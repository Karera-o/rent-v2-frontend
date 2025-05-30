"use client";

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button.jsx'
import AdvancedSearchBar from '@/components/AdvancedSearchBar'

const HeroAlt = ({ onSearchResults, onSearchStart }) => {
  return (
    <div className="relative">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0 h-[650px] md:h-[700px]">
        <div className="relative h-full w-full">
          <Image
            src="https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
            alt="Beautiful Rwandan landscape with modern homes"
            fill
            style={{ objectFit: 'cover' }}
            priority
            className="transition-opacity duration-700 opacity-90"
          />
          {/* Darker gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/50" />
        </div>
      </div>

      {/* Hero Content with minimalist design */}
      <div className="relative z-10 container-responsive pt-28 pb-40 md:pt-40 md:pb-48">
        <div className="max-w-4xl mx-auto text-center">
          {/* Thin decorative line above heading */}
          <div className="w-16 h-px bg-white/70 mx-auto mb-8"></div>

          {/* Elegant typography with text shadow for better visibility */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-8 tracking-tight drop-shadow-md">
            Find Your Perfect Home in Rwanda
          </h1>

          {/* Description with subtle background for better visibility */}
          <p className="text-lg  text-white mb-0 max-w-2xl mx-auto leading-relaxed px-6 py-3 bg-black/30 backdrop-blur-sm inline-block">
            Discover beautiful rental properties across Rwanda. From modern apartments in Kigali to
            scenic homes near Volcanoes National Park, your ideal home awaits.
          </p>
        </div>
      </div>

      {/* Search Bar with elegant styling */}
      <div className="relative z-20 container-responsive -mt-20 md:-mt-24 mb-8">
        <div className="max-w-5xl mx-auto">
          <AdvancedSearchBar
            className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-xl"
            onSearchResults={onSearchResults}
            onSearchStart={() => {
              if (onSearchStart) onSearchStart();
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default HeroAlt
