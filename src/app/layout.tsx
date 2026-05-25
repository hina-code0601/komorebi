import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Komorebi（こもれび）',
  description: '毎日3行書くだけ。帰ってきたくなる日記の場所',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className="h-full" style={{ backgroundColor: 'var(--color-background)' }}>
        {children}
      </body>
    </html>
  )
}
