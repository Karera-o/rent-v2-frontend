"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  HomeIcon,
  Users,
  Building2,
  CalendarCheck,
  CreditCard,
  // BarChart3, // Commented out for this iteration - will be used for Analytics in future
  // MessageSquare, // Removed for this iteration
  Settings,
  LogOut,
  FileCheck
} from "lucide-react";

export default function AdminSidebar({ userRole }) {
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
          <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          <li>
            <Link
              href="/dashboard/admin"
              className={`flex items-center px-4 py-2 rounded-md ${
                isActive("/dashboard/admin")
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
              href="/dashboard/admin/users"
              className={`flex items-center px-4 py-2 rounded-md ${
                isActive("/dashboard/admin/users")
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              Users
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/admin/properties"
              className={`flex items-center px-4 py-2 rounded-md ${
                isActive("/dashboard/admin/properties")
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Building2 className="mr-3 h-5 w-5" />
              Properties
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/admin/bookings"
              className={`flex items-center px-4 py-2 rounded-md ${
                isActive("/dashboard/admin/bookings")
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <CalendarCheck className="mr-3 h-5 w-5" />
              Bookings
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/admin/payments"
              className={`flex items-center px-4 py-2 rounded-md ${
                isActive("/dashboard/admin/payments")
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <CreditCard className="mr-3 h-5 w-5" />
              Payments
            </Link>
          </li>

          {/* Analytics menu item commented out for this iteration - will be implemented in future */}
          {/* <li>
            <Link
              href="/dashboard/admin/analytics"
              className={`flex items-center px-4 py-2 rounded-md ${
                isActive("/dashboard/admin/analytics")
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              Analytics
            </Link>
          </li> */}

          <li>
            <Link
              href="/dashboard/admin/documents"
              className={`flex items-center px-4 py-2 rounded-md ${
                isActive("/dashboard/admin/documents")
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <FileCheck className="mr-3 h-5 w-5" />
              Verification Documents
            </Link>
          </li>

          {/* Messages menu item removed for this iteration */}
        </ul>

        {/* Settings and Logout at bottom */}
        <div className="px-2 mt-6 pt-6 border-t border-gray-800">
          <ul className="space-y-1">
            <li>
              <Link
                href="/dashboard/admin/settings"
                className={`flex items-center px-4 py-2 rounded-md ${
                  isActive("/dashboard/admin/settings")
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