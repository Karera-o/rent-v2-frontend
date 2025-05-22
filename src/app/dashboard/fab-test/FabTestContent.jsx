"use client";

import { useState, useEffect } from 'react';
import useIsPWA from '@/hooks/useIsPWA';
import useUserRole from '@/hooks/useUserRole';
import { MoreHorizontal, Settings, User, LogOut, CreditCard, FileText } from 'lucide-react';
import FloatingActionButton from '@/components/FloatingActionButton';

export default function FabTestContent() {
  const isPWA = useIsPWA();
  const { role, isAdmin, isLandlord, isTenant, loading } = useUserRole();
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">FAB Test Page</h1>

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

        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-medium mb-2">FAB Test</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Primary FAB</h3>
              <div className="relative h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                <FloatingActionButton
                  action="default"
                  color="primary"
                  className="relative right-auto bottom-auto"
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">More Options FAB</h3>
              <div className="relative h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                <FloatingActionButton
                  action="default"
                  color="primary"
                  className="relative right-auto bottom-auto"
                  icon={<MoreHorizontal className="h-6 w-6" />}
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">FAB with Actions</h3>
              <div className="relative h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                <FloatingActionButton
                  action="default"
                  color="primary"
                  className="relative right-auto bottom-auto"
                  icon={<MoreHorizontal className="h-6 w-6" />}
                  actions={[
                    {
                      id: 'settings',
                      label: 'Settings',
                      icon: <Settings className="h-5 w-5" />,
                      handler: () => alert('Settings clicked')
                    },
                    {
                      id: 'profile',
                      label: 'Profile',
                      icon: <User className="h-5 w-5" />,
                      handler: () => alert('Profile clicked')
                    },
                    {
                      id: 'logout',
                      label: 'Logout',
                      icon: <LogOut className="h-5 w-5" />,
                      handler: () => alert('Logout clicked')
                    }
                  ]}
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Admin More FAB</h3>
              <div className="relative h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                <FloatingActionButton
                  action="default"
                  color="primary"
                  className="relative right-auto bottom-auto"
                  icon={<MoreHorizontal className="h-6 w-6" />}
                  actions={[
                    {
                      id: 'payments',
                      label: 'Payments',
                      icon: <CreditCard className="h-5 w-5" />,
                      handler: () => alert('Payments clicked')
                    },
                    {
                      id: 'verification',
                      label: 'Verification',
                      icon: <FileText className="h-5 w-5" />,
                      handler: () => alert('Verification clicked')
                    },
                    {
                      id: 'settings',
                      label: 'Settings',
                      icon: <Settings className="h-5 w-5" />,
                      handler: () => alert('Settings clicked')
                    },
                    {
                      id: 'profile',
                      label: 'Profile',
                      icon: <User className="h-5 w-5" />,
                      handler: () => alert('Profile clicked')
                    },
                    {
                      id: 'logout',
                      label: 'Logout',
                      icon: <LogOut className="h-5 w-5" />,
                      handler: () => alert('Logout clicked')
                    }
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
