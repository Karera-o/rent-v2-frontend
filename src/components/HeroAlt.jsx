import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button.jsx'
import AdvancedSearchBar from '@/components/AdvancedSearchBar'

const HeroAlt = () => {
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
          />
          {/* Enhanced Gradient Overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/40" />
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container-responsive pt-24 pb-36 md:pt-36 md:pb-44">
        <div className="max-w-4xl mx-auto text-center">
          {/* Added text shadow for better visibility */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
            Find Your Perfect Home in Rwanda
          </h1>
          {/* Added semi-transparent background panel for better text visibility */}
          <div className="inline-block px-6 py-3 rounded-lg bg-black/30 backdrop-blur-sm">
            <p className="text-lg md:text-xl text-white mb-0 max-w-2xl mx-auto">
              Discover beautiful rental properties across Rwanda. From modern apartments in Kigali to
              scenic homes near Volcanoes National Park, your ideal home awaits.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar - Positioned to overlap with the image and content below */}
      <div className="relative z-20 container-responsive -mt-20 md:-mt-24 mb-8">
        <div className="max-w-5xl mx-auto">
          <AdvancedSearchBar className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-100" />
        </div>
      </div>
    </div>
  )
}

export default HeroAlt
