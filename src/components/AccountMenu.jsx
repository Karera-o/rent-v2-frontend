"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getIcon } from '@/config/navigationConfig';

/**
 * Account menu component for displaying account-related navigation items
 * @param {Object} props Component props
 * @param {Array} props.items Menu items to display
 * @param {Function} props.onItemClick Function to call when an item is clicked
 */
export default function AccountMenu({ items, onItemClick }) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleItemClick = (item) => {
    if (item.id === 'logout') {
      logout();
      return;
    }

    if (onItemClick) {
      onItemClick(item);
    }

    router.push(item.path);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Account</h2>
        <p className="text-sm text-gray-500">Manage your account settings</p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {items.map((item) => {
          const Icon = getIcon(item.icon);
          const isLogout = item.id === 'logout';
          
          return (
            <button
              key={item.id}
              className={`w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors ${
                isLogout ? 'text-red-600' : 'text-gray-700'
              }`}
              onClick={() => handleItemClick(item)}
            >
              <div className={`p-2 rounded-full mr-3 ${
                isLogout ? 'bg-red-50' : 'bg-gray-100'
              }`}>
                <Icon className={`h-5 w-5 ${
                  isLogout ? 'text-red-500' : 'text-gray-500'
                }`} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">{item.label}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
