"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Building2,
  CreditCard,
  CalendarCheck,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  XCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import AdminService from "@/services/admin";

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [propertyStatuses, setPropertyStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard stats
        const dashboardStats = await AdminService.getDashboardStats();

        // Format stats for display
        const formattedStats = [
          {
            title: "Total Users",
            value: dashboardStats.users.total.toLocaleString(),
            change: dashboardStats.users.change,
            trend: dashboardStats.users.trend,
            icon: <Users className="h-8 w-8 text-blue-500" />
          },
          {
            title: "Total Properties",
            value: dashboardStats.properties.total.toLocaleString(),
            change: dashboardStats.properties.change,
            trend: dashboardStats.properties.trend,
            icon: <Building2 className="h-8 w-8 text-green-500" />
          },
          {
            title: "Total Bookings",
            value: dashboardStats.bookings.total.toLocaleString(),
            change: dashboardStats.bookings.change,
            trend: dashboardStats.bookings.trend,
            icon: <CalendarCheck className="h-8 w-8 text-purple-500" />
          },
          {
            title: "Revenue",
            value: dashboardStats.revenue.formatted,
            change: dashboardStats.revenue.change,
            trend: dashboardStats.revenue.trend,
            icon: <CreditCard className="h-8 w-8 text-yellow-500" />
          }
        ];

        setStats(formattedStats);

        // Fetch recent bookings
        const bookingsResponse = await AdminService.getAllBookings({}, 1, 4);
        setRecentBookings(bookingsResponse.items || []);

        // Fetch property statuses
        const propertiesResponse = await AdminService.getAllProperties({}, 1, 100);

        // Calculate property statuses
        const statusCounts = {};
        propertiesResponse.results.forEach(property => {
          const status = property.status || 'unknown';
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const formattedStatuses = [
          { status: "Available", count: statusCounts.available || 0, color: "bg-green-500" },
          { status: "Pending Approval", count: statusCounts.pending || 0, color: "bg-yellow-500" },
          { status: "Unavailable", count: statusCounts.not_available || 0, color: "bg-gray-500" },
          { status: "Maintenance", count: statusCounts.maintenance || 0, color: "bg-red-500" }
        ];

        setPropertyStatuses(formattedStatuses);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to fetch dashboard data');

        // Fall back to empty data with loading indicators
        setStats([
          {
            title: "Total Users",
            value: "0",
            change: "+0%",
            trend: "up",
            icon: <Users className="h-8 w-8 text-blue-500" />
          },
          {
            title: "Total Properties",
            value: "0",
            change: "+0%",
            trend: "up",
            icon: <Building2 className="h-8 w-8 text-green-500" />
          },
          {
            title: "Total Bookings",
            value: "0",
            change: "+0%",
            trend: "up",
            icon: <CalendarCheck className="h-8 w-8 text-purple-500" />
          },
          {
            title: "Revenue",
            value: "$0.00",
            change: "+0%",
            trend: "up",
            icon: <CreditCard className="h-8 w-8 text-yellow-500" />
          }
        ]);

        // Fall back to mock bookings
        setRecentBookings([
          {
            id: "B12345",
            property: {
              title: "Modern Apartment with City View"
            },
            tenant: {
              name: "John Doe"
            },
            check_in: "2023-03-15",
            check_out: "2023-03-18",
            status: "confirmed",
            amount: 450
          },
          {
            id: "B12346",
            property: {
              title: "Luxury Villa with Pool"
            },
            tenant: {
              name: "Alice Smith"
            },
            check_in: "2023-03-20",
            check_out: "2023-03-25",
            status: "pending",
            amount: 1200
          },
          {
            id: "B12347",
            property: {
              title: "Cozy Studio near University"
            },
            tenant: {
              name: "Robert Johnson"
            },
            check_in: "2023-03-12",
            check_out: "2023-03-14",
            status: "completed",
            amount: 180
          },
          {
            id: "B12348",
            property: {
              title: "Family House with Garden"
            },
            tenant: {
              name: "Emma Williams"
            },
            check_in: "2023-03-25",
            check_out: "2023-03-30",
            status: "cancelled",
            amount: 720
          }
        ]);

        // Fall back to mock property statuses
        setPropertyStatuses([
          { status: "Active", count: 325, color: "bg-green-500" },
          { status: "Pending Approval", count: 64, color: "bg-yellow-500" },
          { status: "Unavailable", count: 48, color: "bg-gray-500" },
          { status: "Maintenance", count: 15, color: "bg-red-500" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to format price
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  // If loading, show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2 text-gray-600">Loading dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
            Generate Reports
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow border border-gray-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {stat.icon}
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {stat.title}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </div>
                  <div
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 flex-shrink-0 self-center" />
                    ) : (
                      <Activity className="h-4 w-4 flex-shrink-0 self-center" />
                    )}
                    <span className="ml-1">{stat.change}</span>
                  </div>
                </dd>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow border border-gray-200 col-span-2">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recent Bookings
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      <Link href={`/dashboard/admin/bookings/${booking.id}`}>
                        {booking.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.property?.title || 'Unknown Property'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.tenant?.name || 'Unknown Tenant'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.check_in || booking.checkIn)} to {formatDate(booking.check_out || booking.checkOut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(booking.status)}
                        <span
                          className={`ml-1.5 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            (booking.status?.toLowerCase() === "confirmed" || booking.status === "Confirmed") ? "bg-green-100 text-green-800" :
                            (booking.status?.toLowerCase() === "pending" || booking.status === "Pending") ? "bg-yellow-100 text-yellow-800" :
                            (booking.status?.toLowerCase() === "completed" || booking.status === "Completed") ? "bg-blue-100 text-blue-800" :
                            "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1).toLowerCase() || booking.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {typeof booking.amount === 'number' ? formatPrice(booking.amount) : booking.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <Link
              href="/dashboard/admin/bookings"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              View all bookings
            </Link>
          </div>
        </div>

        {/* Property Status */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Property Status
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {propertyStatuses.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {item.status}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full`}
                        style={{ width: `${(item.count / Math.max(propertyStatuses.reduce((sum, status) => sum + status.count, 0), 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link
                href="/dashboard/admin/properties"
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                View all properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}