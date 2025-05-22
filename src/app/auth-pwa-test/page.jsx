"use client";

import { useState, useEffect } from 'react';
import useIsPWA from '@/hooks/useIsPWA';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import HomeLink from '@/components/HomeLink';

export default function AuthPWATestPage() {
  const isPWA = useIsPWA();
  const [displayMode, setDisplayMode] = useState('unknown');
  const [userAgent, setUserAgent] = useState('');
  const [standalone, setStandalone] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get display mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
      const isMinimalUi = window.matchMedia('(display-mode: minimal-ui)').matches;
      const isBrowser = window.matchMedia('(display-mode: browser)').matches;
      
      if (isStandalone) setDisplayMode('standalone');
      else if (isFullscreen) setDisplayMode('fullscreen');
      else if (isMinimalUi) setDisplayMode('minimal-ui');
      else if (isBrowser) setDisplayMode('browser');
      
      // Get user agent
      setUserAgent(window.navigator.userAgent);
      
      // Check iOS standalone
      setStandalone(window.navigator.standalone === true);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Home Link - This should be hidden in PWA mode */}
      <HomeLink />
      
      <div className="container-responsive py-8 mt-16">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home (Always Visible)
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Auth PWA Test Page</h1>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-100 rounded-lg">
              <h2 className="text-lg font-medium mb-2">PWA Status</h2>
              <p className="mb-1">
                <span className="font-medium">Is PWA:</span>{' '}
                <span className={isPWA ? 'text-green-600' : 'text-red-600'}>
                  {isPWA ? 'Yes' : 'No'}
                </span>
              </p>
              <p className="mb-1">
                <span className="font-medium">Display Mode:</span> {displayMode}
              </p>
              <p className="mb-1">
                <span className="font-medium">iOS Standalone:</span>{' '}
                <span className={standalone ? 'text-green-600' : 'text-red-600'}>
                  {standalone ? 'Yes' : 'No'}
                </span>
              </p>
            </div>
            
            <div className="p-4 bg-gray-100 rounded-lg">
              <h2 className="text-lg font-medium mb-2">HomeLink Component Test</h2>
              <p className="mb-4">
                The "Back to Home" button in the top-left corner should be:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-medium">Visible</span> when viewing in a browser (mobile or desktop)
                </li>
                <li>
                  <span className="font-medium">Hidden</span> when viewing in PWA mode (installed app)
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-100 rounded-lg">
              <h2 className="text-lg font-medium mb-2">Navigation Links</h2>
              <div className="space-y-2">
                <Link href="/login">
                  <Button variant="outline" className="w-full justify-start">
                    Go to Login Page
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" className="w-full justify-start">
                    Go to Register Page
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
