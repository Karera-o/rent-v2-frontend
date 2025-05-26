"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MapPin, BedDouble, Bath, Square, Loader2, ArrowUpDown } from 'lucide-react';
import PropertyService from '@/services/property';
import { useToast } from '@/components/ui/use-toast';
import PropertyImage from '@/components/PropertyImage';

const PropertyCard = ({ property }) => {
  // Format location from city and state
  const location = `${property.city}, ${property.state}`;

  return (
    <div className="group relative bg-white overflow-hidden transition-all duration-300 hover:translate-y-[-4px]">
      {/* Elegant border that appears on hover */}
      <div className="absolute inset-0 border-2 border-[#111827] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

      {/* Image container with subtle hover effect */}
      <div className="relative h-64 w-full overflow-hidden">
        <PropertyImage
          src={property.primary_image}
          alt={property.title}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Elegant gradient overlay that's always visible but intensifies on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-30 group-hover:opacity-40 transition-opacity duration-300" />

        {/* Price tag positioned at top right */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 shadow-md z-10">
          <span className="text-[#111827] font-medium">${property.price_per_night}</span>
          <span className="text-gray-500 text-xs">/night</span>
        </div>

        {/* Property features as minimal badges at bottom of image */}
        <div className="absolute bottom-4 left-4 right-4 flex space-x-3 z-10">
          <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded-sm flex items-center text-xs">
            <BedDouble className="h-3 w-3 mr-1 text-[#111827]" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded-sm flex items-center text-xs">
            <Bath className="h-3 w-3 mr-1 text-[#111827]" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded-sm flex items-center text-xs">
            <Square className="h-3 w-3 mr-1 text-[#111827]" />
            <span>{property.square_feet} ft²</span>
          </div>
        </div>
      </div>

      {/* Content section with minimal styling */}
      <div className="p-5 border-b border-l border-r border-gray-100">
        <h3 className="text-base font-medium text-[#111827] mb-1.5 truncate">{property.title}</h3>
        <p className="text-sm text-gray-500 flex items-center mb-4">
          <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </p>

        {/* View details link with animated arrow */}
        <Link href={`/properties/${property.id}`} className="inline-flex items-center text-sm text-[#111827] font-medium group/link">
          <span>View details</span>
          <span className="ml-1.5 transition-transform duration-300 group-hover/link:translate-x-1">→</span>
        </Link>
      </div>
    </div>
  );
};

const PropertySearchResults = ({ initialFilters = {}, limit = 6, searchResults = null, isSearching = false }) => {
  const { toast } = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProperties, setTotalProperties] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('price_asc');
  const [filters, setFilters] = useState(initialFilters);
  const [isFiltered, setIsFiltered] = useState(false);

  // Fetch properties from the backend
  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      // Convert filters to search params
      const searchParams = { ...filters };

      // Add sort parameter
      if (sortBy === 'price_asc') {
        searchParams.ordering = 'price_per_night';
      } else if (sortBy === 'price_desc') {
        searchParams.ordering = '-price_per_night';
      } else if (sortBy === 'newest') {
        searchParams.ordering = '-created_at';
      }

      // Set pagination parameters
      searchParams.page = currentPage;
      searchParams.page_size = limit;

      // Fetch properties with pagination
      const response = await PropertyService.getAllProperties(searchParams);

      setProperties(response.results || []);
      setTotalProperties(response.count || 0);
      setTotalPages(response.total_pages || 1);
      setCurrentPage(response.page || 1);
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

  // Handle search results from parent component
  useEffect(() => {
    if (searchResults) {
      setProperties(searchResults.results || []);
      setTotalProperties(searchResults.count || 0);
      setTotalPages(searchResults.total_pages || 1);
      setCurrentPage(searchResults.page || 1);
      setLoading(false);
      setIsFiltered(true);
    }
  }, [searchResults]);

  // Fetch properties when component mounts or filters change
  useEffect(() => {
    // Only fetch properties if we're not using search results from parent
    if (!searchResults && !isSearching) {
      fetchProperties();
    } else if (isSearching) {
      setLoading(true);
    }
  }, [filters, sortBy, currentPage, limit, searchResults, isSearching]);

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full">
      {/* Refined header with elegant heading and sort */}
      <div className="mb-12">
        <div className="flex justify-between items-end">
          <div className="relative">
            <h2 className="text-3xl font-light text-[#111827] relative inline-block">
              {isFiltered || searchResults ? 'Search Results' : 'Featured Properties'}
              <span className="absolute -bottom-3 left-0 w-1/2 h-0.5 bg-[#111827]"></span>
            </h2>
            {isFiltered || searchResults ? (
              <p className="text-sm text-gray-500 mt-4">
                {totalProperties} {totalProperties === 1 ? 'property' : 'properties'} found
              </p>
            ) : null}
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-600 hidden sm:inline text-sm">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="appearance-none bg-transparent border-b border-gray-300 py-1 pl-2 pr-8 text-sm text-[#111827] hover:border-[#111827] focus:outline-none focus:border-[#111827] transition-all duration-200"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-[#111827]">
                <ArrowUpDown className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 mb-4">
              <div className="absolute top-0 left-0 w-full h-full border-2 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-[#111827] rounded-full animate-spin"></div>
            </div>
            <p className="text-sm text-gray-500 tracking-wide">Loading curated properties...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-16 max-w-md mx-auto">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => fetchProperties()}
            className="px-6 py-2 border border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No properties available matching your criteria.</p>
              <button
                onClick={() => {
                  setFilters({});
                  setIsFiltered(false);
                  setCurrentPage(1);
                  // If we're in search mode, we need to reset the parent component
                  if (searchResults) {
                    // This will trigger a re-fetch in the parent
                    window.location.reload();
                  }
                }}
                className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && properties.length > 0 && (
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 border ${currentPage === 1 ? 'border-gray-200 text-gray-400' : 'border-gray-300 text-gray-700 hover:border-[#111827]'} transition-colors`}
            >
              Prev
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Calculate page numbers to show (current page and nearby pages)
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 flex items-center justify-center ${
                    pageNum === currentPage
                      ? 'bg-[#111827] text-white'
                      : 'border border-gray-300 text-gray-700 hover:border-[#111827]'
                  } transition-colors`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 border ${currentPage === totalPages ? 'border-gray-200 text-gray-400' : 'border-gray-300 text-gray-700 hover:border-[#111827]'} transition-colors`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* View All Properties Link - Elegant minimalist design */}
      {properties.length > 0 && !isFiltered && (
        <div className="mt-16 text-center">
          <Link href="/properties" className="inline-block group">
            <div className="relative overflow-hidden">
              <div className="border border-[#111827] px-8 py-3 flex items-center justify-center space-x-2 transition-all duration-300 group-hover:bg-[#111827] group-hover:text-white">
                <span className="text-sm font-medium">View All Properties</span>
                <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#111827] transition-all duration-500 group-hover:w-full"></div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PropertySearchResults;
