import { useState } from 'react'
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const endpoint = mode === 'login' ? '/api/login' : '/api/register'
    const body = mode === 'login' ? { email, password } : { name, email, password }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || 'Something went wrong')
        return
      }
      localStorage.setItem('jt_token', data.token)
      localStorage.setItem('jt_user', JSON.stringify(data.user))
      onAuth(data.user, data.token)
    } catch {
      setError('Connection failed')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full bg-white/5 border border-glass-border rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-teal-main/50 focus:ring-1 focus:ring-teal-main/25 transition-colors'

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-teal-main/15 blur-[120px]" />
        <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] rounded-full bg-accent-neon/10 blur-[100px]" style={{ animation: 'pulse-glow 6s ease-in-out infinite' }} />
      </div>

      <div className="w-full max-w-md relative z-10" style={{ animation: 'slideUp 0.4s ease' }}>
        <div className="bg-white/5 backdrop-blur-2xl border border-glass-border rounded-2xl p-8 shadow-2xl shadow-teal-main/5">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-main to-teal-glow flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">V</div>
            <h1 className="text-2xl font-bold text-text-primary">Vantage</h1>
            <p className="text-sm text-text-secondary mt-1">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required className={inputClass} />
              </div>
            )}
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className={inputClass} />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-status-red/10 border border-status-red/20 text-sm text-status-red">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-teal-main to-teal-glow hover:shadow-lg hover:shadow-teal-main/25 text-white text-sm font-medium transition-all duration-300 disabled:opacity-50 cursor-pointer">
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-text-secondary">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
                className="text-teal-glow hover:text-accent-neon font-medium transition-colors cursor-pointer"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
