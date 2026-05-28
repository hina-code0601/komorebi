'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SplashPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleStart = async () => {
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInAnonymously()
      if (error) throw error
      router.push('/select-character')
    } catch {
      setError('しばらく待ってからもう一度試してね。')
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="w-full max-w-sm animate-fade-in flex flex-col items-center gap-12">
        <div className="text-center">
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

        {error && (
          <p className="text-sm text-center" style={{ color: 'var(--color-accent)' }}>
            {error}
          </p>
        )}

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full py-4 rounded-2xl text-base font-medium transition-opacity"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            opacity: loading ? 0.6 : 1,
            fontFamily: 'Noto Sans JP, sans-serif',
          }}
        >
          {loading ? 'はじめています...' : 'はじめる'}
        </button>
      </div>
    </div>
  )
}
