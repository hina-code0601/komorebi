'use client'

import { useState } from 'react'
import { characters, CharacterId } from '@/types'
import { createClient } from '@/lib/supabase/client'
import CharacterAvatar from '@/components/CharacterAvatar'

export default function SelectCharacterPage() {
  const [selected, setSelected] = useState<CharacterId | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSelect = async (id: CharacterId) => {
    setSelected(id)
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/'; return }

      const { error: upsertError } = await supabase.from('users').upsert({
        id: user.id,
        character_id: id,
        started_at: new Date().toISOString().split('T')[0],
      }, { onConflict: 'id' })

      if (upsertError) { setError(upsertError.message); setLoading(false); return }

      await supabase.from('streaks').upsert({ user_id: user.id }, { onConflict: 'user_id' })
      await supabase.from('character_evolution').upsert({ user_id: user.id }, { onConflict: 'user_id' })

      window.location.href = '/home'
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-10">
          <h1
            className="text-2xl mb-2"
            style={{ color: 'var(--color-accent)', fontFamily: 'Klee One, cursive' }}
          >
            パートナーを決めてね
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            あとで変えることもできます
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.values(characters).map(char => (
            <button
              key={char.id}
              onClick={() => !loading && handleSelect(char.id)}
              disabled={loading}
              className="flex flex-col items-center gap-3 p-5 rounded-3xl transition-all"
              style={{
                backgroundColor:
                  selected === char.id ? char.color + '30' : 'var(--color-secondary)',
                border: `2px solid ${selected === char.id ? char.color : 'transparent'}`,
                opacity: loading && selected !== char.id ? 0.5 : 1,
              }}
            >
              <CharacterAvatar character={char} size={72} />
              <div className="text-center">
                <p
                  className="text-base font-medium"
                  style={{ color: 'var(--color-text)', fontFamily: 'Klee One, cursive' }}
                >
                  {char.name}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: 'var(--color-text-light)' }}
                >
                  {char.catchphrase}
                </p>
              </div>
            </button>
          ))}
        </div>

        {error && (
          <p className="text-center text-sm mt-4" style={{ color: 'red' }}>{error}</p>
        )}
        {loading && (
          <p
            className="text-center text-sm mt-8 animate-fade-in"
            style={{ color: 'var(--color-text-light)' }}
          >
            準備しています...
          </p>
        )}
      </div>
    </div>
  )
}
