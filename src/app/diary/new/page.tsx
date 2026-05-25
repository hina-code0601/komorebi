'use client'

import { useState, useEffect } from 'react'
import { emotionTags, EmotionTag, characters, CharacterId, Expression } from '@/types'
import { createClient } from '@/lib/supabase/client'
import CharacterWidget from '@/components/CharacterWidget'
import CharacterAvatar from '@/components/CharacterAvatar'
import Link from 'next/link'

const fields = [
  { key: 'good_thing', label: 'よかったこと', placeholder: '小さなことでいいよ' },
  { key: 'hard_thing', label: 'つらかったこと', placeholder: 'そのまま書いて' },
  { key: 'tomorrow', label: '明日やること', placeholder: '一つだけでも' },
] as const

export default function DiaryNewPage() {
  const [values, setValues] = useState({ good_thing: '', hard_thing: '', tomorrow: '' })
  const [emotion, setEmotion] = useState<EmotionTag | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [character, setCharacter] = useState(characters.shizuku)
  const [result, setResult] = useState<{ text: string; dayCount: number } | null>(null)
  const [expression, setExpression] = useState<Expression>('sleepy')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('users').select('character_id').eq('id', user.id).single().then(({ data }) => {
        if (data?.character_id) setCharacter(characters[data.character_id as CharacterId] ?? characters.shizuku)
      })
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      const res = await fetch('/api/diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, emotion_tag: emotion }),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setResult({ text: data.response, dayCount: data.dayCount })
      setExpression('happy')
      setTimeout(() => setVisible(true), 100)
    } catch {
      setError('少し待ってね。もう一度試してみて。')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div
          className="w-full max-w-sm flex flex-col items-center gap-8"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease' }}
        >
          <CharacterAvatar character={character} size={120} expression="happy" />

          <div
            className="w-full px-5 py-5 rounded-3xl text-center leading-relaxed"
            style={{
              backgroundColor: 'var(--color-secondary)',
              color: 'var(--color-text)',
              fontFamily: 'Klee One, cursive',
              fontSize: '1.05rem',
              lineHeight: '1.9',
            }}
          >
            {result.text}
          </div>

          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            {result.dayCount}日目の記録
          </p>

          <Link
            href="/home"
            className="w-full py-4 rounded-2xl text-center text-base font-medium transition-opacity active:opacity-80"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              fontFamily: 'Noto Sans JP, sans-serif',
            }}
          >
            メイン画面に戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <header
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: '1px solid var(--color-secondary)' }}
      >
        <Link
          href="/home"
          className="text-xl"
          style={{ color: 'var(--color-text-light)' }}
          aria-label="戻る"
        >
          ←
        </Link>
        <h2
          className="text-lg"
          style={{ color: 'var(--color-text)', fontFamily: 'Klee One, cursive' }}
        >
          今日の日記
        </h2>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-5 py-6 gap-6 max-w-lg mx-auto w-full">
        {fields.map(f => (
          <div key={f.key}>
            <label
              className="block text-sm mb-2 font-medium"
              style={{ color: 'var(--color-text-light)' }}
            >
              ▷ {f.label}
            </label>
            <textarea
              value={values[f.key]}
              onChange={e => setValues(prev => ({ ...prev, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl text-sm resize-none outline-none transition"
              style={{
                backgroundColor: 'var(--color-secondary)',
                color: 'var(--color-text)',
                border: '1.5px solid transparent',
                fontFamily: 'Noto Sans JP, sans-serif',
                lineHeight: '1.7',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
              onBlur={e => (e.target.style.borderColor = 'transparent')}
            />
          </div>
        ))}

        <div>
          <p
            className="text-sm mb-3"
            style={{ color: 'var(--color-text-light)' }}
          >
            今日の気持ち
          </p>
          <div className="flex gap-3 justify-around">
            {emotionTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setEmotion(prev => prev === tag ? null : tag)}
                className="text-2xl transition-all"
                style={{
                  opacity: emotion && emotion !== tag ? 0.35 : 1,
                  transform: emotion === tag ? 'scale(1.2)' : 'scale(1)',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-center" style={{ color: 'var(--color-accent)' }}>
            {error}
          </p>
        )}

        <div className="mt-auto pb-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl text-base font-medium transition-opacity"
            style={{
              backgroundColor: loading ? 'var(--color-text-light)' : 'var(--color-primary)',
              color: '#fff',
              fontFamily: 'Noto Sans JP, sans-serif',
            }}
          >
            {loading ? '送っています...' : '書き終わった'}
          </button>
        </div>
      </form>
      <CharacterWidget character={character} greeting="書けたら送ってね" expression={expression} loading={loading} />
    </div>
  )
}
