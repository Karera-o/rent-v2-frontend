"use client";

import {
  Calendar,
  MapPin,
  DollarSign,
  ChevronRight,
  CalendarX,
  Loader2,
  Home,
  CalendarCheck,
  ArrowUpDown,
  XCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import BookingService from "@/services/booking";
import { format } from "date-fns";
import Cookies from 'js-cookie';

export default function BookingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("current");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingsData, setBookingsData] = useState({ current: [], past: [] });
  const [sortField, setSortField] = useState("checkIn");
  const [sortDirection, setSortDirection] = useState("desc");

  // Format date for display
  const formatDateRange = (checkIn, checkOut) => {
    try {
      const formattedCheckIn = format(new Date(checkIn), 'MMM d, yyyy');
      const formattedCheckOut = format(new Date(checkOut), 'MMM d, yyyy');
      return `${formattedCheckIn} - ${formattedCheckOut}`;
    } catch (error) {
      console.error('Error formatting dates:', error);
      return `${checkIn} - ${checkOut}`;
    }
  };

  // Format single date for display
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

  // Load bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if we're authenticated
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('No auth token available for bookings page request');
          setError('Authentication required');
          setLoading(false);
          return;
        }

        // Get current date
        const today = new Date().toISOString().split('T')[0];

        // Fetch all bookings
        console.log('Fetching bookings page data...');
        const response = await BookingService.getTenantBookings();
        console.log('Bookings page response:', response);

        if (!response || !response.items) {
          console.error('Invalid booking response:', response);
          setBookingsData({ current: [], past: [] });
          setLoading(false);
          return;
        }

        // Process bookings into current and past
        const current = [];
        const past = [];

        response.items.forEach(booking => {
          try {
            // Create a formatted booking object
            const formattedBooking = {
              id: booking.id,
              property: booking.property.title,
              propertyId: booking.property.id,
              location: `${booking.property.city}, ${booking.property.state}`,
              dates: formatDateRange(booking.check_in_date, booking.check_out_date),
              checkIn: booking.check_in_date,
              checkOut: booking.check_out_date,
              price: formatPrice(booking.total_price),
              rawPrice: booking.total_price,
              status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
              guests: booking.guests,
              isPaid: booking.is_paid,
              createdAt: booking.created_at
            };

            // Determine if booking is current or past
            if (booking.status === 'completed' || booking.status === 'cancelled' ||
                new Date(booking.check_out_date) < new Date(today)) {
              past.push(formattedBooking);
            } else {
              current.push(formattedBooking);
            }
          } catch (err) {
            console.error('Error processing booking:', err, booking);
          }
        });

        setBookingsData({ current, past });
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'Failed to load bookings');
        setBookingsData({ current: [], past: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Toggle sort direction or change sort field
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Render sort icon
  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return (
      <ArrowUpDown className="ml-1 h-4 w-4 inline" />
    );
  };

  // Filter and sort bookings based on search term and sort settings
  const filteredAndSortedBookings = bookingsData[activeTab]
    .filter(booking =>
      booking.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(booking.id).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Special case for dates
      if (sortField === "checkIn" || sortField === "checkOut") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
        <Link
          href="/properties"
          className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
        >
          Browse Properties
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Total Bookings</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {loading ? (
              <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
            ) : (
              bookingsData.current.length + bookingsData.past.length
            )}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Upcoming Trips</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {loading ? (
              <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
            ) : (
              bookingsData.current.length
            )}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Total Spent</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {loading ? (
              <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
            ) : (
              formatPrice(bookingsData.current.reduce((total, booking) => total + parseFloat(booking.rawPrice), 0) +
                         bookingsData.past.reduce((total, booking) => total + parseFloat(booking.rawPrice), 0))
            )}
          </p>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search bookings..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("current")}
              className={`${
                activeTab === "current"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              disabled={loading}
            >
              Current ({bookingsData.current.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`${
                activeTab === "past"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              disabled={loading}
            >
              Past ({bookingsData.past.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading bookings...</h3>
            <p className="text-gray-500">Please wait while we fetch your booking data</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading bookings</h3>
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
        ) : filteredAndSortedBookings.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search criteria"
                : `You don't have any ${activeTab} bookings`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center cursor-pointer focus:outline-none"
                      onClick={() => toggleSort("id")}
                    >
                      Booking ID {renderSortIcon("id")}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center cursor-pointer focus:outline-none"
                      onClick={() => toggleSort("property")}
                    >
                      Property {renderSortIcon("property")}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center cursor-pointer focus:outline-none"
                      onClick={() => toggleSort("checkIn")}
                    >
                      Check-in {renderSortIcon("checkIn")}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center cursor-pointer focus:outline-none"
                      onClick={() => toggleSort("checkOut")}
                    >
                      Check-out {renderSortIcon("checkOut")}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center cursor-pointer focus:outline-none"
                      onClick={() => toggleSort("status")}
                    >
                      Status {renderSortIcon("status")}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center cursor-pointer focus:outline-none"
                      onClick={() => toggleSort("price")}
                    >
                      Price {renderSortIcon("price")}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Home className="h-4 w-4 text-gray-400 mr-2" />
                        {booking.property}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        {booking.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.checkIn)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.checkOut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <Link
                        href={`/dashboard/user/bookings/${booking.id}`}
                        className="text-primary hover:text-primary/80 inline-flex items-center"
                      >
                        Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}