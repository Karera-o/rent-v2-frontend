"use client";

import { useState, useEffect } from 'react';
import useIsPWA from '@/hooks/useIsPWA';
import useUserRole from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { USER_ROLES, getNavigationConfig } from '@/config/navigationConfig';

export default function DashboardPWATestPage() {
  const isPWA = useIsPWA();
  const { role, isAdmin, isLandlord, isTenant, loading } = useUserRole();
  const [displayMode, setDisplayMode] = useState('unknown');
  const [userAgent, setUserAgent] = useState('');
  const [standalone, setStandalone] = useState(false);
  
  // Get navigation config for the current role
  const navConfig = role ? getNavigationConfig(role) : null;
  
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
        <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Dashboard PWA Test Page</h1>
        
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
            <h2 className="text-lg font-medium mb-2">User Role</h2>
            {loading ? (
              <p>Loading role information...</p>
            ) : (
              <>
                <p className="mb-1">
                  <span className="font-medium">Role:</span> {role || 'Unknown'}
                </p>
                <p className="mb-1">
                  <span className="font-medium">Is Admin:</span>{' '}
                  <span className={isAdmin ? 'text-green-600' : 'text-red-600'}>
                    {isAdmin ? 'Yes' : 'No'}
                  </span>
                </p>
                <p className="mb-1">
                  <span className="font-medium">Is Landlord:</span>{' '}
                  <span className={isLandlord ? 'text-green-600' : 'text-red-600'}>
                    {isLandlord ? 'Yes' : 'No'}
                  </span>
                </p>
                <p className="mb-1">
                  <span className="font-medium">Is Tenant:</span>{' '}
                  <span className={isTenant ? 'text-green-600' : 'text-red-600'}>
                    {isTenant ? 'Yes' : 'No'}
                  </span>
                </p>
              </>
            )}
          </div>
          
          {navConfig && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <h2 className="text-lg font-medium mb-2">Navigation Configuration</h2>
              <div className="mb-3">
                <h3 className="font-medium">Bottom Tabs:</h3>
                <ul className="list-disc pl-5 mt-1">
                  {navConfig.bottomTabs.map(tab => (
                    <li key={tab.id}>
                      {tab.label} ({tab.id}) - {tab.path}
                    </li>
                  ))}
                </ul>
              </div>
              
              {navConfig.accountItems && (
                <div className="mb-3">
                  <h3 className="font-medium">Account Items:</h3>
                  <ul className="list-disc pl-5 mt-1">
                    {navConfig.accountItems.map(item => (
                      <li key={item.id}>
                        {item.label} ({item.id}) - {item.path}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {navConfig.moreItems && (
                <div>
                  <h3 className="font-medium">More Items:</h3>
                  <ul className="list-disc pl-5 mt-1">
                    {navConfig.moreItems.map(item => (
                      <li key={item.id}>
                        {item.label} ({item.id}) - {item.path}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-medium mb-2">User Agent</h2>
            <p className="text-sm break-words">{userAgent}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
