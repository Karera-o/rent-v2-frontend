"use client"

import { useState } from 'react'
import Image from 'next/image'

// Fallback image for properties without images
const fallbackImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80'

const PropertyImage = ({ src, alt, width = 500, height = 300, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src)
  const [error, setError] = useState(false)

  // Function to handle image load error
  const handleError = () => {
    if (!error) {
      setImgSrc(fallbackImage)
      setError(true)
    }
  }

  // Prepend the backend URL to the image path if it's a relative URL
  // Remove '/api' from the end of NEXT_PUBLIC_API_URL since media files are served from the base URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
    : 'http://localhost:8001';

  const imageUrl = src && !src.startsWith('http') && !src.startsWith('data:')
    ? `${baseUrl}${src}`
    : src

  // Check if fill prop is passed, if so, don't pass width and height
  const hasFill = props.fill === true

  return (
    <Image
      {...props}
      src={error ? fallbackImage : imageUrl}
      alt={alt || 'Property image'}
      onError={handleError}
      unoptimized={true} // Skip Next.js image optimization for external URLs
      {...(!hasFill ? { width, height } : {})}
    />
  )
}

export default PropertyImage
