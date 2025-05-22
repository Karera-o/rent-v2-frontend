"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions | Clickit & Getin",
  description: "Rental terms and conditions for Clickit & Getin property rentals",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111827]/5 to-white py-12">
      <div className="container-responsive max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Rental Terms and Conditions</h1>
          
          <div className="prose prose-gray max-w-none">
            <h2>1. INTRODUCTION AND DEFINITIONS</h2>
            <h3>1.1 Agreement Overview</h3>
            <p>
              These Terms and Conditions ("Agreement") constitute a legally binding contract between Clickit & Getin ("Company," "we," "us," or "our"), the property owner or manager ("Landlord"), and the individual(s) who will occupy the rental property ("Tenant," "you," or "your"). This Agreement governs your rental of properties listed on our platform.
            </p>
            
            <h3>1.2 Definitions</h3>
            <ul>
              <li><strong>Platform</strong> refers to the Clickit & Getin website and mobile applications.</li>
              <li><strong>Property</strong> refers to the accommodation listed on our Platform that you book.</li>
              <li><strong>Booking</strong> refers to the reservation of a Property for a specified period.</li>
              <li><strong>Booking Period</strong> refers to the duration of your stay from check-in to check-out.</li>
              <li><strong>Rental Fee</strong> refers to the total amount payable for your Booking.</li>
              <li><strong>Security Deposit</strong> refers to the refundable amount held to cover potential damages.</li>
            </ul>
            
            <h2>2. ELIGIBILITY REQUIREMENTS</h2>
            <h3>2.1 Age Requirement</h3>
            <p>
              You must be at least 18 years of age to rent a property. By accepting these terms, you confirm that you are at least 18 years old. We reserve the right to request proof of age at any time.
            </p>
            
            <h3>2.2 Identification</h3>
            <p>
              You agree to provide valid government-issued identification upon request. This may be required during booking, check-in, or at any point during your stay.
            </p>
            
            <h3>2.3 Account Accuracy</h3>
            <p>
              You must provide accurate, current, and complete information during the registration and booking processes. You are responsible for maintaining the confidentiality of your account credentials.
            </p>
            
            <h2>3. BOOKING AND RESERVATION PROCESS</h2>
            <h3>3.1 Booking Request</h3>
            <p>
              Submitting a booking request does not guarantee a reservation. A booking is only confirmed after you receive an official confirmation from us.
            </p>
            
            <h3>3.2 Guest Information</h3>
            <p>
              You must provide accurate information about all guests who will occupy the Property. The number of guests must not exceed the maximum occupancy stated in the Property listing.
            </p>
            
            <h3>3.3 Special Requests</h3>
            <p>
              Any special requests must be made during the booking process. While we will attempt to accommodate reasonable requests, we cannot guarantee fulfillment of all special requests.
            </p>
            
            <h3>3.4 Booking Confirmation</h3>
            <p>
              Upon confirmation of your booking, you will receive a booking confirmation via email containing essential details about your reservation.
            </p>
            
            <h2>4. PAYMENT TERMS</h2>
            <h3>4.1 Payment Methods</h3>
            <p>
              We accept payments through the methods specified on our Platform, which may include bank transfers, credit/debit cards, and digital payment services.
            </p>
            
            <h3>4.2 Payment Schedule</h3>
            <ul>
              <li>A deposit of 30% of the total Rental Fee is required to secure your booking.</li>
              <li>The remaining balance must be paid at least 14 days before your check-in date.</li>
              <li>For bookings made less than 14 days before check-in, the full payment is required immediately.</li>
            </ul>
            
            <h2>5. TENANT RESPONSIBILITIES</h2>
            <h3>5.1 Proper Use</h3>
            <p>
              You agree to use the Property solely for residential purposes and in a manner consistent with peaceful enjoyment. The Property may not be used for commercial activities, parties, or events without prior written approval.
            </p>
            
            <h3>5.2 Care of Property</h3>
            <p>
              You agree to keep the Property and all furnishings in good order, use appliances and fixtures properly, and notify the Landlord promptly of any damages or maintenance issues.
            </p>
            
            <h2>6. GOVERNING LAW</h2>
            <p>
              This Agreement shall be governed by and construed in accordance with the laws of Rwanda, without regard to its conflict of law principles.
            </p>
            
            <p className="mt-8 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
