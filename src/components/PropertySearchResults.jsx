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
    <div className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
      {/* Image container with overlay on hover */}
      <div className="relative h-52 w-full overflow-hidden">
        <PropertyImage
          src={property.primary_image}
          alt={property.title}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-500 group-hover:scale-110"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick view button that appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link href={`/properties/${property.id}`} className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm hover:bg-white">
              Quick View
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{property.title}</h3>
        <p className="text-sm text-gray-500 mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-gray-700 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </p>

        {/* Property features in a more compact, elegant layout */}
        <div className="flex items-center justify-between mb-4 bg-gray-50 p-2 rounded-lg">
          <div className="flex items-center text-gray-600 text-xs">
            <BedDouble className="h-3.5 w-3.5 mr-1 text-gray-700" />
            <span className="mr-2">{property.bedrooms}</span>
          </div>
          <div className="flex items-center text-gray-600 text-xs">
            <Bath className="h-3.5 w-3.5 mr-1 text-gray-700" />
            <span className="mr-2">{property.bathrooms}</span>
          </div>
          <div className="flex items-center text-gray-600 text-xs">
            <Square className="h-3.5 w-3.5 mr-1 text-gray-700" />
            <span>{property.square_feet} ft²</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-gray-900 font-bold">
            ${property.price_per_night}<span className="text-gray-500 font-normal text-sm">/night</span>
          </div>
          <Link href={`/properties/${property.id}`}>
            <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-auto">Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const PropertySearchResults = ({ initialFilters = {}, limit = 6 }) => {
  const { toast } = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProperties, setTotalProperties] = useState(0);
  const [sortBy, setSortBy] = useState('price_asc');
  const [filters, setFilters] = useState(initialFilters);

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

      // Fetch properties with pagination
      const response = await PropertyService.getAllProperties(searchParams, 1, limit);

      setProperties(response.results || []);
      setTotalProperties(response.total || 0);
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

  // Fetch properties when component mounts or filters change
  useEffect(() => {
    fetchProperties();
  }, [filters, sortBy, limit]);

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="w-full">
      {/* Header with elegant heading and sort */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#111827] to-[#1f2937]">
          Featured Properties
        </h2>
        <div className="flex items-center space-x-3">
          <span className="text-gray-600 hidden sm:inline font-medium">Sort by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-[#111827] transition-all duration-200"
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-gray-500">Loading properties...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => fetchProperties()}
            className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
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
                onClick={() => setFilters({})}
                className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* View All Properties Link */}
      {properties.length > 0 && (
        <div className="mt-8 text-center">
          <Link href="/properties">
            <Button variant="outline" className="px-6">
              View All Properties
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PropertySearchResults;
