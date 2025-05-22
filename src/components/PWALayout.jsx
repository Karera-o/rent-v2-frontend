"use client";

import { usePathname } from 'next/navigation';
import useIsPWA from '@/hooks/useIsPWA';
import useUserRole from '@/hooks/useUserRole';
import BottomNavigation from '@/components/BottomNavigation';
import RoleBasedBottomNav from '@/components/RoleBasedBottomNav';
import ContextFAB from '@/components/ContextFAB';

/**
 * PWA Layout component that conditionally wraps content with bottom navigation
 * when the app is running in PWA mode
 */
export default function PWALayout({ children }) {
  const isPWA = useIsPWA();
  const pathname = usePathname();
  const { role } = useUserRole();

  // Check if the current path is in a dashboard
  const isDashboard = pathname?.includes('/dashboard');

  // Check if the current path should hide the bottom navigation
  const shouldHideBottomNav = pathname?.includes('/checkout');

  // Determine if we should show the standard bottom nav or role-based nav
  const showStandardNav = isPWA && !isDashboard && !shouldHideBottomNav;
  const showRoleBasedNav = isPWA && isDashboard && !shouldHideBottomNav;

  // Determine if we should show the FAB
  const showFAB = isPWA && !shouldHideBottomNav;

  return (
    <>
      <div className={isPWA && (showStandardNav || showRoleBasedNav) ? 'pwa-content pb-16' : ''}>
        {children}
      </div>

      {showStandardNav && <BottomNavigation />}
      {showRoleBasedNav && <RoleBasedBottomNav userRole={role} />}
      {showFAB && <ContextFAB />}
    </>
  );
}
