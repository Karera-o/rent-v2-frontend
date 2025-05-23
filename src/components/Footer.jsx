import Link from 'next/link'
import { cn } from '@/lib/utils'

const Footer = ({ className }) => {
  return (
    <footer className={cn("relative bg-gradient-to-b from-[#111827] to-[#1f2937] text-white", className)}>

      <div className="relative container-responsive py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              HouseRental
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Find your perfect rental home with our easy-to-use platform. We connect tenants with quality properties.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="bg-white/10 p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-200">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="group text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="bg-white/10 p-1 rounded mr-2 group-hover:bg-white/20 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="group text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="bg-white/10 p-1 rounded mr-2 group-hover:bg-white/20 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="group text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="bg-white/10 p-1 rounded mr-2 group-hover:bg-white/20 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="group text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="bg-white/10 p-1 rounded mr-2 group-hover:bg-white/20 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-200">Property Types</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/properties?type=apartment"
                  className="group text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="bg-white/10 p-1 rounded mr-2 group-hover:bg-white/20 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </span>
                  Apartments
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=house"
                  className="group text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="bg-white/10 p-1 rounded mr-2 group-hover:bg-white/20 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </span>
                  Houses
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=villa"
                  className="group text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="bg-white/10 p-1 rounded mr-2 group-hover:bg-white/20 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </span>
                  Villas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-200">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <span className="bg-white/10 p-2 rounded mr-3 group-hover:bg-white/20 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <span className="text-gray-300">123 Rental Street, City, Country</span>
              </li>
              <li className="flex items-start group">
                <span className="bg-white/10 p-2 rounded mr-3 group-hover:bg-white/20 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <span className="text-gray-300">info@houserental.com</span>
              </li>
              <li className="flex items-start group">
                <span className="bg-white/10 p-2 rounded mr-3 group-hover:bg-white/20 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <span className="text-gray-300">(123) 456-7890</span>
              </li>
              <li className="mt-6">
                <div className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors duration-300">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-200">Subscribe to our newsletter</p>
                      <p className="text-xs text-gray-400 mt-1">Get the latest updates and offers</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} HouseRental. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
