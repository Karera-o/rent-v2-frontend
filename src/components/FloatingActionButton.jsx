"use client";

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * Floating Action Button (FAB) component
 *
 * @param {Object} props Component props
 * @param {string} props.action Primary action type
 * @param {string} props.color Button color (primary, secondary, etc.)
 * @param {Array} props.actions Optional array of secondary actions for speed dial
 * @param {Function} props.onClick Function to call when FAB is clicked
 */
export default function FloatingActionButton({
  action = 'default',
  color = 'primary',
  actions = [],
  onClick,
  className,
  icon = null
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Define action configurations
  const actionConfigs = {
    default: {
      icon: <Plus className="h-6 w-6" />,
      label: 'Add',
      handler: () => {
        if (onClick) onClick();
      }
    },
    addProperty: {
      icon: <Plus className="h-6 w-6" />,
      label: 'Add Property',
      handler: () => router.push('/dashboard/landlord/properties/new')
    },
    addUser: {
      icon: <Plus className="h-6 w-6" />,
      label: 'Add User',
      handler: () => router.push('/dashboard/admin/users/new')
    },
    addBooking: {
      icon: <Plus className="h-6 w-6" />,
      label: 'Add Booking',
      handler: () => router.push('/dashboard/landlord/bookings/new')
    }
  };

  // Get the current action config
  const currentAction = actionConfigs[action] || actionConfigs.default;

  // Define color classes
  const colorClasses = {
    primary: 'bg-[#111827] hover:bg-[#1f2937] text-white',
    secondary: 'bg-blue-600 hover:bg-blue-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  const buttonColorClass = colorClasses[color] || colorClasses.primary;

  // Handle FAB click
  const handleClick = () => {
    if (actions.length > 0) {
      setIsOpen(!isOpen);
    } else {
      currentAction.handler();
    }
  };

  return (
    <div className={cn("fixed right-4 bottom-24 z-40", className)}>
      {/* Speed dial actions */}
      {isOpen && actions.length > 0 && (
        <div className="flex flex-col-reverse gap-2 mb-2 items-end">
          {actions.map((speedAction, index) => {
            const actionConfig = actionConfigs[speedAction.action] || actionConfigs.default;

            return (
              <button
                key={index}
                onClick={() => {
                  setIsOpen(false);
                  if (speedAction.handler) {
                    speedAction.handler();
                  } else {
                    actionConfig.handler();
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-full shadow-lg bg-white text-gray-800"
              >
                <span className="text-sm whitespace-nowrap">{speedAction.label || actionConfig.label}</span>
                <div className={`p-2 rounded-full ${buttonColorClass}`}>
                  {speedAction.icon || actionConfig.icon}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Main FAB button */}
      <button
        onClick={handleClick}
        className={`h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all ${buttonColorClass}`}
        aria-label={currentAction.label}
      >
        {isOpen && actions.length > 0 ? (
          <X className="h-6 w-6" />
        ) : (
          icon || currentAction.icon
        )}
      </button>
    </div>
  );
}
