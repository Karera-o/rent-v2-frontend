"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  HomeIcon,
  Building2,
  CalendarCheck,
  CreditCard,
  // MessageSquare, // Removed for this iteration
  Settings,
  LogOut,
  CalendarDays,
  FileCheck
} from "lucide-react";

export default function LandlordSidebar() {
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
          <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded">Landlord</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          <li>
            <Link
              href="/dashboard/landlord"
              className={`flex items-center px-4 py-2 rounded-md ${
                isActive("/dashboard/landlord") && !isActive("/dashboard/landlord/properties") && !isActive("/dashboard/landlord/bookings") && !isActive("/dashboard/landlord/calendar")
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
              href="/dashboard/landlord/properties"
              className={`flex items-center px-4 py-2 rounded-md ${
                isActive("/dashboard/landlord/properties")
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Building2 className="mr-3 h-5 w-5" />
              My Properties
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/landlord/bookings"
              className={`flex items-center px-4 py-2 rounded-md ${
                isActive("/dashboard/landlord/bookings")
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <CalendarCheck className="mr-3 h-5 w-5" />
              Bookings
            </Link>
          </li>

          {/* Commented out Calendar item
          <li>
            <Link
              href="/dashboard/landlord/calendar"
              className={`flex items-center px-4 py-2 rounded-md ${
                isActive("/dashboard/landlord/calendar")
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <CalendarDays className="mr-3 h-5 w-5" />
              Calendar
            </Link>
          </li>
          */}

          <li>
            <Link
              href="/dashboard/landlord/payments"
              className={`flex items-center px-4 py-2 rounded-md ${
                isActive("/dashboard/landlord/payments")
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <CreditCard className="mr-3 h-5 w-5" />
              Payments
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/landlord/documents"
              className={`flex items-center px-4 py-2 rounded-md ${
                isActive("/dashboard/landlord/documents")
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
                href="/dashboard/landlord/settings"
                className={`flex items-center px-4 py-2 rounded-md ${
                  isActive("/dashboard/landlord/settings")
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
