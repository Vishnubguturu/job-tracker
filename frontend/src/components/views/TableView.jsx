import { useState } from 'react'
import { Plus, ChevronUp, ChevronDown, Pencil, Trash2 } from 'lucide-react'
import GlassCard from '../shared/GlassCard'
import StatusBadge from '../shared/StatusBadge'
import StageBadge from '../shared/StageBadge'
import SearchFilters from '../shared/SearchFilters'
import Modal from '../shared/Modal'
import JobForm from '../shared/JobForm'
import { getAvatarColor } from '../../lib/constants'

const COLUMNS = [
  { key: 'company', label: 'Company' },
  { key: 'role', label: 'Role' },
  { key: 'location', label: 'Location' },
  { key: 'pay', label: 'Pay' },
  { key: 'status', label: 'Status' },
  { key: 'next_stage', label: 'Stage' },
  { key: 'date_applied', label: 'Applied' },
]

export default function TableView({
  filteredJobs, search, setSearch, filter, setFilter,
  stageFilter, setStageFilter, sortConfig, handleSort,
  handleSave, handleDelete,
}) {
  const [modal, setModal] = useState(null)

  function openAdd() { setModal({ type: 'add' }) }
  function openEdit(job) { setModal({ type: 'edit', job }) }
  function closeModal() { setModal(null) }

  function onSave(formData) {
    handleSave(formData, modal.type === 'edit' ? modal.job.id : null)
    closeModal()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Applications</h1>
          <p className="text-sm text-text-secondary mt-1">Track and manage your job applications</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-main to-teal-glow hover:shadow-lg hover:shadow-teal-main/25 text-white text-sm font-medium transition-all duration-300 cursor-pointer">
          <Plus size={16} />
          Add Application
        </button>
      </div>

      <GlassCard className="p-4">
        <SearchFilters
          search={search} setSearch={setSearch}
          filter={filter} setFilter={setFilter}
          stageFilter={stageFilter} setStageFilter={setStageFilter}
          jobCount={filteredJobs.length}
        />
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border">
                {COLUMNS.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider cursor-pointer hover:text-teal-glow transition-colors"
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {sortConfig.key === col.key && (
                        sortConfig.dir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      )}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map(job => (
                <tr
                  key={job.id}
                  className="border-b border-white/[0.03] hover:bg-glass-hover transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-semibold shrink-0"
                        style={{ backgroundColor: getAvatarColor(job.company) }}
                      >
                        {job.company.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{job.company}</p>
                        {job.referred && <span className="text-[10px] text-accent-neon font-medium">REFERRED</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{job.role}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{job.location}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{job.pay || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={job.status} /></td>
                  <td className="px-4 py-3"><StageBadge stage={job.next_stage} /></td>
                  <td className="px-4 py-3 text-sm text-text-muted">{job.date_applied}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(job)} className="p-1.5 rounded-lg text-text-muted hover:text-teal-glow hover:bg-teal-main/10 transition-colors cursor-pointer">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(job.id)} className="p-1.5 rounded-lg text-text-muted hover:text-status-red hover:bg-status-red/10 transition-colors cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredJobs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-text-muted text-sm">
                    No applications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {modal && (
        <Modal title={modal.type === 'add' ? 'New Application' : 'Edit Application'} onClose={closeModal}>
          <JobForm job={modal.type === 'edit' ? modal.job : null} onSave={onSave} onCancel={closeModal} />
        </Modal>
      )}
    </div>
  )
}
