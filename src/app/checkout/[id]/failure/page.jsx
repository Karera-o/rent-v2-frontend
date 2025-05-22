"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import BookingService from '@/services/booking';
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentFailurePage({ params }) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleRetryPayment = () => {
    router.push(`/checkout/${params.id}`);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#111827]/5 to-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !booking) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111827]/5 to-white py-12">
      <div className="container-responsive max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-100 text-center">
          <div className="bg-red-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-2 text-[#111827]">Payment Failed</h1>
          <p className="text-gray-600 mb-8">Your payment could not be processed. Please try again or use a different payment method.</p>
          
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 text-left">
            <p className="font-medium">Common reasons for payment failure:</p>
            <ul className="list-disc list-inside text-sm mt-2 space-y-1">
              <li>Insufficient funds in your account</li>
              <li>Card has expired or is invalid</li>
              <li>Bank declined the transaction</li>
              <li>Incorrect card information was entered</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={handleRetryPayment}
              className="bg-gradient-to-r from-[#111827] to-[#1f2937] text-white py-3 px-6 rounded-md hover:opacity-90 transition-opacity font-medium w-full sm:w-auto flex items-center justify-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
            
            <Link href={`/properties/${booking.property.id}`}>
              <button className="bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 transition-colors font-medium w-full sm:w-auto flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Property
              </button>
            </Link>
          </div>
        </div>
        
        <div className="mt-8 bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg">
          <div className="flex items-start">
            <div>
              <p className="font-medium">Need Help?</p>
              <p className="text-sm">If you continue to experience issues with your payment, please contact our support team for assistance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
