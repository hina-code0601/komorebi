'use client'

import { useState } from 'react'
import { signInWithEmail } from './auth/actions'

export default function SplashPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    try {
      await signInWithEmail(email)
      setSent(true)
    } catch (err) {
      setError('送信に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="w-full max-w-sm animate-fade-in">
        {/* ロゴ */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl mb-3"
            style={{ color: 'var(--color-accent)', fontFamily: 'Klee One, cursive' }}
          >
            こもれび
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            毎日3行書くだけ。
          </p>
        </div>

        {sent ? (
          <div className="text-center animate-fade-in">
            <div className="text-5xl mb-6">✉️</div>
            <p style={{ color: 'var(--color-text)' }} className="text-base leading-relaxed">
              メールを送りました。
              <br />
              リンクをタップしてログインしてください。
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="メールアドレス"
                required
                className="w-full px-4 py-3 rounded-2xl text-base outline-none transition"
                style={{
                  backgroundColor: 'var(--color-secondary)',
                  color: 'var(--color-text)',
                  border: '1.5px solid transparent',
                  fontFamily: 'Noto Sans JP, sans-serif',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={e => (e.target.style.borderColor = 'transparent')}
              />
            </div>

            {error && (
              <p className="text-sm text-center" style={{ color: 'var(--color-accent)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3 rounded-2xl text-base font-medium transition-opacity"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                opacity: loading || !email ? 0.6 : 1,
                fontFamily: 'Noto Sans JP, sans-serif',
              }}
            >
              {loading ? '送信中...' : 'はじめる'}
            </button>
          </form>
        )}

        <p className="text-center text-xs mt-8" style={{ color: 'var(--color-text-light)' }}>
          メールアドレスのみで利用できます
        </p>
      </div>
    </div>
  )
}
