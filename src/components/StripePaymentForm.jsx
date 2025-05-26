"use client";

import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useStripe as useStripeContext } from '@/contexts/StripeContext';
import { CreditCard, Lock } from 'lucide-react';
import { MockCardElement, useMockStripe, useMockElements } from '@/components/MockStripeElements';

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      fontFamily: 'sans-serif',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
      iconColor: '#9e2146',
    },
  },
  hidePostalCode: true,
};

export default function StripePaymentForm({ 
  bookingId, 
  amount, 
  onSuccess, 
  onError, 
  onProcessingChange,
  disabled 
}) {
  // Get Stripe instances from either real or mock implementation
  const realStripe = useStripe();
  const realElements = useElements();
  const mockStripe = useMockStripe();
  const mockElements = useMockElements();
  
  const { createPaymentIntent, processPayment, useMockImplementation } = useStripeContext();
  
  // Use either real or mock instances based on context flag
  const stripe = useMockImplementation ? mockStripe : realStripe;
  const elements = useMockImplementation ? mockElements : realElements;
  
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [saveCard, setSaveCard] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Create payment intent when component mounts
  useEffect(() => {
    const getPaymentIntent = async () => {
      try {
        setProcessing(true);
        onProcessingChange?.(true);
        
        const paymentIntentData = await createPaymentIntent(bookingId, {
          setupFutureUsage: saveCard ? 'off_session' : undefined
        });
        
        setPaymentIntent(paymentIntentData);
        setError(null);
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setError(err.message || 'Failed to initialize payment. Please try again.');
        onError?.(err.message || 'Failed to initialize payment. Please try again.');
      } finally {
        setProcessing(false);
        onProcessingChange?.(false);
      }
    };

    if (bookingId) {
      getPaymentIntent();
    }
  }, [bookingId, createPaymentIntent, onError, onProcessingChange, saveCard]);

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    setError(event.error ? event.error.message : null);
    
    if (event.error) {
      onError?.(event.error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !paymentIntent) {
      // Stripe.js has not loaded yet or payment intent is not ready
      return;
    }

    try {
      setProcessing(true);
      onProcessingChange?.(true);

      // Get card element
      const cardElement = elements.getElement(CardElement);

      // Confirm card payment
      const { error, paymentIntent: updatedPaymentIntent } = await stripe.confirmCardPayment(
        paymentIntent.client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              // You can add billing details here if needed
            },
          },
          // Save payment method if requested
          setup_future_usage: saveCard ? 'off_session' : undefined,
        }
      );

      if (error) {
        console.error('Payment confirmation error:', error);
        setError(error.message);
        onError?.(error.message);
      } else if (updatedPaymentIntent.status === 'succeeded') {
        // Payment succeeded, process on backend
        await processPayment(
          updatedPaymentIntent.id, 
          updatedPaymentIntent.payment_method,
          saveCard
        );
        
        // Call success callback
        onSuccess?.();
      } else {
        // Payment requires additional action or failed
        setError('Payment processing failed. Please try again.');
        onError?.('Payment processing failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setError(err.message || 'Payment processing failed. Please try again.');
      onError?.(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
      onProcessingChange?.(false);
    }
  };

  // If using mock implementation, show a message
  if (useMockImplementation) {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Information
            </label>
            <div className="border border-gray-300 rounded-md p-4">
              <MockCardElement 
                options={cardElementOptions} 
                onChange={handleCardChange}
                className="pt-1"
              />
            </div>
            <p className="mt-2 text-sm text-amber-600">
              Development Mode: No actual payment will be processed
            </p>
          </div>

          <div className="flex items-center">
            <input
              id="save-card"
              name="save-card"
              type="checkbox"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              className="h-4 w-4 text-[#111827] focus:ring-[#111827] border-gray-300 rounded"
            />
            <label htmlFor="save-card" className="ml-2 block text-sm text-gray-700">
              Save this card for future bookings
            </label>
          </div>
        </div>

        {error && !processing && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={processing || disabled}
          className="w-full bg-[#111827] hover:bg-[#1f2937] text-white py-3 flex items-center justify-center"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay ${amount} (Test Mode)
            </>
          )}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-md p-4 focus-within:ring-2 focus-within:ring-[#111827] focus-within:border-[#111827]">
            <CardElement 
              options={cardElementOptions} 
              onChange={handleCardChange}
              className="pt-1"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="save-card"
            name="save-card"
            type="checkbox"
            checked={saveCard}
            onChange={(e) => setSaveCard(e.target.checked)}
            className="h-4 w-4 text-[#111827] focus:ring-[#111827] border-gray-300 rounded"
          />
          <label htmlFor="save-card" className="ml-2 block text-sm text-gray-700">
            Save this card for future bookings
          </label>
        </div>

        <div className="bg-gray-50 p-4 rounded-md flex items-center">
          <Lock className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-xs text-gray-500">
            Your payment information is processed securely. We do not store your credit card details.
          </span>
        </div>
      </div>

      {error && !processing && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || !cardComplete || processing || disabled}
        className="w-full bg-[#111827] hover:bg-[#1f2937] text-white py-3 flex items-center justify-center"
      >
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Pay ${amount}
          </>
        )}
      </Button>
    </form>
  );
} 