"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  CalendarCheck,
  CreditCard,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import BookingService from "@/services/booking";
import PaymentService from "@/services/payment";
import PropertyService from "@/services/property";

export default function LandlordDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([
    {
      title: "Total Properties",
      value: "0",
      change: "0",
      trend: "up",
      icon: <Building2 className="h-8 w-8 text-green-500" />
    },
    {
      title: "Active Bookings",
      value: "0",
      change: "0",
      trend: "up",
      icon: <CalendarCheck className="h-8 w-8 text-purple-500" />
    },
    {
      title: "This Month Revenue",
      value: "$0",
      change: "0",
      trend: "up",
      icon: <CreditCard className="h-8 w-8 text-yellow-500" />
    },
    {
      title: "Occupancy Rate",
      value: "0%",
      change: "0",
      trend: "up",
      icon: <Users className="h-8 w-8 text-blue-500" />
    }
  ]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [propertyStatuses, setPropertyStatuses] = useState([]);

  // Format price for display
  const formatPrice = (price) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price);
    } catch (error) {
      console.error('Error formatting price:', error);
      return `$${price}`;
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    console.log('LandlordDashboard: Initializing dashboard with real data from backend APIs');
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if we're authenticated
        if (!user) {
          console.error('No user available for dashboard request');
          setError('Authentication required');
          setLoading(false);
          return;
        }

        // Check if user is an agent/landlord
        if (user.role !== 'agent' && user.role !== 'admin') {
          console.error('User is not an agent or admin');
          setError('You do not have permission to view this page');
          setLoading(false);
          return;
        }

        // Fetch properties
        console.log('Fetching landlord properties from backend...');
        const propertiesResponse = await PropertyService.getLandlordProperties();
        console.log('Properties response from backend:', propertiesResponse);
        const properties = propertiesResponse.results || [];

        // Fetch bookings
        console.log('Fetching owner bookings from backend...');
        const bookingsResponse = await BookingService.getOwnerBookings();
        console.log('Bookings response from backend:', bookingsResponse);
        const bookings = bookingsResponse.items || [];

        // Fetch payments
        console.log('Fetching user payments from backend...');
        const paymentsResponse = await PaymentService.getUserPayments();
        console.log('Payments response from backend:', paymentsResponse);
        const payments = paymentsResponse.items || [];

        // Process recent bookings (latest 3)
        const formattedBookings = bookings
          .slice(0, 3)
          .map(booking => {
            // Check if tenant information is available
            let tenantName = 'Guest';
            if (booking.tenant) {
              // Try to get the name from first_name and last_name if available
              if (booking.tenant.first_name || booking.tenant.last_name) {
                tenantName = `${booking.tenant.first_name || ''} ${booking.tenant.last_name || ''}`.trim();
              } else if (booking.tenant.username) {
                // Fall back to username if available
                tenantName = booking.tenant.username;
              }
            } else if (booking.guest_name) {
              // If tenant object is not available, try to use guest_name
              tenantName = booking.guest_name;
            }

            return {
              id: booking.id,
              property: booking.property.title,
              tenant: tenantName,
              checkIn: formatDate(booking.check_in_date),
              checkOut: formatDate(booking.check_out_date),
              status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
              amount: formatPrice(booking.total_price)
            };
          });
        setRecentBookings(formattedBookings);

        // Process property statuses
        const formattedPropertyStatuses = properties.map(property => {
          try {
            // Find active booking for this property
            const activeBooking = bookings.find(b => {
              // Make sure property exists and has an id
              if (!b.property || !b.property.id) return false;
              return b.property.id === property.id &&
                (b.status === 'confirmed' || b.status === 'pending');
            });

            let status = 'Available';
            let color = 'bg-green-500';
            let occupiedUntil = null;

            if (activeBooking) {
              if (activeBooking.status === 'confirmed') {
                status = 'Occupied';
                color = 'bg-blue-500';
              } else {
                status = 'Reserved';
                color = 'bg-yellow-500';
              }
              occupiedUntil = formatDate(activeBooking.check_out_date);
            } else if (property.status !== 'approved') {
              status = 'Maintenance';
              color = 'bg-red-500';
            }

            return {
              property: property.title || 'Unnamed Property',
              status,
              occupiedUntil,
              color
            };
          } catch (err) {
            console.error('Error processing property status:', err, property);
            return {
              property: property.title || 'Unnamed Property',
              status: 'Unknown',
              occupiedUntil: null,
              color: 'bg-gray-500'
            };
          }
        });
        setPropertyStatuses(formattedPropertyStatuses);

        // Calculate stats
        const activeBookingsCount = bookings.filter(b =>
          b.status === 'confirmed' || b.status === 'pending'
        ).length;

        // Calculate this month's revenue
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const thisMonthPayments = payments.filter(payment => {
          const paymentDate = new Date(payment.created_at);
          return paymentDate.getMonth() === thisMonth &&
                 paymentDate.getFullYear() === thisYear &&
                 payment.status === 'completed';
        });
        const thisMonthRevenue = thisMonthPayments.reduce(
          (sum, payment) => sum + parseFloat(payment.amount), 0
        );

        // Calculate occupancy rate
        const totalDays = properties.length * 30; // Assuming 30 days per month per property
        const occupiedDays = bookings
          .filter(b => b.status === 'confirmed' || b.status === 'completed')
          .reduce((sum, booking) => {
            const checkIn = new Date(booking.check_in_date);
            const checkOut = new Date(booking.check_out_date);
            const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            return sum + days;
          }, 0);
        const occupancyRate = totalDays > 0 ? Math.round((occupiedDays / totalDays) * 100) : 0;

        // Update stats
        setStats([
          {
            title: "Total Properties",
            value: properties.length.toString(),
            change: "+0",
            trend: "up",
            icon: <Building2 className="h-8 w-8 text-green-500" />
          },
          {
            title: "Active Bookings",
            value: activeBookingsCount.toString(),
            change: "+0",
            trend: "up",
            icon: <CalendarCheck className="h-8 w-8 text-purple-500" />
          },
          {
            title: "This Month Revenue",
            value: formatPrice(thisMonthRevenue),
            change: "+0",
            trend: "up",
            icon: <CreditCard className="h-8 w-8 text-yellow-500" />
          },
          {
            title: "Occupancy Rate",
            value: `${occupancyRate}%`,
            change: "+0",
            trend: "up",
            icon: <Users className="h-8 w-8 text-blue-500" />
          }
        ]);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const getStatusIcon = (status) => {
    switch(status) {
      case "Confirmed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "Completed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "Cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Landlord Dashboard</h1>
        <div className="flex space-x-2">
          <Link
            href="/dashboard/landlord/properties/new"
            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
          >
            Add New Property
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          // Loading skeleton
          Array(4).fill(0).map((_, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow border border-gray-200"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gray-200 rounded-full h-8 w-8 animate-pulse"></div>
                <div className="ml-5 w-0 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          // Error state
          <div className="col-span-4 bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading dashboard</h3>
              <p className="text-gray-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          // Loaded stats
          stats.map((stat, index) => (
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
          ))
        )}
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

          {loading ? (
            // Loading skeleton
            <div className="p-6 space-y-4">
              {Array(3).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="p-6 text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading bookings</h3>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : recentBookings.length === 0 ? (
            // Empty state
            <div className="p-6 text-center">
              <CalendarCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-500">When you receive bookings, they will appear here</p>
            </div>
          ) : (
            // Loaded bookings
            <>
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
                          <Link href={`/dashboard/landlord/bookings/${booking.id}`}>
                            {booking.id}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.property}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.tenant}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.checkIn} to {booking.checkOut}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(booking.status)}
                            <span
                              className={`ml-1.5 text-xs font-medium ${
                                booking.status === "Confirmed" ? "text-green-700" :
                                booking.status === "Pending" ? "text-yellow-700" :
                                booking.status === "Completed" ? "text-blue-700" :
                                "text-red-700"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-200">
                <Link
                  href="/dashboard/landlord/bookings"
                  className="text-sm font-medium text-primary hover:text-primary/80"
                >
                  View all bookings
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Property Status */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Property Status
            </h3>
          </div>

          {loading ? (
            // Loading skeleton
            <div className="p-6 space-y-4">
              {Array(5).fill(0).map((_, index) => (
                <div key={index} className="flex items-center animate-pulse">
                  <div className="w-3 h-3 rounded-full bg-gray-200 mr-2"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="p-6 text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading properties</h3>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : propertyStatuses.length === 0 ? (
            // Empty state
            <div className="p-6 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
              <p className="text-gray-500">Add your first property to get started</p>
              <div className="mt-4">
                <Link
                  href="/dashboard/landlord/properties/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
                >
                  Add Property
                </Link>
              </div>
            </div>
          ) : (
            // Loaded property statuses
            <div className="p-6">
              <div className="space-y-4">
                {propertyStatuses.map((property, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${property.color} mr-2`}></div>
                    <div className="flex-1">
                      <div className="mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {property.property}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-gray-700">
                          {property.status}
                        </span>
                        {property.occupiedUntil && (
                          <span className="text-xs text-gray-500">
                            Until {property.occupiedUntil}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  href="/dashboard/landlord/properties"
                  className="text-sm font-medium text-primary hover:text-primary/80"
                >
                  Manage properties
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}