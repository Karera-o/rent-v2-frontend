"use client";

import { useState } from 'react';
import { User, Mail, Phone, Calendar, AlertCircle } from 'lucide-react';

export default function GuestBookingForm({ onSubmit, formData, setFormData, errors }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user types
    if (errors[name]) {
      delete errors[name];
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#111827] mb-4">Guest Information</h3>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <User className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          name="guestName"
          value={formData.guestName}
          onChange={handleInputChange}
          placeholder="Full Name"
          className={`w-full pl-10 pr-4 py-2 border ${errors.guestName ? 'border-red-500' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent`}
        />
        {errors.guestName && (
          <div className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.guestName}
          </div>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="email"
          name="guestEmail"
          value={formData.guestEmail}
          onChange={handleInputChange}
          placeholder="Email Address"
          className={`w-full pl-10 pr-4 py-2 border ${errors.guestEmail ? 'border-red-500' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent`}
        />
        {errors.guestEmail && (
          <div className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.guestEmail}
          </div>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Phone className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="tel"
          name="guestPhone"
          value={formData.guestPhone}
          onChange={handleInputChange}
          placeholder="Phone Number"
          className={`w-full pl-10 pr-4 py-2 border ${errors.guestPhone ? 'border-red-500' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent`}
        />
        {errors.guestPhone && (
          <div className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.guestPhone}
          </div>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          placeholder="Date of Birth"
          max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
          className={`w-full pl-10 pr-4 py-2 border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent`}
        />
        {errors.dateOfBirth && (
          <div className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.dateOfBirth}
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">You must be at least 18 years old to book</p>
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={onSubmit}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#111827] hover:bg-[#1f2937] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#111827]"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
} 