"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Calendar, User, Home, Download, ArrowRight, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import BookingService from '@/services/booking';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';

export default function PaymentSuccessPage({ params }) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const bookingData = await BookingService.getBookingById(params.id);
        setBooking(bookingData);
        
        // Determine if this is a guest booking
        const guestEmail = bookingData.guest_email || bookingData.guest_email;
        const guestPhone = bookingData.guest_phone || bookingData.guest_phone;
        if (guestEmail && guestPhone && !isAuthenticated) {
          setIsGuest(true);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details.');
      } finally {
        setLoading(false);
      }
    };

    // Fetch booking regardless of authentication status
    fetchBooking();
  }, [params.id, isAuthenticated]);

  const generateBookingPDF = () => {
    if (!booking) return;
    
    setGeneratingPdf(true);
    
    try {
      const doc = new jsPDF();
      
      // Extract booking properties using the new format structure
      const bookingId = booking.id || booking.booking_id;
      const propertyTitle = booking.property?.title || booking.property_name;
      const propertyAddress = booking.property?.address || booking.property_address;
      const propertyCity = booking.property?.city || (booking.property_address ? booking.property_address.split(',')[0] : '');
      const propertyState = booking.property?.state || (booking.property_address ? booking.property_address.split(',')[1] : '');
      const checkInDate = booking.check_in_date || booking.checkin_date;
      const checkOutDate = booking.check_out_date || booking.checkout_date;
      const guestCount = booking.guests || booking.guest_count;
      const totalPrice = booking.total_price || booking.total_amount;
      
      // Add logo or header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Booking Confirmation', 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Booking Reference: #${bookingId}`, 20, 40);
      doc.text(`Date: ${format(new Date(), 'MMM dd, yyyy')}`, 20, 50);
      
      // Property details
      doc.setFont('helvetica', 'bold');
      doc.text('Property Details', 20, 70);
      doc.setFont('helvetica', 'normal');
      doc.text(`${propertyTitle}`, 20, 80);
      doc.text(`${propertyAddress}`, 20, 90);
      if (propertyCity && propertyState) {
        doc.text(`${propertyCity}, ${propertyState}`, 20, 100);
      }
      
      // Booking details
      doc.setFont('helvetica', 'bold');
      doc.text('Booking Details', 20, 120);
      doc.setFont('helvetica', 'normal');
      
      // Format dates correctly handling both date objects and formatted strings
      const formatBookingDate = (date) => {
        if (!date) return 'N/A';
        if (typeof date === 'string' && date.includes('th')) {
          return date;
        }
        return format(new Date(date), 'MMM dd, yyyy');
      };
      
      doc.text(`Check-in: ${formatBookingDate(checkInDate)}`, 20, 130);
      doc.text(`Check-out: ${formatBookingDate(checkOutDate)}`, 20, 140);
      doc.text(`Guests: ${guestCount}`, 20, 150);
      
      // Payment details
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Details', 20, 170);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Amount: $${totalPrice}`, 20, 180);
      doc.text(`Payment Status: Paid`, 20, 190);
      doc.text(`Payment Date: ${format(new Date(), 'MMM dd, yyyy')}`, 20, 200);
      
      // Footer
      doc.setFontSize(10);
      doc.text('Thank you for your booking!', 105, 250, { align: 'center' });
      doc.text('If you have any questions, please contact our support team.', 105, 260, { align: 'center' });
      
      // Save the PDF
      doc.save(`booking-confirmation-${bookingId}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loading) {
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
          <Link href="/">
            <button className="bg-gradient-to-r from-[#111827] to-[#1f2937] text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity font-medium">
              Return to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Extract booking properties for both old and new formats
  const bookingId = booking.id || booking.booking_id;
  const propertyTitle = booking.property?.title || booking.property_name;
  const propertyAddress = booking.property?.address || booking.property_address;
  const propertyCity = booking.property?.city || (booking.property_address ? booking.property_address.split(',')[0] : '');
  const propertyState = booking.property?.state || (booking.property_address ? booking.property_address.split(',')[1] : '');
  const checkInDate = booking.check_in_date || booking.checkin_date;
  const checkOutDate = booking.check_out_date || booking.checkout_date;
  const guestCount = booking.guests || booking.guest_count;
  const totalPrice = booking.total_price || booking.total_amount;
  const guestName = booking.guest_name || booking.first_name;
  const guestEmail = booking.guest_email;
  const guestPhone = booking.guest_phone;
  
  // Helper function to format dates
  const formatBookingDate = (date) => {
    if (!date) return 'N/A';
    if (typeof date === 'string' && date.includes('th')) {
      return date;
    }
    return format(new Date(date), 'MMM dd, yyyy');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111827]/5 to-white py-12">
      <div className="container-responsive">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
            {/* Success Header */}
            <div className="bg-green-50 p-8 border-b border-gray-100 text-center">
              <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-[#111827] mb-2">Booking Confirmed!</h1>
              <p className="text-gray-600">Your payment has been processed successfully.</p>
              <p className="text-gray-600 mt-1">Booking Reference: <span className="font-medium">#{bookingId}</span></p>
              
              {isGuest && guestEmail && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md inline-block">
                  <p className="text-sm text-blue-700">
                    A confirmation email has been sent to {guestEmail}
                  </p>
                </div>
              )}
            </div>
            
            {/* Booking Details */}
            <div className="p-8 space-y-8">
              {/* Property Info */}
              <div className="flex items-start">
                <Home className="h-6 w-6 text-gray-400 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-[#111827] mb-2">Property Details</h2>
                  <h3 className="font-medium text-gray-900">{propertyTitle}</h3>
                  <p className="text-gray-600">{propertyAddress}</p>
                  {propertyCity && propertyState && (
                    <p className="text-gray-600">{propertyCity}, {propertyState}</p>
                  )}
                </div>
              </div>
              
              {/* Dates */}
              <div className="flex items-start">
                <Calendar className="h-6 w-6 text-gray-400 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-[#111827] mb-2">Stay Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Check-in</p>
                      <p className="text-gray-600">
                        {formatBookingDate(checkInDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Check-out</p>
                      <p className="text-gray-600">
                        {formatBookingDate(checkOutDate)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-900">Guests</p>
                    <p className="text-gray-600">{guestCount} {guestCount === 1 ? 'guest' : 'guests'}</p>
                  </div>
                </div>
              </div>
              
              {/* Guest Information for guest bookings */}
              {isGuest && (
                <div className="flex items-start">
                  <User className="h-6 w-6 text-gray-400 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-semibold text-[#111827] mb-2">Guest Information</h2>
                    {guestName && <p className="text-gray-600"><span className="font-medium">Name:</span> {guestName}</p>}
                    {guestEmail && <p className="text-gray-600"><span className="font-medium">Email:</span> {guestEmail}</p>}
                    {guestPhone && <p className="text-gray-600"><span className="font-medium">Phone:</span> {guestPhone}</p>}
                  </div>
                </div>
              )}
              
              {/* Payment Info */}
              <div className="flex items-start">
                <CreditCard className="h-6 w-6 text-gray-400 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-[#111827] mb-2">Payment Details</h2>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-semibold text-gray-900">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Payment Status</span>
                    <span className="text-green-600 font-medium">Paid</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                <Button
                  onClick={generateBookingPDF}
                  disabled={generatingPdf}
                  variant="outline"
                  className="border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white transition-colors"
                >
                  {generatingPdf ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download Confirmation
                    </>
                  )}
                </Button>
                
                {isAuthenticated ? (
                  <Link href="/dashboard/user/bookings">
                    <Button className="w-full bg-[#111827] hover:bg-[#1f2937] text-white">
                      View My Bookings
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/">
                    <Button className="w-full bg-[#111827] hover:bg-[#1f2937] text-white">
                      Return to Home
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>

              {/* Create Account Prompt for Guests */}
              {isGuest && (
                <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-md">
                  <h3 className="text-lg font-semibold text-[#111827] mb-2">Create an Account</h3>
                  <p className="text-gray-600 mb-4">
                    Create an account to easily manage your bookings, view your stay history, and receive exclusive offers.
                  </p>
                  <Link href="/register">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Create Account
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}