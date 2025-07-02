import type { Metadata } from 'next'
import { Inter, Alfa_Slab_One, Kalam } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const alfaSlabOne = Alfa_Slab_One({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

const kalam = Kalam({ 
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-handwritten',
})

export const metadata: Metadata = {
  title: 'Digital Polaroid Pinboard',
  description: 'A nostalgic member directory that transforms traditional member listings into an immersive experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${alfaSlabOne.variable} ${kalam.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}