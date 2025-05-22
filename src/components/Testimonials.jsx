import Image from 'next/image'

const testimonials = [
  {
    id: 1,
    content: "I found my dream apartment through this platform. The process was smooth and the property was exactly as described. Highly recommend!",
    author: "Sarah Johnson",
    role: "Marketing Executive",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
  },
  {
    id: 2,
    content: "As a student, finding affordable housing was a challenge until I discovered this website. The filters made it easy to find places within my budget near campus.",
    author: "Michael Chen",
    role: "University Student",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
  },
  {
    id: 3,
    content: "My family and I relocated to a new city and needed a home quickly. This platform connected us with several great options, and we found our perfect house within a week!",
    author: "Emily Rodriguez",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80",
  },
]

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-xl relative transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-l-4 border-[#111827]">
      <div className="absolute -top-5 -left-5 w-10 h-10 bg-gradient-to-r from-[#111827] to-[#1f2937] rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      </div>
      <p className="text-gray-700 italic mb-6 leading-relaxed">"<span className="text-[#111827] font-medium not-italic">{testimonial.content.split(' ').slice(0, 3).join(' ')}</span> {testimonial.content.split(' ').slice(3).join(' ')}"</p>
      <div className="flex items-center">
        <div className="relative h-14 w-14 rounded-full overflow-hidden mr-4 border-2 border-[#111827]/10">
          <Image
            src={testimonial.avatar}
            alt={testimonial.author}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{testimonial.author}</h4>
          <p className="text-sm text-[#111827]">{testimonial.role}</p>
        </div>
      </div>
      <div className="mt-4 flex text-[#111827]">
        {[...Array(5)].map((_, i) => (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  )
}

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#111827]/5">
      <div className="container-responsive">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#111827] to-[#1f2937]">What Our Clients Say</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#111827] to-[#1f2937] mx-auto mt-2 mb-6 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what people who found their homes through our platform have to say.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-lg font-medium text-white bg-gradient-to-r from-[#111827] to-[#1f2937] py-4 px-8 rounded-full inline-block shadow-md">
            Join thousands of satisfied renters who found their perfect home with us!
          </p>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
