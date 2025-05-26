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
import PropertyService from '@/services/property';
import { useToast } from '@/components/ui/use-toast';

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

const AdvancedSearchBar = ({ className, variant = "default", onSearchResults, onSearchStart }) => {
  const router = useRouter();
  const { toast } = useToast();
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
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // Fetch properties based on search criteria
  const fetchProperties = async () => {
    setLoading(true);

    try {
      // Format search parameters according to the API documentation
      const searchParams = {};

      // Handle location/city search
      if (location) {
        // Extract city name from location (e.g., "Kigali, Rwanda" -> "Kigali")
        const city = location.split(',')[0].trim();
        
        // Add general query parameter for general search
        searchParams.query = city;
        
        // Add specific city parameter with proper capitalization
        searchParams.city = city;
      }

      // Handle property type - use the label (capitalized) instead of value
      if (filters.propertyType) {
        const selectedType = propertyTypes.find(type => type.value === filters.propertyType);
        searchParams.property_type = selectedType ? selectedType.label : filters.propertyType;
      }

      // Handle bedrooms (will find properties with X+ bedrooms)
      if (filters.bedrooms) {
        searchParams.bedrooms = filters.bedrooms;
      }

      // Handle price range in format "min-max" (e.g., "200-500")
      if (filters.minPrice > 0 || filters.maxPrice < 5000) {
        const minPrice = filters.minPrice;
        // If maxPrice is the max value (5000), use 'any' to indicate no upper limit
        const maxPrice = filters.maxPrice === 5000 ? 'any' : filters.maxPrice;
        searchParams.price_range = `${minPrice}-${maxPrice}`;
      }

      // Handle pagination if needed
      searchParams.page = 1;
      searchParams.page_size = 8; // Default to 8 results for the homepage

      console.log('Searching with params:', searchParams);

      // Fetch properties with the search parameters
      const response = await PropertyService.getAllProperties(searchParams);

      // Update search results
      setSearchResults(response);

      // If onSearchResults callback is provided, pass the results to parent component
      if (onSearchResults) {
        onSearchResults(response);
      }

      // Show success toast if no results
      if (response.results.length === 0) {
        toast({
          title: "No properties found",
          description: "Try adjusting your search criteria.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error searching properties:', error);
      toast({
        title: "Search failed",
        description: "Failed to search properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search submission
  const handleSearch = () => {
    // If we're searching directly on the home page
    if (onSearchResults) {
      // Notify parent that search is starting
      if (onSearchStart) {
        onSearchStart();
      }
      fetchProperties();
    } else {
      // Build query parameters for navigation
      const params = new URLSearchParams();

      if (location) {
        // Extract city name from location (e.g., "Kigali, Rwanda" -> "Kigali")
        const city = location.split(',')[0].trim();
        params.append('query', city);
        params.append('city', city);
      }
      
      // Handle property type - use the label (capitalized) instead of value
      if (filters.propertyType) {
        const selectedType = propertyTypes.find(type => type.value === filters.propertyType);
        params.append('property_type', selectedType ? selectedType.label : filters.propertyType);
      }
      
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
      
      if (filters.minPrice > 0 || filters.maxPrice < 5000) {
        const minPrice = filters.minPrice;
        // If maxPrice is the max value (5000), use 'any' to indicate no upper limit
        const maxPrice = filters.maxPrice === 5000 ? 'any' : filters.maxPrice;
        params.append('price_range', `${minPrice}-${maxPrice}`);
      }

      // Navigate to properties page with filters
      router.push(`/properties?${params.toString()}`);
    }
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
    
    // Close filters panel if open
    setActiveFilter(null);
    
    // If we're on the search results page and have a callback, trigger a new search
    if (onSearchResults) {
      // Notify parent that search is starting
      if (onSearchStart) {
        onSearchStart();
      }
      
      // Small delay to ensure state is updated before search
      setTimeout(() => {
        // Use empty search params to get default results
        PropertyService.getAllProperties({
          page: 1,
          page_size: 8
        }).then(response => {
          if (onSearchResults) {
            onSearchResults(response);
          }
        }).catch(error => {
          console.error('Error fetching properties after reset:', error);
          toast({
            title: "Search failed",
            description: "Failed to refresh properties. Please try again.",
            variant: "destructive",
          });
        });
      }, 100);
    }
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
    ? "bg-white"
    : variant === "minimal"
      ? "bg-transparent"
      : "bg-transparent";

  // Check if any filters are applied
  const hasActiveFilters = () => {
    return (
      location !== '' || 
      filters.propertyType !== '' || 
      filters.bedrooms !== null || 
      filters.minPrice > 0 || 
      filters.maxPrice < 5000
    );
  };

  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (location !== '') count++;
    if (filters.propertyType !== '') count++;
    if (filters.bedrooms !== null) count++;
    if (filters.minPrice > 0 || filters.maxPrice < 5000) count++;
    return count;
  };

  return (
    <div className={`${containerStyles} ${className}`}>
      <div className="flex flex-col md:flex-row md:items-end">
        {/* Location Search with elegant minimal styling */}
        <div className="relative p-4 md:p-6 flex-grow">
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <input
              ref={locationInputRef}
              type="text"
              placeholder="Where are you going?"
              value={location}
              onChange={handleLocationChange}
              onFocus={() => location.length > 1 && setShowSuggestions(true)}
              className="pl-10 pr-4 py-2.5 w-full border-b border-gray-200 focus:border-[#111827] focus:outline-none transition-all duration-200 bg-transparent"
            />

            {/* Location Suggestions with elegant styling */}
            {showSuggestions && (
              <div
                ref={suggestionsRef}
                className="absolute z-10 mt-1 w-full bg-white shadow-lg border border-gray-100 max-h-60 overflow-auto"
              >
                {locationSuggestions.length > 0 ? (
                  locationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center transition-colors duration-150"
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      <MapPin className="h-3.5 w-3.5 mr-2 text-gray-400" />
                      <span className="text-sm">{suggestion}</span>
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

        {/* Filters Button with minimal design */}
        <div className="p-4 md:p-6 md:pl-8">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs uppercase tracking-wider text-gray-500">Filters</label>
            {hasActiveFilters() && (
              <button 
                onClick={resetFilters}
                className="text-xs text-[#111827] hover:underline flex items-center"
              >
                Clear All
              </button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={handleFilterClick}
            className={`w-full justify-between border-gray-200 hover:border-[#111827] transition-all duration-200 bg-transparent ${
              hasActiveFilters() 
                ? 'border-[#111827]' 
                : ''
            }`}
          >
            <div className="flex items-center">
              <Filter className={`h-3.5 w-3.5 mr-2 ${hasActiveFilters() ? 'text-[#111827]' : 'text-gray-500'}`} />
              <span className={`text-sm ${hasActiveFilters() ? 'text-[#111827] font-medium' : 'text-gray-700'}`}>
                {hasActiveFilters() ? `Filters (${countActiveFilters()})` : 'Add filters'}
              </span>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 ${hasActiveFilters() ? 'text-[#111827]' : 'text-gray-400'}`} />
          </Button>
        </div>

        {/* Search Button with elegant styling */}
        <div className="p-4 md:p-6 md:pl-8">
          <label className="block text-xs uppercase tracking-wider text-transparent mb-2">Search</label>
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="w-full border border-[#111827] bg-[#111827] hover:bg-transparent hover:text-[#111827] text-white transition-all duration-300"
          >
            {loading ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-sm">Searching...</span>
              </>
            ) : (
              <>
                <Search className="h-3.5 w-3.5 mr-2" />
                <span className="text-sm">Search</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Elegant Filters Panel */}
      {activeFilter === 'filters' && (
        <div className="mt-4 p-8 bg-white border border-gray-100 shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Refine Search</span>
              <h3 className="font-light text-lg text-[#111827]">Filters</h3>
            </div>
            <button onClick={() => setActiveFilter(null)} className="text-gray-400 hover:text-[#111827] transition-colors duration-200">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Property Type with elegant styling */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Property Type</label>
              <select
                className="w-full p-2.5 border-b border-gray-200 focus:border-[#111827] focus:outline-none transition-all duration-200 bg-transparent text-sm"
                value={filters.propertyType}
                onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
              >
                <option value="">Any Type</option>
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Bedrooms with minimal styling */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Bedrooms</label>
              <select
                className="w-full p-2.5 border-b border-gray-200 focus:border-[#111827] focus:outline-none transition-all duration-200 bg-transparent text-sm"
                value={filters.bedrooms || ''}
                onChange={(e) => setFilters({...filters, bedrooms: e.target.value ? parseInt(e.target.value) : null})}
              >
                <option value="">Any</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            {/* Price Range with elegant styling */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Price Range</label>
              <select
                className="w-full p-2.5 border-b border-gray-200 focus:border-[#111827] focus:outline-none transition-all duration-200 bg-transparent text-sm"
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

          {/* Action buttons with elegant styling */}
          <div className="mt-10 flex justify-between items-center">
            {/* Clear Filters Button */}
            <Button
              onClick={resetFilters}
              variant="outline"
              className="border border-gray-200 text-gray-500 hover:text-[#111827] hover:border-[#111827] transition-all duration-300"
            >
              <span className="text-sm">Clear Filters</span>
            </Button>
            
            {/* Apply Button */}
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="border border-[#111827] bg-[#111827] hover:bg-transparent hover:text-[#111827] text-white transition-all duration-300 px-8"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span className="text-sm">Searching...</span>
                </>
              ) : (
                <span className="text-sm">Apply Filters</span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchBar;
