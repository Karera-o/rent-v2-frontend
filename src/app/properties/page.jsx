'use client';

import PropertiesGrid from '@/components/properties/PropertiesGrid';

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header - Minimalist and Elegant with Dark Background */}
      <div className="py-24 bg-gradient-to-b from-[#111827] to-[#1f2937]">
        <div className="container-responsive">
          <div className="text-center mb-4">
            <span className="text-xs uppercase tracking-widest text-gray-300 mb-3 block">Discover Properties</span>
            <h1 className="text-3xl font-light text-white relative inline-block">
              Find Your Perfect Rental Property
            </h1>
            <div className="mt-4 mx-auto w-16 h-px bg-white/40"></div>
            <p className="mt-6 text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Browse our curated collection of premium rental properties across Rwanda
            </p>
          </div>
        </div>
      </div>

      <div className="container-responsive py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* PropertiesGrid component handles both the sidebar filters and the properties display */}
          <PropertiesGrid />
        </div>
      </div>
    </div>
  )
}
