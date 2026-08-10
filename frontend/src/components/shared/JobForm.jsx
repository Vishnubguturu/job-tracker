import { useState } from 'react'
import { STATUS_OPTIONS, STAGE_OPTIONS, emptyJob } from '../../lib/constants'

export default function JobForm({ job, onSave, onCancel }) {
  const [form, setForm] = useState(job || { ...emptyJob, date_applied: new Date().toISOString().split('T')[0] })

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave(form)
  }

  const inputClass = 'w-full bg-white/5 border border-glass-border rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-teal-main/50 focus:ring-1 focus:ring-teal-main/25 transition-colors'
  const labelClass = 'block text-xs font-medium text-text-secondary mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Company *</label>
          <input className={inputClass} value={form.company} onChange={e => set('company', e.target.value)} required placeholder="Google" />
        </div>
        <div>
          <label className={labelClass}>Role *</label>
          <input className={inputClass} value={form.role} onChange={e => set('role', e.target.value)} required placeholder="Software Engineer" />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input className={inputClass} value={form.location} onChange={e => set('location', e.target.value)} placeholder="Remote" />
        </div>
        <div>
          <label className={labelClass}>Pay</label>
          <input className={inputClass} value={form.pay} onChange={e => set('pay', e.target.value)} placeholder="$120k" />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select className={inputClass} value={form.status} onChange={e => set('status', e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Next Stage</label>
          <select className={inputClass} value={form.next_stage} onChange={e => set('next_stage', e.target.value)}>
            {STAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Date Applied</label>
          <input type="date" className={inputClass} value={form.date_applied} onChange={e => set('date_applied', e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Contact Email</label>
          <input type="email" className={inputClass} value={form.email} onChange={e => set('email', e.target.value)} placeholder="recruiter@company.com" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Notes</label>
        <textarea className={`${inputClass} resize-none`} rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Additional notes..." />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.referred} onChange={e => set('referred', e.target.checked)} className="w-4 h-4 rounded border-glass-border bg-white/5 text-teal-main focus:ring-teal-main/30" />
        <span className="text-sm text-text-secondary">Referred</span>
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-glass-hover transition-colors cursor-pointer">
          Cancel
        </button>
        <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-main to-teal-glow hover:shadow-lg hover:shadow-teal-main/25 text-white transition-all duration-300 cursor-pointer">
          {job ? 'Save Changes' : 'Add Application'}
        </button>
      </div>
    </form>
  )
}
