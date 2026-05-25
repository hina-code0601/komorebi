'use client'

import Link from 'next/link'

type Props = {
  year: number
  month: number
  writtenDates: string[]
  currentStreak: number
  longestStreak: number
}

const DAYS = ['日', '月', '火', '水', '木', '金', '土']

export default function CalendarClient({ year, month, writtenDates, currentStreak, longestStreak }: Props) {
  const written = new Set(writtenDates)
  const today = new Date().toISOString().split('T')[0]

  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const pad = (n: number) => String(n).padStart(2, '0')
  const toDate = (day: number) => `${year}-${pad(month)}-${pad(day)}`

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* ヘッダー */}
      <header
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: '1px solid var(--color-secondary)' }}
      >
        <Link href="/home" className="text-xl" style={{ color: 'var(--color-text-light)' }}>
          ←
        </Link>
        <h2
          className="text-lg"
          style={{ color: 'var(--color-text)', fontFamily: 'Klee One, cursive' }}
        >
          {year}年{month}月
        </h2>
      </header>

      <div className="flex-1 px-4 py-6 max-w-sm mx-auto w-full animate-fade-in">
        {/* 連続記録 */}
        <div
          className="flex justify-around py-4 rounded-2xl mb-6"
          style={{ backgroundColor: 'var(--color-secondary)' }}
        >
          <div className="text-center">
            <p className="text-2xl font-medium" style={{ color: 'var(--color-accent)', fontFamily: 'Klee One, cursive' }}>
              {currentStreak}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
              連続中
            </p>
          </div>
          <div className="w-px" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.3 }} />
          <div className="text-center">
            <p className="text-2xl font-medium" style={{ color: 'var(--color-accent)', fontFamily: 'Klee One, cursive' }}>
              {longestStreak}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
              最長
            </p>
          </div>
        </div>

        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d, i) => (
            <div
              key={d}
              className="text-center text-xs py-1"
              style={{ color: i === 0 ? '#E57373' : i === 6 ? '#64B5F6' : 'var(--color-text-light)' }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* カレンダーグリッド */}
        <div className="grid grid-cols-7 gap-y-2">
          {cells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />
            const dateStr = toDate(day)
            const isWritten = written.has(dateStr)
            const isToday = dateStr === today

            return (
              <Link
                key={dateStr}
                href={isWritten ? `/diary/${dateStr}` : '#'}
                className="flex flex-col items-center py-1"
              >
                <div
                  className="w-8 h-8 flex items-center justify-center rounded-full text-sm transition"
                  style={{
                    backgroundColor: isToday ? 'var(--color-primary)' : isWritten ? 'var(--color-secondary)' : 'transparent',
                    color: isToday ? '#fff' : 'var(--color-text)',
                    fontWeight: isToday ? '600' : '400',
                  }}
                >
                  {day}
                </div>
                {/* 花マーク */}
                {isWritten && (
                  <span className="text-xs" style={{ color: 'var(--color-accent)' }}>
                    ✿
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* 凡例 */}
        <div className="flex gap-4 justify-center mt-6 text-xs" style={{ color: 'var(--color-text-light)' }}>
          <span>✿ 書いた日</span>
          <span
            className="px-2 rounded-full"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
          >
            今日
          </span>
        </div>
      </div>
    </div>
  )
}
