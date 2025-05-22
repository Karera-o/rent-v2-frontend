"use client";

import { useState, useEffect } from 'react';

/**
 * Hook to detect if the application is running in PWA mode
 * @returns {boolean} True if the app is running in PWA mode
 */
export default function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Function to check if the app is running in standalone mode (PWA)
    const checkPWA = () => {
      // Check for display-mode: standalone (Android, Chrome, Edge)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      
      // Check for navigator.standalone (iOS Safari)
      const isIOSStandalone = 
        window.navigator.standalone === true || 
        window.navigator.standalone === 'standalone';
      
      return isStandalone || isIOSStandalone;
    };

    // Set initial state
    setIsPWA(checkPWA());

    // Listen for changes in display mode
    const mediaQueryList = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e) => {
      setIsPWA(e.matches || window.navigator.standalone === true);
    };

    // Add event listener for display mode changes
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else if (mediaQueryList.addListener) {
      // Fallback for older browsers
      mediaQueryList.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else if (mediaQueryList.removeListener) {
        // Fallback for older browsers
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, []);

  return isPWA;
}
