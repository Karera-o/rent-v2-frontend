"use client";

import {
  CalendarCheck,
  Heart,
  MessageSquare,
  Star,
  CheckCircle,
  Clock,
  XCircle,
  Home,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import BookingService from "@/services/booking";
import { format } from "date-fns";
import Cookies from 'js-cookie';

export default function UserDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [upcomingBookingsCount, setUpcomingBookingsCount] = useState(0);
  const [totalBookingsCount, setTotalBookingsCount] = useState(0);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if we're authenticated
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('No auth token available for dashboard bookings request');
          setError('Authentication required');
          setLoading(false);
          return;
        }

        // Get current date
        const today = new Date().toISOString().split('T')[0];

        // Fetch all bookings
        console.log('Fetching dashboard bookings...');
        const response = await BookingService.getTenantBookings();
        console.log('Dashboard bookings response:', response);

        if (!response || !response.items) {
          console.error('Invalid booking response:', response);
          setBookings([]);
          setUpcomingBookingsCount(0);
          setTotalBookingsCount(0);
          setLoading(false);
          return;
        }

        // Process bookings
        const allBookings = response.items.map(booking => {
          try {
            return {
              id: booking.id,
              property: booking.property.title,
              checkIn: formatDate(booking.check_in_date),
              checkOut: formatDate(booking.check_out_date),
              rawCheckIn: booking.check_in_date,
              rawCheckOut: booking.check_out_date,
              status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
              amount: formatPrice(booking.total_price),
              isPaid: booking.is_paid
            };
          } catch (err) {
            console.error('Error processing booking:', err, booking);
            return null;
          }
        }).filter(booking => booking !== null);

        // Count upcoming bookings (not completed or cancelled and check-out date is in the future)
        const upcoming = allBookings.filter(booking =>
          booking.status !== 'Completed' &&
          booking.status !== 'Cancelled' &&
          new Date(booking.rawCheckOut) >= new Date(today)
        );

        setBookings(allBookings);
        setUpcomingBookingsCount(upcoming.length);
        setTotalBookingsCount(allBookings.length);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'Failed to load bookings');
        // Set empty data
        setBookings([]);
        setUpcomingBookingsCount(0);
        setTotalBookingsCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Stats cards
  const stats = [
    {
      title: "Upcoming Stays",
      value: loading ? <Loader2 className="h-6 w-6 text-blue-500 animate-spin" /> : upcomingBookingsCount,
      icon: <CalendarCheck className="h-8 w-8 text-blue-500" />,
      link: "/dashboard/user/bookings"
    },
    {
      title: "Saved Properties",
      value: "0",
      icon: <Heart className="h-8 w-8 text-red-500" />,
      link: "/dashboard/user/bookings"
    },
    {
      title: "Total Bookings",
      value: loading ? <Loader2 className="h-6 w-6 text-green-500 animate-spin" /> : totalBookingsCount,
      icon: <MessageSquare className="h-8 w-8 text-green-500" />,
      link: "/dashboard/user/bookings"
    },
    {
      title: "Loyalty Points",
      value: totalBookingsCount * 100,
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      link: "/dashboard/user/bookings"
    }
  ];

  // Get recent bookings (up to 3)
  const recentBookings = bookings
    .filter(booking => booking.status !== 'Cancelled')
    .sort((a, b) => new Date(b.rawCheckIn) - new Date(a.rawCheckIn))
    .slice(0, 3);

  // Mock favorites data (to be replaced with real data in the future)
  const favorites = [
    {
      property: "Beachfront Cottage",
      location: "Malibu, CA",
      price: "$350/night",
      rating: "4.9"
    },
    {
      property: "Mountain Cabin",
      location: "Aspen, CO",
      price: "$275/night",
      rating: "4.8"
    },
    {
      property: "Downtown Loft",
      location: "New York, NY",
      price: "$420/night",
      rating: "4.7"
    }
  ];

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
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome Back, {user?.first_name || user?.username || 'Guest'}
        </h1>
        <Link
          href="/properties"
          className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
        >
          Browse Properties
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Link
            key={index}
            href={stat.link}
            className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {stat.icon}
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {stat.title}
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </dd>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow border border-gray-200 col-span-2">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Upcoming Stays
            </h3>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="ml-2 text-gray-600">Loading bookings...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-2">Error loading bookings</p>
                <p className="text-gray-500">{error}</p>
                <button
                  onClick={() => {
                    // Refresh the token first
                    const token = localStorage.getItem('accessToken');
                    if (token) {
                      console.log('Refreshing token before retry');
                      // Force token sync
                      const refreshToken = localStorage.getItem('refreshToken');
                      if (refreshToken) {
                        Cookies.set('accessToken', token, {
                          expires: 1,
                          path: '/',
                          sameSite: 'Lax'
                        });
                        Cookies.set('refreshToken', refreshToken, {
                          expires: 7,
                          path: '/',
                          sameSite: 'Lax'
                        });
                      }
                    }
                    // Retry fetching bookings
                    fetchBookings();
                  }}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Try Again
                </button>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">You don't have any bookings yet.</p>
                <Link href="/properties" className="text-primary hover:underline mt-2 inline-block">
                  Browse properties to book your first stay
                </Link>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                        <Link href={`/dashboard/user/bookings/${booking.id}`}>
                          {booking.property}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.checkIn} – {booking.checkOut}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(booking.status)}
                          <span className="ml-1.5 text-xs font-medium">
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
            )}
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <Link
              href="/dashboard/user/bookings"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              View booking history
            </Link>
          </div>
        </div>

        {/* Favorites */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Favorite Properties
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {favorites.map((property, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <Home className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {property.property}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {property.location}
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm font-medium text-primary">
                        {property.price}
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="ml-1 text-sm text-gray-600">
                          {property.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/dashboard/user/saved"
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                View all favorites
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}