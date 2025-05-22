"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useIsPWA from '@/hooks/useIsPWA';

/**
 * Handles conditional routing for PWA mode
 * - Redirects About/Contact pages to Home when in PWA mode
 * - Maps URLs to tab states
 * 
 * @param {Object} options - Configuration options
 * @param {Function} options.setActiveTab - Function to set the active tab
 * @returns {Object} - Routing state and functions
 */
export function usePWARouting({ setActiveTab }) {
  const router = useRouter();
  const pathname = usePathname();
  const isPWA = useIsPWA();

  // Handle PWA-specific routing
  useEffect(() => {
    if (!isPWA) return;

    // Redirect About/Contact pages to Home in PWA mode
    if (pathname?.includes('/about') || pathname?.includes('/contact')) {
      router.push('/');
      return;
    }

    // Map current path to tab state
    if (pathname === '/') {
      setActiveTab('home');
    } else if (pathname.startsWith('/properties')) {
      setActiveTab('properties');
    } else if (
      pathname.startsWith('/login') || 
      pathname.startsWith('/register') || 
      pathname.startsWith('/profile') || 
      pathname.startsWith('/dashboard')
    ) {
      setActiveTab('account');
    } else if (pathname.startsWith('/search')) {
      setActiveTab('search');
    }
  }, [isPWA, pathname, router, setActiveTab]);

  return {
    isPWA,
    pathname,
  };
}

/**
 * Maps a tab name to its corresponding URL
 * 
 * @param {string} tab - Tab name
 * @returns {string} - URL for the tab
 */
export function getTabUrl(tab) {
  switch (tab) {
    case 'home':
      return '/';
    case 'properties':
      return '/properties';
    case 'account':
      return '/login';
    case 'search':
      return '/properties';
    default:
      return '/';
  }
}
