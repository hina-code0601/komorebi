'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { characters, getGreeting, getExpression, CharacterId } from '@/types'
import CharacterWidget from '@/components/CharacterWidget'
import { signOut } from '@/app/auth/actions'

type Props = {
  characterId: string
  dayCount: number
  daysSinceLastVisit: number
  hasWrittenToday: boolean
  currentStreak: number
  today: string
}

export default function HomeClient({
  characterId,
  dayCount,
  daysSinceLastVisit,
  hasWrittenToday,
  currentStreak,
  today,
}: Props) {
  const character = characters[characterId as CharacterId] ?? characters.shizuku
  const greeting = getGreeting(dayCount, hasWrittenToday, daysSinceLastVisit)
  const expression = getExpression({ hasWrittenToday, currentStreak, daysSinceLastVisit })

  const dateObj = new Date(today + 'T00:00:00')
  const weekDays = ['日', '月', '火', '水', '木', '金', '土']
  const dateLabel = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日（${weekDays[dateObj.getDay()]}）`

  const isSpecial = daysSinceLastVisit >= 7 || [7, 30, 60, 100, 365].includes(dayCount)

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* ヘッダー */}
      <header
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid var(--color-secondary)' }}
      >
        <h1
          className="text-xl"
          style={{ color: 'var(--color-accent)', fontFamily: 'Klee One, cursive' }}
        >
          こもれび
        </h1>
        <Link
          href="/settings"
          className="text-xl"
          style={{ color: 'var(--color-text-light)' }}
          aria-label="設定"
        >
          ⚙
        </Link>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-32 animate-fade-in">
        {/* 日付・日数 */}
        <div className="text-center mb-10">
          <p className="text-sm mb-1" style={{ color: 'var(--color-text-light)' }}>
            {dateLabel}
          </p>
          <p
            className={`text-2xl font-medium ${isSpecial ? 'animate-pop-in' : ''}`}
            style={{ color: 'var(--color-accent)', fontFamily: 'Klee One, cursive' }}
          >
            {dayCount}日目
          </p>
          {currentStreak > 1 && (
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
              {currentStreak}日連続
            </p>
          )}
        </div>

        {/* 状態メッセージ */}
        <div className="text-center mb-10">
          <p
            className="text-lg leading-relaxed"
            style={{ color: 'var(--color-text)', fontFamily: 'Klee One, cursive' }}
          >
            {hasWrittenToday
              ? '今日もありがとう'
              : daysSinceLastVisit >= 7
              ? '会いたかったよ'
              : '今日のこと、聞かせて'}
          </p>
        </div>

        {/* ボタン群 */}
        <div className="w-full max-w-xs flex flex-col gap-3">
          {!hasWrittenToday && (
            <Link
              href="/diary/new"
              className="w-full py-4 rounded-2xl text-center text-base font-medium transition-opacity active:opacity-80"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                fontFamily: 'Noto Sans JP, sans-serif',
              }}
            >
              今日のことを書く
            </Link>
          )}
          <Link
            href="/calendar"
            className="w-full py-4 rounded-2xl text-center text-base transition-opacity active:opacity-80"
            style={{
              backgroundColor: 'var(--color-secondary)',
              color: 'var(--color-text)',
              fontFamily: 'Noto Sans JP, sans-serif',
            }}
          >
            カレンダーを見る
          </Link>
        </div>
      </main>

      {/* キャラクター */}
      <CharacterWidget character={character} greeting={greeting} expression={expression} />
    </div>
  )
}
