"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useIsPWA from '@/hooks/useIsPWA';
import useUserRole from '@/hooks/useUserRole';
import { USER_ROLES, getNavigationConfig } from '@/config/navigationConfig';

/**
 * Maps dashboard paths to their corresponding tab IDs
 * @param {string} pathname - Current path
 * @param {string} role - User role
 * @returns {string|null} - Tab ID or null if no match
 */
export function mapPathToTabId(pathname, role) {
  if (!pathname || !role) return null;
  
  const navConfig = getNavigationConfig(role);
  if (!navConfig) return null;
  
  // Find the tab that matches the current path
  const matchingTab = navConfig.bottomTabs.find(tab => 
    pathname === tab.path || pathname.startsWith(`${tab.path}/`)
  );
  
  return matchingTab ? matchingTab.id : null;
}

/**
 * Maps a tab ID to its corresponding path
 * @param {string} tabId - Tab ID
 * @param {string} role - User role
 * @returns {string|null} - Path or null if no match
 */
export function mapTabIdToPath(tabId, role) {
  if (!tabId || !role) return null;
  
  const navConfig = getNavigationConfig(role);
  if (!navConfig) return null;
  
  // Find the tab with the matching ID
  const matchingTab = navConfig.bottomTabs.find(tab => tab.id === tabId);
  
  return matchingTab ? matchingTab.path : null;
}

/**
 * Hook for handling PWA dashboard routing
 * @param {Object} options - Configuration options
 * @param {Function} options.setActiveTab - Function to set the active tab
 * @returns {Object} - Routing state and functions
 */
export function usePWADashboardRouting({ setActiveTab }) {
  const router = useRouter();
  const pathname = usePathname();
  const isPWA = useIsPWA();
  const { role } = useUserRole();
  
  // Handle PWA-specific routing
  useEffect(() => {
    if (!isPWA || !pathname || !role) return;
    
    // Map current path to tab state
    const tabId = mapPathToTabId(pathname, role);
    if (tabId) {
      setActiveTab(tabId);
    }
  }, [isPWA, pathname, role, setActiveTab]);
  
  /**
   * Navigate to a tab
   * @param {string} tabId - Tab ID to navigate to
   */
  const navigateToTab = (tabId) => {
    const path = mapTabIdToPath(tabId, role);
    if (path) {
      router.push(path);
    }
  };
  
  return {
    isPWA,
    pathname,
    role,
    navigateToTab
  };
}
