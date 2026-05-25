import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: userData } = await supabase
    .from('users')
    .select('character_id, email')
    .eq('id', user.id)
    .single()

  return (
    <SettingsClient
      email={userData?.email ?? user.email ?? ''}
      characterId={userData?.character_id ?? 'shizuku'}
    />
  )
}
