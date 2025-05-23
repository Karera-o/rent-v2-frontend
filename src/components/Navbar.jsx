

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button.jsx'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const Navbar = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className={cn("bg-white border-b border-gray-100 sticky top-0 z-50", className)}>
      <div className="container-responsive">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-light text-[#111827]">Clickit & Getin</h1>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-[#111827] hover:text-[#111827]">
                Home
              </Link>

              <Link href="/properties" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-[#111827] hover:text-[#111827]">
                Properties
              </Link>
              <Link href="/about" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-[#111827] hover:text-[#111827]">
                About
              </Link>
              <Link href="/contact" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-[#111827] hover:text-[#111827]">
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline" className="border-[#111827] text-[#111827] hover:bg-gray-50 rounded-none">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#111827] hover:bg-[#1f2937] rounded-none">
                Register
              </Button>
            </Link>
          </div>
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded="false"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" className="block pl-3 pr-4 py-2 text-base font-medium text-[#111827] bg-gray-50 border-l-4 border-[#111827]">
              Home
            </Link>
            <Link href="/properties" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-[#111827] hover:bg-gray-50 hover:border-[#111827] border-l-4 border-transparent">
              Properties
            </Link>
            <Link href="/about" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-[#111827] hover:bg-gray-50 hover:border-[#111827] border-l-4 border-transparent">
              About
            </Link>
            <Link href="/contact" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-[#111827] hover:bg-gray-50 hover:border-[#111827] border-l-4 border-transparent">
              Contact
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4 space-x-3">
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full border-[#111827] text-[#111827] hover:bg-gray-50 rounded-none">
                  Login
                </Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button className="w-full bg-[#111827] hover:bg-[#1f2937] rounded-none">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
