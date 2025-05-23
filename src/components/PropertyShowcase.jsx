"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button.jsx'
import PropertyService from '@/services/property'
import PropertyImage from '@/components/PropertyImage'
import { MapPin, BedDouble, Bath, Square, ArrowRight, Eye, ChevronRight } from 'lucide-react'

const PropertyCard = ({ property, index, variant = "default" }) => {
  // Format location from city and state
  const location = `${property.city}, ${property.state}`;

  // Different card variants for visual variety
  if (variant === "featured") {
    return (
      <div className="relative group overflow-hidden h-[500px] bg-white">
        {/* Full-width image with overlay */}
        <div className="absolute inset-0">
          <PropertyImage
            src={property.primary_image}
            alt={property.title}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-1000 ease-out group-hover:scale-105"
          />
          {/* Elegant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
        </div>

        {/* Content positioned on left with elegant spacing */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="ml-16 max-w-lg">
            {/* Thin line above title */}
            <div className="w-16 h-px bg-white/70 mb-6"></div>

            <div className="mb-8">
              <div className="inline-block px-3 py-1 mb-4 text-xs tracking-wider uppercase border border-white/30 text-white/90 backdrop-blur-sm">
                Featured Property
              </div>
              <h2 className="text-4xl font-light mb-4 text-white">{property.title}</h2>
              <p className="text-white/80 mb-6 line-clamp-3 text-sm leading-relaxed">{property.description || `Beautiful ${property.bedrooms} bedroom property in ${location}`}</p>
            </div>

            {/* Property features with minimal design */}
            <div className="flex space-x-8 mb-8">
              <div className="flex items-center space-x-2 text-white/90">
                <BedDouble className="h-5 w-5 text-white/70" />
                <div>
                  <span className="block font-medium">{property.bedrooms}</span>
                  <span className="text-xs text-white/60">Bedrooms</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <Bath className="h-5 w-5 text-white/70" />
                <div>
                  <span className="block font-medium">{property.bathrooms}</span>
                  <span className="text-xs text-white/60">Bathrooms</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <Square className="h-5 w-5 text-white/70" />
                <div>
                  <span className="block font-medium">{property.area}</span>
                  <span className="text-xs text-white/60">Square Feet</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="mr-8">
                <span className="block text-sm text-white/60">Price per night</span>
                <span className="text-3xl font-light text-white">${property.price_per_night}</span>
              </div>
              <Link href={`/properties/${property.id}`} className="group/btn">
                <div className="border border-white/30 backdrop-blur-sm px-6 py-3 text-white hover:bg-white hover:text-[#111827] transition-colors duration-300 flex items-center space-x-2">
                  <span>View Property</span>
                  <span className="transform transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "stacked") {
    // Elegant stacked design with minimalist aesthetic
    return (
      <div className="group relative h-full flex flex-col bg-white overflow-hidden">
        {/* Subtle border that appears on hover */}
        <div className="absolute inset-0 border border-[#111827] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>

        {/* Image container with elegant hover effect */}
        <div className="relative h-56 overflow-hidden">
          <PropertyImage
            src={property.primary_image}
            alt={property.title}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Price tag positioned at top right */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 shadow-sm z-10">
            <span className="text-[#111827] font-medium">${property.price_per_night}</span>
            <span className="text-gray-500 text-xs">/night</span>
          </div>
        </div>

        {/* Content section with clean, minimal styling */}
        <div className="relative flex-grow flex flex-col p-6 bg-white z-[1]">
          <div className="mb-auto">
            {/* Property title with elegant typography */}
            <h3 className="text-lg font-medium mb-2 text-[#111827] line-clamp-1">{property.title}</h3>

            {/* Location with subtle icon */}
            <p className="text-sm text-gray-500 mb-4 flex items-center">
              <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
              <span className="line-clamp-1">{location}</span>
            </p>

            {/* Property features with minimal separator design */}
            <div className="flex items-center space-x-4 text-xs text-gray-600 mb-6">
              <div className="flex items-center">
                <BedDouble className="h-3.5 w-3.5 mr-1 text-[#111827]" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <div className="flex items-center">
                <Bath className="h-3.5 w-3.5 mr-1 text-[#111827]" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <div className="flex items-center">
                <Square className="h-3.5 w-3.5 mr-1 text-[#111827]" />
                <span>{property.area}</span>
              </div>
            </div>
          </div>

          {/* View details link with animated underline effect */}
          <Link href={`/properties/${property.id}`} className="inline-flex items-center text-sm text-[#111827] font-medium group/link">
            <span className="relative">
              View details
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#111827] transition-all duration-300 group-hover/link:w-full"></span>
            </span>
            <span className="ml-1.5 transition-transform duration-300 group-hover/link:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    );
  }

  // Default variant - Elegant horizontal card with minimalist design
  return (
    <div className="group relative overflow-hidden bg-white">
      {/* Subtle border effect on hover */}
      <div className="absolute inset-0 border border-[#111827] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>

      <div className="flex flex-col h-full">
        {/* Image with elegant hover effects */}
        <div className="relative h-44 overflow-hidden">
          <PropertyImage
            src={property.primary_image}
            alt={property.title}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Subtle gradient overlay that appears on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Elegant price tag */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 shadow-sm">
            <span className="text-[#111827] font-medium">${property.price_per_night}</span>
            <span className="text-gray-500 text-xs">/night</span>
          </div>
        </div>

        {/* Content with refined typography and spacing */}
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-base font-medium text-[#111827] mb-1.5 line-clamp-1">{property.title}</h3>
          <p className="text-sm text-gray-500 mb-4 flex items-center">
            <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </p>

          {/* Property features with elegant minimal design */}
          <div className="flex items-center space-x-4 text-xs text-gray-600 mb-4">
            <div className="flex items-center">
              <BedDouble className="h-3.5 w-3.5 mr-1 text-[#111827]" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            <div className="flex items-center">
              <Bath className="h-3.5 w-3.5 mr-1 text-[#111827]" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            <div className="flex items-center">
              <Square className="h-3.5 w-3.5 mr-1 text-[#111827]" />
              <span>{property.area}</span>
            </div>
          </div>

          {/* View details link with animated arrow */}
          <Link href={`/properties/${property.id}`} className="inline-flex items-center text-sm text-[#111827] font-medium group/link mt-auto">
            <span className="relative">
              View details
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#111827] transition-all duration-300 group-hover/link:w-full"></span>
            </span>
            <span className="ml-1.5 transition-transform duration-300 group-hover/link:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const PropertyShowcase = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // Get a mix of different property types
        const data = await PropertyService.getAllProperties({
          sort_by: 'newest',
          page_size: 6
        }, 1, 6);
        setProperties(data.results || []);
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

  return (
    <section className="py-24 bg-white">
      <div className="container-responsive">
        {/* Elegant minimalist section header */}
        <div className="mb-20 text-center">
          <div className="inline-block relative">
            <span className="text-xs uppercase tracking-widest text-gray-500 mb-3 block">Curated Selection</span>
            <h2 className="text-3xl font-light text-[#111827] relative inline-block">
              Exceptional Living Spaces
            </h2>
            <div className="mt-4 mx-auto w-16 h-px bg-[#111827]"></div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center">
              <div className="relative w-12 h-12 mb-4">
                <div className="absolute top-0 left-0 w-full h-full border-2 border-gray-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-[#111827] rounded-full animate-spin"></div>
              </div>
              <p className="text-sm text-gray-500 tracking-wide">Loading exceptional properties...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16 max-w-md mx-auto">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 border border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {properties.length > 0 ? (
              <div className="space-y-16">
                {/* Featured property - full width with split design */}
                {properties.length > 0 && (
                  <div className="mb-16">
                    <PropertyCard
                      property={properties[0]}
                      variant="featured"
                    />
                  </div>
                )}

                {/* Grid of properties with mixed card styles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {properties.slice(1, 4).map((property, index) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      variant="stacked"
                    />
                  ))}
                </div>

                {/* Elegant section for remaining properties */}
                {properties.length > 4 && (
                  <div className="mt-24">
                    <div className="flex items-center justify-center mb-12">
                      <div className="w-12 h-px bg-gray-300"></div>
                      <h3 className="text-xl font-light text-[#111827] mx-4">More to Explore</h3>
                      <div className="w-12 h-px bg-gray-300"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {properties.slice(4).map((property, index) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          variant="default"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No properties available at the moment.</p>
              </div>
            )}

            {/* Elegant minimalist View All link */}
            <div className="mt-24 text-center">
              <Link href="/properties" className="inline-block group">
                <div className="relative overflow-hidden">
                  <div className="border border-[#111827] px-8 py-3 flex items-center justify-center space-x-2 transition-all duration-300 group-hover:bg-[#111827] group-hover:text-white">
                    <span className="text-sm font-medium tracking-wide">Discover All Properties</span>
                    <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#111827] transition-all duration-500 group-hover:w-full"></div>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PropertyShowcase;
