"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Calendar,
  User,
  Building2,
  Loader2,
  Home
} from "lucide-react";
import AdminService from "@/services/admin";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const pageSize = 10;

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Prepare filters
        const filters = {};
        if (selectedStatus) {
          filters.status = selectedStatus.toLowerCase();
        }
        if (selectedPaymentStatus) {
          // Convert UI payment status to backend format
          if (selectedPaymentStatus.toLowerCase() === 'paid') {
            filters.is_paid = true;
          } else if (selectedPaymentStatus.toLowerCase() === 'pending') {
            filters.is_paid = false;
          }
          // Note: Refunded and Failed statuses are not directly supported by the backend yet
        }
        if (searchQuery) {
          filters.query = searchQuery;
        }

        console.log('Fetching bookings with filters:', filters);

        // Fetch bookings from API
        const response = await AdminService.getAllBookings(filters, currentPage, pageSize);

        setBookings(response.items || []);
        setTotalPages(response.total_pages || 1);
        setTotalBookings(response.total || 0);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to fetch bookings. Please try again.');
        // Fall back to mock data
        setBookings([
          {
            id: "B12345",
            property: {
              id: "P12345",
              title: "Modern Apartment with City View",
              type: "Apartment",
              image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            },
            tenant: {
              id: "U12345",
              name: "John Doe",
              email: "john.doe@example.com"
            },
            checkIn: "2023-04-10",
            checkOut: "2023-04-15",
            guests: 2,
            status: "Confirmed",
            paymentStatus: "Paid",
            amount: 1200,
            createdAt: "2023-03-01"
          },
          {
            id: "B12346",
            property: {
              id: "P12346",
              title: "Luxury Villa with Pool",
              type: "Villa",
              image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
            },
            tenant: {
              id: "U12346",
              name: "Alice Smith",
              email: "alice.smith@example.com"
            },
            checkIn: "2023-05-20",
            checkOut: "2023-05-27",
            guests: 4,
            status: "Confirmed",
            paymentStatus: "Paid",
            amount: 4500,
            createdAt: "2023-03-05"
          },
          {
            id: "B12347",
            property: {
              id: "P12347",
              title: "Cozy Studio near University",
              type: "Studio",
              image: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            },
            tenant: {
              id: "U12347",
              name: "Bob Johnson",
              email: "bob.johnson@example.com"
            },
            checkIn: "2023-04-01",
            checkOut: "2023-04-30",
            guests: 1,
            status: "Completed",
            paymentStatus: "Paid",
            amount: 800,
            createdAt: "2023-02-15"
          },
          {
            id: "B12348",
            property: {
              id: "P12348",
              title: "Family House with Garden",
              type: "House",
              image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            },
            tenant: {
              id: "U12348",
              name: "Emma Wilson",
              email: "emma.wilson@example.com"
            },
            checkIn: "2023-06-15",
            checkOut: "2023-06-30",
            guests: 5,
            status: "Pending",
            paymentStatus: "Pending",
            amount: 2200,
            createdAt: "2023-03-10"
          },
          {
            id: "B12349",
            property: {
              id: "P12349",
              title: "Penthouse with Rooftop Terrace",
              type: "Apartment",
              image: "https://images.unsplash.com/photo-1551361415-69c87624334f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            },
            tenant: {
              id: "U12349",
              name: "Michael Brown",
              email: "michael.brown@example.com"
            },
            checkIn: "2023-07-01",
            checkOut: "2023-07-07",
            guests: 3,
            status: "Cancelled",
            paymentStatus: "Refunded",
            amount: 3500,
            createdAt: "2023-03-12"
          },
          {
            id: "B12350",
            property: {
              id: "P12350",
              title: "Beachfront Condo",
              type: "Condo",
              image: "https://images.unsplash.com/photo-1582610116397-edb318620f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            },
            tenant: {
              id: "U12350",
              name: "Sophia Davis",
              email: "sophia.davis@example.com"
            },
            checkIn: "2023-08-10",
            checkOut: "2023-08-20",
            guests: 2,
            status: "Pending",
            paymentStatus: "Pending",
            amount: 850,
            createdAt: "2023-03-15"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentPage, selectedStatus, selectedPaymentStatus, searchQuery]);

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

  // Helper function to get status badge color
  const getStatusBadgeColor = (status) => {
    switch(status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get payment status badge color
  const getPaymentStatusBadgeColor = (status) => {
    switch(status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle search and filters
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  // If loading, show loading state
  if (loading && bookings.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2 text-gray-600">Loading bookings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Booking Management</h1>
        <div className="flex space-x-2">
          <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            placeholder="Search bookings..."
          />
        </div>

        <div className="flex gap-2">
          <div className="relative inline-block">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            >
              <option value="">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="relative inline-block">
            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            >
              <option value="">All Payment Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Loading and Error States */}
      {loading && bookings.length > 0 && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <span className="ml-2 text-gray-600">Updating bookings...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-white shadow overflow-hidden border border-gray-200 sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in/out
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.length === 0 && !loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No bookings found matching your criteria
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary">
                        <Link href={`/dashboard/admin/bookings/${booking.id}`}>
                          {booking.id}
                        </Link>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(booking.created_at || booking.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        <Link href={`/dashboard/admin/properties/${booking.property?.id}`} className="hover:text-primary">
                          {booking.property?.title || 'Unknown Property'}
                        </Link>
                      </div>
                      <div className="text-xs text-gray-500">{booking.property?.type || 'Unknown Type'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            <Link href={`/dashboard/admin/users/${booking.tenant?.id}`} className="hover:text-primary">
                              {booking.tenant?.name || `${booking.tenant?.first_name || ''} ${booking.tenant?.last_name || ''}`.trim() || booking.tenant?.username || 'Unknown Tenant'}
                            </Link>
                          </div>
                          <div className="text-xs text-gray-500">{booking.tenant?.email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(booking.check_in || booking.checkIn)}
                      </div>
                      <div className="text-xs text-gray-500">
                        to {formatDate(booking.check_out || booking.checkOut)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.guests} guests
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(booking.status)}
                        <span
                          className={`ml-1.5 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(booking.status)}`}
                        >
                          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1).toLowerCase() || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadgeColor(booking.payment_status)}`}
                      >
                        {booking.payment_status?.charAt(0).toUpperCase() + booking.payment_status?.slice(1).toLowerCase() || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end">
                        <CreditCard className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{formatPrice(booking.amount)}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'text-gray-400 bg-gray-50' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
              >
                Previous
              </button>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'text-gray-400 bg-gray-50' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(currentPage * pageSize, totalBookings)}</span> of{" "}
                  <span className="font-medium">{totalBookings}</span> bookings
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {/* Generate page numbers */}
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    // For small number of pages, show all
                    if (totalPages <= 5) {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${pageNum === currentPage ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    }

                    // For larger number of pages, show current page and neighbors
                    let pageNum;
                    if (currentPage <= 3) {
                      // Near the start
                      pageNum = i + 1;
                      if (i === 4) return (
                        <span key="ellipsis-end" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>
                      );
                    } else if (currentPage >= totalPages - 2) {
                      // Near the end
                      pageNum = totalPages - 4 + i;
                      if (i === 0) return (
                        <span key="ellipsis-start" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>
                      );
                    } else {
                      // In the middle
                      if (i === 0) return (
                        <span key="ellipsis-start" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>
                      );
                      if (i === 4) return (
                        <span key="ellipsis-end" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>
                      );
                      pageNum = currentPage - 1 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${pageNum === currentPage ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
