"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, DollarSign, AlertCircle, User, CheckCircle } from 'lucide-react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import BookingService from '@/services/booking';
import { useAuth } from '@/contexts/AuthContext';
import TermsAndConditionsModal from '@/components/TermsAndConditionsModal';
// import { log } from 'console';

export default function BookingSection({ property }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      key: 'selection'
    }
  ]);

  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    dateOfBirth: '',
    guests: 1,
    specialRequests: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [totalDays, setTotalDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const pricePerDay = property.price;

  // Pre-fill form with user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        guestName: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username,
        guestEmail: user.email || '',
        guestPhone: user.phone_number || '',
        dateOfBirth: user.date_of_birth || ''
      }));
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const start = dateRange[0].startDate;
    const end = dateRange[0].endDate;
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Ensure at least 1 day
    const days = Math.max(diffDays, 1);
    setTotalDays(days);
    setTotalPrice(days * pricePerDay);
  }, [dateRange, pricePerDay]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate guest name
    if (!formData.guestName.trim()) {
      newErrors.guestName = 'Guest name is required';
    } else if (formData.guestName.trim().length < 2) {
      newErrors.guestName = 'Name must be at least 2 characters';
    }

    // Validate email
    if (!formData.guestEmail.trim()) {
      newErrors.guestEmail = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.guestEmail)) {
      newErrors.guestEmail = 'Please enter a valid email';
    }

    // Validate phone
    if (!formData.guestPhone.trim()) {
      newErrors.guestPhone = 'Phone number is required';
    } else if (formData.guestPhone.trim().length < 5) {
      newErrors.guestPhone = 'Please enter a valid phone number';
    }

    // Validate date of birth for all users
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      // Check if user is at least 18 years old
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old to book a property';
      }
    }

    // Validate dates
    if (dateRange[0].startDate >= dateRange[0].endDate) {
      newErrors.dates = 'Check-out date must be after check-in date';
    }

    // Validate terms and conditions acceptance
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the rental terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle terms and conditions acceptance
  const handleAcceptTerms = () => {
    setShowTermsModal(false);
    setFormData(prev => ({ ...prev, agreeToTerms: true }));
    // Clear any error related to terms agreement
    if (errors.agreeToTerms) {
      setErrors(prev => ({ ...prev, agreeToTerms: null }));
    }
  };

  // Handle terms and conditions decline
  const handleDeclineTerms = () => {
    setShowTermsModal(false);
    // If user declines, we don't set agreeToTerms to true
    // They'll need to check the box manually if they change their mind
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    try {
      // Common booking data for both authenticated and guest users
      const bookingData = {
        property_id: property.id,
        check_in_date: dateRange[0].startDate.toISOString().split('T')[0],
        check_out_date: dateRange[0].endDate.toISOString().split('T')[0],
        guests: formData.guests,
        guest_name: formData.guestName,
        guest_email: formData.guestEmail,
        guest_phone: formData.guestPhone,
        special_requests: formData.specialRequests,
      };

      let booking;

      // If user is authenticated, use regular booking endpoint
      if (isAuthenticated && user) {
        booking = await BookingService.createBooking(bookingData);
        console.log(isAuthenticated);
        console.log("testing the bookings");
        // console.log();
        
      } else {
        // For guest bookings, add user info for account creation
        console.log("Guest testing the bookings");
        const guestBookingData = {
          ...bookingData,
          user_info: {
            full_name: formData.guestName,
            email: formData.guestEmail,
            phone_number: formData.guestPhone,
            birthday: formData.dateOfBirth
          }
        };
        
        booking = await BookingService.createGuestBooking(guestBookingData);
      }

      // Redirect to checkout page with booking ID
      router.push(`/checkout/${booking.id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      setBookingError(error.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lg:col-span-1">
      <div className="border border-gray-200 p-8 sticky top-24 space-y-8">
        {/* Section Header */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-gray-500 block mb-2">Reserve</span>
          <h3 className="text-2xl font-light text-[#111827]">
            Book Your Stay
          </h3>
          <div className="mt-2 w-12 h-px bg-[#111827]"></div>
        </div>

        {/* Price per day */}
        <div className="border-b border-gray-100 pb-6">
          <div className="flex items-baseline">
            <span className="text-3xl font-light text-[#111827]">
              ${pricePerDay}
            </span>
            <span className="text-gray-500 text-sm ml-2">/day</span>
          </div>
        </div>

        {/* Booking Form */}
        <div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Date Range Picker */}
            <div className="space-y-2">
              <div className="border rounded-lg overflow-hidden">
                <DateRange
                  editableDateInputs={true}
                  onChange={item => setDateRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                  minDate={new Date()}
                  className="w-full"
                />
              </div>
              {errors.dates && (
                <div className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.dates}
                </div>
              )}
            </div>

            {/* Booking Summary - Minimalist and Elegant */}
            <div className="border border-gray-200 p-6 space-y-4">
              <h4 className="text-sm font-medium text-gray-800">Booking Summary</h4>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Duration</span>
                <span>{totalDays} days</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Price per day</span>
                <span>${pricePerDay}</span>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-medium text-gray-800">Total</span>
                  <span className="text-xl font-light text-[#111827]">${totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-2 border ${errors.guestName ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-gray-400 transition-colors`}
                />
                {errors.guestName && (
                  <div className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.guestName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="guestEmail"
                  value={formData.guestEmail}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className={`w-full px-4 py-2 border ${errors.guestEmail ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-gray-400 transition-colors`}
                />
                {errors.guestEmail && (
                  <div className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.guestEmail}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="guestPhone"
                  value={formData.guestPhone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full px-4 py-2 border ${errors.guestPhone ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-gray-400 transition-colors`}
                />
                {errors.guestPhone && (
                  <div className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.guestPhone}
                  </div>
                )}
              </div>

              {/* Date of Birth - Show for all users */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-xs text-gray-500">(Must be 18 or older)</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  className={`w-full px-4 py-2 border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-gray-400 transition-colors`}
                />
                {errors.dateOfBirth && (
                  <div className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.dateOfBirth}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                  placeholder="Any special requests or requirements..."
                ></textarea>
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="pt-2">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          agreeToTerms: e.target.checked
                        }));
                        // Clear error if checked
                        if (e.target.checked && errors.agreeToTerms) {
                          setErrors(prev => ({ ...prev, agreeToTerms: null }));
                        }
                      }}
                      className={`h-4 w-4 text-[#111827] focus:ring-[#111827] border-gray-300 rounded ${
                        errors.agreeToTerms ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-[#111827] hover:text-gray-700 underline"
                      >
                        Rental Terms and Conditions
                      </button>
                    </label>
                  </div>
                </div>
                {errors.agreeToTerms && (
                  <div className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.agreeToTerms}
                  </div>
                )}
              </div>
            </div>

            {bookingError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {bookingError}
              </div>
            )}

            {!isAuthenticated && !authLoading && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded flex items-start">
                <User className="h-5 w-5 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Guest Booking Available</p>
                  <p className="text-sm">You can book as a guest without logging in. Fill in your information and proceed to payment.</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full border border-[#111827] bg-[#111827] text-white py-3 hover:bg-[#1f2937] transition-colors font-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Book Now & Proceed to Payment'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <TermsAndConditionsModal
        open={showTermsModal}
        onOpenChange={setShowTermsModal}
        onAccept={handleAcceptTerms}
        onDecline={handleDeclineTerms}
        title="Tenant Rental Terms and Conditions"
        acceptButtonText="I Accept the Terms"
        declineButtonText="I Decline"
      />
    </div>
  );
}