import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import HomeClient from './HomeClient'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const today = new Date().toISOString().split('T')[0]

  const [userRes, diaryRes, streakRes] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    supabase.from('diary_entries').select('id').eq('user_id', user.id).eq('entry_date', today).maybeSingle(),
    supabase.from('streaks').select('*').eq('user_id', user.id).maybeSingle(),
  ])

  if (!userRes.data) redirect('/select-character')

  const userData = userRes.data
  const startedAt = new Date(userData.started_at)
  const todayDate = new Date()
  const dayCount = Math.floor((todayDate.getTime() - startedAt.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const lastVisited = userData.last_visited_at ? new Date(userData.last_visited_at) : startedAt
  const daysSinceLastVisit = Math.floor((todayDate.getTime() - lastVisited.getTime()) / (1000 * 60 * 60 * 24))

  await supabase
    .from('users')
    .update({ last_visited_at: new Date().toISOString() })
    .eq('id', user.id)

  return (
    <HomeClient
      characterId={userData.character_id}
      dayCount={dayCount}
      daysSinceLastVisit={daysSinceLastVisit}
      hasWrittenToday={!!diaryRes.data}
      currentStreak={streakRes.data?.current_streak ?? 0}
      today={today}
    />
  )
}
