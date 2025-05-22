"use client"

import Link from 'next/link'
import { Home } from 'lucide-react'
import useIsPWA from '@/hooks/useIsPWA'

export default function HomeLink() {
  const isPWA = useIsPWA();

  // Don't render the component at all in PWA mode
  if (isPWA) {
    return null;
  }

  return (
    <div className="absolute top-4 left-4 z-10">
      <Link
        href="/"
        className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 group text-gray-700 hover:text-[#111627]"
      >
        <Home className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>
    </div>
  )
}