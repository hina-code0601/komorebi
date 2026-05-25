import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CalendarClient from './CalendarClient'

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`

  const [entriesRes, streakRes] = await Promise.all([
    supabase
      .from('diary_entries')
      .select('entry_date')
      .eq('user_id', user.id)
      .gte('entry_date', startDate)
      .lte('entry_date', endDate),
    supabase.from('streaks').select('current_streak, longest_streak').eq('user_id', user.id).maybeSingle(),
  ])

  const writtenDates = new Set((entriesRes.data ?? []).map(e => e.entry_date))

  return (
    <CalendarClient
      year={year}
      month={month}
      writtenDates={Array.from(writtenDates)}
      currentStreak={streakRes.data?.current_streak ?? 0}
      longestStreak={streakRes.data?.longest_streak ?? 0}
    />
  )
}
