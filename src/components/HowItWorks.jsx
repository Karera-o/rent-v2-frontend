import { Search, Home, Key } from 'lucide-react'

const steps = [
  {
    id: 1,
    title: 'Search Properties',
    description: 'Browse our extensive collection of rental properties. Use filters to find exactly what you need.',
    icon: Search,
    color: 'bg-gray-100 text-gray-600',
  },
  {
    id: 2,
    title: 'Book a Viewing',
    description: 'Found a property you like? Schedule a viewing online or contact the property owner directly.',
    icon: Home,
    color: 'bg-gray-100 text-gray-600',
  },
  {
    id: 3,
    title: 'Move In',
    description: 'Complete the rental agreement, pay your deposit, and get the keys to your new home.',
    icon: Key,
    color: 'bg-pink-100 text-pink-600',
  },
]

const StepCard = ({ step }) => {
  const Icon = step.icon
  
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-[#111827]">
      <div className={`bg-gradient-to-r from-[#111827] to-[#1f2937] text-white p-5 rounded-full mb-6 shadow-inner`}>
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#111827] to-[#1f2937]">{step.title}</h3>
      <p className="text-gray-600 leading-relaxed">{step.description}</p>
    </div>
  )
}

const HowItWorks = () => {
  return (
    <section className="pt-20 bg-gradient-to-b from-[#111827]/5 to-white">
      <div className="container-responsive">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#111827] to-[#1f2937]">How It Works</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#111827] to-[#1f2937] mx-auto mt-2 mb-6 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Finding and renting your perfect home is easy with our simple three-step process.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <StepCard key={step.id} step={step} />
          ))}
        </div>
        
        {/* <div className="mt-20 bg-gradient-to-r from-[#111827] to-[#1f2937] rounded-xl p-10 text-center shadow-xl">
          <h3 className="text-2xl font-bold mb-4 text-white">Need Help?</h3>
          <p className="text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Our team is always ready to assist you with any questions you might have about the rental process.
          </p>
          <div className="inline-flex items-center justify-center space-x-2 text-[#111827] bg-white py-3 px-6 rounded-full hover:bg-gray-100 transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span className="font-medium">Call us at (123) 456-7890</span>
          </div>
        </div> */}
      </div>
    </section>
  )
}

export default HowItWorks
