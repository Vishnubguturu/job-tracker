import { STATUS_COLORS } from '../../lib/constants'

export default function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS['Waiting']
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${c.color} ${c.bg} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  )
}
