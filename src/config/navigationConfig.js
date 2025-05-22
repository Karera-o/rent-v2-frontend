"use client";

import {
  Home,
  Building2,
  Calendar,
  Users,
  User,
  MoreHorizontal,
  Heart,
  CreditCard,
  Settings,
  FileText,
  LogOut
} from 'lucide-react';

/**
 * User role constants
 */
export const USER_ROLES = {
  LANDLORD: 'landlord',
  ADMIN: 'admin',
  TENANT: 'tenant'
};

/**
 * Map of icon names to Lucide React icon components
 */
export const iconMap = {
  dashboard: Home,
  properties: Building2,
  'my-properties': Building2,
  bookings: Calendar,
  users: Users,
  account: User,
  more: MoreHorizontal,
  'saved-properties': Heart,
  profile: User,
  payments: CreditCard,
  'verification-documents': FileText,
  settings: Settings,
  logout: LogOut
};

/**
 * Navigation configuration for different user roles
 */
export const navigationConfig = {
  [USER_ROLES.LANDLORD]: {
    bottomTabs: [
      { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', path: '/dashboard/landlord' },
      { id: 'my-properties', icon: 'properties', label: 'Properties', path: '/dashboard/landlord/properties' },
      { id: 'bookings', icon: 'bookings', label: 'Bookings', path: '/dashboard/landlord/bookings' },
      { id: 'account', icon: 'account', label: 'Account', path: '/dashboard/landlord/account' }
    ],
    accountItems: [
      { id: 'profile', icon: 'profile', label: 'Profile', path: '/dashboard/landlord/profile' },
      { id: 'payments', icon: 'payments', label: 'Payments', path: '/dashboard/landlord/payments' },
      { id: 'verification-documents', icon: 'verification-documents', label: 'Verification', path: '/dashboard/landlord/documents' },
      { id: 'settings', icon: 'settings', label: 'Settings', path: '/dashboard/landlord/settings' },
      { id: 'logout', icon: 'logout', label: 'Logout', path: '/logout' }
    ]
  },
  [USER_ROLES.ADMIN]: {
    bottomTabs: [
      { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', path: '/dashboard/admin' },
      { id: 'users', icon: 'users', label: 'Users', path: '/dashboard/admin/users' },
      { id: 'properties', icon: 'properties', label: 'Properties', path: '/dashboard/admin/properties' },
      { id: 'bookings', icon: 'bookings', label: 'Bookings', path: '/dashboard/admin/bookings' },
      { id: 'more', icon: 'more', label: 'More', path: '/dashboard/admin/more' }
    ],
    moreItems: [
      { id: 'payments', icon: 'payments', label: 'Payments', path: '/dashboard/admin/payments' },
      { id: 'verification-documents', icon: 'verification-documents', label: 'Verification', path: '/dashboard/admin/documents' },
      { id: 'settings', icon: 'settings', label: 'Settings', path: '/dashboard/admin/settings' },
      { id: 'profile', icon: 'profile', label: 'Profile', path: '/dashboard/admin/profile' },
      { id: 'logout', icon: 'logout', label: 'Logout', path: '/logout' }
    ]
  },
  [USER_ROLES.TENANT]: {
    bottomTabs: [
      { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', path: '/dashboard/user' },
      { id: 'bookings', icon: 'bookings', label: 'Bookings', path: '/dashboard/user/bookings' },
      { id: 'saved-properties', icon: 'saved-properties', label: 'Saved', path: '/dashboard/user/favorites' },
      { id: 'account', icon: 'account', label: 'Account', path: '/dashboard/user/account' }
    ],
    accountItems: [
      { id: 'profile', icon: 'profile', label: 'Profile', path: '/dashboard/user/profile' },
      { id: 'settings', icon: 'settings', label: 'Settings', path: '/dashboard/user/settings' },
      { id: 'logout', icon: 'logout', label: 'Logout', path: '/logout' }
    ]
  }
};

/**
 * Get navigation config for a specific user role
 * @param {string} role - User role
 * @returns {Object} Navigation configuration for the role
 */
export function getNavigationConfig(role) {
  // Map API roles to our internal role constants
  let mappedRole;
  
  if (role === 'agent' || role === 'landlord') {
    mappedRole = USER_ROLES.LANDLORD;
  } else if (role === 'admin') {
    mappedRole = USER_ROLES.ADMIN;
  } else {
    // Default to tenant/user
    mappedRole = USER_ROLES.TENANT;
  }
  
  return navigationConfig[mappedRole] || navigationConfig[USER_ROLES.TENANT];
}

/**
 * Get icon component for a given icon name
 * @param {string} iconName - Name of the icon
 * @returns {React.Component} Icon component
 */
export function getIcon(iconName) {
  return iconMap[iconName] || iconMap.dashboard;
}
