import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

// Featured locations in Rwanda
const rwandaDestinations = [
  {
    id: 1,
    name: 'Kigali',
    description: 'Rwanda\'s vibrant capital with modern amenities and cultural attractions',
    image: '/home page/kigali.jpg',
    properties: 48
  },
  {
    id: 2,
    name: 'Musanze',
    description: 'Gateway to Volcanoes National Park and gorilla trekking adventures',
    image: '/home page/Musanze.jpg',
    properties: 24
  },
  {
    id: 3,
    name: 'Rubavu',
    description: 'Beautiful lakeside town with beaches on Lake Kivu',
    image: '/home page/Gisenyi.jpg',
    properties: 16
  }
]

const DestinationCard = ({ destination }) => {
  return (
    <Link href={`/properties?location=${destination.name}`} className="block group">
      <div className="relative h-80 sm:h-96 overflow-hidden">
        {/* Elegant border that appears on hover */}
        <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

        {/* Destination Image with subtle hover effect */}
        <div className="absolute inset-0">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-1000 ease-out group-hover:scale-105"
          />
          {/* Elegant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
        </div>

        {/* Content with minimalist design */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
          {/* Location name with elegant typography */}
          <h3 className="text-2xl font-light text-white mb-2">{destination.name}</h3>

          {/* Description with refined styling */}
          <p className="text-white/80 text-sm mb-4 line-clamp-2 max-w-xs">{destination.description}</p>

          {/* Property count with minimal badge */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center border border-white/30 px-3 py-1.5 backdrop-blur-sm">
              <span className="text-white text-xs">{destination.properties} properties</span>
            </div>

            {/* Explore button with animated arrow */}
            <div className="flex items-center text-white text-sm group/btn">
              <span className="mr-2 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">Explore</span>
              <span className="transform transition-transform duration-300 group-hover/btn:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

const PopularDestinations = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container-responsive">
        {/* Elegant section header */}
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-widest text-gray-500 mb-3 block">Explore Rwanda</span>
          <h2 className="text-3xl font-light text-[#111827] relative inline-block">
            Popular Destinations
          </h2>
          <div className="mt-4 mx-auto w-16 h-px bg-[#111827]"></div>
          <p className="mt-6 text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore properties in these trending locations across Rwanda
          </p>
        </div>

        {/* Destinations grid with alignment matching footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {rwandaDestinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularDestinations
