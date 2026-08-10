import { useMemo } from 'react'
import { Calendar, MapPin } from 'lucide-react'
import GlassCard from '../shared/GlassCard'
import StatusBadge from '../shared/StatusBadge'
import StageBadge from '../shared/StageBadge'
import { getAvatarColor } from '../../lib/constants'

export default function TimelineView({ jobs }) {
  const grouped = useMemo(() => {
    const groups = {}
    const sorted = [...jobs].sort((a, b) => (b.date_applied || '').localeCompare(a.date_applied || ''))
    sorted.forEach(job => {
      const date = job.date_applied || 'Unknown'
      if (!groups[date]) groups[date] = []
      groups[date].push(job)
    })
    return Object.entries(groups)
  }, [jobs])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Timeline</h1>
        <p className="text-sm text-text-secondary mt-1">Your application history, organized by date</p>
      </div>

      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-teal-main/30 via-teal-glow/20 to-accent-neon/10" />

        <div className="space-y-8">
          {grouped.map(([date, dateJobs]) => (
            <div key={date} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative z-10 w-10 h-10 rounded-xl bg-gradient-to-br from-teal-main/20 to-teal-glow/20 border border-teal-main/20 flex items-center justify-center shadow-sm shadow-teal-main/10">
                  <Calendar size={16} className="text-teal-glow" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-text-muted">{dateJobs.length} application{dateJobs.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="ml-[48px] space-y-3">
                {dateJobs.map(job => (
                  <GlassCard key={job.id} className="p-4" hover>
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-semibold shrink-0"
                        style={{ backgroundColor: getAvatarColor(job.company) }}
                      >
                        {job.company.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-text-primary">{job.company}</p>
                            <p className="text-sm text-text-secondary">{job.role}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <StatusBadge status={job.status} />
                            <StageBadge stage={job.next_stage} />
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          {job.location && (
                            <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                              <MapPin size={12} />
                              {job.location}
                            </span>
                          )}
                          {job.pay && <span className="text-xs text-text-muted">{job.pay}</span>}
                          {job.referred && <span className="text-[10px] text-accent-neon font-medium">REFERRED</span>}
                        </div>
                        {job.notes && (
                          <p className="text-xs text-text-muted mt-2 line-clamp-2">{job.notes}</p>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          ))}
          {grouped.length === 0 && (
            <div className="text-center py-12 text-text-muted text-sm">No applications yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
