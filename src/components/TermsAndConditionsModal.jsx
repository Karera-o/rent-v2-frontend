"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function TermsAndConditionsModal({
  open,
  onOpenChange,
  onAccept,
  onDecline,
  showDeclineButton = true,
  acceptButtonText = "I Accept",
  declineButtonText = "I Decline",
  title = "Rental Terms and Conditions",
}) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  // Reset scroll state when modal opens
  useEffect(() => {
    if (open) {
      setScrolledToBottom(false);
      setScrollPercentage(0);
    }
  }, [open]);

  const handleScroll = (e) => {
    const element = e.currentTarget;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    // Calculate scroll percentage
    const percentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
    setScrollPercentage(percentage);

    // Consider scrolled to bottom when within 90% of the content
    // This makes it easier for users to activate the accept button
    if (percentage >= 90) {
      setScrolledToBottom(true);
    }
  };

  const handleAccept = () => {
    if (onAccept) onAccept();
  };

  const handleDecline = () => {
    if (onDecline) onDecline();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <div className="relative flex-1 min-h-[400px] max-h-[70vh] flex flex-col">
          {/* Scroll progress indicator */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 z-10">
            <div
              className="h-full bg-gray-900 transition-all duration-300"
              style={{ width: `${scrollPercentage}%` }}
            />
          </div>

          <ScrollArea
            className="flex-1 pr-4 mt-2 max-h-[60vh] overflow-y-auto"
            onScroll={handleScroll}
          >
            <div className="space-y-4 text-sm">
              <h2 className="text-lg font-semibold">1. INTRODUCTION AND DEFINITIONS</h2>
              <p><strong>1.1 Agreement Overview</strong><br />
              These Terms and Conditions ("Agreement") constitute a legally binding contract between Clickit & Getin ("Company," "we," "us," or "our"), the property owner or manager ("Landlord"), and the individual(s) who will occupy the rental property ("Tenant," "you," or "your"). This Agreement governs your rental of properties listed on our platform.</p>

              <p><strong>1.2 Definitions</strong><br />
              - "Platform" refers to the Clickit & Getin website and mobile applications.<br />
              - "Property" refers to the accommodation listed on our Platform that you book.<br />
              - "Booking" refers to the reservation of a Property for a specified period.<br />
              - "Booking Period" refers to the duration of your stay from check-in to check-out.<br />
              - "Rental Fee" refers to the total amount payable for your Booking.<br />
              - "Security Deposit" refers to the refundable amount held to cover potential damages.</p>

              <h2 className="text-lg font-semibold mt-6">2. ELIGIBILITY REQUIREMENTS</h2>
              <p><strong>2.1 Age Requirement</strong><br />
              You must be at least 18 years of age to rent a property. By accepting these terms, you confirm that you are at least 18 years old. We reserve the right to request proof of age at any time.</p>

              <p><strong>2.2 Identification</strong><br />
              You agree to provide valid government-issued identification upon request. This may be required during booking, check-in, or at any point during your stay.</p>

              <p><strong>2.3 Account Accuracy</strong><br />
              You must provide accurate, current, and complete information during the registration and booking processes. You are responsible for maintaining the confidentiality of your account credentials.</p>

              <h2 className="text-lg font-semibold mt-6">3. BOOKING AND RESERVATION PROCESS</h2>
              <p><strong>3.1 Booking Request</strong><br />
              Submitting a booking request does not guarantee a reservation. A booking is only confirmed after you receive an official confirmation from us.</p>

              <p><strong>3.2 Guest Information</strong><br />
              You must provide accurate information about all guests who will occupy the Property. The number of guests must not exceed the maximum occupancy stated in the Property listing.</p>

              <p><strong>3.3 Special Requests</strong><br />
              Any special requests must be made during the booking process. While we will attempt to accommodate reasonable requests, we cannot guarantee fulfillment of all special requests.</p>

              <h2 className="text-lg font-semibold mt-6">4. PAYMENT TERMS</h2>
              <p><strong>4.1 Payment Methods</strong><br />
              We accept payments through the methods specified on our Platform, which may include bank transfers, credit/debit cards, and digital payment services.</p>

              <p><strong>4.2 Payment Schedule</strong><br />
              - A deposit of 30% of the total Rental Fee is required to secure your booking.<br />
              - The remaining balance must be paid at least 14 days before your check-in date.<br />
              - For bookings made less than 14 days before check-in, the full payment is required immediately.</p>

              <h2 className="text-lg font-semibold mt-6">5. TENANT RESPONSIBILITIES</h2>
              <p><strong>5.1 Proper Use</strong><br />
              You agree to use the Property solely for residential purposes and in a manner consistent with peaceful enjoyment. The Property may not be used for commercial activities, parties, or events without prior written approval.</p>

              <p><strong>5.2 Care of Property</strong><br />
              You agree to keep the Property and all furnishings in good order, use appliances and fixtures properly, and notify the Landlord promptly of any damages or maintenance issues.</p>

              <h2 className="text-lg font-semibold mt-6">6. GOVERNING LAW</h2>
              <p>This Agreement shall be governed by and construed in accordance with the laws of Rwanda, without regard to its conflict of law principles.</p>

              <p className="mt-6 italic">By accepting these terms, you acknowledge that you have read, understood, and agree to be bound by all the terms and conditions outlined in this Agreement.</p>
            </div>
          </ScrollArea>

          {/* Scroll indicator */}
          {!scrolledToBottom && (
            <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent h-20 flex items-end justify-center pb-2 pointer-events-none">
              <div className="text-sm bg-gray-100 text-gray-700 flex items-center animate-bounce px-3 py-2 rounded-full shadow-md border border-gray-200 pointer-events-auto">
                <span>Please scroll down to read all terms</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          {showDeclineButton && (
            <Button
              variant="outline"
              onClick={handleDecline}
              className="sm:w-1/2 w-full"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              {declineButtonText}
            </Button>
          )}

          <Button
            onClick={handleAccept}
            className={`${showDeclineButton ? 'sm:w-1/2' : 'w-full'} bg-gradient-to-r from-[#111827] to-[#1f2937] hover:opacity-90`}
            disabled={!scrolledToBottom}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {acceptButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
