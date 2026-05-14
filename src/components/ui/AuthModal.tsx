'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

interface Props { open: boolean; onClose: () => void }

export default function AuthModal({ open, onClose }: Props) {
  const [tab, setTab] = useState<'signin' | 'register'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    if (tab === 'signin') {
      const { error } = await signIn(email, password)
      if (error) { toast.error(error); setLoading(false); return }
      toast.success('Welcome back! ✨')
      onClose()
    } else {
      const { error } = await signUp(email, password, fullName)
      if (error) { toast.error(error); setLoading(false); return }
      toast.success('Account created! Check your email to confirm.')
      onClose()
    }
    setLoading(false)
  }

  return (
    <>
      <div className="fixed inset-0 bg-brand-dark/50 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-brand-white rounded-2xl shadow-card-hover w-full max-w-sm p-8 animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl font-semibold text-brand-dark">
              {tab === 'signin' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-sm text-brand-muted font-body mt-1">
              {tab === 'signin' ? 'Sign in to your NT Beauty account' : 'Join the Glow Club today'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-brand-cream rounded-full p-1 mb-6">
            {(['signin', 'register'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-full text-sm font-body font-medium transition-all ${tab === t ? 'bg-white text-brand-dark shadow-card' : 'text-brand-muted hover:text-brand-dark'}`}>
                {t === 'signin' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="label">Full Name</label>
                <input className="input" type="text" placeholder="Jane Doe" value={fullName} onChange={e => setFullName(e.target.value)} required />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? 'Please wait…' : tab === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <button onClick={onClose} className="absolute top-4 right-4 text-brand-muted hover:text-brand-dark transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
    </>
  )
}
