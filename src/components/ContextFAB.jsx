"use client";

import { usePathname, useRouter } from 'next/navigation';
import useUserRole from '@/hooks/useUserRole';
import { useAuth } from '@/contexts/AuthContext';
import FloatingActionButton from './FloatingActionButton';
import { USER_ROLES, getNavigationConfig, getIcon } from '@/config/navigationConfig';
import { MoreHorizontal } from 'lucide-react';

/**
 * Context-aware Floating Action Button
 * Shows different FABs based on the current route and user role
 */
export default function ContextFAB() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useUserRole();
  const { logout } = useAuth();

  // Don't show FAB on certain paths
  if (!pathname || !role) return null;

  // Don't show FAB on login, register, checkout pages
  if (
    pathname.includes('/login') ||
    pathname.includes('/register') ||
    pathname.includes('/checkout')
  ) {
    return null;
  }

  // Get navigation config for the user role
  const navConfig = getNavigationConfig(role);

  // If there are no FAB items, don't show the FAB
  if (!navConfig?.fabItems || navConfig.fabItems.length === 0) {
    return null;
  }

  // Convert fabItems to actions for the FAB
  const fabActions = navConfig.fabItems.map(item => {
    const IconComponent = getIcon(item.icon);

    return {
      id: item.id,
      label: item.label,
      icon: IconComponent ? <IconComponent className="h-5 w-5" /> : null,
      handler: () => {
        if (item.id === 'logout') {
          logout();
        } else {
          router.push(item.path);
        }
      }
    };
  });

  // Define FAB configurations based on path and role

  // Admin role FABs
  if (role === USER_ROLES.ADMIN) {
    // Admin Users page - Add User + More Options
    if (pathname.includes('/dashboard/admin/users')) {
      return (
        <FloatingActionButton
          action="addUser"
          color="primary"
          actions={fabActions}
        />
      );
    }

    // Admin Properties page - Add Property + More Options
    if (pathname.includes('/dashboard/admin/properties')) {
      return (
        <FloatingActionButton
          action="addProperty"
          color="primary"
          actions={fabActions}
        />
      );
    }

    // Admin Bookings page - Add Booking + More Options
    if (pathname.includes('/dashboard/admin/bookings')) {
      return (
        <FloatingActionButton
          action="addBooking"
          color="primary"
          actions={fabActions}
        />
      );
    }

    // Admin Dashboard page - More Options
    if (pathname.includes('/dashboard/admin')) {
      return (
        <FloatingActionButton
          action="default"
          color="primary"
          icon={<MoreHorizontal className="h-6 w-6" />}
          actions={fabActions}
        />
      );
    }
  }

  // Landlord role FABs
  if (role === USER_ROLES.LANDLORD) {
    // Landlord Properties page - Add Property + More Options
    if (pathname.includes('/dashboard/landlord/properties')) {
      return (
        <FloatingActionButton
          action="addProperty"
          color="primary"
          actions={fabActions}
        />
      );
    }

    // Landlord Bookings page - Add Booking + More Options
    if (pathname.includes('/dashboard/landlord/bookings')) {
      return (
        <FloatingActionButton
          action="addBooking"
          color="primary"
          actions={fabActions}
        />
      );
    }

    // Landlord Dashboard page - More Options + Add Property/Booking
    if (pathname.includes('/dashboard/landlord')) {
      const PropertyIcon = getIcon('properties');
      const BookingIcon = getIcon('bookings');

      const combinedActions = [
        {
          id: 'addProperty',
          label: 'Add Property',
          icon: PropertyIcon ? <PropertyIcon className="h-5 w-5" /> : null,
          handler: () => router.push('/dashboard/landlord/properties/new')
        },
        {
          id: 'addBooking',
          label: 'Add Booking',
          icon: BookingIcon ? <BookingIcon className="h-5 w-5" /> : null,
          handler: () => router.push('/dashboard/landlord/bookings/new')
        },
        ...fabActions
      ];

      return (
        <FloatingActionButton
          action="default"
          color="primary"
          icon={<MoreHorizontal className="h-6 w-6" />}
          actions={combinedActions}
        />
      );
    }
  }

  // Tenant role FABs
  if (role === USER_ROLES.TENANT) {
    // Tenant Saved Properties page - Browse Properties + More Options
    if (pathname.includes('/dashboard/user/favorites')) {
      const PropertiesIcon = getIcon('properties');

      const browseAction = {
        id: 'browse',
        label: 'Browse Properties',
        icon: PropertiesIcon ? <PropertiesIcon className="h-5 w-5" /> : null,
        handler: () => router.push('/properties')
      };

      return (
        <FloatingActionButton
          action="default"
          color="primary"
          icon={<MoreHorizontal className="h-6 w-6" />}
          actions={[browseAction, ...fabActions]}
        />
      );
    }

    // Tenant Bookings page - Add Booking + More Options
    if (pathname.includes('/dashboard/user/bookings')) {
      return (
        <FloatingActionButton
          action="addBooking"
          color="primary"
          actions={fabActions}
        />
      );
    }

    // Tenant Dashboard page - More Options
    if (pathname.includes('/dashboard/user')) {
      return (
        <FloatingActionButton
          action="default"
          color="primary"
          icon={<MoreHorizontal className="h-6 w-6" />}
          actions={fabActions}
        />
      );
    }
  }

  // Default: show More Options FAB for dashboard pages
  if (pathname.includes('/dashboard')) {
    return (
      <FloatingActionButton
        action="default"
        color="primary"
        icon={<MoreHorizontal className="h-6 w-6" />}
        actions={fabActions}
      />
    );
  }

  // No FAB for other pages
  return null;
}
