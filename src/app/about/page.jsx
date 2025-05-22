import Image from 'next/image'
import { Button } from '@/components/ui/button.jsx'
import Link from 'next/link'
import { 
  ShieldCheck, 
  Users, 
  Clock, 
  HeartHandshake,
  BadgeCheck,
  Banknote,
  Home,
  MessageSquare
} from "lucide-react";

// Team members data
const teamMembers = [
  {
    name: 'Jessica Thompson',
    role: 'CEO & Founder',
    bio: 'Jessica has over 15 years of experience in real estate and property management. She founded HouseRental with the vision of making the rental process simple and transparent for everyone.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
  },
  {
    name: 'David Wilson',
    role: 'Chief Operations Officer',
    bio: 'David oversees the day-to-day operations of HouseRental, ensuring that both property owners and tenants receive exceptional service and support throughout the rental process.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
  },
  {
    name: 'Michael Brown',
    role: 'Head of Property Management',
    bio: 'Michael leads our property management team, working closely with property owners to ensure their investments are well-maintained and profitable while providing tenants with comfortable homes.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
  {
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    bio: 'Sarah develops and implements our marketing strategies, helping property owners showcase their properties effectively and connecting tenants with their perfect rental homes.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
  },
];

// Company values
const values = [
  {
    title: 'Transparency',
    description: 'We believe in clear, honest communication with both property owners and tenants. No hidden fees, no surprises.',
    icon: <ShieldCheck className="h-6 w-6 text-white" />,
  },
  {
    title: 'Community',
    description: 'Building lasting relationships between landlords and tenants, creating a trusted rental community.',
    icon: <Users className="h-6 w-6 text-white" />,
  },
  {
    title: 'Reliability',
    description: 'Quick responses and dependable service. We\'re here when you need us, every step of the way.',
    icon: <Clock className="h-6 w-6 text-white" />,
  },
  {
    title: 'Trust',
    description: 'Every property is verified and every user is validated. Your safety and security are our priority.',
    icon: <HeartHandshake className="h-6 w-6 text-white" />,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111827]/5 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#111827] to-[#1f2937] text-white py-20">
        <div className="container-responsive text-center">
          <h1 className="text-4xl font-bold mb-4">About HouseRental</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We're on a mission to make finding and renting your perfect home simple, transparent, and stress-free.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="container-responsive py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#111827] to-[#1f2937]">Our Story</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Founded in 2018, HouseRental was born from a simple observation: finding and renting a home should be an exciting journey, not a stressful ordeal.
              </p>
              <p>
                Our founder, Jessica Thompson, experienced firsthand the challenges of the rental market – from misleading listings to hidden fees and poor communication. She envisioned a platform that would bring transparency, quality, and efficiency to the rental process.
              </p>
              <p>
                Today, HouseRental has helped thousands of people find their perfect rental homes. We've built strong relationships with property owners who share our commitment to quality and transparency, and we continue to innovate and improve our platform to better serve both tenants and landlords.
              </p>
              <p>
                Our team of dedicated professionals works tirelessly to ensure that every property on our platform meets our high standards, and that every user receives the support they need throughout their rental journey.
              </p>
            </div>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
              alt="Our office"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-gradient-to-b from-white to-[#111827]/5 py-16">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#111827] to-[#1f2937]">Our Values</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#111827] to-[#1f2937] mx-auto mt-2 mb-6 rounded-full"></div>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do at HouseRental.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-[#111827]"
              >
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-[#111827] to-[#1f2937] p-3 rounded-full w-14 h-14 flex items-center justify-center">
                    <div className="text-white">{value.icon}</div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#111827] to-[#1f2937]">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="container-responsive py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#111827] to-[#1f2937]">Meet Our Team</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            The dedicated professionals working to make your rental experience exceptional.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-[#111827]/10">
              <div className="relative h-64 w-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#111827] mb-1">{member.name}</h3>
                <p className="text-[#1f2937] font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#111827] to-[#1f2937] text-white py-16">
        <div className="container-responsive text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Rental Home?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Browse our extensive collection of quality rental properties and start your journey to a new home today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/properties">
              <Button size="lg" className="bg-white text-[#111827] hover:bg-gray-100">
                Browse Properties
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-[#1f2937]">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
