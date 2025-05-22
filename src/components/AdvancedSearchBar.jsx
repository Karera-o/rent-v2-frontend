"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Home,
  BedDouble,
  Bath,
  DollarSign,
  Filter,
  X,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock location suggestions for Rwanda - in a real app, this would come from an API
const LOCATION_SUGGESTIONS = [
  "Kigali, Rwanda",
  "Musanze, Rwanda",
  "Rubavu, Rwanda",
  "Huye, Rwanda",
  "Muhanga, Rwanda",
  "Nyagatare, Rwanda",
  "Rusizi, Rwanda",
  "Nyanza, Rwanda",
  "Rwamagana, Rwanda",
  "Karongi, Rwanda"
];

const AdvancedSearchBar = ({ className, variant = "default" }) => {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filters, setFilters] = useState({
    propertyType: '',
    minPrice: 0,
    maxPrice: 5000,
    bedrooms: null,
    bathrooms: null
  });

  const locationInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Property type options for Rwanda
  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'studio', label: 'Studio' },
    { value: 'compound', label: 'Compound' },
    { value: 'bungalow', label: 'Bungalow' }
  ];

  // Handle location input change
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);

    if (value.length > 1) {
      // Filter suggestions based on input
      const filtered = LOCATION_SUGGESTIONS.filter(
        suggestion => suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    setLocation(suggestion);
    setShowSuggestions(false);
  };

  // Handle property type selection
  const handlePropertyTypeSelect = (type) => {
    setFilters(prev => ({
      ...prev,
      propertyType: prev.propertyType === type ? '' : type
    }));
  };

  // Handle bedroom/bathroom selection
  const handleRoomSelect = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? null : value
    }));
  };

  // Handle price range change
  const handlePriceChange = (value) => {
    setFilters(prev => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1]
    }));
  };

  // Handle search submission
  const handleSearch = () => {
    // Build query parameters
    const params = new URLSearchParams();

    if (location) params.append('location', location);
    if (filters.propertyType) params.append('property_type', filters.propertyType);
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
    if (filters.bathrooms) params.append('bathrooms', filters.bathrooms);
    if (filters.minPrice > 0) params.append('min_price', filters.minPrice);
    if (filters.maxPrice < 5000) params.append('max_price', filters.maxPrice);

    // Navigate to properties page with filters
    router.push(`/properties?${params.toString()}`);
  };

  // Handle filter button click
  const handleFilterClick = () => {
    setActiveFilter('filters');
  };

  // Reset all filters
  const resetFilters = () => {
    setLocation('');
    setFilters({
      propertyType: '',
      minPrice: 0,
      maxPrice: 5000,
      bedrooms: null,
      bathrooms: null
    });
    setActiveFilter(null);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Determine styles based on variant
  const containerStyles = variant === "default"
    ? "bg-white rounded-xl shadow-xl"
    : variant === "minimal"
      ? "bg-transparent"
      : "bg-transparent";

  return (
    <div className={`${containerStyles} ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:divide-x md:divide-gray-200">
        {/* Location Search */}
        <div className="relative p-3 md:p-4 flex-grow">
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={locationInputRef}
              type="text"
              placeholder="Where are you going?"
              value={location}
              onChange={handleLocationChange}
              onFocus={() => location.length > 1 && setShowSuggestions(true)}
              className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111827] focus:border-[#111827] transition-all duration-200"
            />

            {/* Location Suggestions with improved styling */}
            {showSuggestions && (
              <div
                ref={suggestionsRef}
                className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto"
              >
                {locationSuggestions.length > 0 ? (
                  locationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center transition-colors duration-150"
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                      {suggestion}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    Type to search locations...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Filters Button */}
        <div className="p-3 md:p-4 md:pl-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filters</label>
          <Button
            variant="outline"
            onClick={handleFilterClick}
            className="w-full justify-between border-gray-300 hover:border-[#111827] transition-colors duration-200"
          >
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-700">Add filters</span>
            </div>
            <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
          </Button>
        </div>

        {/* Search Button with enhanced styling */}
        <div className="p-3 md:p-4 md:pl-6">
          <label className="block text-sm font-medium text-transparent mb-1">Search</label>
          <Button
            onClick={handleSearch}
            className="w-full bg-[#111827] hover:bg-[#1f2937] transition-colors duration-200"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {activeFilter === 'filters' && (
        <div className="mt-4 p-6 bg-white rounded-lg border border-gray-200 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium text-lg text-gray-900">Filters</h3>
            <button onClick={() => setActiveFilter(null)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111827] focus:border-[#111827]"
                value={filters.propertyType}
                onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
              >
                <option value="">Any Type</option>
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111827] focus:border-[#111827]"
                value={filters.bedrooms || ''}
                onChange={(e) => setFilters({...filters, bedrooms: e.target.value ? parseInt(e.target.value) : null})}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111827] focus:border-[#111827]"
                value={`${filters.minPrice}-${filters.maxPrice === 5000 ? 'any' : filters.maxPrice}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-');
                  setFilters({
                    ...filters,
                    minPrice: parseInt(min),
                    maxPrice: max === 'any' ? 5000 : parseInt(max)
                  });
                }}
              >
                <option value="0-any">Any Price</option>
                <option value="0-100">$0 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="200-500">$200 - $500</option>
                <option value="500-1000">$500 - $1000</option>
                <option value="1000-any">$1000+</option>
              </select>
            </div>
          </div>

          {/* Apply Button */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSearch}
              className="bg-[#111827] hover:bg-[#1f2937] text-white"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchBar;
