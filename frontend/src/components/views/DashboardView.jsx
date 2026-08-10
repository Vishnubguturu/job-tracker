import { useMemo } from 'react'
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Target } from 'lucide-react'
import GlassCard from '../shared/GlassCard'
import StatsBar from '../shared/StatsBar'

const PIE_COLORS = {
  'Waiting': '#fb923c',
  'Replied': '#2dd4bf',
  'Rejected': '#f87171',
  'Offer': '#4ade80',
  'Role Filled': '#94a3b8',
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-card/95 backdrop-blur-2xl border border-glass-border rounded-xl px-3 py-2 shadow-xl">
      <p className="text-xs text-text-muted">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: p.color }}>{p.value}</p>
      ))}
    </div>
  )
}

export default function DashboardView({ stats, jobs }) {
  const weeklyData = useMemo(() => {
    const weeks = {}
    jobs.forEach(j => {
      if (!j.date_applied) return
      const d = new Date(j.date_applied)
      const weekStart = new Date(d)
      weekStart.setDate(d.getDate() - d.getDay())
      const key = weekStart.toISOString().split('T')[0]
      weeks[key] = (weeks[key] || 0) + 1
    })
    return Object.entries(weeks)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([week, count]) => ({
        week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count,
      }))
  }, [jobs])

  const statusData = useMemo(() => {
    const counts = {}
    jobs.forEach(j => { counts[j.status] = (counts[j.status] || 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [jobs])

  const funnelData = useMemo(() => [
    { stage: 'Applied', count: stats.total },
    { stage: 'Response', count: stats.gotResponse },
    { stage: 'Next Stage', count: stats.nextStage },
    { stage: 'Offer', count: jobs.filter(j => j.status === 'Offer').length },
  ], [stats, jobs])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">Overview of your job search progress</p>
      </div>

      <StatsBar stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-teal-glow" />
            <h3 className="text-sm font-semibold text-text-primary">Applications Over Time</h3>
          </div>
          <div className="h-[240px]">
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d9488" stopOpacity={0.35} />
                      <stop offset="50%" stopColor="#2dd4bf" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#020617" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="count" stroke="#2dd4bf" fill="url(#chartGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-text-muted text-sm">No data yet</div>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} className="text-accent-neon" />
            <h3 className="text-sm font-semibold text-text-primary">Status Breakdown</h3>
          </div>
          <div className="h-[240px] flex items-center">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                    {statusData.map(entry => (
                      <Cell key={entry.name} fill={PIE_COLORS[entry.name] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full text-center text-text-muted text-sm">No data yet</div>
            )}
            <div className="space-y-2 min-w-[120px]">
              {statusData.map(entry => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[entry.name] }} />
                  <span className="text-xs text-text-secondary">{entry.name}</span>
                  <span className="text-xs font-medium text-text-primary ml-auto">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-teal-glow" />
            <h3 className="text-sm font-semibold text-text-primary">Response Funnel</h3>
            <span className="text-xs text-text-muted ml-auto">
              Response rate: {stats.responseRate} · Next stage rate: {stats.nextStageRate}
            </span>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0d9488" />
                    <stop offset="100%" stopColor="#2dd4bf" />
                  </linearGradient>
                </defs>
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="stage" tick={{ fill: '#e2e8f0', fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="url(#barGrad)" radius={[0, 8, 8, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
