import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useJobs } from './hooks/useJobs'
import Sidebar from './components/layout/Sidebar'
import DashboardView from './components/views/DashboardView'
import TableView from './components/views/TableView'
import KanbanView from './components/views/KanbanView'
import TimelineView from './components/views/TimelineView'

function App({ user, token, onLogout }) {
  const [view, setView] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const jobsHook = useJobs(token, onLogout)

  if (jobsHook.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <Loader2 size={32} className="animate-spin text-teal-glow" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-teal-main/20 blur-[120px]" />
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-accent-neon/10 blur-[100px]" style={{ animation: 'pulse-glow 6s ease-in-out infinite' }} />
      </div>

      <Sidebar view={view} setView={setView} user={user.name || user.email} onLogout={onLogout} collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className={`${collapsed ? 'ml-[72px]' : 'ml-[260px]'} min-h-screen p-6 relative z-10 transition-all duration-300`}>
        <div className="max-w-[1400px] mx-auto">
          {view === 'dashboard' && (
            <DashboardView stats={jobsHook.stats} jobs={jobsHook.jobs} />
          )}
          {view === 'table' && (
            <TableView
              filteredJobs={jobsHook.filteredJobs}
              search={jobsHook.search} setSearch={jobsHook.setSearch}
              filter={jobsHook.filter} setFilter={jobsHook.setFilter}
              stageFilter={jobsHook.stageFilter} setStageFilter={jobsHook.setStageFilter}
              sortConfig={jobsHook.sortConfig} handleSort={jobsHook.handleSort}
              handleSave={jobsHook.handleSave} handleDelete={jobsHook.handleDelete}
            />
          )}
          {view === 'kanban' && (
            <KanbanView
              jobs={jobsHook.jobs}
              stats={jobsHook.stats}
              updateJobStatus={jobsHook.updateJobStatus}
              handleSave={jobsHook.handleSave}
            />
          )}
          {view === 'timeline' && (
            <TimelineView jobs={jobsHook.jobs} />
          )}
        </div>
      </main>

      {jobsHook.saving && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="flex flex-col items-center gap-3 bg-glass backdrop-blur-2xl border border-glass-border rounded-2xl px-8 py-6">
            <Loader2 size={32} className="animate-spin text-teal-glow" />
            <span className="text-sm text-text-secondary">Saving...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
