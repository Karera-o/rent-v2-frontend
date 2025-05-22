"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import {
  Building2,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  AlertCircle,
  BedDouble,
  Bath,
  Home,
  DollarSign,
  MapPin
} from "lucide-react";
import Link from "next/link";
import EditPropertyDialog from "@/components/properties/EditPropertyDialog";
import AddPropertyDialog from "@/components/properties/AddPropertyDialog";
import PropertyService from "@/services/property";
import { useToast } from "@/components/ui/use-toast";

const LandlordProperties = forwardRef((props, ref) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list");
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    fetchProperties: (page, searchParams) => fetchProperties(page, searchParams)
  }));

  // Function to fetch properties from the backend
  const fetchProperties = async (page = 1, searchParams = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await PropertyService.getLandlordProperties(
        searchParams,
        page,
        pageSize
      );

      // Debug logs to see the property data structure and status values
      console.log('Property data from API:', response.results);

      // Log unique status values to help with debugging
      const statusValues = [...new Set(response.results.map(p => p.status))];
      console.log('Available status values:', statusValues);

      setProperties(response.results || []);
      setTotalPages(response.total_pages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching landlord properties:', err);
      setError('Failed to load properties. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load properties. Please try again.",
        variant: "destructive",
      });
      // Set empty properties array if there's an error
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch properties when component mounts or when search/filter/page changes
  useEffect(() => {
    const searchParams = {};

    if (searchTerm) {
      searchParams.search = searchTerm;
    }

    // Add status filter if it's not "All"
    if (filterStatus !== "All") {
      searchParams.status = filterStatus;
    }

    // Add a small delay to avoid too many API calls while typing
    const timer = setTimeout(() => {
      fetchProperties(currentPage, searchParams);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus, currentPage, pageSize]);

  // Apply client-side filtering since the backend doesn't support it for my-properties
  const applyFilters = () => {
    if (!searchTerm && filterStatus === "All") {
      return properties;
    }

    return properties.filter(property => {
      const matchesSearch = !searchTerm ||
        property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(property.id).toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filterStatus === "All" || property.status === filterStatus;

      return matchesSearch && matchesFilter;
    });
  };

  // No mock data - we only want to show real properties from the API

  // Function to handle property deletion
  const handleDeleteProperty = async (propertyId) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);

    try {
      await PropertyService.deleteProperty(propertyId);

      toast({
        title: "Success",
        description: "Property deleted successfully.",
      });

      // Refresh the properties list
      fetchProperties(currentPage);
    } catch (err) {
      console.error('Error deleting property:', err);
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Only use actual properties from the API, never use mock data in production

  const toggleSortDirection = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Apply client-side filtering for status since the backend might not support our exact status values
  const filteredProperties = properties.filter(property => {
    // Apply search filter
    const matchesSearch = !searchTerm ||
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(property.id).toLowerCase().includes(searchTerm.toLowerCase());

    // Only apply status filter if it's not "All"
    let matchesStatus = true;
    if (filterStatus !== "All") {
      // Case-insensitive comparison and handle null/undefined status
      const propertyStatus = property.status || '';
      matchesStatus = propertyStatus.toLowerCase() === filterStatus.toLowerCase() ||
                     propertyStatus.toLowerCase().includes(filterStatus.toLowerCase());
    }

    return matchesSearch && matchesStatus;
  });

  // Apply sorting client-side
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];
    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Apply client-side pagination
  const paginatedProperties = sortedProperties;

  // Make sure we're not using any mock data - use paginatedProperties directly

  const getStatusColor = (status) => {
    // Convert status to lowercase for case-insensitive comparison
    const statusLower = status?.toLowerCase() || '';

    switch (statusLower) {
      case "approved": return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "pending": return "bg-amber-100 text-amber-700 border border-amber-200";
      case "denied": return "bg-rose-100 text-rose-700 border border-rose-200";
      case "rented": return "bg-blue-100 text-blue-700 border border-blue-200";
      // Keep the old status colors for backward compatibility
      case "available": return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "reserved": return "bg-amber-100 text-amber-700 border border-amber-200";
      case "occupied": return "bg-blue-100 text-blue-700 border border-blue-200";
      case "maintenance": return "bg-rose-100 text-rose-700 border border-rose-200";
      default: return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-60 bg-gray-200 rounded animate-pulse" />
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="h-64 w-full bg-gray-200 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="w-full sm:w-40 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending Approval</option>
              <option value="denied">Denied</option>
              <option value="rented">Rented</option>
            </select>
          </div>
          <button
            onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            {viewMode === "list" ? "Grid" : "List"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {paginatedProperties.length === 0 && !isLoading && !error ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No properties found</h3>
          <p className="text-gray-500 mb-4">You haven't added any properties yet or none match your filters.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedProperties.map((property) => (
            <div key={property.id} className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold truncate pr-2">{property.title}</h3>
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-4">
                <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
                <p className="truncate">{property.address || 'No address provided'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center bg-gray-50 p-2 rounded-md">
                  <Home className="h-4 w-4 mr-2 text-primary/70" />
                  <span className="text-sm">{property.type || 'Not specified'}</span>
                </div>
                <div className="flex items-center bg-gray-50 p-2 rounded-md">
                  <DollarSign className="h-4 w-4 mr-2 text-primary/70" />
                  <span className="text-sm font-medium">${property.price || property.price_per_night || property.pricePerNight || 0}</span>
                  <span className="text-xs text-gray-500 ml-1">/night</span>
                </div>
                <div className="flex items-center bg-gray-50 p-2 rounded-md">
                  <BedDouble className="h-4 w-4 mr-2 text-primary/70" />
                  <span className="text-sm">{property.bedrooms || 0} Beds</span>
                </div>
                <div className="flex items-center bg-gray-50 p-2 rounded-md">
                  <Bath className="h-4 w-4 mr-2 text-primary/70" />
                  <span className="text-sm">{property.bathrooms || 0} Baths</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <Link
                  href={`/dashboard/landlord/properties/${property.id}`}
                  className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                  title="View details"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <EditPropertyDialog property={property}>
                  <button
                    className="p-2 bg-amber-50 text-amber-600 rounded-md hover:bg-amber-100 transition-colors"
                    title="Edit property"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </EditPropertyDialog>
                <button
                  className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                  onClick={() => handleDeleteProperty(property.id)}
                  title="Delete property"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white text-gray-500 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                  <button onClick={() => toggleSortDirection("title")} className="flex items-center text-gray-700 hover:text-primary">
                    <Home className="h-4 w-4 mr-1" />
                    Property {sortField === "title" && (sortDirection === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                  <div className="flex items-center">
                    <BedDouble className="h-4 w-4 mr-1" />
                    Details
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                  <button onClick={() => toggleSortDirection("pricePerNight")} className="flex items-center text-gray-700 hover:text-primary">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Price {sortField === "pricePerNight" && (sortDirection === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Status
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedProperties.map((property, index) => (
                <tr key={property.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-primary/5 transition-colors`}>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 mb-1">{property.title}</span>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="truncate max-w-[200px]">{property.address || 'No address provided'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-2 text-primary/70" />
                        <span className="text-gray-700">{property.type || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center">
                        <BedDouble className="h-4 w-4 mr-2 text-primary/70" />
                        <span className="text-gray-700">{property.bedrooms || 0} Beds</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <Bath className="h-4 w-4 mr-2 text-primary/70" />
                        <span className="text-gray-700">{property.bathrooms || 0} Baths</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">${property.price || property.price_per_night || property.pricePerNight || 0}</span>
                        <span className="text-gray-500 ml-1">/night</span>
                      </div>
                      {property.monthlyDiscount && (
                        <div className="text-xs text-green-600 mt-1">
                          {property.monthlyDiscount}% monthly discount
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/landlord/properties/${property.id}`}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <EditPropertyDialog property={property}>
                        <button
                          className="p-1.5 bg-amber-50 text-amber-600 rounded-md hover:bg-amber-100 transition-colors"
                          title="Edit property"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </EditPropertyDialog>
                      <button
                        className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                        onClick={() => handleDeleteProperty(property.id)}
                        title="Delete property"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
});

export default LandlordProperties;
