'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { useToast } from '@/components/ui/use-toast';
import ContactService from '@/services/contact';

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'first-name' ? 'firstName' :
       id === 'last-name' ? 'lastName' : id]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await ContactService.sendContactMessage(formData);
      setSuccess(true);
      toast({
        title: 'Message Sent',
        description: response.message,
        variant: 'default',
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111827]/5 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#111827] to-[#1f2937] text-white py-20">
        <div className="container-responsive text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Have questions or need assistance? We're here to help you with all your rental needs.
          </p>
        </div>
      </div>

      <div className="container-responsive py-16">
        {/* Contact Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-16 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Left Side - Contact Info */}
            <div className="lg:col-span-2 bg-gradient-to-br from-[#111827] to-[#1f2937] text-white p-8 lg:p-12 relative">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                    <circle id="pattern-circle" cx="10" cy="10" r="2" fill="#FFF"></circle>
                  </pattern>
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
                </svg>
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                <p className="mb-12 opacity-90">
                  Reach out to us directly or fill out the form and we'll get back to you as soon as possible.
                </p>

                <div className="space-y-8">
                  {/* Office Address */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white/10 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Our Office</h3>
                      <p className="mt-1 opacity-90">
                        123 Rental Street<br />
                        City, State 12345<br />
                        Country
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white/10 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Phone</h3>
                      <p className="mt-1 opacity-90">
                        Main: (123) 456-7890<br />
                        Support: (123) 456-7891
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white/10 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Email</h3>
                      <p className="mt-1 opacity-90">
                        info@houserental.com<br />
                        support@houserental.com
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-12 flex space-x-4">
                  <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                    </svg>
                  </a>
                  <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-3 p-8 lg:p-12">
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#111827] to-[#1f2937]">Get in Touch</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below, and one of our team members will get back to you as soon as possible.
              </p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <input
                      type="text"
                      id="first-name"
                      className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-[#111827] bg-transparent"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                    <label
                      htmlFor="first-name"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      First Name
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      id="last-name"
                      className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-[#111827] bg-transparent"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                    <label
                      htmlFor="last-name"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Last Name
                    </label>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-[#111827] bg-transparent"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Email Address
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-[#111827] bg-transparent"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  <label
                    htmlFor="phone"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Phone Number
                  </label>
                </div>

                <div className="relative">
                  <select
                    id="subject"
                    className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-[#111827] bg-transparent"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled></option>
                    <option value="general">General Inquiry</option>
                    <option value="property">Property Question</option>
                    <option value="viewing">Schedule a Viewing</option>
                    <option value="support">Customer Support</option>
                    <option value="feedback">Feedback</option>
                  </select>
                  <label
                    htmlFor="subject"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm"
                  >
                    Subject
                  </label>
                </div>

                <div className="relative">
                  <textarea
                    id="message"
                    rows="4"
                    className="peer w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-[#111827] bg-transparent resize-none"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <label
                    htmlFor="message"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Message
                  </label>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-[#111827] to-[#1f2937] hover:from-[#1f2937] hover:to-[#374151] text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>

                {success && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
                    Your message has been sent successfully! Our team will get back to you soon.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-1 bg-gradient-to-br from-[#111827] to-[#1f2937] text-white p-8 lg:p-12">
              <h3 className="text-2xl font-bold mb-4">Visit Our Office</h3>
              <p className="mb-6 opacity-90">
                We'd love to meet you in person! Our office is conveniently located in the heart of the city.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-white/10 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">Business Hours</h4>
                    <p className="text-sm opacity-90">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 h-80 lg:h-auto">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Map will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-[#111827]/5 py-16">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#111827] to-[#1f2937]">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our rental process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-gray-900">How do I schedule a property viewing?</h3>
              <p className="text-gray-600">
                You can schedule a viewing by clicking the "Schedule a Viewing" button on any property listing page, or by contacting our team directly through this contact form.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-gray-900">What documents do I need to apply for a rental?</h3>
              <p className="text-gray-600">
                Typically, you'll need proof of income, identification, rental history, and references. The specific requirements may vary depending on the property, so it's best to contact us for details.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-gray-900">How long does the application process take?</h3>
              <p className="text-gray-600">
                Our application process usually takes 1-3 business days, depending on how quickly we can verify your information and references.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-gray-900">Are utilities included in the rent?</h3>
              <p className="text-gray-600">
                This varies by property. Each listing specifies which utilities, if any, are included in the rent. You can find this information in the property details section.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
