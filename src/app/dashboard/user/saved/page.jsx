"use client";

import {
  Heart,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Trash2,
  ChevronRight,
  Filter,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function SavedPropertiesPage() {
  const [savedProperties, setSavedProperties] = useState([
    {
      id: 1,
      title: "Downtown Loft",
      location: "New York, NY",
      price: 150,
      priceDisplay: "$150/night",
      bedrooms: 2,
      bathrooms: 1,
      image: "/placeholder-image-1.jpg",
      rating: 4.8,
      reviews: 24,
      type: "Loft"
    },
    {
      id: 2,
      title: "Beachfront Villa",
      location: "Miami, FL",
      price: 250,
      priceDisplay: "$250/night",
      bedrooms: 3,
      bathrooms: 2,
      image: "/placeholder-image-2.jpg",
      rating: 4.9,
      reviews: 18,
      type: "Villa"
    },
    {
      id: 3,
      title: "Mountain Cabin",
      location: "Aspen, CO",
      price: 180,
      priceDisplay: "$180/night",
      bedrooms: 2,
      bathrooms: 1,
      image: "/placeholder-image-3.jpg",
      rating: 4.7,
      reviews: 32,
      type: "Cabin"
    },
  ]);

  const [sortBy, setSortBy] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterBedrooms, setFilterBedrooms] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleRemoveProperty = (id) => {
    setSavedProperties(savedProperties.filter((prop) => prop.id !== id));
    // In a real app, this would also make an API call to update the backend
  };

  const sortProperties = (properties) => {
    let sorted = [...properties];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews-desc":
        sorted.sort((a, b) => b.reviews - a.reviews);
        break;
    }
    return sorted;
  };

  const filterProperties = (properties) => {
    return properties.filter((prop) => {
      const matchesLocation = !filterLocation || 
        prop.location.toLowerCase().includes(filterLocation.toLowerCase());
      const matchesBedrooms = !filterBedrooms || 
        prop.bedrooms === parseInt(filterBedrooms);
      const matchesType = !filterType || 
        prop.type.toLowerCase() === filterType.toLowerCase();
      return matchesLocation && matchesBedrooms && matchesType;
    });
  };

  const processedProperties = sortProperties(filterProperties(savedProperties));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Saved Properties</h1>
        <Link
          href="/properties"
          className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
        >
          Browse Properties
        </Link>
      </div>

      {/* Sorting and Filtering Controls */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Default</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="rating-desc">Rating (High to Low)</option>
              <option value="reviews-desc">Most Reviewed</option>
            </select>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-primary hover:text-primary/80"
          >
            <Filter className="h-5 w-5 mr-1" />
            Filters
            <ChevronDown
              className={`h-4 w-4 ml-1 transform transition-transform duration-200 ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                placeholder="e.g., New York"
                className="mt-1 w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Bedrooms
              </label>
              <select
                value={filterBedrooms}
                onChange={(e) => setFilterBedrooms(e.target.value)}
                className="mt-1 w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3+</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Property Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="mt-1 w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="loft">Loft</option>
                <option value="villa">Villa</option>
                <option value="cabin">Cabin</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Properties Grid */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        {processedProperties.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">No saved properties found</p>
            <p className="text-sm">
              {filterLocation || filterBedrooms || filterType
                ? "Try adjusting your filters"
                : "Start exploring to save your favorites!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 divide-y divide-gray-200">
            {processedProperties.map((property) => (
              <div
                key={property.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-32 h-24 object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {property.title}
                      </h3>
                      <button
                        onClick={() => handleRemoveProperty(property.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {property.priceDisplay}
                      </div>
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          {property.bedrooms} Beds
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          {property.bathrooms} Baths
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-medium text-gray-900">
                        {property.rating}
                      </span>
                      <span className="text-gray-600">
                        ({property.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/properties/${property.id}`}
                    className="flex items-center text-primary hover:text-primary/80 transition-colors"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {processedProperties.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-sm text-gray-600">Saved Properties</p>
            <p className="text-2xl font-semibold text-gray-900">
              {processedProperties.length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-sm text-gray-600">Average Price</p>
            <p className="text-2xl font-semibold text-gray-900">
              ${Math.round(
                processedProperties.reduce((sum, prop) => sum + prop.price, 0) /
                  processedProperties.length
              )}
              /night
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-sm text-gray-600">Average Rating</p>
            <p className="text-2xl font-semibold text-gray-900">
              {(
                processedProperties.reduce((sum, prop) => sum + prop.rating, 0) /
                processedProperties.length
              ).toFixed(1)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}