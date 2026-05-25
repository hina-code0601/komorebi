export type CharacterId = 'shizuku' | 'pomu' | 'kokeshi' | 'goron'

export type Character = {
  id: CharacterId
  name: string
  color: string
  catchphrase: string
  image: string
}

export const characters: Record<CharacterId, Character> = {
  shizuku: {
    id: 'shizuku',
    name: 'しずく',
    color: '#89CFF0',
    catchphrase: 'うん、聞いてるよ',
    image: '/characters/shizuku.png',
  },
  pomu: {
    id: 'pomu',
    name: 'ぽむ',
    color: '#C9B1D9',
    catchphrase: 'いっしょにがんばろ！',
    image: '/characters/pomu.png',
  },
  kokeshi: {
    id: 'kokeshi',
    name: 'こけし',
    color: '#90C67C',
    catchphrase: 'ま、ぼちぼちいこ',
    image: '/characters/kokeshi.png',
  },
  goron: {
    id: 'goron',
    name: 'ごろん',
    color: '#F5A66D',
    catchphrase: 'どっしりいこう',
    image: '/characters/goron.png',
  },
}

export type EmotionTag = '😊' | '😐' | '😔' | '😤' | '😴'

export const emotionTags: EmotionTag[] = ['😊', '😐', '😔', '😤', '😴']

export type Expression = 'happy' | 'sleepy' | 'sad' | 'upset'

export function getExpression({
  hasWrittenToday,
  currentStreak,
  daysSinceLastVisit,
}: {
  hasWrittenToday: boolean
  currentStreak: number
  daysSinceLastVisit: number
}): Expression {
  const hour = new Date().getHours()
  if (daysSinceLastVisit >= 14) return 'upset'
  if (daysSinceLastVisit >= 7) return 'sad'
  if (hasWrittenToday) return 'happy'
  if (currentStreak >= 7) return 'happy'
  if (daysSinceLastVisit >= 3) return 'sad'
  if (hour >= 22 || hour < 6) return 'sleepy'
  return 'sleepy'
}

export const getGreeting = (
  dayCount: number,
  hasWrittenToday: boolean,
  daysSinceLastVisit: number
): string => {
  if (daysSinceLastVisit >= 7) return `会いたかったよ。${dayCount}日目だよ`
  if (dayCount === 7) return `7日目！続いてるね、すごいよ`
  if (dayCount === 30) return `1ヶ月いっしょにいたね。ありがとう`
  if (dayCount === 60) return `2ヶ月だよ。本当にありがとう`
  if (dayCount === 100) return `100日。すごいよ、本当に`
  if (dayCount === 365) return `1年。ずっといっしょだったね`
  if (hasWrittenToday) return `今日もよく書いてくれた`
  return `${dayCount}日目だよ。今日も書こっか`
}
