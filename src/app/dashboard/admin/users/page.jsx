"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  PlusCircle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Download,
  Loader2
} from "lucide-react";
import AdminService from "@/services/admin";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showDropdown, setShowDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Prepare filters
        const filters = {};
        if (selectedRole) {
          filters.role = selectedRole.toLowerCase();
        }
        if (selectedStatus) {
          filters.status = selectedStatus.toLowerCase();
        }
        if (searchQuery) {
          filters.query = searchQuery;
        }

        // Fetch users from API
        const response = await AdminService.getAllUsers(filters, currentPage, usersPerPage);

        setUsers(response.items || []);
        setTotalPages(response.total_pages || 1);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users. Please try again.');
        // Fall back to mock data
        setUsers([
          {
            id: "U12345",
            name: "John Doe",
            email: "john.doe@example.com",
            role: "Tenant",
            status: "Active",
            joinDate: "2023-01-15",
            properties: 0,
            bookings: 3
          },
          {
            id: "U12346",
            name: "Alice Smith",
            email: "alice.smith@example.com",
            role: "Landlord",
            status: "Active",
            joinDate: "2023-02-10",
            properties: 2,
            bookings: 0
          },
          {
            id: "U12347",
            name: "Bob Johnson",
            email: "bob.johnson@example.com",
            role: "Agent",
            status: "Pending",
            joinDate: "2023-03-05",
            properties: 0,
            bookings: 0
          },
          {
            id: "U12348",
            name: "Emma Wilson",
            email: "emma.wilson@example.com",
            role: "Tenant",
            status: "Active",
            joinDate: "2023-01-20",
            properties: 0,
            bookings: 1
          },
          {
            id: "U12349",
            name: "Michael Brown",
            email: "michael.brown@example.com",
            role: "Admin",
            status: "Active",
            joinDate: "2022-12-01",
            properties: 0,
            bookings: 0
          },
          {
            id: "U12350",
            name: "Sophia Davis",
            email: "sophia.davis@example.com",
            role: "Landlord",
            status: "Inactive",
            joinDate: "2023-02-15",
            properties: 3,
            bookings: 0
          }
        ]);

        // Set total pages based on mock data
        setTotalPages(Math.ceil(6 / usersPerPage));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, selectedRole, selectedStatus, searchQuery, usersPerPage]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown
  const toggleDropdown = (userId) => {
    setShowDropdown(showDropdown === userId ? null : userId);
  };

  // Render action dropdown
  const renderActionDropdown = (user) => {
    return (
      <div
        ref={dropdownRef}
        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
      >
        <div className="py-1">
          <Link
            href={`/dashboard/admin/users/${user.id}`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            View Details
          </Link>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => handleEditUser(user.id)}
          >
            Edit User
          </button>
          {user.role?.toLowerCase() === 'agent' && user.status?.toLowerCase() === 'pending' && (
            <button
              className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
              onClick={() => handleApproveAgent(user.id)}
            >
              Approve Agent
            </button>
          )}
          <button
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            onClick={() => handleDeleteUser(user.id)}
          >
            Delete User
          </button>
        </div>
      </div>
    );
  };

  // Handle user actions
  const handleEditUser = (userId) => {
    console.log(`Edit user ${userId}`);
    setShowDropdown(null);
  };

  const handleDeleteUser = (userId) => {
    console.log(`Delete user ${userId}`);
    setShowDropdown(null);
  };

  const handleApproveAgent = (userId) => {
    console.log(`Approve agent ${userId}`);
    setShowDropdown(null);
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch = searchQuery === '' ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === '' ||
      user.role?.toLowerCase() === selectedRole.toLowerCase();

    const matchesStatus = selectedStatus === '' ||
      user.status?.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Update totalPages based on filtered users
  useEffect(() => {
    const calculatedPages = Math.ceil(filteredUsers.length / usersPerPage);
    if (calculatedPages !== totalPages) {
      setTotalPages(calculatedPages || 1); // Ensure at least 1 page
    }
  }, [filteredUsers, usersPerPage, totalPages]);

  // Helper functions
  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'landlord':
        return 'bg-blue-100 text-blue-800';
      case 'agent':
        return 'bg-indigo-100 text-indigo-800';
      case 'tenant':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status, role, user) => {
    // Check if we're in a filtered view
    const currentFilter = selectedStatus?.toLowerCase();

    // Handle agent pending approval
    if (role?.toLowerCase() === 'agent' &&
        (status?.toLowerCase() === 'pending' ||
         (user && !user.is_active && currentFilter === 'pending'))) {
      return 'bg-yellow-100 text-yellow-800';
    }

    // If we're filtering by status, use the filter color
    if (currentFilter) {
      switch (currentFilter) {
        case 'active':
          return 'bg-green-100 text-green-800';
        case 'inactive':
          return 'bg-red-100 text-red-800';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        default:
          break;
      }
    }

    // Map Django's is_active field to our status colors
    if (user && typeof user.is_active === 'boolean') {
      return user.is_active
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800';
    }

    // Fall back to string status
    switch (status?.toLowerCase()) {
      case 'active':
      case 'true':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
      case 'false':
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
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

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <div className="flex space-x-2">
          <Link
            href="/dashboard/admin/users/new"
            className="flex items-center justify-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Link>
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
            placeholder="Search users..."
          />
        </div>

        <div className="flex gap-2">
          <div className="relative inline-block">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
              <option value="tenant">Tenant</option>
            </select>
          </div>

          <div className="relative inline-block">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
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
      {isLoading && users.length > 0 && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <span className="ml-2 text-gray-600">Updating users...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden border border-gray-200 sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Properties
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading && users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                      <span>Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : error && users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    {selectedStatus ? (
                      <>
                        No users found with status <span className="font-semibold">{selectedStatus}</span>
                        {selectedRole && <span> and role <span className="font-semibold">{selectedRole}</span></span>}
                        {searchQuery && <span> matching <span className="font-semibold">"{searchQuery}"</span></span>}
                      </>
                    ) : (
                      <>No users found matching your criteria</>
                    )}
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                          {(user.first_name?.charAt(0) || user.username?.charAt(0) || '?').toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            <Link href={`/dashboard/admin/users/${user.id}`} className="hover:text-primary">
                              {user.first_name && user.last_name
                                ? `${user.first_name} ${user.last_name}`
                                : user.username}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(user.status, user.role, user)}`}>
                        {(() => {
                          // For agents with pending status
                          if (user.role?.toLowerCase() === 'agent' &&
                              (user.status?.toLowerCase() === 'pending' ||
                               (user.is_active === false && selectedStatus === 'pending'))) {
                            return 'Pending Approval';
                          }

                          // For users with is_active property
                          if (user.is_active !== undefined) {
                            return user.is_active ? 'Active' : 'Inactive';
                          }

                          // Fallback to status string
                          return user.status || 'Unknown';
                        })()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.date_joined || user.joinDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.properties_count || user.properties || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.bookings_count || user.bookings || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => toggleDropdown(user.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                        {showDropdown === user.id && renderActionDropdown(user)}
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
                  Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{" "}
                  <span className="font-medium">{filteredUsers.length}</span> users
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

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
