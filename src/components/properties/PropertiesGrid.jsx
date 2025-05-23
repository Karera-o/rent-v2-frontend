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
          className={`py-2.5 px-5 border border-gray-200 ${
            i === currentPage
              ? 'bg-[#111827] text-white'
              : 'text-gray-600 hover:border-gray-400 transition-colors'
          }`}
        >
          {i}
        </button>
      );
    }

    return items;
  };

  // Loading state - Minimalist and Elegant
  if (loading && properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
        <p className="mt-6 text-gray-500 text-sm">Loading properties...</p>
      </div>
    );
  }

  // Error state - Minimalist and Elegant
  if (error && properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="border border-gray-200 p-12 max-w-md">
          <h3 className="text-lg font-light text-[#111827] mb-2">Unable to Load Properties</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => fetchProperties(currentPage, filters)}
            className="border border-[#111827] px-6 py-2 text-sm text-[#111827] hover:bg-[#111827] hover:text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Filters Sidebar - Minimalist and Elegant */}
      <div className="lg:col-span-1">
        <div className="bg-white p-8 sticky top-24 border border-gray-100">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-widest text-gray-500 block mb-2">Refine Search</span>
            <h2 className="text-xl font-light text-[#111827]">
              Filter Properties
            </h2>
            <div className="mt-2 w-12 h-px bg-[#111827]"></div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="text-sm font-medium mb-4 text-gray-800">Price Range</h3>
            <div className="space-y-3">
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
              <div className="flex justify-between text-xs text-gray-500">
                <span>$0</span>
                <span>${filters.maxPrice}</span>
              </div>
            </div>
          </div>

          {/* Property Type */}
          <div className="mb-8">
            <h3 className="text-sm font-medium mb-4 text-gray-800">Property Type</h3>
            <div className="space-y-3">
              {['apartment', 'house', 'villa', 'studio', 'duplex', 'townhouse'].map((type) => (
                <label key={type} className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.propertyTypes.includes(type)}
                    onChange={() => handlePropertyTypeChange(type)}
                    className="rounded border-gray-300 text-[#111827] focus:ring-[#1f2937]"
                  />
                  <span className="ml-2 text-sm text-gray-600 group-hover:text-[#111827] transition-colors">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2 italic">Note: Currently only one property type filter can be applied at a time.</p>
          </div>

          {/* Bedrooms */}
          <div className="mb-8">
            <h3 className="text-sm font-medium mb-4 text-gray-800">Bedrooms</h3>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => handleFilterChange('bedrooms', filters.bedrooms === num ? null : num)}
                  className={`py-1.5 px-3 text-sm transition-colors ${
                    filters.bedrooms === num
                      ? 'bg-[#111827] text-white'
                      : 'border border-gray-200 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {num === 5 ? '5+' : num}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div className="mb-8">
            <h3 className="text-sm font-medium mb-4 text-gray-800">Bathrooms</h3>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => handleFilterChange('bathrooms', filters.bathrooms === num ? null : num)}
                  className={`py-1.5 px-3 text-sm transition-colors ${
                    filters.bathrooms === num
                      ? 'bg-[#111827] text-white'
                      : 'border border-gray-200 text-gray-700 hover:border-gray-400'
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
            className="w-full border border-[#111827] bg-[#111827] text-white py-2.5 px-4 hover:bg-[#1f2937] transition-colors flex items-center justify-center"
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
            className="w-full mt-3 py-2 border border-gray-200 text-gray-600 text-sm hover:border-gray-400 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      </div>

      {/* Properties Grid - Minimalist and Elegant */}
      <div className="lg:col-span-3">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <span className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Available Listings</span>
            <h2 className="text-2xl font-light text-[#111827]">
              {totalProperties} Properties
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="border border-gray-200 py-2 px-4 text-sm focus:outline-none focus:border-gray-400 transition-colors"
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
          <div className="border border-gray-200 p-12 text-center">
            <h3 className="text-lg font-light text-[#111827] mb-2">No properties found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters to see more results.</p>
            <button
              onClick={resetFilters}
              className="border border-[#111827] px-6 py-2 text-sm text-[#111827] hover:bg-[#111827] hover:text-white transition-colors"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map((property) => (
              <Link
                href={`/properties/${property.id}`}
                key={property.id}
                className="group block"
              >
                <div className="relative overflow-hidden border border-gray-200 transition-all duration-300 hover:border-gray-400">
                  {/* Image container with subtle hover effect */}
                  <div className="relative h-64 w-full overflow-hidden">
                    {/* Elegant border that appears on hover */}
                    <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

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
                      className="transition-transform duration-1000 ease-out group-hover:scale-105"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/property-placeholder.jpg';
                      }}
                    />

                    {/* Elegant gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>

                    {/* Status badge */}
                    {property.status === 'approved' && (
                      <div className="absolute top-4 right-4 border border-white/30 backdrop-blur-sm px-3 py-1 text-white text-xs z-10">
                        Available
                      </div>
                    )}
                  </div>

                  {/* Content with minimalist design */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-light text-[#111827]">{property.title}</h3>
                      <p className="text-[#111827] font-medium">
                        ${property.price_per_night}<span className="text-gray-500 text-xs ml-1">/night</span>
                      </p>
                    </div>

                    <p className="text-sm text-gray-500 mb-4 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {property.city}, {property.country}
                    </p>

                    {/* Property features with minimal styling */}
                    <div className="flex items-center gap-4 text-xs text-gray-600 border-t border-gray-100 pt-4">
                      <span className="flex items-center">
                        <BedDouble className="h-3 w-3 mr-1" />
                        {property.bedrooms} Beds
                      </span>
                      <span className="flex items-center">
                        <Bath className="h-3 w-3 mr-1" />
                        {property.bathrooms} Baths
                      </span>
                      <span className="flex items-center">
                        <Square className="h-3 w-3 mr-1" />
                        {property.area} sq ft
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination - Minimalist and Elegant */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <nav className="inline-flex">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`py-2.5 px-5 border border-gray-200 ${
                  currentPage === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:border-gray-400 transition-colors'
                }`}
              >
                Previous
              </button>

              {paginationItems()}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`py-2.5 px-5 border border-gray-200 ${
                  currentPage === totalPages
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:border-gray-400 transition-colors'
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
