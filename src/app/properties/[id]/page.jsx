"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link'
import Image from 'next/image';
import { Button } from '@/components/ui/button.jsx'
import {
  MapPin,
  BedDouble,
  Bath,
  Square,
  Home,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  ArrowLeft,
  Building2
} from 'lucide-react'
import BookingSection from './BookingSection'
import ZoomablePropertyImage from '@/components/ZoomablePropertyImage'
import PropertyImage from '@/components/PropertyImage'
import PropertyService from '@/services/property'

export default function PropertyDetailsPage({ params }) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const propertyId = parseInt(params.id);
        const data = await PropertyService.getPropertyById(propertyId);
        setProperty(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching property details:', err);
        setError('Failed to load property details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.id]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#111827]/5 to-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show error state
  if (error || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#111827]/5 to-white flex flex-col justify-center items-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Property not found'}</p>
          <Link href="/properties">
            <Button>Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Format amenities from the property data
  const amenities = [];

  // Check if amenities is an object with boolean values
  if (property.amenities && typeof property.amenities === 'object') {
    for (const [key, value] of Object.entries(property.amenities)) {
      if (value) {
        // Convert snake_case to Title Case
        const formattedKey = key
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        amenities.push(formattedKey);
      }
    }
  }

  // Also check for has_* properties directly on the property object
  if (property.has_wifi) amenities.push('Wifi');
  if (property.has_kitchen) amenities.push('Kitchen');
  if (property.has_air_conditioning) amenities.push('Air Conditioning');
  if (property.has_heating) amenities.push('Heating');
  if (property.has_tv) amenities.push('TV');
  if (property.has_parking) amenities.push('Parking');
  if (property.has_pool) amenities.push('Pool');
  if (property.has_gym) amenities.push('Gym');

  // Format additional services from the property data
  const additionalServices = [];

  // Check if additional_services is an object with boolean values
  if (property.additional_services && typeof property.additional_services === 'object') {
    for (const [key, value] of Object.entries(property.additional_services)) {
      if (value) {
        // Convert snake_case to Title Case
        const formattedKey = key
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        additionalServices.push(formattedKey);
      }
    }
  }

  // Also check for has_* properties directly on the property object for additional services
  if (property.has_maid_service) additionalServices.push('Maid Service');
  if (property.has_car_rental) additionalServices.push('Car Rental');

  // Format location
  const location = `${property.address}, ${property.city}, ${property.state}`;

  // Get property images
  const propertyImages = property.images && property.images.length > 0
    ? property.images.map(img => img.url)
    : [property.primary_image];

  // Navigation functions
  const nextImage = () => {
    if (propertyImages.length <= 1) return;
    setSelectedImage((prev) => (prev === propertyImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (propertyImages.length <= 1) return;
    setSelectedImage((prev) => (prev === 0 ? propertyImages.length - 1 : prev - 1));
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111827]/5 to-white">
      <div className="container-responsive py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center space-x-2 text-sm">
          <Link
            href="/properties"
            className="text-[#111827] hover:text-[#1f2937] transition-colors"
          >
            Properties
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-500" />
          <span className="text-gray-500">{property.title}</span>
        </nav>

        {/* Property Title and Price */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#111827] to-[#1f2937] mb-2">
              {property.title}
            </h1>
            <p className="text-gray-600 flex items-center">
              <MapPin className="h-5 w-5 mr-1 text-[#111827]" />
              {property.location}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#111827] to-[#1f2937]">
              ${property.price}<span className="text-gray-500 text-lg">/month</span>
            </p>
          </div>
        </div>

        {/* Property Images */}
        {isFullscreen && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <div className="flex justify-between items-center p-4 text-white">
              <h3 className="text-xl font-semibold">{property.title}</h3>
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 relative">
              <ZoomablePropertyImage
                src={propertyImages[selectedImage]}
                alt={property.title}
                className="h-full w-full"
              />

              {/* Navigation Controls */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
              >
                <ChevronLeft className="h-8 w-8 text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
              >
                <ChevronRight className="h-8 w-8 text-white" />
              </button>

              {/* Image counter */}
              <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                {selectedImage + 1} / {propertyImages.length}
              </div>

              {/* Thumbnails at the bottom in fullscreen */}
              <div className="absolute bottom-4 left-0 right-0 z-10 px-4">
                <div className="flex gap-3 overflow-x-auto py-3 px-4 bg-black/50 backdrop-blur-sm rounded-lg">
                  {propertyImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-16 w-24 flex-shrink-0 rounded-md overflow-hidden transition-all duration-200 ${selectedImage === index
                        ? 'ring-2 ring-white shadow-md scale-105'
                        : 'opacity-60 hover:opacity-100'}`}
                    >
                      <PropertyImage
                        src={image}
                        alt={`View ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-10">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">


            {/* Main Image with Thumbnails */}
            <div className="w-full h-[500px] relative group">
              {/* Thumbnails at the bottom within the image frame */}
              <div className="absolute bottom-4 left-0 right-0 z-10 px-4">
                <div className="flex gap-3 overflow-x-auto py-3 px-4 bg-black/30 backdrop-blur-sm rounded-lg">
                  {propertyImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-16 w-24 flex-shrink-0 rounded-md overflow-hidden transition-all duration-200 ${selectedImage === index
                        ? 'ring-2 ring-white shadow-md scale-105'
                        : 'opacity-80 hover:opacity-100 hover:shadow-sm'}`}
                    >
                      <PropertyImage
                        src={image}
                        alt={`View ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <ZoomablePropertyImage
                src={propertyImages[selectedImage]}
                alt={property.title}
                className="h-full w-full"
              />

              {/* Navigation Controls */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>

              {/* Fullscreen button */}
              <button
                onClick={toggleFullscreen}
                className="absolute top-24 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
              >
                <Maximize2 className="h-5 w-5 text-white" />
              </button>

              {/* Image counter */}
              <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                {selectedImage + 1} / {propertyImages.length}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#111827] to-[#1f2937]">
                Property Details
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col items-center p-4 bg-[#111827]/5 rounded-lg">
                  <Home className="h-6 w-6 text-[#111827] mb-2" />
                  <span className="text-sm text-gray-500">Type</span>
                  <span className="font-semibold text-gray-800 capitalize">{property.property_type}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-[#111827]/5 rounded-lg">
                  <BedDouble className="h-6 w-6 text-[#111827] mb-2" />
                  <span className="text-sm text-gray-500">Bedrooms</span>
                  <span className="font-semibold text-gray-800">{property.bedrooms}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-[#111827]/5 rounded-lg">
                  <Bath className="h-6 w-6 text-[#111827] mb-2" />
                  <span className="text-sm text-gray-500">Bathrooms</span>
                  <span className="font-semibold text-gray-800">{property.bathrooms}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-[#111827]/5 rounded-lg">
                  <Square className="h-6 w-6 text-[#111827] mb-2" />
                  <span className="text-sm text-gray-500">Area</span>
                  <span className="font-semibold text-gray-800">{property.area} sqft</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-[#111827]">Description</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {property.description}
              </p>

              {/* Amenities */}
              <h3 className="text-xl font-semibold mb-4 text-[#111827]">Amenities</h3>
              {amenities.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-[#111827]" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-8 bg-[#111827]/5 rounded-lg mb-6">
                  <Building2 className="h-6 w-6 text-gray-400 mr-3" />
                  <span className="text-gray-500 text-lg">No amenities listed for this property</span>
                </div>
              )}

              {/* Additional Services */}
              {additionalServices.length > 0 && (
                <>
                  <h3 className="text-xl font-semibold mb-4 text-[#111827]">Additional Services</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {additionalServices.map((service, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-[#111827]" />
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Booking Section */}
          <BookingSection property={{...property, price: property.price_per_night}} />
        </div>
      </div>
    </div>
  );
}


