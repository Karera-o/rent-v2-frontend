"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getNavigationConfig, getIcon } from '@/config/navigationConfig';

/**
 * Role-based bottom navigation component for PWA mode
 * @param {Object} props Component props
 * @param {string} props.userRole User role (admin, landlord, tenant)
 */
export default function RoleBasedBottomNav({ userRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Get navigation config for the user role
  const navConfig = getNavigationConfig(userRole);

  // Update active tab based on current path
  useEffect(() => {
    if (!pathname || !navConfig) return;

    // Find the tab that matches the current path
    const matchingTab = navConfig.bottomTabs.find(tab =>
      pathname === tab.path || pathname.startsWith(`${tab.path}/`)
    );

    if (matchingTab) {
      setActiveTab(matchingTab.id);
    }
  }, [pathname, navConfig]);

  // Handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    router.push(tab.path);
  };

  // We no longer need these menu handlers since we're using the FAB
  // for all secondary options

  if (!navConfig) return null;

  return (
    <div className="pwa-bottom-nav fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navConfig.bottomTabs.map((tab) => {
          const Icon = getIcon(tab.icon);
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              className={`flex flex-col items-center justify-center w-full h-full min-h-[56px] ${
                isActive ? 'text-[#111827]' : 'text-gray-500 hover:text-[#111827]'
              }`}
              onClick={() => handleTabClick(tab)}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-[#111827]' : 'text-gray-500'}`} />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
