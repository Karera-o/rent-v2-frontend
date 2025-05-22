import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button.jsx'
import Hero from '@/components/Hero.jsx'
import FeaturedProperties from '@/components/FeaturedProperties.jsx'
import HowItWorks from '@/components/HowItWorks.jsx'
import Testimonials from '@/components/Testimonials.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProperties />
      <HowItWorks />
      <Testimonials />
    </>
  )
}
