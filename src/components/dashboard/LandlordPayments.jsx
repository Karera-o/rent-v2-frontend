"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  ArrowUpDown,
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
  XCircle,
  RefreshCw,
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import PaymentService from "@/services/payment";
import BookingService from "@/services/booking";
import PropertyService from "@/services/property";
import { useAuth } from "@/contexts/AuthContext";

export default function LandlordPayments() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    completedRevenue: 0,
    pendingRevenue: 0,
    totalRevenue: 0
  });

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

  // Function to fetch property details for a booking
  const fetchPropertyDetails = async (bookingId) => {
    try {
      console.log(`Fetching property details for booking ${bookingId}`);
      // First get the booking to find the property ID
      const booking = await BookingService.getBookingById(bookingId);

      if (booking && booking.property && booking.property.id) {
        // Now get the property details
        const property = await PropertyService.getPropertyById(booking.property.id);
        return property.title || 'Unknown Property';
      } else if (booking && booking.property_id) {
        // If we have a property_id directly
        const property = await PropertyService.getPropertyById(booking.property_id);
        return property.title || 'Unknown Property';
      }

      return 'Unknown Property';
    } catch (error) {
      console.error(`Error fetching property details for booking ${bookingId}:`, error);
      return 'Unknown Property';
    }
  };

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if we're authenticated
        if (!user) {
          console.error('No user available for payments page request');
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

        console.log('Fetching user payments...');
        const response = await PaymentService.getUserPayments(filters, page, 10);
        console.log('User payments response:', response);

        if (!response || !response.items) {
          console.error('Invalid payment response:', response);
          setPayments([]);
          setLoading(false);
          return;
        }

        // Process payments
        const processPayment = async (payment) => {
          try {
            // Handle both formats: payment with booking_id field or payment with nested booking object
            const bookingId = payment.booking_id || (payment.booking && payment.booking.id);

            // Get property name - try to get from booking.property.title, or use a default with booking ID
            let propertyName = 'Unknown Property';
            if (payment.booking && payment.booking.property && payment.booking.property.title) {
              propertyName = payment.booking.property.title;
            } else if (payment.property_name) {
              propertyName = payment.property_name;
            } else if (bookingId) {
              // Try to fetch property details for this booking
              try {
                console.log(`Fetching property details for booking ID: ${bookingId}`);
                const propertyTitle = await fetchPropertyDetails(bookingId);
                console.log(`Property title for booking ${bookingId}: ${propertyTitle}`);
                if (propertyTitle) {
                  propertyName = propertyTitle;
                }
              } catch (error) {
                console.error(`Error fetching property details for booking ${bookingId}:`, error);
              }
            }

            const bookingTenant = payment.booking && payment.booking.tenant;
            const guestName = payment.booking && payment.booking.guest_name;

            return {
              id: payment.id,
              booking: {
                id: bookingId,
                property: String(propertyName)
              },
              guest: String(bookingTenant ?
                (`${bookingTenant.first_name || ''} ${bookingTenant.last_name || ''}`.trim() || bookingTenant.username || 'Guest') :
                (guestName || 'Guest')),
              date: payment.created_at,
              amount: formatPrice(payment.amount),
              rawAmount: payment.amount,
              status: payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
              method: 'VISA CARD' // Always use VISA CARD as the payment method
            };
          } catch (err) {
            console.error('Error processing payment:', err, payment);
            return null;
          }
        };

        // Process payments one by one to avoid race conditions with API calls
        const formattedPayments = [];
        for (const payment of response.items) {
          const formattedPayment = await processPayment(payment);
          if (formattedPayment) {
            formattedPayments.push(formattedPayment);
          }
        }

        setPayments(formattedPayments);
        setTotalPages(response.total_pages || 1);

        // Calculate statistics
        const completedPayments = formattedPayments.filter(p => p.status.toLowerCase() === 'completed');
        const pendingPayments = formattedPayments.filter(p => p.status.toLowerCase() === 'pending');

        const totalRevenue = formattedPayments.reduce((sum, payment) => sum + parseFloat(payment.rawAmount), 0);
        const completedRevenue = completedPayments.reduce((sum, payment) => sum + parseFloat(payment.rawAmount), 0);
        const pendingRevenue = pendingPayments.reduce((sum, payment) => sum + parseFloat(payment.rawAmount), 0);

        setStats({
          totalRevenue,
          completedRevenue,
          pendingRevenue
        });
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError(err.message || 'Failed to load payments');
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user, page, filterStatus]);

  // Filter and sort payments
  const filteredAndSortedPayments = [...payments]
    .filter((payment) => {
      const matchesSearch =
        String(payment.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.booking.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.guest.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "All" || payment.status === filterStatus;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Special case for date
      if (sortField === "date") {
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
      case "Completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "Failed":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "Cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "Refunded":
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Completed Payments
                </dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {loading ? (
                    <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                  ) : (
                    formatPrice(stats.completedRevenue)
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Pending Payments
                </dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {loading ? (
                    <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                  ) : (
                    formatPrice(stats.pendingRevenue)
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Revenue
                </dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {loading ? (
                    <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                  ) : (
                    formatPrice(stats.totalRevenue)
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </div>
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
              placeholder="Search payments by ID, property, or guest..."
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
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading payments...</h3>
            <p className="text-gray-500">Please wait while we fetch your payment data</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading payments</h3>
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
        ) : filteredAndSortedPayments.length === 0 ? (
          <div className="py-12 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== "All"
                ? "Try adjusting your search or filter criteria"
                : "You don't have any payments yet"}
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
                      Payment ID {renderSortIcon("id")}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property / Booking
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center cursor-pointer focus:outline-none"
                      onClick={() => toggleSort("date")}
                    >
                      Date {renderSortIcon("date")}
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center cursor-pointer focus:outline-none"
                      onClick={() => toggleSort("status")}
                    >
                      Status {renderSortIcon("status")}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>{payment.booking.property}</div>
                      <div className="text-xs text-gray-500">
                        <Link
                          href={`/dashboard/landlord/bookings/${payment.booking.id}`}
                          className="hover:underline"
                        >
                          {payment.booking.id}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.guest}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <span
                          className={`ml-1.5 text-xs font-medium ${
                            payment.status === "Completed" ? "text-green-700" :
                            payment.status === "Pending" ? "text-yellow-700" :
                            payment.status === "Refunded" ? "text-blue-700" :
                            payment.status === "Cancelled" || payment.status === "Failed" ? "text-red-700" :
                            "text-gray-700"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.method}
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