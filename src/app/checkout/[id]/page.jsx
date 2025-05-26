"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, CreditCard, User, Home, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import BookingService from '@/services/booking';
import { useAuth } from '@/contexts/AuthContext';
import StripePaymentForm from '@/components/StripePaymentForm';

export default function CheckoutPage({ params }) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchBooking = async () => {
      try {
        setLoading(true);
        const bookingData = await BookingService.getBookingById(params.id);
        setBooking(bookingData);
        setError(null);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchBooking();
    }
  }, [params.id, isAuthenticated, authLoading, router]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    // Redirect to success page after a short delay
    setTimeout(() => {
      router.push(`/checkout/${params.id}/success`);
    }, 1500);
  };

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage || 'Payment failed. Please try again.');
    setProcessingPayment(false);
  };

  const handlePaymentProcessing = (isProcessing) => {
    setProcessingPayment(isProcessing);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#111827]/5 to-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#111827]/5 to-white flex flex-col justify-center items-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Booking not found'}</p>
          <Link href="/dashboard/user/bookings">
            <button className="bg-gradient-to-r from-[#111827] to-[#1f2937] text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity font-medium">
              Go to My Bookings
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#111827]/5 to-white flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
          <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
          <p className="text-gray-700 mb-6">Redirecting to confirmation page...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111827]/5 to-white py-12">
      <div className="container-responsive">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href={`/properties/${booking.property.id}`} className="inline-flex items-center text-sm text-gray-600 hover:text-[#111827] mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to property
            </Link>
            <h1 className="text-3xl font-bold text-[#111827]">Complete Your Booking</h1>
            <p className="text-gray-600 mt-2">Please review your booking details and complete payment</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Summary */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-[#111827] mb-4">Booking Summary</h2>
                  
                  <div className="flex items-start mb-4">
                    <Home className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-900">{booking.property.title}</h3>
                      <p className="text-sm text-gray-600">{booking.property.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Check-in</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(booking.check_in_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Check-out</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(booking.check_out_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Guests</p>
                      <p className="text-sm text-gray-600">{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      ${booking.property.price_per_night} x {booking.total_days} {booking.total_days === 1 ? 'night' : 'nights'}
                    </span>
                    <span className="text-sm text-gray-900">${booking.subtotal}</span>
                  </div>
                  
                  {booking.cleaning_fee > 0 && (
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Cleaning fee</span>
                      <span className="text-sm text-gray-900">${booking.cleaning_fee}</span>
                    </div>
                  )}
                  
                  {booking.service_fee > 0 && (
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Service fee</span>
                      <span className="text-sm text-gray-900">${booking.service_fee}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-100 my-4"></div>
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${booking.total_price}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Form */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden p-6">
                <div className="flex items-center mb-6">
                  <CreditCard className="h-6 w-6 text-[#111827] mr-3" />
                  <h2 className="text-xl font-semibold text-[#111827]">Payment Details</h2>
                </div>
                
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                <StripePaymentForm 
                  bookingId={booking.id}
                  amount={booking.total_price}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onProcessingChange={handlePaymentProcessing}
                  disabled={processingPayment}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 