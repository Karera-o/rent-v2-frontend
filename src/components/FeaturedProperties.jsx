"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button.jsx'
import PropertyService from '@/services/property'
import PropertyImage from '@/components/PropertyImage'
import { MapPin, BedDouble, Bath, Square, Heart, ArrowRight } from 'lucide-react'

const PropertyCard = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  // Format location from city and state
  const location = `${property.city}, ${property.state}`;

  return (
    <div className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
      {/* Property Image with Overlay */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <PropertyImage
          src={property.primary_image}
          alt={property.title}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-all duration-700 filter group-hover:brightness-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Price Tag */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm py-1.5 px-3 rounded-full shadow-sm">
          <p className="text-sm font-medium text-gray-900">
            ${property.price_per_night}<span className="text-xs text-gray-500">/night</span>
          </p>
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-transform hover:scale-110"
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
          />
        </button>

        {/* Property Features - Shown on Hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
          <div className="flex items-center justify-between space-x-4 text-white">
            <div className="flex items-center">
              <BedDouble className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.area} sqft</span>
            </div>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-5">
        {/* Location */}
        <p className="text-xs text-gray-500 flex items-center mb-2">
          <MapPin className="h-3 w-3 mr-1" />
          {location}
        </p>

        {/* Title */}
        <h3 className="text-lg font-medium text-gray-900 mb-3 line-clamp-1">
          {property.title}
        </h3>

        {/* View Details Link */}
        <Link
          href={`/properties/${property.id}`}
          className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors group/link"
        >
          <span>View Property</span>
          <ArrowRight className="h-4 w-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('price_asc');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await PropertyService.getFeaturedProperties(8);
        setProperties(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter and sort properties
  const filteredAndSortedProperties = [...properties]
    .filter(property => {
      if (activeFilter === 'all') return true;
      // This is just an example - you would need to add property types to your data
      return property.type === activeFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price_per_night - b.price_per_night;
      if (sortBy === 'price_desc') return b.price_per_night - a.price_per_night;
      return 0;
    });

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'house', label: 'Houses' },
    { value: 'apartment', label: 'Apartments' },
    { value: 'villa', label: 'Villas' }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container-responsive">
        {/* Elegant Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-3">Featured <span className="font-medium">Properties</span></h2>
          <div className="w-16 h-0.5 bg-gray-900 mx-auto mb-6"></div>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Discover our handpicked selection of exceptional properties, each offering unique character and comfort.
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          {/* Filter Pills */}
          <div className="flex items-center space-x-2 mb-6 md:mb-0 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={`px-4 py-2 text-sm rounded-full transition-all whitespace-nowrap ${
                  activeFilter === option.value
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-full shadow-sm">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Sort</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border-0 bg-transparent focus:ring-0 cursor-pointer"
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Properties Display */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-900 border-t-transparent mb-4"></div>
            <p className="text-gray-500">Loading properties...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm p-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {filteredAndSortedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredAndSortedProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500 mb-2">No properties match your current filters.</p>
                <button
                  onClick={() => setActiveFilter('all')}
                  className="text-gray-900 underline text-sm"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}

        {/* View All Link */}
        <div className="mt-16 text-center">
          <Link
            href="/properties"
            className="inline-block px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
          >
            Explore All Properties
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProperties
