"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  BedDouble,
  Bath,
  Square,
  Calendar,
  DollarSign,
  ArrowLeft,
  Wifi,
  Tv,
  ChefHat,
  Wind,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ZoomableImage from "@/components/ZoomableImage";
import PropertyImage from "@/components/PropertyImage";

const amenityIcons = {
  "Wi-Fi": Wifi,
  "TV": Tv,
  "Kitchen": ChefHat,
  "Elevator": Building2, // Changed from Stairs to Building2
  "Air Conditioning": Wind,
};

export default function PropertyDetails({ params }) {
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      // Mock data - replace with actual API call
      const mockProperty = {
        id: params.id,
        title: "Modern Apartment with City View",
        type: "Apartment",
        address: "123 Downtown Ave, New York, NY 10001",
        pricePerNight: 125,
        status: "Available",
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        description: "A beautiful modern apartment with stunning city views, perfect for both short and long-term stays. This newly renovated space features high-end finishes, an open concept living area, and a fully equipped kitchen. Located in the heart of the city, you'll be steps away from restaurants, shopping, and public transportation.",
        amenities: ["Wi-Fi", "Air Conditioning", "Kitchen", "TV", "Elevator"],
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858",
          "https://images.unsplash.com/photo-1560185007-c5ca9d2c0862",
          "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
          "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8"
        ],
        lastUpdated: "2023-11-20",
        features: [
          "Floor-to-ceiling windows",
          "Hardwood floors",
          "Stainless steel appliances",
          "In-unit laundry",
          "24/7 security"
        ]
      };

      setProperty(mockProperty);
      setIsLoading(false);
    };

    fetchProperty();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-60 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-96 w-full bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-4 gap-4 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Property not found</h1>
        <Link href="/dashboard/landlord/properties">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </Link>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-800";
      case "Reserved": return "bg-yellow-100 text-yellow-800";
      case "Occupied": return "bg-blue-100 text-blue-800";
      case "Maintenance": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const nextImage = () => {
    if (property.images.length <= 1) return;
    setSelectedImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (property.images.length <= 1) return;
    setSelectedImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard/landlord/properties">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </Link>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(property.status)}`}>
          {property.status}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Image Gallery */}
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
              <ZoomableImage
                src={property.images[selectedImage]}
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
                {selectedImage + 1} / {property.images.length}
              </div>

              {/* Thumbnails at the bottom in fullscreen */}
              <div className="absolute bottom-4 left-0 right-0 z-10 px-4">
                <div className="flex gap-3 overflow-x-auto py-3 px-4 bg-black/50 backdrop-blur-sm rounded-lg">
                  {property.images.map((image, index) => (
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

        <div className="relative">
          {/* Thumbnails at the bottom */}
          <div className="absolute bottom-4 left-0 right-0 z-10 px-4">
            <div className="flex gap-3 overflow-x-auto py-3 px-4 bg-black/30 backdrop-blur-sm rounded-lg">
              {property.images.map((image, index) => (
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

          {/* Main Image */}
          <div className="w-full h-[500px] relative group">
            <ZoomableImage
              src={property.images[selectedImage]}
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
              className="absolute top-4 left-4 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <Maximize2 className="h-5 w-5 text-white" />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
              {selectedImage + 1} / {property.images.length}
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-3">{property.title}</h1>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              {property.address}
            </div>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <BedDouble className="h-6 w-6 text-primary" />
                <span className="ml-2 text-lg font-semibold">{property.bedrooms}</span>
              </div>
              <p className="text-gray-600">Bedrooms</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Bath className="h-6 w-6 text-primary" />
                <span className="ml-2 text-lg font-semibold">{property.bathrooms}</span>
              </div>
              <p className="text-gray-600">Bathrooms</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Square className="h-6 w-6 text-primary" />
                <span className="ml-2 text-lg font-semibold">{property.squareFeet}</span>
              </div>
              <p className="text-gray-600">Square Feet</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <DollarSign className="h-6 w-6 text-primary" />
                <span className="ml-2 text-lg font-semibold">${property.pricePerNight}</span>
              </div>
              <p className="text-gray-600">Per Night</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">About this property</h2>
            <p className="text-gray-600 leading-relaxed">{property.description}</p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.features.map((feature) => (
                <div key={feature} className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                  <span className="text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            {property.amenities && property.amenities.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {property.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity] || Building2;
                  return (
                    <div key={amenity} className="flex items-center bg-gray-50 p-3 rounded-lg">
                      <Icon className="h-5 w-5 text-primary mr-3" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                <Building2 className="h-6 w-6 text-gray-400 mr-3" />
                <span className="text-gray-500 text-lg">No amenities listed for this property</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t pt-6 mt-8">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              Last updated: {property.lastUpdated}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
