"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Home, Building2, User, Search } from 'lucide-react';
import { usePWARouting, getTabUrl } from '@/utils/pwaRouting';

/**
 * Bottom navigation component for PWA mode
 * Shows simplified tabs: Home, Properties, Account, Search
 */
export default function BottomNavigation() {
  const [activeTab, setActiveTab] = useState('home');

  // Use the PWA routing utility
  usePWARouting({ setActiveTab });

  return (
    <div className="pwa-bottom-nav fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          href={getTabUrl('home')}
          className={`flex flex-col items-center justify-center w-full h-full min-h-[56px] ${
            activeTab === 'home'
              ? 'text-[#111827]'
              : 'text-gray-500 hover:text-[#111827]'
          }`}
        >
          <Home className={`h-5 w-5 ${activeTab === 'home' ? 'fill-current' : ''}`} />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          href={getTabUrl('properties')}
          className={`flex flex-col items-center justify-center w-full h-full min-h-[56px] ${
            activeTab === 'properties'
              ? 'text-[#111827]'
              : 'text-gray-500 hover:text-[#111827]'
          }`}
        >
          <Building2 className={`h-5 w-5 ${activeTab === 'properties' ? 'fill-current' : ''}`} />
          <span className="text-xs mt-1">Properties</span>
        </Link>

       

        <Link
          href={getTabUrl('search')}
          className={`flex flex-col items-center justify-center w-full h-full min-h-[56px] ${
            activeTab === 'search'
              ? 'text-[#111827]'
              : 'text-gray-500 hover:text-[#111827]'
          }`}
        >
          <Search className={`h-5 w-5 ${activeTab === 'search' ? 'fill-current' : ''}`} />
          <span className="text-xs mt-1">Search</span>
        </Link>
         <Link
          href={getTabUrl('account')}
          className={`flex flex-col items-center justify-center w-full h-full min-h-[56px] ${
            activeTab === 'account'
              ? 'text-[#111827]'
              : 'text-gray-500 hover:text-[#111827]'
          }`}
        >
          <User className={`h-5 w-5 ${activeTab === 'account' ? 'fill-current' : ''}`} />
          <span className="text-xs mt-1">Account</span>
        </Link>
      </div>
    </div>
  );
}
