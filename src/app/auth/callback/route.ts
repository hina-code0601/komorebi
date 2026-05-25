import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!existingUser) {
          await supabase.from('users').insert({
            id: user.id,
            email: user.email!,
            character_id: 'shizuku',
          })
          return NextResponse.redirect(`${origin}/select-character`)
        }

        const { data: userData } = await supabase
          .from('users')
          .select('character_id')
          .eq('id', user.id)
          .single()

        if (!userData?.character_id || userData.character_id === 'shizuku') {
          return NextResponse.redirect(`${origin}/select-character`)
        }
      }
      return NextResponse.redirect(`${origin}/home`)
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth`)
}
