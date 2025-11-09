import type { Metadata } from 'next'

import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Inter } from 'next/font/google'
import ThemeToggle from '@/components/theme-toggle'

// Initialize font - Using Inter for clean, modern look
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bridge - Real-Time Chat App',
  description: 'Bridge connects people instantly with real-time messaging and visual communication',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
        <ThemeToggle />
        <Analytics />
      </body>
    </html>
  )
}
