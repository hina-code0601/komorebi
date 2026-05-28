'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signInAnonymously() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInAnonymously()
  if (error) throw new Error(error.message)
  redirect('/select-character')
}

export async function signInWithEmail(email: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
    },
  })
  if (error) throw new Error(error.message)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
