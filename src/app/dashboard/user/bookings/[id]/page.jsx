"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  DollarSign,
  User,
  Phone,
  Mail,
  Clock,
  ChevronLeft,
  Download,
  Loader2,
  AlertCircle,
  Building2
} from "lucide-react";
import Link from "next/link";
import { jsPDF } from "jspdf";
import BookingService from "@/services/booking";
import { format } from "date-fns";

export default function BookingDetailPage({ params }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if we're authenticated
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('No auth token available for booking details request');
          setError('Authentication required');
          setLoading(false);
          return;
        }

        console.log(`Fetching booking details for ID: ${params.id}`);
        const bookingData = await BookingService.getBookingById(params.id);
        console.log('Booking data received:', bookingData);

        if (!bookingData || !bookingData.property) {
          console.error('Invalid booking data received:', bookingData);
          setError('Invalid booking data received');
          setLoading(false);
          return;
        }

        // Format the booking data for display
        const formattedBooking = {
          id: bookingData.id,
          property: bookingData.property.title,
          propertyId: bookingData.property.id,
          location: `${bookingData.property.city}, ${bookingData.property.state}`,
          dates: {
            checkIn: formatDate(bookingData.check_in_date),
            checkOut: formatDate(bookingData.check_out_date),
          },
          price: {
            nightly: formatPrice(bookingData.property.price_per_night),
            total: formatPrice(bookingData.total_price),
            fees: formatPrice(bookingData.total_price - (bookingData.property.price_per_night * (bookingData.duration_days || 1))),
          },
          status: bookingData.status.charAt(0).toUpperCase() + bookingData.status.slice(1),
          host: {
            name: `${bookingData.property.owner.first_name || ''} ${bookingData.property.owner.last_name || ''}`.trim() || bookingData.property.owner.username,
            phone: bookingData.property.owner.phone_number || 'Not provided',
            email: bookingData.property.owner.email,
          },
          bookingDate: formatDate(bookingData.created_at),
          guests: bookingData.guests,
          isPaid: bookingData.is_paid,
          propertyDetails: {
            type: bookingData.property.property_type.charAt(0).toUpperCase() + bookingData.property.property_type.slice(1),
            bedrooms: bookingData.property.bedrooms,
            bathrooms: bookingData.property.bathrooms,
            amenities: [],
          },
          rawData: bookingData,
        };

        // Extract amenities
        const amenities = [];
        if (bookingData.property.has_wifi) amenities.push('WiFi');
        if (bookingData.property.has_kitchen) amenities.push('Kitchen');
        if (bookingData.property.has_air_conditioning) amenities.push('Air Conditioning');
        if (bookingData.property.has_heating) amenities.push('Heating');
        if (bookingData.property.has_tv) amenities.push('TV');
        if (bookingData.property.has_parking) amenities.push('Parking');
        if (bookingData.property.has_pool) amenities.push('Pool');
        if (bookingData.property.has_gym) amenities.push('Gym');
        formattedBooking.propertyDetails.amenities = amenities;

        setBooking(formattedBooking);
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError(err.message || 'Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [params.id]);

  const generateReceipt = async () => {
    setGeneratingPDF(true);
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.text("Booking Receipt", 105, 20, { align: "center" });

      // Booking ID and Status
      doc.setFontSize(12);
      doc.text(`Booking Reference: #${booking.id}`, 20, 40);
      doc.text(`Status: ${booking.status}`, 20, 48);
      doc.text(`Date of Booking: ${booking.bookingDate}`, 20, 56);

      // Property Details
      doc.setFontSize(14);
      doc.text("Property Details", 20, 70);
      doc.setFontSize(12);
      doc.text(`Property: ${booking.property}`, 20, 80);
      doc.text(`Location: ${booking.location}`, 20, 88);
      doc.text(`Check-in: ${booking.dates.checkIn}`, 20, 96);
      doc.text(`Check-out: ${booking.dates.checkOut}`, 20, 104);
      doc.text(`Number of Guests: ${booking.guests}`, 20, 112);

      // Price Breakdown
      doc.setFontSize(14);
      doc.text("Price Details", 20, 130);
      doc.setFontSize(12);
      doc.text(`Nightly Rate: ${booking.price.nightly}`, 20, 140);
      doc.text(`Service Fees: ${booking.price.fees}`, 20, 148);
      doc.setLineWidth(0.5);
      doc.line(20, 152, 100, 152);
      doc.setFontSize(13);
      doc.text(`Total Amount: ${booking.price.total}`, 20, 160);

      // Host Information
      doc.setFontSize(14);
      doc.text("Host Information", 20, 180);
      doc.setFontSize(12);
      doc.text(`Name: ${booking.host.name}`, 20, 190);
      doc.text(`Email: ${booking.host.email}`, 20, 198);
      doc.text(`Phone: ${booking.host.phone}`, 20, 206);

      // Footer
      doc.setFontSize(10);
      doc.text("This is an electronically generated receipt.", 105, 270, { align: "center" });
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 276, { align: "center" });

      // Save the PDF
      doc.save(`booking-receipt-${booking.id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Loading booking details...</h3>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading booking details</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <div className="flex space-x-4">
          <Link
            href="/dashboard/user/bookings"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Back to Bookings
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Handle no booking found
  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Booking not found</h3>
        <p className="text-gray-500 mb-4">The booking you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link
          href="/dashboard/user/bookings"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Back to Bookings
        </Link>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/user/bookings"
            className="text-primary hover:text-primary/80 flex items-center"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Bookings
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            Booking #{booking.id}
          </h1>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Property Details</h2>
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{booking.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{booking.dates.checkIn} - {booking.dates.checkOut}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <User className="h-5 w-5 mr-2" />
                <span>{booking.guests} Guests</span>
              </div>
              <div className="mt-4">
                <h3 className="font-medium mb-2">Amenities:</h3>
                {booking.propertyDetails.amenities && booking.propertyDetails.amenities.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {booking.propertyDetails.amenities.map((amenity) => (
                      <div key={amenity} className="text-gray-600">• {amenity}</div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-500">No amenities listed for this property</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Host Information</h2>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <User className="h-5 w-5 mr-2" />
                <span>{booking.host.name}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-2" />
                <span>{booking.host.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="h-5 w-5 mr-2" />
                <span>{booking.host.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Price Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Nightly Rate</span>
                <span>{booking.price.nightly}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Service Fees</span>
                <span>{booking.price.fees}</span>
              </div>
              <div className="pt-3 border-t flex justify-between font-semibold">
                <span>Total</span>
                <span>{booking.price.total}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              <span>Booked on: {booking.bookingDate}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={generateReceipt}
              disabled={generatingPDF}
              className="w-full flex justify-center items-center bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generatingPDF ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Receipt...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </>
              )}
            </button>
            <button className="w-full flex justify-center items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
              <Mail className="h-4 w-4 mr-2" />
              Contact Host
            </button>
            {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
              <button className="w-full flex justify-center items-center border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-50">
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
