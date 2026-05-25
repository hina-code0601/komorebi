import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

export default async function DiaryDetailPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: entry } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('user_id', user.id)
    .eq('entry_date', date)
    .single()

  if (!entry) notFound()

  const dateObj = new Date(date + 'T00:00:00')
  const weekDays = ['日', '月', '火', '水', '木', '金', '土']
  const dateLabel = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日（${weekDays[dateObj.getDay()]}）`

  const fields = [
    { label: 'よかったこと', value: entry.good_thing },
    { label: 'つらかったこと', value: entry.hard_thing },
    { label: '明日やること', value: entry.tomorrow },
  ]

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
      <header
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: '1px solid var(--color-secondary)' }}
      >
        <Link href="/calendar" className="text-xl" style={{ color: 'var(--color-text-light)' }}>
          ←
        </Link>
        <h2 className="text-lg" style={{ color: 'var(--color-text)', fontFamily: 'Klee One, cursive' }}>
          {dateLabel}
        </h2>
      </header>

      <div className="flex-1 px-5 py-6 max-w-sm mx-auto w-full flex flex-col gap-5 animate-fade-in">
        {entry.emotion_tag && (
          <div className="text-center text-3xl">{entry.emotion_tag}</div>
        )}
        {fields.map(f => f.value && (
          <div key={f.label}>
            <p className="text-xs mb-2" style={{ color: 'var(--color-text-light)' }}>
              ▷ {f.label}
            </p>
            <div
              className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
              style={{
                backgroundColor: 'var(--color-secondary)',
                color: 'var(--color-text)',
                fontFamily: 'Noto Sans JP, sans-serif',
                lineHeight: '1.8',
              }}
            >
              {f.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
