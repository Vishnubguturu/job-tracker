import { LayoutDashboard, Table2, Columns3, Clock, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'table', label: 'Applications', icon: Table2 },
  { id: 'kanban', label: 'Board', icon: Columns3 },
  { id: 'timeline', label: 'Timeline', icon: Clock },
]

export default function Sidebar({ view, setView, user, onLogout, collapsed, setCollapsed }) {
  return (
    <aside className={`fixed top-0 left-0 h-screen ${collapsed ? 'w-[72px]' : 'w-[260px]'} bg-bg-secondary/60 backdrop-blur-2xl border-r border-glass-border flex flex-col z-40 transition-all duration-300`}>
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-6'} h-16 border-b border-glass-border`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-main to-teal-glow flex items-center justify-center text-white font-bold text-sm">V</div>
        {!collapsed && <span className="text-lg font-semibold text-text-primary tracking-tight">Vantage</span>}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-bg-elevated border border-glass-border flex items-center justify-center text-text-muted hover:text-teal-glow hover:border-teal-main/30 transition-colors cursor-pointer z-50"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-3'} py-4 space-y-1`}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            title={collapsed ? label : undefined}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-0 py-3' : 'px-3 py-2.5'} rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              view === id
                ? 'bg-teal-main/12 text-teal-glow border border-teal-main/25 shadow-sm shadow-teal-main/10'
                : 'text-text-secondary hover:text-text-primary hover:bg-glass-hover border border-transparent'
            }`}
          >
            <Icon size={18} />
            {!collapsed && label}
          </button>
        ))}
      </nav>

      <div className={`${collapsed ? 'px-2' : 'px-3'} pb-4`}>
        <div className={`flex items-center ${collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-3'} rounded-xl bg-white/5 border border-glass-border`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-main/50 to-teal-glow/50 flex items-center justify-center text-white text-sm font-semibold shrink-0">
            {user?.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{user}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-text-muted hover:text-status-red hover:bg-status-red/10 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
