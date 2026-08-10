import { STAGE_COLORS } from '../../lib/constants'

export default function StageBadge({ stage }) {
  if (stage === 'N/A') return <span className="text-xs text-text-muted">—</span>
  const colors = STAGE_COLORS[stage] || STAGE_COLORS['N/A']
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors}`}>
      {stage}
    </span>
  )
}
