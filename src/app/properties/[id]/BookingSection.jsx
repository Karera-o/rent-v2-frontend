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

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login page with return URL
      router.push(`/login?redirect=${encodeURIComponent(`/properties/${property.id}`)}`);
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    try {
      // Create booking
      const bookingData = {
        property_id: property.id,
        check_in_date: dateRange[0].startDate.toISOString().split('T')[0],
        check_out_date: dateRange[0].endDate.toISOString().split('T')[0],
        guests: formData.guests,
        guest_name: formData.guestName,
        guest_email: formData.guestEmail,
        guest_phone: formData.guestPhone,
        date_of_birth: formData.dateOfBirth,
        special_requests: formData.specialRequests
      };

      const booking = await BookingService.createBooking(bookingData);

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
      <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 sticky top-24 space-y-6">
        {/* Price per day */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#111827] to-[#1f2937]">
              ${pricePerDay}
            </span>
            <span className="text-gray-500">/day</span>
          </div>
        </div>

        {/* Booking Form */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#111827] to-[#1f2937]">
            Book Your Stay
          </h3>

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

            {/* Booking Summary */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold text-gray-900">Booking Summary</h4>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{totalDays} days</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price per day</span>
                <span className="font-medium">${pricePerDay}</span>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">${totalPrice}</span>
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
                  className={`w-full px-4 py-2 rounded-md border ${errors.guestName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent`}
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
                  className={`w-full px-4 py-2 rounded-md border ${errors.guestEmail ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent`}
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
                  className={`w-full px-4 py-2 rounded-md border ${errors.guestPhone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent`}
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
                  className={`w-full px-4 py-2 rounded-md border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent`}
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
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent"
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
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent"
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
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded flex items-start">
                <User className="h-5 w-5 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Login Required</p>
                  <p className="text-sm">You need to be logged in to book this property. You'll be redirected to login when you click "Book Now".</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#111827] to-[#1f2937] text-white py-3 rounded-md hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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