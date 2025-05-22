"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MapPin, BedDouble, Bath, Square, Loader2 } from 'lucide-react';
import PropertyService from '@/services/property';
import { useToast } from '@/components/ui/use-toast';

export default function PropertyList() {
  const { toast } = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);

  // Fetch properties from the backend
  const fetchProperties = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch only approved properties
      const response = await PropertyService.getAllProperties({}, page);
      
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

  // Fetch properties when component mounts or page changes
  useEffect(() => {
    fetchProperties(currentPage);
  }, [currentPage]);

  // Handle pagination
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
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
            onClick={() => fetchProperties(currentPage)}
            className="mt-4 bg-red-100 text-red-800 px-4 py-2 rounded-md hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No properties found
  if (properties.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-1">No properties found</h3>
        <p className="text-gray-500 mb-4">Check back later for new listings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#111827] to-[#1f2937]">
          {totalProperties} Properties Available
        </h2>
      </div>
      
      {loading && properties.length > 0 && (
        <div className="flex justify-center my-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div 
            key={property.id} 
            className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100"
          >
            <div className="relative h-56 w-full">
              {property.primary_image ? (
                <Image
                  src={property.primary_image}
                  alt={property.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No image available</p>
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
  );
}
