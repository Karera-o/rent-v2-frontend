"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  Edit
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminService from "@/services/admin";

export default function AdminPropertiesPage() {
  const { toast } = useToast();
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [openDropdown, setOpenDropdown] = useState(null);

  // Function to toggle dropdown for a specific property
  const toggleDropdown = (propertyId) => {
    setOpenDropdown(openDropdown === propertyId ? null : propertyId);
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to get status badge color
  const getStatusBadgeColor = (status) => {
    // Normalize status to lowercase for comparison
    const normalizedStatus = status?.toLowerCase() || '';

    // Map status to color
    switch (normalizedStatus) {
      case 'available':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
      case 'rented':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        console.log('Unknown status:', status);
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to fetch properties from the backend
  const fetchProperties = async (page = 1, filters = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await AdminService.getAllProperties(filters, page, pageSize);

      setProperties(response.results || []);
      setTotalPages(response.total_pages || 1);
      setTotalProperties(response.total || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Failed to load properties. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle property approval
  const handleApproveProperty = async (propertyId) => {
    try {
      await AdminService.approveProperty(propertyId);
      toast({
        title: "Success",
        description: "Property approved successfully.",
      });
      fetchProperties(currentPage, getFilters());
    } catch (error) {
      console.error('Error approving property:', error);
      toast({
        title: "Error",
        description: "Failed to approve property. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to handle property rejection
  const handleRejectProperty = async (propertyId) => {
    try {
      await AdminService.rejectProperty(propertyId);
      toast({
        title: "Success",
        description: "Property rejected successfully.",
      });
      fetchProperties(currentPage, getFilters());
    } catch (error) {
      console.error('Error rejecting property:', error);
      toast({
        title: "Error",
        description: "Failed to reject property. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to handle property deletion
  const handleDeleteProperty = async (propertyId) => {
    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      return;
    }

    try {
      await AdminService.deleteProperty(propertyId);
      toast({
        title: "Success",
        description: "Property deleted successfully.",
      });
      fetchProperties(currentPage, getFilters());
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to get current filters
  const getFilters = () => {
    const filters = {};

    if (searchTerm) {
      filters.query = searchTerm;
    }

    if (filterStatus !== "All") {
      filters.status = filterStatus.toLowerCase();
    }

    if (filterType !== "All") {
      filters.property_type = filterType.toLowerCase();
    }

    // Always include all statuses for admin view
    filters.include_all_statuses = true;

    return filters;
  };

  // Fetch properties when component mounts or when search/filter/page changes
  useEffect(() => {
    const filters = getFilters();

    // Add a small delay to avoid too many API calls while typing
    const timer = setTimeout(() => {
      fetchProperties(currentPage, filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus, filterType, currentPage, pageSize]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          Properties Management
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search properties..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="w-40">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="approved">Available</SelectItem>
                <SelectItem value="pending">Pending Approval</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-40">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                // Loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={`skeleton-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                        <div className="ml-4">
                          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 w-32 bg-gray-200 rounded animate-pulse mt-2"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="h-4 w-8 bg-gray-200 rounded animate-pulse ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : error ? (
                // Error state
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : properties.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    {searchTerm || filterStatus !== "All" || filterType !== "All" ? (
                      <>
                        No properties found matching your filters.
                        {searchTerm && <span className="font-semibold"> Search: "{searchTerm}"</span>}
                        {filterStatus !== "All" && <span className="font-semibold"> Status: {filterStatus}</span>}
                        {filterType !== "All" && <span className="font-semibold"> Type: {filterType}</span>}
                      </>
                    ) : (
                      "No properties found in the system."
                    )}
                  </td>
                </tr>
              ) : (
                // Properties list
                properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-200 rounded-md overflow-hidden">
                          {property.images && property.images.length > 0 ? (
                            <img
                              src={property.images[0].url}
                              alt={property.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Building2 className="h-full w-full p-2 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            <Link href={`/dashboard/admin/properties/${property.id}`} className="hover:text-primary">
                              {property.title}
                            </Link>
                          </div>
                          <div className="text-xs text-gray-500">
                            {property.city}, {property.state}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {property.owner ? (
                          <Link href={`/dashboard/admin/users/${property.owner.id}`} className="hover:text-primary">
                            {property.owner.name ||
                             (property.owner.first_name && property.owner.last_name ?
                              `${property.owner.first_name} ${property.owner.last_name}` :
                              property.owner.username) ||
                             'Unknown'}
                          </Link>
                        ) : (
                          'Unknown Owner'
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {property.property_type || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(property.status)}`}>
                        {(() => {
                          // Format status for display
                          const status = property.status?.toLowerCase();
                          if (status === 'pending' || status === 'pending_approval') {
                            return 'Pending Approval';
                          } else if (status === 'approved' || status === 'available') {
                            return 'Available';
                          } else if (status) {
                            // Capitalize first letter
                            return status.charAt(0).toUpperCase() + status.slice(1);
                          } else {
                            return 'Unknown';
                          }
                        })()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${property.price_per_night}/night
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(property.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block text-left">
                        <DropdownMenu open={openDropdown === property.id} onOpenChange={() => toggleDropdown(property.id)}>
                          <DropdownMenuTrigger asChild>
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/admin/properties/${property.id}`} className="flex items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/admin/properties/${property.id}/edit`} className="flex items-center">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            {property.status === 'pending_approval' && (
                              <DropdownMenuItem onClick={() => handleApproveProperty(property.id)} className="flex items-center">
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            {property.status === 'pending_approval' && (
                              <DropdownMenuItem onClick={() => handleRejectProperty(property.id)} className="flex items-center">
                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                Reject
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleDeleteProperty(property.id)} className="flex items-center text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && !error && properties.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(currentPage * pageSize, totalProperties)}
              </span>{" "}
              of <span className="font-medium">{totalProperties}</span> properties
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
