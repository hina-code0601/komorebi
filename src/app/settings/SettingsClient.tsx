'use client'

import Link from 'next/link'
import { useState } from 'react'
import { characters, CharacterId } from '@/types'
import { createClient } from '@/lib/supabase/client'
import CharacterAvatar from '@/components/CharacterAvatar'
import { signOut } from '@/app/auth/actions'

type Props = { email: string; characterId: string }

export default function SettingsClient({ email, characterId: initialCharId }: Props) {
  const [currentChar, setCurrentChar] = useState<CharacterId>(initialCharId as CharacterId)
  const [saving, setSaving] = useState(false)

  const handleCharChange = async (id: CharacterId) => {
    setSaving(true)
    setCurrentChar(id)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('users').update({ character_id: id }).eq('id', user.id)
    }
    setSaving(false)
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
        <Link href="/home" className="text-xl" style={{ color: 'var(--color-text-light)' }}>
          ←
        </Link>
        <h2 className="text-lg" style={{ color: 'var(--color-text)', fontFamily: 'Klee One, cursive' }}>
          設定
        </h2>
      </header>

      <div className="flex-1 px-5 py-6 max-w-sm mx-auto w-full flex flex-col gap-8 animate-fade-in">
        {/* アカウント */}
        <section>
          <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-light)' }}>
            アカウント
          </h3>
          <div
            className="px-4 py-3 rounded-2xl text-sm"
            style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-text)' }}
          >
            {email}
          </div>
        </section>

        {/* キャラクター変更 */}
        <section>
          <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-light)' }}>
            いっしょにいる子
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(characters).map(char => (
              <button
                key={char.id}
                onClick={() => !saving && handleCharChange(char.id)}
                disabled={saving}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl transition"
                style={{
                  backgroundColor: currentChar === char.id ? char.color + '25' : 'var(--color-secondary)',
                  border: `2px solid ${currentChar === char.id ? char.color : 'transparent'}`,
                }}
              >
                <CharacterAvatar character={char} size={56} />
                <span className="text-sm" style={{ color: 'var(--color-text)', fontFamily: 'Klee One, cursive' }}>
                  {char.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ログアウト */}
        <form action={signOut} className="mt-auto">
          <button
            type="submit"
            className="w-full py-3 rounded-2xl text-sm transition-opacity active:opacity-70"
            style={{
              backgroundColor: 'var(--color-secondary)',
              color: 'var(--color-text-light)',
              fontFamily: 'Noto Sans JP, sans-serif',
            }}
          >
            ログアウト
          </button>
        </form>
      </div>
    </div>
  )
}
