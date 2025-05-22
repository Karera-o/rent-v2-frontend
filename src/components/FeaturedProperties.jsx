"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button.jsx'
import PropertyService from '@/services/property'
import PropertyImage from '@/components/PropertyImage'

const PropertyCard = ({ property }) => {
  // Format location from city and state
  const location = `${property.city}, ${property.state}`;

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="relative h-56 w-full">
        <PropertyImage
          src={property.primary_image}
          alt={property.title}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-gray-700 transition-colors">{property.title}</h3>
        <p className="text-sm text-gray-500 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </p>
        <div className="flex justify-between text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded-lg">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {property.bedrooms} Beds
          </span>
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {property.bathrooms} Baths
          </span>
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {property.area} sqft
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-900 font-bold text-lg">${property.price_per_night}<span className="text-gray-500 text-sm">/night</span></p>
          <Link href={`/properties/${property.id}`}>
            <Button variant="outline" size="sm">View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await PropertyService.getFeaturedProperties(6);
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

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-100">
      <div className="container-responsive">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-800">Featured Properties</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gray-900 to-gray-800 mx-auto mt-2 mb-6 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our handpicked selection of properties that might be perfect for your next home.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.length > 0 ? (
              properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-500">No properties available at the moment.</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/properties">
            <Button size="lg">
              View All Properties
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProperties
