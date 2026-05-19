import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Search, Plus, Pencil, Trash2, X, Briefcase, ArrowUpDown,
  Users, Loader2, Filter
} from 'lucide-react'
import './App.css'

const STATUS_OPTIONS = ['Waiting', 'Replied', 'Rejected', 'Offer', 'Role Filled']
const STAGE_OPTIONS = ['N/A', 'Coding Assessment', 'Phone Screen', 'Behavioral', 'Technical Interview', 'Onsite']
const AVATAR_COLORS = [
  '#6c5ce7', '#00b894', '#e17055', '#0984e3', '#d63031',
  '#fdcb6e', '#e84393', '#00cec9', '#636e72', '#a29bfe',
]

function getAvatarColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function pct(num, den) {
  if (den === 0) return '0%'
  return Math.round((num / den) * 100) + '%'
}

const emptyJob = {
  company: '', role: '', location: '', pay: '',
  status: 'Waiting', next_stage: 'N/A', email: '',
  referred: false, date_applied: new Date().toISOString().split('T')[0],
  notes: '',
}

async function api(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (options.method === 'DELETE') return null
  return res.json()
}

function App() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [stageFilter, setStageFilter] = useState('All Stages')
  const [showModal, setShowModal] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [formData, setFormData] = useState({ ...emptyJob })
  const [sortConfig, setSortConfig] = useState({ key: 'date_applied', dir: 'desc' })

  const fetchJobs = useCallback(async () => {
    try {
      const data = await api('/jobs')
      setJobs(data)
    } catch (err) {
      console.error('Failed to fetch jobs:', err)
    } finally {
      setLoading(false)
    }
  }, [])

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

  function openAdd() {
    setEditingJob(null)
    setFormData({ ...emptyJob, date_applied: new Date().toISOString().split('T')[0] })
    setShowModal(true)
  }

  function openEdit(job) {
    setEditingJob(job.id)
    setFormData({ ...job })
    setShowModal(true)
  }

  async function handleSave() {
    if (!formData.company.trim() || !formData.role.trim()) return
    try {
      if (editingJob) {
        const { id, ...body } = formData
        await api(`/jobs/${editingJob}`, { method: 'PUT', body: JSON.stringify(body) })
      } else {
        await api('/jobs', { method: 'POST', body: JSON.stringify(formData) })
      }
      await fetchJobs()
      setShowModal(false)
    } catch (err) {
      console.error('Failed to save:', err)
    }
  }

  async function handleDelete(id) {
    try {
      await api(`/jobs/${id}`, { method: 'DELETE' })
      await fetchJobs()
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  function getStatusClass(status) {
    const map = { 'Replied': 'replied', 'Waiting': 'waiting', 'Rejected': 'rejected', 'Offer': 'offer', 'Role Filled': 'role-filled' }
    return map[status] || 'waiting'
  }

  function getStageClass(stage) {
    const map = {
      'Coding Assessment': 'coding', 'Technical Interview': 'interview',
      'Phone Screen': 'phone', 'Onsite': 'onsite', 'Behavioral': 'behavioral', 'N/A': 'na'
    }
    return map[stage] || 'na'
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="header-logo">JT</div>
          <div>
            <div className="header-title">JobTracker</div>
            <div className="header-subtitle">Application Dashboard</div>
          </div>
        </div>
        <button className="add-btn" onClick={openAdd}>
          <Plus size={16} /> Add Application
        </button>
      </header>

      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-label">Total Applied</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Got Response</div>
          <div className="stat-value green">{stats.gotResponse}</div>
          <div className="stat-pct">{stats.responseRate}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Next Stage</div>
          <div className="stat-value blue">{stats.nextStage}</div>
          <div className="stat-pct">{stats.nextStageRate}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rejected</div>
          <div className="stat-value red">{stats.rejected}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">No Reply</div>
          <div className="stat-value yellow">{stats.noReply}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Referral</div>
          <div className="stat-value purple">{stats.referred}</div>
        </div>
      </div>

      <div className="controls">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search company, role, location, or notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="stage-filter">
          <Filter size={14} />
          <select
            value={stageFilter}
            onChange={e => setStageFilter(e.target.value)}
          >
            <option>All Stages</option>
            {STAGE_OPTIONS.filter(s => s !== 'N/A').map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        {['All', 'Waiting', 'Replied', 'Rejected', 'Offer', 'Role Filled', 'Referred'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="table-container">
        {loading ? (
          <div className="empty-state">
            <Loader2 size={32} className="spinner" />
            <p>Loading applications...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Briefcase size={28} />
            </div>
            <h3>{jobs.length === 0 ? 'No applications yet' : 'No matches found'}</h3>
            <p>{jobs.length === 0 ? 'Click "Add Application" to start tracking your job search' : 'Try adjusting your search or filters'}</p>
          </div>
        ) : (
          <table className="job-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('company')}>
                  Company <ArrowUpDown size={12} />
                </th>
                <th onClick={() => handleSort('location')}>
                  Location <ArrowUpDown size={12} />
                </th>
                <th onClick={() => handleSort('pay')}>
                  Pay <ArrowUpDown size={12} />
                </th>
                <th onClick={() => handleSort('status')}>
                  Status <ArrowUpDown size={12} />
                </th>
                <th onClick={() => handleSort('next_stage')}>
                  Next Stage <ArrowUpDown size={12} />
                </th>
                <th>Email / Contact</th>
                <th onClick={() => handleSort('referred')}>
                  Referral <ArrowUpDown size={12} />
                </th>
                <th>Notes</th>
                <th onClick={() => handleSort('date_applied')}>
                  Applied <ArrowUpDown size={12} />
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map(job => (
                <tr key={job.id} onDoubleClick={() => openEdit(job)}>
                  <td>
                    <div className="company-cell">
                      <div className="company-avatar" style={{ background: getAvatarColor(job.company) }}>
                        {job.company.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="company-name">{job.company}</div>
                        <div className="company-role">{job.role}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="location-text">{job.location || '—'}</span></td>
                  <td><span className="pay-text">{job.pay || '—'}</span></td>
                  <td>
                    <span className={`badge badge-${getStatusClass(job.status)}`}>
                      <span className="badge-dot"></span>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <span className={`stage-badge stage-${getStageClass(job.next_stage)}`}>
                      {job.next_stage}
                    </span>
                  </td>
                  <td><span className="email-text">{job.email || '—'}</span></td>
                  <td>
                    <span className={`referral-badge ${job.referred ? 'referral-yes' : 'referral-no'}`}>
                      {job.referred ? (
                        <><Users size={12} /> Referred</>
                      ) : (
                        'Direct'
                      )}
                    </span>
                  </td>
                  <td><span className="notes-text">{job.notes || '—'}</span></td>
                  <td><span className="date-text">{job.date_applied}</span></td>
                  <td>
                    <div className="actions-cell">
                      <button className="action-btn" onClick={() => openEdit(job)} title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(job.id)} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{editingJob ? 'Edit Application' : 'Add Application'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Company *</label>
                  <input
                    type="text"
                    placeholder="e.g. Google"
                    value={formData.company}
                    onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label>Role *</label>
                  <input
                    type="text"
                    placeholder="e.g. SWE Intern"
                    value={formData.role}
                    onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Mountain View, CA"
                    value={formData.location}
                    onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Pay</label>
                  <input
                    type="text"
                    placeholder="e.g. $150k or $45/hr"
                    value={formData.pay}
                    onChange={e => setFormData(p => ({ ...p, pay: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Next Stage</label>
                  <select
                    value={formData.next_stage}
                    onChange={e => setFormData(p => ({ ...p, next_stage: e.target.value }))}
                  >
                    {STAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email / Contact</label>
                  <input
                    type="text"
                    placeholder="recruiter@company.com"
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Date Applied</label>
                  <input
                    type="date"
                    value={formData.date_applied}
                    onChange={e => setFormData(p => ({ ...p, date_applied: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  placeholder="Any additional notes..."
                  value={formData.notes}
                  onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="checkbox"
                    checked={formData.referred}
                    onChange={e => setFormData(p => ({ ...p, referred: e.target.checked }))}
                    style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
                  />
                  <span style={{ textTransform: 'none', fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                    I was referred for this position
                  </span>
                </label>
              </div>
              <div className="form-actions">
                <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-save" onClick={handleSave}>
                  {editingJob ? 'Save Changes' : 'Add Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
