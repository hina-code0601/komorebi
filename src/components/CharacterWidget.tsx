'use client'

import { useEffect, useState, useCallback } from 'react'
import CharacterAvatar from './CharacterAvatar'
import { Character, Expression } from '@/types'

type Props = {
  character: Character
  greeting: string
  expression?: Expression
  loading?: boolean
}

const LOADING_FRAMES = ['・', '・・', '・・・']

export default function CharacterWidget({ character, greeting, expression = 'happy', loading = false }: Props) {
  const [showBubble, setShowBubble] = useState(false)
  const [bubbleTimer, setBubbleTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [loadingFrame, setLoadingFrame] = useState(0)

  const showAndScheduleHide = useCallback(() => {
    if (bubbleTimer) clearTimeout(bubbleTimer)
    setShowBubble(true)
    const t = setTimeout(() => setShowBubble(false), 3000)
    setBubbleTimer(t)
  }, [bubbleTimer])

  useEffect(() => {
    const t = setTimeout(() => showAndScheduleHide(), 800)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!loading) return
    setShowBubble(true)
    const interval = setInterval(() => {
      setLoadingFrame(f => (f + 1) % LOADING_FRAMES.length)
    }, 400)
    return () => clearInterval(interval)
  }, [loading])

  const [charSize, setCharSize] = useState(100)
  useEffect(() => {
    setCharSize(Math.floor(window.innerHeight / 8))
  }, [])

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2">
      {showBubble && (
        <div
          className="animate-pop-in max-w-[200px] px-3 py-2 rounded-2xl rounded-bl-none text-sm leading-relaxed"
          style={{
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-primary)',
            fontFamily: 'Noto Sans JP, sans-serif',
          }}
        >
          {loading ? LOADING_FRAMES[loadingFrame] : greeting}
        </div>
      )}
      <button onClick={showAndScheduleHide} className="focus:outline-none">
        <CharacterAvatar character={character} size={charSize} expression={expression} />
      </button>
    </div>
  )
}
