import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button.jsx'

const Hero = () => {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="container-responsive">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div className="pt-10 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Find Your Perfect</span>{' '}
                <span className="block text-gray-900 xl:inline bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-800">Rental Home</span>
              </h1>
              <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 leading-relaxed">
                Discover thousands of rental properties in your area. From cozy apartments to spacious houses, 
                we have the perfect home waiting for you.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link href="/properties">
                    <Button size="lg" className="w-full">
                      Browse Properties
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link href="/contact">
                    <Button variant="outline" size="lg" className="w-full">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full bg-gray-200 relative rounded-lg shadow-2xl overflow-hidden transform lg:-translate-x-10 lg:translate-y-10">
          <Image
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80"
            alt="Modern apartment building"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </div>
    </div>
  )
}

export default Hero
