import Link from 'next/link'
import Image from 'next/image'

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
    <Link href={`/properties?location=${destination.name}`}>
      <div className="group relative h-80 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
        {/* Destination Image */}
        <div className="absolute inset-0">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{destination.name}</h3>
              <p className="text-white/80 text-sm mb-2 line-clamp-2">{destination.description}</p>
              <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                <span className="text-white text-sm font-medium">{destination.properties} properties</span>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#111827]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

const PopularDestinations = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#111827]/5">
      <div className="container-responsive">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#111827] to-[#1f2937]">Popular Destinations</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#111827] to-[#1f2937] mx-auto mt-2 mb-6 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore properties in these trending locations across Rwanda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rwandaDestinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularDestinations
