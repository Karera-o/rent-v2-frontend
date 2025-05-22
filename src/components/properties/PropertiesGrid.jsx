"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MapPin, BedDouble, Bath, Square, Loader2 } from 'lucide-react';
import PropertyService from '@/services/property';
import { useToast } from '@/components/ui/use-toast';

export default function PropertiesGrid() {
  const { toast } = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 5000,
    propertyTypes: [],
    bedrooms: null,
    bathrooms: null,
    sortBy: 'price_asc'
  });

  // Fetch properties from the backend
  const fetchProperties = async (page = 1, filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Convert filters to search params
      const searchParams = {};

      // Only add filters that have values
      if (filters.minPrice && filters.minPrice > 0) searchParams.min_price = filters.minPrice;
      if (filters.maxPrice && filters.maxPrice < 5000) searchParams.max_price = filters.maxPrice;

      // Handle property types - backend expects a single property_type value
      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        // Use the first selected property type
        searchParams.property_type = filters.propertyTypes[0];
      }

      // Only add bedroom/bathroom filters if they're selected
      if (filters.bedrooms) searchParams.bedrooms = filters.bedrooms;
      if (filters.bathrooms) searchParams.bathrooms = filters.bathrooms;

      console.log('Applying filters:', searchParams);

      // Fetch properties with pagination
      const response = await PropertyService.getAllProperties(searchParams, page);

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
      setLoading(false);
    }
  };

  // Fetch properties when component mounts
  useEffect(() => {
    fetchProperties(currentPage, filters);
  }, [currentPage]);

  // Debug: Log filter changes
  useEffect(() => {
    console.log('Filters changed:', filters);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    console.log('Applying filters:', filters);
    setCurrentPage(1); // Reset to first page when applying filters
    fetchProperties(1, filters);
  };

  // Reset filters
  const resetFilters = () => {
    const defaultFilters = {
      minPrice: 0,
      maxPrice: 5000,
      propertyTypes: [],
      bedrooms: null,
      bathrooms: null,
      sortBy: 'price_asc'
    };

    setFilters(defaultFilters);
    setCurrentPage(1);
    fetchProperties(1, {});

    // Show toast notification
    toast({
      title: "Filters Reset",
      description: "All filters have been reset to default values.",
    });
  };

  // Handle property type checkbox change
  const handlePropertyTypeChange = (type) => {
    setFilters(prev => {
      const updatedTypes = prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type];

      return {
        ...prev,
        propertyTypes: updatedTypes
      };
    });
  };

  // Handle pagination
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    handleFilterChange('sortBy', sortBy);

    // Sort properties client-side
    const sortedProperties = [...properties];

    switch (sortBy) {
      case 'price_asc':
        sortedProperties.sort((a, b) => a.price_per_night - b.price_per_night);
        break;
      case 'price_desc':
        sortedProperties.sort((a, b) => b.price_per_night - a.price_per_night);
        break;
      case 'newest':
        sortedProperties.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        break;
    }

    setProperties(sortedProperties);
  };

  // Generate pagination items
  const paginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    // Calculate range of pages to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`py-2 px-4 border-t border-b border-gray-300 bg-white ${
            i === currentPage
              ? 'text-indigo-600 font-medium'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    return items;
  };

  // Loading state
  if (loading && properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
        <p className="mt-4 text-gray-600">Loading properties...</p>
      </div>
    );
  }

  // Error state
  if (error && properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Properties</h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => fetchProperties(currentPage, filters)}
            className="mt-4 bg-red-100 text-red-800 px-4 py-2 rounded-md hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Filters Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-md sticky top-24 border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#111827] to-[#1f2937]">
            Filter Properties
          </h2>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800">Price Range</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                  className="w-full accent-[#111827]"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>$0</span>
                <span>${filters.maxPrice}</span>
              </div>
            </div>
          </div>

          {/* Property Type */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800">Property Type</h3>
            <div className="space-y-2">
              {['apartment', 'house', 'villa', 'studio', 'duplex', 'townhouse'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.propertyTypes.includes(type)}
                    onChange={() => handlePropertyTypeChange(type)}
                    className="rounded border-gray-300 text-[#111827] focus:ring-[#1f2937]"
                  />
                  <span className="ml-2 text-gray-600">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Note: Currently only one property type filter can be applied at a time.</p>
          </div>

          {/* Bedrooms */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800">Bedrooms</h3>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => handleFilterChange('bedrooms', filters.bedrooms === num ? null : num)}
                  className={`py-1 px-2 border rounded-md text-gray-700 transition-colors ${
                    filters.bedrooms === num
                      ? 'bg-indigo-100 border-indigo-500'
                      : 'border-gray-300 hover:bg-indigo-50 hover:border-indigo-500'
                  }`}
                >
                  {num === 5 ? '5+' : num}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800">Bathrooms</h3>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => handleFilterChange('bathrooms', filters.bathrooms === num ? null : num)}
                  className={`py-1 px-2 border rounded-md text-gray-700 transition-colors ${
                    filters.bathrooms === num
                      ? 'bg-indigo-100 border-indigo-500'
                      : 'border-gray-300 hover:bg-indigo-50 hover:border-indigo-500'
                  }`}
                >
                  {num === 5 ? '5+' : num}
                </button>
              ))}
            </div>
          </div>

          {/* Apply Filters Button */}
          <button
            onClick={applyFilters}
            className="w-full bg-gradient-to-r from-[#111827] to-[#1f2937] text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Applying...
              </>
            ) : (
              'Apply Filters'
            )}
          </button>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="w-full mt-2 text-indigo-600 text-sm hover:underline"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="lg:col-span-3">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#111827] to-[#1f2937]">
            {totalProperties} Properties Available
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-md py-1 px-3 focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-[#111827]"
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {loading && properties.length > 0 && (
          <div className="flex justify-center my-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        {properties.length === 0 && !loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No properties found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters to see more results.</p>
            <button
              onClick={resetFilters}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={property.primary_image ?
                      (property.primary_image.startsWith('http') ?
                        property.primary_image :
                        `${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:8001'}${property.primary_image}`
                      ) :
                      '/images/property-placeholder.jpg'
                    }
                    alt={property.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/property-placeholder.jpg';
                    }}
                  />
                  {property.status === 'approved' && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Available
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-[#111827] transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.city}, {property.state}, {property.country}
                  </p>
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <BedDouble className="h-4 w-4 mr-1" />
                      {property.bedrooms} Beds
                    </span>
                    <span className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      {property.bathrooms} Baths
                    </span>
                    <span className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      {property.area} sq ft
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[#111827] font-bold text-lg">
                      ${property.price_per_night}<span className="text-gray-500 text-sm">/night</span>
                    </p>
                    <Link href={`/properties/${property.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white transition-colors"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`py-2 px-4 border border-gray-300 bg-white rounded-l-md ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>

              {paginationItems()}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`py-2 px-4 border border-gray-300 bg-white rounded-r-md ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
