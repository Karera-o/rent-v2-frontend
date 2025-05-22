"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home, BedDouble, Bath, DollarSign, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

const SearchBar = ({ className, variant = "default" }) => {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: '',
    minPrice: 0,
    maxPrice: 5000,
    bedrooms: null,
    bathrooms: null
  });

  // Property type options
  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'studio', label: 'Studio' },
    { value: 'duplex', label: 'Duplex' },
    { value: 'townhouse', label: 'Townhouse' }
  ];

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
  };

  // Determine styles based on variant
  const containerStyles = variant === "default" 
    ? "bg-white rounded-xl shadow-xl p-4 md:p-6" 
    : "bg-transparent";

  return (
    <div className={`${containerStyles} ${className}`}>
      {/* Main Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch">
        {/* Location Input */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Filter Button (Mobile) */}
        <div className="md:hidden">
          <Button 
            onClick={() => setShowFilters(!showFilters)} 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Property Type Dropdown (Desktop) */}
        <div className="hidden md:block">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-full min-w-[140px] flex items-center justify-between gap-2">
                <Home className="h-4 w-4" />
                <span>{filters.propertyType ? propertyTypes.find(t => t.value === filters.propertyType)?.label : 'Property Type'}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
              <div className="space-y-2">
                {propertyTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handlePropertyTypeSelect(type.value)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      filters.propertyType === type.value 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button */}
        <Button 
          onClick={handleSearch} 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
        >
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>

      {/* Expanded Filters (Mobile) */}
      {showFilters && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 md:hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Filters</h3>
            <button onClick={() => setShowFilters(false)} className="text-gray-500">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Property Type */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Property Type</h4>
            <div className="grid grid-cols-2 gap-2">
              {propertyTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handlePropertyTypeSelect(type.value)}
                  className={`px-3 py-2 text-sm border rounded-md ${
                    filters.propertyType === type.value 
                      ? 'bg-indigo-100 border-indigo-500 text-indigo-700' 
                      : 'border-gray-300'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Bedrooms */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Bedrooms</h4>
            <div className="flex gap-2">
              {[1, 2, 3, 4, '5+'].map((num) => (
                <button
                  key={num}
                  onClick={() => handleRoomSelect('bedrooms', num === '5+' ? 5 : num)}
                  className={`flex-1 py-2 border rounded-md ${
                    filters.bedrooms === (num === '5+' ? 5 : num)
                      ? 'bg-indigo-100 border-indigo-500 text-indigo-700' 
                      : 'border-gray-300'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          
          {/* Bathrooms */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Bathrooms</h4>
            <div className="flex gap-2">
              {[1, 2, 3, 4, '5+'].map((num) => (
                <button
                  key={num}
                  onClick={() => handleRoomSelect('bathrooms', num === '5+' ? 5 : num)}
                  className={`flex-1 py-2 border rounded-md ${
                    filters.bathrooms === (num === '5+' ? 5 : num)
                      ? 'bg-indigo-100 border-indigo-500 text-indigo-700' 
                      : 'border-gray-300'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          
          {/* Price Range */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Price Range</h4>
              <span className="text-sm text-gray-500">
                ${filters.minPrice} - ${filters.maxPrice}
              </span>
            </div>
            <Slider
              defaultValue={[filters.minPrice, filters.maxPrice]}
              max={5000}
              step={100}
              onValueChange={handlePriceChange}
              className="my-4"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetFilters} className="flex-1">
              Reset
            </Button>
            <Button onClick={handleSearch} className="flex-1">
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
