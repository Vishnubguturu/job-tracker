import { Briefcase, MessageSquare, ArrowUpRight, XCircle, Clock, UserCheck } from 'lucide-react'
import GlassCard from './GlassCard'

const STAT_ITEMS = [
  { key: 'total', label: 'Total Applied', icon: Briefcase, gradient: 'from-teal-main/25 to-teal-glow/25', iconColor: 'text-teal-glow' },
  { key: 'gotResponse', label: 'Got Response', icon: MessageSquare, gradient: 'from-status-green/25 to-teal-glow/25', iconColor: 'text-status-green' },
  { key: 'nextStage', label: 'Next Stage', icon: ArrowUpRight, gradient: 'from-teal-main/25 to-accent-neon/25', iconColor: 'text-teal-glow' },
  { key: 'rejected', label: 'Rejected', icon: XCircle, gradient: 'from-status-red/25 to-accent-neon/25', iconColor: 'text-status-red' },
  { key: 'noReply', label: 'No Reply', icon: Clock, gradient: 'from-accent-neon/25 to-status-orange/25', iconColor: 'text-accent-neon' },
  { key: 'referred', label: 'Referred', icon: UserCheck, gradient: 'from-status-blue/25 to-teal-main/25', iconColor: 'text-status-blue' },
]

export default function StatsBar({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {STAT_ITEMS.map(({ key, label, icon: Icon, gradient, iconColor }) => (
        <GlassCard key={key} className="p-4 group hover:scale-[1.02]" hover>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient} ${iconColor}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats[key]}</p>
              <p className="text-xs text-text-muted">{label}</p>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
