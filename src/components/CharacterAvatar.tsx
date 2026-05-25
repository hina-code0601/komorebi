'use client'

import { useState, useEffect } from 'react'
import { Character, Expression } from '@/types'

type Props = {
  character: Character
  size?: number
  expression?: Expression
  className?: string
}

const SPRITE_POSITIONS: Record<Expression, string> = {
  happy:  '0% center',
  sleepy: '33.33% center',
  sad:    '66.67% center',
  upset:  '100% center',
}

export default function CharacterAvatar({ character, size = 80, expression = 'happy', className = '' }: Props) {
  const [hopKey, setHopKey] = useState(0)
  const [hopping, setHopping] = useState(false)
  const [imgOk, setImgOk] = useState(true)

  useEffect(() => {
    const img = new Image()
    img.src = character.image
    img.onerror = () => setImgOk(false)
  }, [character.image])

  const handleClick = () => {
    if (hopping) return
    setHopping(true)
    setHopKey(k => k + 1)
    setTimeout(() => setHopping(false), 750)
  }

  const animClass = hopping ? 'animate-character-hop' : 'animate-character-idle'

  if (!imgOk) {
    return (
      <div
        key={hopKey}
        className={`rounded-full flex items-center justify-center font-bold text-white ${animClass} ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: character.color,
          fontSize: size * 0.3,
          cursor: 'pointer',
        }}
        onClick={handleClick}
      >
        {character.name[0]}
      </div>
    )
  }

  return (
    <div
      key={hopKey}
      className={`${animClass} ${className}`}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${character.image})`,
        backgroundSize: '400% auto',
        backgroundPosition: SPRITE_POSITIONS[expression],
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    />
  )
}
