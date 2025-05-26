"use client";

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx'
import { Home as HomeIcon, Building, Castle, Warehouse, Trees, Building2 } from 'lucide-react'
import HeroAlt from '@/components/HeroAlt.jsx'
import PropertySearchResults from '@/components/PropertySearchResults.jsx'
import HowItWorks from '@/components/HowItWorks.jsx'
import PopularDestinations from '@/components/PopularDestinations.jsx'
import PropertyShowcase from '@/components/PropertyShowcase.jsx'

// Featured property categories with elegant styling
const propertyCategories = [
  {
    name: 'Apartments',
    icon: <Building className="h-5 w-5 text-[#111827] transition-colors duration-300" />,
    query: 'property_type=apartment'
  },
  {
    name: 'Houses',
    icon: <HomeIcon className="h-5 w-5 text-[#111827] transition-colors duration-300" />,
    query: 'property_type=house'
  },
  {
    name: 'Villas',
    icon: <Castle className="h-5 w-5 text-[#111827] transition-colors duration-300" />,
    query: 'property_type=villa'
  },
  {
    name: 'Studios',
    icon: <Warehouse className="h-5 w-5 text-[#111827] transition-colors duration-300" />,
    query: 'property_type=studio'
  },
  {
    name: 'Compounds',
    icon: <Trees className="h-5 w-5 text-[#111827] transition-colors duration-300" />,
    query: 'property_type=compound'
  },
  {
    name: 'Bungalows',
    icon: <Building2 className="h-5 w-5 text-[#111827] transition-colors duration-300" />,
    query: 'property_type=bungalow'
  }
];

export default function Home() {
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Handle search results from AdvancedSearchBar
  const handleSearchResults = (results) => {
    setSearchResults(results);
    setIsSearching(false);

    // Scroll to results section
    if (results) {
      setTimeout(() => {
        const resultsSection = document.getElementById('property-results');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <>
      <HeroAlt
        onSearchStart={() => setIsSearching(true)}
        onSearchResults={handleSearchResults}
      />

      {/* Featured Categories Section - Elegant Minimalist Design */}
      <div className="bg-white py-20 mt-16">
        <div className="container-responsive">
          {/* Elegant section header */}
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-gray-500 mb-3 block">Explore Options</span>
            <h2 className="text-3xl font-light text-[#111827] relative inline-block">
              Browse by Property Type
            </h2>
            <div className="mt-4 mx-auto w-16 h-px bg-[#111827]"></div>
          </div>

          {/* Refined category grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 max-w-5xl mx-auto">
            {propertyCategories.map((category, index) => (
              <Link
                key={index}
                href={`/properties?${category.query}`}
                className="group flex flex-col items-center justify-center p-6 border border-gray-100 hover:border-[#111827] transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle background highlight on hover */}
                <div className="absolute inset-0 bg-[#111827]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Icon with refined styling */}
                <div className="relative mb-4 p-3 rounded-full bg-gray-50 group-hover:bg-white transition-colors duration-300">
                  {category.icon}
                </div>

                {/* Category name with elegant typography */}
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#111827] transition-colors duration-300 relative">
                  {category.name}
                </span>

                {/* Animated underline on hover */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-px bg-[#111827] transition-all duration-300 group-hover:w-12"></div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Property Search Results Section - Refined Design */}
      <div id="property-results" className="bg-white py-24">
        <div className="container-responsive">
          <PropertySearchResults
            limit={8}
            searchResults={searchResults}
            isSearching={isSearching}
          />
        </div>
      </div>

      <HowItWorks />
      <PropertyShowcase />
      <PopularDestinations />
    </>
  )
}
