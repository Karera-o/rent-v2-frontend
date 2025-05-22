"use client";

import { usePathname } from 'next/navigation';
import useIsPWA from '@/hooks/useIsPWA';
import BottomNavigation from '@/components/BottomNavigation';

/**
 * PWA Layout component that conditionally wraps content with bottom navigation
 * when the app is running in PWA mode
 */
export default function PWALayout({ children }) {
  const isPWA = useIsPWA();
  const pathname = usePathname();
  
  // Check if the current path should hide the bottom navigation
  const shouldHideBottomNav = 
    pathname?.includes('/dashboard') || 
    pathname?.includes('/checkout');

  return (
    <>
      <div className={isPWA && !shouldHideBottomNav ? 'pwa-content pb-16' : ''}>
        {children}
      </div>
      
      {isPWA && !shouldHideBottomNav && <BottomNavigation />}
    </>
  );
}
