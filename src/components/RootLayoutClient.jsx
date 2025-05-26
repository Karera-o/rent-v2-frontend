"use client"

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import GoogleAuthProvider from '@/components/GoogleAuthProvider'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import PWALayout from '@/components/PWALayout'
import useIsPWA from '@/hooks/useIsPWA'
import { StripeProvider } from '@/contexts/StripeContext'

export default function RootLayoutClient({ children }) {
  const pathname = usePathname()
  const isPWA = useIsPWA()
  const isDashboard = pathname?.includes('/dashboard')
  const isLoginPage = pathname?.includes('/login')
  const isRegisterPage = pathname?.includes('/register')
  const shouldShowNavAndFooter = !isDashboard && !isLoginPage && !isRegisterPage

  return (
    <GoogleAuthProvider>
      <AuthProvider>
        <StripeProvider>
          {shouldShowNavAndFooter && <Navbar className={isPWA ? 'hide-in-pwa' : ''} />}
          <PWALayout>
            <main>{children}</main>
          </PWALayout>
          {shouldShowNavAndFooter && <Footer className={isPWA ? 'hide-in-pwa' : ''} />}
          <Toaster />
          <PWAInstallPrompt />
        </StripeProvider>
      </AuthProvider>
    </GoogleAuthProvider>
  )
}