"use client";

import { useState, useEffect } from 'react';
import useIsPWA from '@/hooks/useIsPWA';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PWATestPage() {
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
    <div className="container-responsive py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">PWA Test Page</h1>
        
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
            <h2 className="text-lg font-medium mb-2">User Agent</h2>
            <p className="text-sm break-words">{userAgent}</p>
          </div>
          
          <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-medium mb-2">Navigation Test</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/">
                <Button variant="outline" className="w-full">Home</Button>
              </Link>
              <Link href="/properties">
                <Button variant="outline" className="w-full">Properties</Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="w-full">About</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="w-full">Contact</Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Note: In PWA mode, About and Contact links should redirect to Home
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
