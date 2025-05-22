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
  CreditCard,
  Calendar,
  User,
  Building2,
  Loader2
} from "lucide-react";
import AdminService from "@/services/admin";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const pageSize = 10;

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Prepare filters
        const filters = {};
        if (selectedStatus) {
          filters.status = selectedStatus.toLowerCase();
        }
        if (selectedPaymentMethod) {
          // Convert UI payment method to backend format
          if (selectedPaymentMethod.toLowerCase() === 'card' ||
              selectedPaymentMethod.toLowerCase() === 'credit card') {
            filters.payment_method = 'card';
          } else if (selectedPaymentMethod.toLowerCase() === 'visa' ||
                     selectedPaymentMethod.toLowerCase() === 'visa card') {
            filters.payment_method = 'visa';
          } else {
            filters.payment_method = selectedPaymentMethod.toLowerCase();
          }
        }
        if (searchQuery) {
          filters.query = searchQuery;
        }

        console.log('Fetching payments with filters:', filters);

        // Fetch payments from API
        const response = await AdminService.getAllPayments(filters, currentPage, pageSize);

        setPayments(response.items || []);
        setTotalPages(response.total_pages || 1);
        setTotalPayments(response.total || 0);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError('Failed to fetch payments. Please try again.');
        // Fall back to mock data
        setPayments([
          {
            id: "PAY12345",
            bookingId: "B12345",
            tenant: {
              id: "U12345",
              name: "John Doe",
              email: "john.doe@example.com"
            },
            property: {
              id: "P12345",
              title: "Modern Apartment with City View"
            },
            date: "2023-04-01",
            amount: 1200,
            paymentMethod: "Credit Card",
            status: "Completed",
            receiptUrl: "https://example.com/receipt/12345"
          },
          {
            id: "PAY12346",
            bookingId: "B12346",
            tenant: {
              id: "U12346",
              name: "Alice Smith",
              email: "alice.smith@example.com"
            },
            property: {
              id: "P12346",
              title: "Luxury Villa with Pool"
            },
            date: "2023-05-15",
            amount: 4500,
            paymentMethod: "Credit Card",
            status: "Completed",
            receiptUrl: "https://example.com/receipt/12346"
          },
          {
            id: "PAY12347",
            bookingId: "B12347",
            tenant: {
              id: "U12347",
              name: "Bob Johnson",
              email: "bob.johnson@example.com"
            },
            property: {
              id: "P12347",
              title: "Cozy Studio near University"
            },
            date: "2023-03-20",
            amount: 800,
            paymentMethod: "PayPal",
            status: "Completed",
            receiptUrl: "https://example.com/receipt/12347"
          },
          {
            id: "PAY12348",
            bookingId: "B12348",
            tenant: {
              id: "U12348",
              name: "Emma Wilson",
              email: "emma.wilson@example.com"
            },
            property: {
              id: "P12348",
              title: "Family House with Garden"
            },
            date: "2023-06-01",
            amount: 2200,
            paymentMethod: "Bank Transfer",
            status: "Pending",
            receiptUrl: null
          },
          {
            id: "PAY12349",
            bookingId: "B12349",
            tenant: {
              id: "U12349",
              name: "Michael Brown",
              email: "michael.brown@example.com"
            },
            property: {
              id: "P12349",
              title: "Penthouse with Rooftop Terrace"
            },
            date: "2023-07-01",
            amount: 3500,
            paymentMethod: "Credit Card",
            status: "Refunded",
            receiptUrl: "https://example.com/receipt/12349"
          },
          {
            id: "PAY12350",
            bookingId: "B12350",
            tenant: {
              id: "U12350",
              name: "Sophia Davis",
              email: "sophia.davis@example.com"
            },
            property: {
              id: "P12350",
              title: "Beachfront Condo"
            },
            date: "2023-08-01",
            amount: 2800,
            paymentMethod: "PayPal",
            status: "Failed",
            receiptUrl: null
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [currentPage, selectedStatus, selectedPaymentMethod, searchQuery]);

  // Helper function to get status badge color
  const getStatusBadgeColor = (status) => {
    switch(status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-indigo-100 text-indigo-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <CreditCard className="h-5 w-5 text-yellow-500" />;
      case "processing":
        return <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />;
      case "refunded":
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return null;
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

  // Log payments for debugging
  useEffect(() => {
    console.log('Current payments:', payments);
  }, [payments]);

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
  if (loading && payments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2 text-gray-600">Loading payments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Payment Management</h1>
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
            placeholder="Search payments..."
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="relative inline-block">
            <select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            >
              <option value="">All Payment Methods</option>
              <option value="card">Credit Card</option>
              <option value="visa">Visa Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank">Bank Account</option>
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
      {loading && payments.length > 0 && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <span className="ml-2 text-gray-600">Updating payments...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white shadow overflow-hidden border border-gray-200 sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.length === 0 && !loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                    No payments found matching your criteria
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary">
                        <Link href={`/dashboard/admin/payments/${payment.id}`}>
                          {payment.id}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.booking_id && payment.booking_id !== 'unknown' ? (
                          <Link href={`/dashboard/admin/bookings/${payment.booking_id}`} className="hover:text-primary">
                            Booking: {payment.booking_id}
                          </Link>
                        ) : (
                          <span>Unknown Booking</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.tenant?.id && payment.tenant.id !== 'unknown' ? (
                              <Link href={`/dashboard/admin/users/${payment.tenant.id}`} className="hover:text-primary">
                                {payment.tenant.name || 'Unknown Tenant'}
                              </Link>
                            ) : (
                              <span>Unknown Tenant</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">{payment.tenant?.email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.property?.id && payment.property.id !== 'unknown' ? (
                          <Link href={`/dashboard/admin/properties/${payment.property.id}`} className="hover:text-primary">
                            {payment.property.title || 'Unknown Property'}
                          </Link>
                        ) : (
                          <span>Unknown Property</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {formatDate(payment.created_at || payment.date)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {payment.payment_method || payment.paymentMethod || 'Visa Card'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <span
                          className={`ml-1.5 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(payment.status)}`}
                        >
                          {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1).toLowerCase() || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {typeof payment.amount === 'number' ? formatPrice(payment.amount) : payment.amount || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {(payment.receipt_url || payment.receiptUrl) ? (
                        <a
                          href={payment.receipt_url || payment.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
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
                  <span className="font-medium">{Math.min(currentPage * pageSize, totalPayments)}</span> of{" "}
                  <span className="font-medium">{totalPayments}</span> payments
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
