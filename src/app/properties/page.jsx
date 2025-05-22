'use client';

import PropertiesGrid from '@/components/properties/PropertiesGrid';

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111827]/5 to-white">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#111827] to-[#1f2937] text-white py-16">
        <div className="container-responsive">
          <h1 className="text-4xl font-bold text-center">Find Your Perfect Rental Property</h1>
          <p className="mt-4 text-xl text-center max-w-3xl mx-auto opacity-90">
            Browse our extensive collection of rental properties and find your next home.
          </p>
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
