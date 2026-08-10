import { useState, useEffect, useMemo, useCallback } from 'react'
import { api } from '../lib/api'
import { pct } from '../lib/constants'

export function useJobs(token, onLogout) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [stageFilter, setStageFilter] = useState('All Stages')
  const [sortConfig, setSortConfig] = useState({ key: 'date_applied', dir: 'desc' })
  const [saving, setSaving] = useState(false)

  const fetchJobs = useCallback(async () => {
    try {
      const data = await api('/jobs', token)
      setJobs(data)
    } catch (err) {
      if (err.message === 'unauthorized') return onLogout()
      console.error('Failed to fetch jobs:', err)
    } finally {
      setLoading(false)
    }
  }, [token, onLogout])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  const stats = useMemo(() => {
    const total = jobs.length
    const gotResponse = jobs.filter(j => j.status === 'Replied' || j.status === 'Rejected' || j.status === 'Offer' || j.status === 'Role Filled').length
    const nextStage = jobs.filter(j => j.next_stage !== 'N/A').length
    const rejected = jobs.filter(j => j.status === 'Rejected').length
    const noReply = jobs.filter(j => j.status === 'Waiting').length
    const referred = jobs.filter(j => j.referred).length
    return {
      total, gotResponse, nextStage, rejected, noReply, referred,
      responseRate: pct(gotResponse, total),
      nextStageRate: pct(nextStage, total),
    }
  }, [jobs])

  const filteredJobs = useMemo(() => {
    let result = [...jobs]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(j =>
        j.company.toLowerCase().includes(q) ||
        j.role.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        (j.notes && j.notes.toLowerCase().includes(q))
      )
    }
    if (filter !== 'All') {
      if (filter === 'Referred') result = result.filter(j => j.referred)
      else result = result.filter(j => j.status === filter)
    }
    if (stageFilter !== 'All Stages') {
      result = result.filter(j => j.next_stage === stageFilter)
    }
    result.sort((a, b) => {
      let aVal = a[sortConfig.key]
      let bVal = b[sortConfig.key]
      if (sortConfig.key === 'pay') {
        aVal = parseFloat(String(aVal).replace(/[^0-9.]/g, '')) || 0
        bVal = parseFloat(String(bVal).replace(/[^0-9.]/g, '')) || 0
      }
      if (aVal < bVal) return sortConfig.dir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.dir === 'asc' ? 1 : -1
      return 0
    })
    return result
  }, [jobs, search, filter, stageFilter, sortConfig])

  function handleSort(key) {
    setSortConfig(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc'
    }))
  }

  async function handleSave(formData, editingJob) {
    setSaving(true)
    try {
      if (editingJob) {
        const { id, ...body } = formData
        setJobs(prev => prev.map(j => j.id === editingJob ? { ...j, ...body } : j))
        await api(`/jobs/${editingJob}`, token, { method: 'PUT', body: JSON.stringify(body) })
      } else {
        const saved = await api('/jobs', token, { method: 'POST', body: JSON.stringify(formData) })
        setJobs(prev => [saved, ...prev])
      }
    } catch (err) {
      console.error('Failed to save:', err)
      fetchJobs()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    setJobs(prev => prev.filter(j => j.id !== id))
    try {
      await api(`/jobs/${id}`, token, { method: 'DELETE' })
    } catch (err) {
      console.error('Failed to delete:', err)
      fetchJobs()
    }
  }

  async function updateJobStatus(id, newStatus) {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: newStatus } : j))
    try {
      await api(`/jobs/${id}`, token, { method: 'PUT', body: JSON.stringify({ status: newStatus }) })
    } catch (err) {
      console.error('Failed to update status:', err)
      fetchJobs()
    }
  }

  return {
    jobs, loading, saving,
    search, setSearch,
    filter, setFilter,
    stageFilter, setStageFilter,
    sortConfig, handleSort,
    stats, filteredJobs,
    handleSave, handleDelete, updateJobStatus, fetchJobs,
  }
}
