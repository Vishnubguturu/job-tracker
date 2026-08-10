export default function GlassCard({ children, className = '', hover = false, onClick, glow }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white/5 backdrop-blur-2xl border border-glass-border rounded-2xl shadow-lg shadow-black/20 ${
        hover ? 'hover:bg-white/8 hover:border-glass-border-hover hover:shadow-xl hover:shadow-teal-main/5 cursor-pointer' : ''
      } ${glow ? 'ring-1 ring-teal-main/20' : ''} transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  )
}
