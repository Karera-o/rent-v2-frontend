import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button.jsx'
import { Home as HomeIcon, Building, Castle, Warehouse, Trees, Building2 } from 'lucide-react'
import HeroAlt from '@/components/HeroAlt.jsx'
import PropertySearchResults from '@/components/PropertySearchResults.jsx'
import HowItWorks from '@/components/HowItWorks.jsx'
import PopularDestinations from '@/components/PopularDestinations.jsx'
import PropertyShowcase from '@/components/PropertyShowcase.jsx'

// Featured property categories for quick navigation in Rwanda
const propertyCategories = [
  {
    name: 'Apartments',
    icon: <Building className="h-6 w-6 mb-3 text-[#111827] group-hover:text-white transition-colors duration-300" />,
    query: 'property_type=apartment'
  },
  {
    name: 'Houses',
    icon: <HomeIcon className="h-6 w-6 mb-3 text-[#111827] group-hover:text-white transition-colors duration-300" />,
    query: 'property_type=house'
  },
  {
    name: 'Villas',
    icon: <Castle className="h-6 w-6 mb-3 text-[#111827] group-hover:text-white transition-colors duration-300" />,
    query: 'property_type=villa'
  },
  {
    name: 'Studios',
    icon: <Warehouse className="h-6 w-6 mb-3 text-[#111827] group-hover:text-white transition-colors duration-300" />,
    query: 'property_type=studio'
  },
  {
    name: 'Compounds',
    icon: <Trees className="h-6 w-6 mb-3 text-[#111827] group-hover:text-white transition-colors duration-300" />,
    query: 'property_type=compound'
  },
  {
    name: 'Bungalows',
    icon: <Building2 className="h-6 w-6 mb-3 text-[#111827] group-hover:text-white transition-colors duration-300" />,
    query: 'property_type=bungalow'
  }
];

export default function Home() {
  return (
    <>
      <HeroAlt />

      {/* Featured Categories Section */}
      <div className="bg-white py-12 mt-24 pt-12">
        <div className="container-responsive">
          <h2 className="text-2xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-[#111827] to-[#1f2937]">
            Browse by Property Type
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {propertyCategories.map((category, index) => (
              <Link
                key={index}
                href={`/properties?${category.query}`}
                className="group flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:bg-[#111827] hover:border-[#111827] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {category.icon}
                <span className="text-sm font-medium text-gray-700 group-hover:text-white transition-colors duration-300">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Property Search Results Section */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="container-responsive">
          <PropertySearchResults limit={8} />
        </div>
      </div>

      <HowItWorks />
      <PropertyShowcase />
      <PopularDestinations />
    </>
  )
}
