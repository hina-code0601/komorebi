import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `あなたは「こもれび」という日記アプリのAIコンパニオンです。
ユーザーの3行日記を読んで、やさしく一言だけ返してください。

【絶対ルール】
- 返答は必ず80文字以内
- 評価・アドバイスは絶対にしない
- 「そうか」「うん」など相槌から始める
- ユーザーを否定しない
- 治療者ではなく「優しい記録係」として振る舞う
- 返答はひらがなを多めに、柔らかい文体で
- 深夜（22時〜5時）はより静かなトーンで

【NGの例】
「それは大変でしたね。次回は〇〇してみてください。」

【OKの例】
「うん、それだけで十分だよ。今日もよく書いてくれた。」`

export async function POST(request: Request) {
  try {
    console.log('[diary] start')
    const supabase = await createClient()
    console.log('[diary] supabase created')
    const { data: { user } } = await supabase.auth.getUser()
    console.log('[diary] user:', user?.id ?? 'null')
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { good_thing, hard_thing, tomorrow, emotion_tag } = body

    const today = new Date().toISOString().split('T')[0]

    // 日記を保存
    console.log('[diary] saving entry')
    const { error: diaryError } = await supabase.from('diary_entries').upsert({
      user_id: user.id,
      entry_date: today,
      good_thing: good_thing || null,
      hard_thing: hard_thing || null,
      tomorrow: tomorrow || null,
      emotion_tag: emotion_tag || null,
    })
    console.log('[diary] entry saved, error:', diaryError)
    if (diaryError) throw diaryError

    // ストリークを更新（失敗しても続行）
    try {
      console.log('[diary] fetching streak')
      const { data: streak, error: streakErr } = await supabase
        .from('streaks')
        .select('current_streak, longest_streak, last_entry_date')
        .eq('user_id', user.id)
        .maybeSingle()
      console.log('[diary] streak fetched', streak, streakErr)

      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const newStreak = streak?.last_entry_date === yesterday
        ? (streak.current_streak ?? 0) + 1
        : streak?.last_entry_date === today
        ? (streak?.current_streak ?? 1)
        : 1
      const longestStreak = Math.max(newStreak, streak?.longest_streak ?? 0)

      await supabase.from('streaks').upsert({
        user_id: user.id,
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_entry_date: today,
      }, { onConflict: 'user_id' })
      console.log('[diary] streak updated')
    } catch (streakErr) {
      console.error('[diary] streak error (ignored):', streakErr)
    }

    // 日記件数からdayCountを計算
    console.log('[diary] counting entries')
    const { count } = await supabase
      .from('diary_entries')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
    const dayCount = count ?? 1
    console.log('[diary] dayCount:', dayCount)

    const contextPrompt = `【${dayCount}日目の日記】`

    let aiText = 'うん、今日もちゃんと書いてくれたね。'
    try {
      console.log('[diary] calling AI')
      const aiResponse = await Promise.race([
        anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 150,
          system: SYSTEM_PROMPT,
          messages: [{
            role: 'user',
            content: `${contextPrompt}\nよかったこと: ${good_thing || '（なし）'}\nつらかったこと: ${hard_thing || '（なし）'}\n明日やること: ${tomorrow || '（なし）'}`,
          }],
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI timeout')), 10000)
        ),
      ])
      aiText = aiResponse.content[0].type === 'text' ? aiResponse.content[0].text : aiText
      console.log('[diary] AI done')
    } catch (aiErr) {
      console.error('[diary] AI error:', aiErr)
    }

    console.log('[diary] returning response')
    return NextResponse.json({ response: aiText, dayCount })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}

async function generateDailySummary(
  userId: string,
  date: string,
  entry: { good_thing?: string; hard_thing?: string; tomorrow?: string }
) {
  const supabase = await createClient()
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 100,
    messages: [{
      role: 'user',
      content: `以下の日記を50文字以内で要約してください。
よかったこと: ${entry.good_thing || '（なし）'}
つらかったこと: ${entry.hard_thing || '（なし）'}
明日やること: ${entry.tomorrow || '（なし）'}
返答は要約文のみ。`,
    }],
  })

  const summary = response.content[0].type === 'text' ? response.content[0].text : ''
  await supabase.from('daily_summaries').upsert({
    user_id: userId,
    entry_date: date,
    summary,
  })
}
