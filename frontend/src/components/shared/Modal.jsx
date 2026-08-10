import { X } from 'lucide-react'

export default function Modal({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      style={{ animation: 'fadeIn 0.2s ease' }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <div
        className="relative w-full max-w-2xl bg-bg-card/95 backdrop-blur-2xl border border-glass-border rounded-2xl shadow-2xl shadow-teal-main/5"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'slideUp 0.3s ease' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-glass-border">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-glass-hover transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
