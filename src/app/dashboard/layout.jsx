"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import AdminHeader from "@/components/dashboard/AdminHeader";
import LandlordSidebar from "@/components/dashboard/LandlordSidebar";
import LandlordHeader from "@/components/dashboard/LandlordHeader";
import UserSidebar from "@/components/dashboard/UserSidebar";
import UserHeader from "@/components/dashboard/UserHeader";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  
  // Check if current path is admin, landlord, or user
  const isAdmin = pathname.includes('/dashboard/admin');
  const isLandlord = pathname.includes('/dashboard/landlord');
  const isUser = pathname.includes('/dashboard/user');
  
  if (!isAdmin && !isLandlord && !isUser) {
    // Redirect to user dashboard by default
    window.location.href = "/dashboard/user";
  }

  // Determine which sidebar and header to display
  let Sidebar = UserSidebar;
  let Header = UserHeader;
  
  if (isAdmin) {
    Sidebar = AdminSidebar;
    Header = AdminHeader;
  } else if (isLandlord) {
    Sidebar = LandlordSidebar;
    Header = LandlordHeader;
  }
  
  // Determine the user role for passing to sidebar
  const userRole = isAdmin ? 'admin' : isLandlord ? 'landlord' : 'user';

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar userRole={userRole} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header />
          
          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
