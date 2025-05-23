import { Search, Home, Key, Calendar, FileCheck, Shield } from 'lucide-react'

const steps = [
  {
    id: 1,
    title: 'Search Properties',
    description: 'Browse our curated collection of premium rental properties in Rwanda. Use advanced filters to find your ideal home based on location, price, and amenities.',
    icon: Search,
  },
  {
    id: 2,
    title: 'Book a Viewing',
    description: 'Schedule an in-person or virtual viewing with our responsive property owners. Get all your questions answered before making any decisions.',
    icon: Calendar,
  },
  {
    id: 3,
    title: 'Move In',
    description: 'Complete the secure online rental agreement, make your payment, and receive the keys to your new Rwandan home. Our support team is available throughout the process.',
    icon: Key,
  },
]

const StepCard = ({ step }) => {
  const Icon = step.icon

  return (
    <div className="group flex flex-col items-center text-center p-8 bg-white border border-gray-100 relative transition-all duration-500 hover:border-[#111827]">
      {/* Step number with elegant positioning */}
      <div className="absolute -top-4 right-4 text-4xl font-light text-gray-100 group-hover:text-gray-200 transition-colors duration-500">
        {step.id}
      </div>

      {/* Icon with minimal styling */}
      <div className="relative mb-6 w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 border border-gray-200 rounded-full group-hover:border-[#111827] transition-colors duration-300"></div>
        <Icon size={24} className="text-[#111827]" />
      </div>

      {/* Title with elegant typography */}
      <h3 className="text-xl font-light mb-4 text-[#111827]">{step.title}</h3>

      {/* Description with refined text styling */}
      <p className="text-gray-600 leading-relaxed text-sm">{step.description}</p>

      {/* Subtle line decoration that appears on hover */}
      <div className="mt-6 w-0 h-px bg-[#111827] transition-all duration-500 group-hover:w-16"></div>
    </div>
  )
}

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container-responsive">
        {/* Elegant section header */}
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-widest text-gray-500 mb-3 block">Simple Process</span>
          <h2 className="text-3xl font-light text-[#111827] relative inline-block">
            How It Works
          </h2>
          <div className="mt-4 mx-auto w-16 h-px bg-[#111827]"></div>
          <p className="mt-6 text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Finding and renting your perfect home in Rwanda is simple and secure with our streamlined three-step process.
          </p>
        </div>

        {/* Steps with refined grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {steps.map((step) => (
            <StepCard key={step.id} step={step} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
