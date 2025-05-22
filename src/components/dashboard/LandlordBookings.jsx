"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  CalendarCheck,
  ArrowUpDown,
  Loader2
} from "lucide-react";
import Link from "next/link";
import BookingService from "@/services/booking";
import { useAuth } from "@/contexts/AuthContext";

export default function LandlordBookings() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortField, setSortField] = useState("checkIn");
  const [sortDirection, setSortDirection] = useState("asc");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if we're authenticated
        if (!user) {
          console.error('No user available for bookings page request');
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

        // Prepare filters based on status
        const filters = {};
        if (filterStatus !== 'All') {
          filters.status = filterStatus.toLowerCase();
        }

        console.log('Fetching owner bookings...');
        const response = await BookingService.getOwnerBookings(filters, page, 10);
        console.log('Owner bookings response:', response);

        if (!response || !response.items) {
          console.error('Invalid booking response:', response);
          setBookings([]);
          setLoading(false);
          return;
        }

        // Process bookings
        const formattedBookings = response.items.map(booking => {
          try {
            return {
              id: booking.id,
              property: booking.property.title,
              propertyId: booking.property.id,
              tenant: {
                name: `${booking.tenant.first_name || ''} ${booking.tenant.last_name || ''}`.trim() || booking.tenant.username,
                email: booking.tenant.email,
                phone: booking.tenant.phone_number || 'N/A'
              },
              checkIn: booking.check_in_date,
              checkOut: booking.check_out_date,
              guests: booking.guests,
              status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
              amount: formatPrice(booking.total_price),
              createdAt: booking.created_at
            };
          } catch (err) {
            console.error('Error processing booking:', err, booking);
            return null;
          }
        }).filter(booking => booking !== null);

        setBookings(formattedBookings);
        setTotalPages(response.total_pages || 1);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'Failed to load bookings');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, page, filterStatus]);

  // Filter and sort bookings
  const filteredAndSortedBookings = [...bookings]
    .filter((booking) => {
      const matchesSearch =
        booking.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(booking.id).toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "All" || booking.status === filterStatus;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Special case for check-in/check-out dates
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

  // Note: We already have a formatDate function defined above

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;

    return (
      <span className="ml-1 text-gray-400">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Search by property, guest, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
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
                // Refresh the page
                window.location.reload();
              }}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        ) : filteredAndSortedBookings.length === 0 ? (
          <div className="py-12 text-center">
            <CalendarCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== "All"
                ? "Try adjusting your search or filter criteria"
                : "You don't have any bookings yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white text-gray-500 border-b">
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
                    Guest
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center cursor-pointer focus:outline-none"
                      onClick={() => toggleSort("checkIn")}
                    >
                      Check-In {renderSortIcon("checkIn")}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center cursor-pointer focus:outline-none"
                      onClick={() => toggleSort("checkOut")}
                    >
                      Check-Out {renderSortIcon("checkOut")}
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
                      onClick={() => toggleSort("amount")}
                    >
                      Amount {renderSortIcon("amount")}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      <Link href={`/dashboard/landlord/bookings/${booking.id}`}>
                        {booking.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Link
                        href={`/dashboard/landlord/properties/${booking.propertyId}`}
                        className="hover:underline"
                      >
                        {booking.property}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        {booking.tenant.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {booking.tenant.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.checkIn)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.checkOut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.amount}
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
