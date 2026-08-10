export const STATUS_OPTIONS = ['Waiting', 'Replied', 'Rejected', 'Role Filled', 'Offer']
export const STAGE_OPTIONS = ['N/A', 'Coding Assessment', 'Phone Screen', 'Behavioral', 'Technical Interview', 'Onsite']

export const AVATAR_COLORS = [
  '#6c5ce7', '#00b894', '#e17055', '#0984e3', '#d63031',
  '#fdcb6e', '#e84393', '#00cec9', '#636e72', '#a29bfe',
]

export const STATUS_COLORS = {
  'Waiting': { color: 'text-accent-neon', bg: 'bg-accent-neon/10', dot: 'bg-accent-neon', border: 'border-accent-neon/20' },
  'Replied': { color: 'text-teal-glow', bg: 'bg-teal-main/10', dot: 'bg-teal-glow', border: 'border-teal-main/20' },
  'Rejected': { color: 'text-status-red', bg: 'bg-status-red/10', dot: 'bg-status-red', border: 'border-status-red/20' },
  'Offer': { color: 'text-status-green', bg: 'bg-status-green/10', dot: 'bg-status-green', border: 'border-status-green/20' },
  'Role Filled': { color: 'text-text-muted', bg: 'bg-white/5', dot: 'bg-text-muted', border: 'border-white/10' },
}

export const STAGE_COLORS = {
  'Coding Assessment': 'text-teal-glow bg-teal-main/10 border border-teal-main/20',
  'Technical Interview': 'text-accent-neon bg-accent-neon/10 border border-accent-neon/20',
  'Phone Screen': 'text-status-blue bg-status-blue/10 border border-status-blue/20',
  'Onsite': 'text-accent-neon bg-accent-neon/10 border border-accent-neon/20',
  'Behavioral': 'text-status-green bg-status-green/10 border border-status-green/20',
  'N/A': 'text-text-muted bg-white/5',
}

export function getAvatarColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function pct(num, den) {
  if (den === 0) return '0%'
  return Math.round((num / den) * 100) + '%'
}

export const emptyJob = {
  company: '', role: '', location: '', pay: '',
  status: 'Waiting', next_stage: 'N/A', email: '',
  referred: false, date_applied: new Date().toISOString().split('T')[0],
  notes: '',
}
