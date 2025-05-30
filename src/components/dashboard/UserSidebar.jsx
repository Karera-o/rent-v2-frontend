"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  HomeIcon,
  CalendarCheck,
  // MessageSquare, // Removed for this iteration
  Heart,
  Settings,
  LogOut
} from "lucide-react";

export default function UserSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    logout();
  };

  return (
    <aside className="hidden md:flex md:w-64 flex-col bg-gray-900 text-white">
      {/* Logo */}
      <div className="p-4 border-b border-gray-800">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-semibold">HomeRental</span>
          <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded">Tenant</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          <li>
            <Link
              href="/dashboard/user"
              className={`flex items-center px-4 py-2 rounded-md ${
                isActive("/dashboard/user")
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <HomeIcon className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/user/bookings"
              className={`flex items-center px-4 py-2 rounded-md ${
                isActive("/dashboard/user/bookings")
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <CalendarCheck className="mr-3 h-5 w-5" />
              My Bookings
            </Link>
          </li>

          {/* Messages menu item removed for this iteration */}

          {/* <li>
            <Link
              href="/dashboard/user/saved"
              className={`flex items-center px-4 py-2 rounded-md ${
                isActive("/dashboard/user/saved")
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Heart className="mr-3 h-5 w-5" />
              Saved Properties
            </Link>
          </li> */}
        </ul>

        {/* Settings and Logout at bottom */}
        <div className="px-2 mt-6 pt-6 border-t border-gray-800">
          <ul className="space-y-1">
            <li>
              <Link
                href="/dashboard/user/settings"
                className={`flex items-center px-4 py-2 rounded-md ${
                  isActive("/dashboard/user/settings")
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Link>
            </li>
            <li>
              <button
                className="w-full flex items-center px-4 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}