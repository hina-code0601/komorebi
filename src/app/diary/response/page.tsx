'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { characters, CharacterId } from '@/types'
import CharacterAvatar from '@/components/CharacterAvatar'
import Link from 'next/link'

export default function DiaryResponsePage() {
  const router = useRouter()
  const [aiText, setAiText] = useState('')
  const [character, setCharacter] = useState(characters.shizuku)
  const [dayCount, setDayCount] = useState(1)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const text = sessionStorage.getItem('aiResponse') ?? '少し待ってね。'
    const day = Number(sessionStorage.getItem('dayCount') ?? 1)
    setAiText(text)
    setDayCount(day)
    sessionStorage.removeItem('aiResponse')
    sessionStorage.removeItem('dayCount')

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('users').select('character_id').eq('id', user.id).single().then(({ data }) => {
        if (data?.character_id) {
          setCharacter(characters[data.character_id as CharacterId] ?? characters.shizuku)
        }
      })
    })

    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div
        className="w-full max-w-sm flex flex-col items-center gap-8"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease' }}
      >
        {/* キャラ（大きめ） */}
        <div className="animate-breathe">
          <CharacterAvatar character={character} size={120} />
        </div>

        {/* AI返答 */}
        <div
          className="w-full px-5 py-5 rounded-3xl animate-fade-in text-center leading-relaxed"
          style={{
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-text)',
            fontFamily: 'Klee One, cursive',
            fontSize: '1.05rem',
            lineHeight: '1.9',
          }}
        >
          {aiText || '...'}
        </div>

        {/* 日数バッジ */}
        <p
          className="text-sm"
          style={{ color: 'var(--color-text-light)' }}
        >
          {dayCount}日目の記録
        </p>

        {/* ありがとうボタン */}
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
