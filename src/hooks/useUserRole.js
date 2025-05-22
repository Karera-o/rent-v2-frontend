"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { USER_ROLES } from '@/config/navigationConfig';

/**
 * Hook to detect the current user role
 * @returns {Object} User role information
 */
export default function useUserRole() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Determine role from user data
    if (user) {
      if (user.role === 'admin') {
        setRole(USER_ROLES.ADMIN);
      } else if (user.role === 'agent' || user.role === 'landlord') {
        setRole(USER_ROLES.LANDLORD);
      } else {
        setRole(USER_ROLES.TENANT);
      }
      setLoading(false);
      return;
    }

    // If no user data, try to determine role from URL path
    if (pathname) {
      if (pathname.includes('/dashboard/admin')) {
        setRole(USER_ROLES.ADMIN);
      } else if (pathname.includes('/dashboard/landlord')) {
        setRole(USER_ROLES.LANDLORD);
      } else if (pathname.includes('/dashboard/user')) {
        setRole(USER_ROLES.TENANT);
      } else {
        // Default to tenant if we can't determine
        setRole(USER_ROLES.TENANT);
      }
    } else {
      // Default to tenant if no pathname
      setRole(USER_ROLES.TENANT);
    }
    
    setLoading(false);
  }, [user, pathname]);

  return {
    role,
    isAdmin: role === USER_ROLES.ADMIN,
    isLandlord: role === USER_ROLES.LANDLORD,
    isTenant: role === USER_ROLES.TENANT,
    loading
  };
}
