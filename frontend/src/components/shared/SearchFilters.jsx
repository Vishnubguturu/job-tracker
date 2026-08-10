import { Search, Filter } from 'lucide-react'
import { STATUS_OPTIONS, STAGE_OPTIONS } from '../../lib/constants'

export default function SearchFilters({ search, setSearch, filter, setFilter, stageFilter, setStageFilter, jobCount }) {
  const selectClass = 'bg-white/5 border border-glass-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-teal-main/50 transition-colors cursor-pointer appearance-none'

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="relative flex-1 w-full sm:max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search companies, roles..."
          className="w-full bg-white/5 border border-glass-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-teal-main/50 focus:ring-1 focus:ring-teal-main/25 transition-colors"
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter size={14} className="text-text-muted" />
        <select className={selectClass} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          <option value="Referred">Referred</option>
        </select>
        <select className={selectClass} value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
          <option value="All Stages">All Stages</option>
          {STAGE_OPTIONS.filter(s => s !== 'N/A').map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="text-xs text-text-muted ml-2 bg-white/5 px-2 py-1 rounded-full">{jobCount} results</span>
      </div>
    </div>
  )
}
