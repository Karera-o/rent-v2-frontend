import { Inter } from 'next/font/google'
import './globals.css'
import '../styles/fix-circle.css'
import './globals-override.css'
import RootLayoutClient from '@/components/RootLayoutClient'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Clickit & Getin',
  description: 'Find your perfect home with our house rental platform',
  manifest: '/manifest.json',
  formatDetection: {
    telephone: false,
  },
}

export const viewport = {
  themeColor: '#111827',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const appleWebApp = {
  capable: true,
  statusBarStyle: 'default',
  title: 'Clickit & Getin',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Clickit & Getin" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#111827" />
      </head>
      <body className={inter.className}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}
