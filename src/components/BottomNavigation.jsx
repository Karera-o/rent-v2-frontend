'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Heart, User, Grid3X3 } from 'lucide-react';

const BottomNavigation = () => {
  const pathname = usePathname();
  
  // Don't show on dashboard, login, or register pages
  if (pathname.startsWith('/dashboard') || pathname.includes('/login') || pathname.includes('/register')) {
    return null;
  }

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: 'Home',
      active: pathname === '/'
    },
    {
      href: '/properties',
      icon: Search,
      label: 'Browse',
      active: pathname.startsWith('/properties')
    },
    {
      href: '/favorites',
      icon: Heart,
      label: 'Saved',
      active: pathname.startsWith('/favorites')
    },
    {
      href: '/dashboard',
      icon: Grid3X3,
      label: 'Dashboard',
      active: pathname.startsWith('/dashboard')
    },
    {
      href: '/profile',
      icon: User,
      label: 'Profile',
      active: pathname.startsWith('/profile')
    }
  ];

  return (
    <>
      {/* Bottom Navigation - Only visible on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50 safe-area-pb">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center min-w-0 flex-1 py-1 px-1 text-xs bottom-nav-item ${
                  item.active
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon 
                  size={20} 
                  className={`mb-1 ${item.active ? 'text-blue-600' : 'text-gray-500'}`} 
                />
                <span className={`text-xs font-medium truncate ${
                  item.active ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* Bottom spacing to prevent content from being hidden behind bottom nav */}
      <div className="h-16 lg:hidden"></div>
    </>
  );
};

export default BottomNavigation;