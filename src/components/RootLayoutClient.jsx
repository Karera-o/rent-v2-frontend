"use client"

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import GoogleAuthProvider from '@/components/GoogleAuthProvider'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'

export default function RootLayoutClient({ children }) {
  const pathname = usePathname()
  const isDashboard = pathname?.includes('/dashboard')
  const isLoginPage = pathname?.includes('/login')
  const isRegisterPage = pathname?.includes('/register')
  const shouldShowNavAndFooter = !isDashboard && !isLoginPage && !isRegisterPage

  return (
    <GoogleAuthProvider>
      <AuthProvider>
        {shouldShowNavAndFooter && <Navbar />}
        <main>{children}</main>
        {shouldShowNavAndFooter && <Footer />}
        <Toaster />
        <PWAInstallPrompt />
      </AuthProvider>
    </GoogleAuthProvider>
  )
}