import type { Metadata } from 'next'
import { Pacifico, Nunito } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pacifico',
})

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: 'Happy Birthday Billi! 🐱',
  description: 'A special birthday surprise from Billa to Billi — turning 22!',
  generator: 'Billa',
  icons: {
    icon: "/photos/billi.gif", // Points to public/favicon.gif
    // Optional: Keep a static ico as a backup for older browsers
    // shortcut: "/favicon.ico", 
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${pacifico.variable} ${nunito.variable} bg-bday-bg`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
