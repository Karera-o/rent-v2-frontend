"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useStripe as useStripeContext } from '@/contexts/StripeContext';
import { CreditCard, Lock, Bug } from 'lucide-react';
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

// Helper function to collect debugging information
const collectDebugInfo = (paymentIntent, error) => {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    paymentIntent: paymentIntent ? {
      id: paymentIntent.id,
      status: paymentIntent.status,
      clientSecret: paymentIntent.stripe_client_secret ? 'present (not shown)' : 'missing',
      amount: paymentIntent.amount
    } : 'No payment intent available',
    error: error ? {
      message: error.message,
      type: error.type,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data
    } : 'No error information available',
    browser: navigator.userAgent,
    localStorage: {
      hasToken: !!localStorage.getItem('token') || !!localStorage.getItem('accessToken'),
      usesMockImplementation: !!localStorage.getItem('use_mock_implementation')
    }
  };
  
  console.log('[PAYMENT DEBUG]', debugInfo);
  return debugInfo;
};

export default function StripePaymentForm({ 
  bookingId, 
  amount, 
  onSuccess, 
  onError, 
  onProcessingChange,
  disabled 
}) {
  console.log('[StripePaymentForm] Initializing payment form for booking:', bookingId);
  
  // Get Stripe instances from either real or mock implementation
  const realStripe = useStripe();
  const realElements = useElements();
  const mockStripe = useMockStripe();
  const mockElements = useMockElements();
  
  const { createPaymentIntent, processPayment, useMockImplementation, resetStripeState } = useStripeContext();
  
  // Use either real or mock instances based on context flag
  const stripe = useMockImplementation ? mockStripe : realStripe;
  const elements = useMockImplementation ? mockElements : realElements;
  
  console.log('[StripePaymentForm] Using mock implementation:', useMockImplementation);
  console.log('[StripePaymentForm] Stripe instance available:', !!stripe);
  console.log('[StripePaymentForm] Elements instance available:', !!elements);
  
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [saveCard, setSaveCard] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  
  // Define effectRan ref at the component level
  const effectRan = useRef(false);

  // Create payment intent when component mounts
  useEffect(() => {
    const getPaymentIntent = async () => {
      // Generate a unique request ID to track this specific request in logs
      const requestId = Math.random().toString(36).substring(2, 10);
      console.log(`[StripePaymentForm][${requestId}] Creating payment intent for booking:`, bookingId);
      
      try {
        setProcessing(true);
        onProcessingChange?.(true);
        
        // Check if we have an existing payment intent in localStorage first
        const cachedIntentKey = `payment_intent_booking_${bookingId}`;
        const existingIntent = localStorage.getItem(cachedIntentKey);
        
        if (existingIntent) {
          try {
            const parsedIntent = JSON.parse(existingIntent);
            console.log(`[StripePaymentForm][${requestId}] Using cached payment intent from localStorage:`, parsedIntent.id);
            setPaymentIntent(parsedIntent);
            setError(null);
            setDebugInfo(null);
            return;  // Exit early - no need to create a new intent
          } catch (e) {
            console.error(`[StripePaymentForm][${requestId}] Error parsing cached intent:`, e);
            localStorage.removeItem(cachedIntentKey);
          }
        }
        
        // If execution reaches here, we need to create a new payment intent
        console.log(`[StripePaymentForm][${requestId}] No valid cached intent, creating new one`);
        
        const paymentIntentData = await createPaymentIntent(bookingId, {
          setupFutureUsage: saveCard ? 'off_session' : undefined
        });
        
        console.log(`[StripePaymentForm][${requestId}] Payment intent created successfully:`, paymentIntentData);
        
        // Cache the intent in localStorage directly from this component
        if (typeof window !== 'undefined' && paymentIntentData && paymentIntentData.id) {
          localStorage.setItem(cachedIntentKey, JSON.stringify(paymentIntentData));
          console.log(`[StripePaymentForm][${requestId}] Cached payment intent in localStorage:`, paymentIntentData.id);
        }
        
        setPaymentIntent(paymentIntentData);
        setError(null);
        setDebugInfo(null);
      } catch (err) {
        console.error(`[StripePaymentForm][${requestId}] Error creating payment intent:`, err);
        setError(err.message || 'Failed to initialize payment. Please try again.');
        
        // Collect debug information
        const debug = collectDebugInfo(null, err);
        setDebugInfo(debug);
        
        onError?.(err.message || 'Failed to initialize payment. Please try again.');
      } finally {
        setProcessing(false);
        onProcessingChange?.(false);
      }
    };

    // Prevent duplicate calls on component re-renders
    // In development, React 18 StrictMode runs effects twice
    if (effectRan.current === false) {
      // Only create the payment intent once when the component mounts
      // and only if we don't already have one
      if (bookingId && !paymentIntent) {
        console.log('[StripePaymentForm] Initial payment intent creation for booking:', bookingId);
        getPaymentIntent();
      }
      
      // Mark that this effect has run
      effectRan.current = true;
    } else {
      console.log('[StripePaymentForm] Skipping duplicate payment intent creation (effect already ran)');
    }
    
    // Cleanup function
    return () => {
      console.log('[StripePaymentForm] Component unmounting for booking:', bookingId);
    };
  }, [bookingId, createPaymentIntent, onError, onProcessingChange, saveCard, paymentIntent]);

  const handleCardChange = (event) => {
    console.log('[StripePaymentForm] Card input changed, complete:', event.complete);
    setCardComplete(event.complete);
    setError(event.error ? event.error.message : null);
    
    if (event.error) {
      console.error('[StripePaymentForm] Card input error:', event.error.message);
      onError?.(event.error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('[StripePaymentForm] Payment form submitted');

    if (!stripe || !elements || !paymentIntent) {
      console.error('[StripePaymentForm] Missing required instances:', {
        stripe: !!stripe,
        elements: !!elements,
        paymentIntent: !!paymentIntent
      });
      return;
    }

    try {
      setProcessing(true);
      onProcessingChange?.(true);

      // Get card element
      const cardElement = elements.getElement(CardElement);
      console.log('[StripePaymentForm] Card element retrieved:', !!cardElement);

      // Get client secret (either directly or from stripe_client_secret)
      const clientSecret = paymentIntent.stripe_client_secret || paymentIntent.client_secret;
      
      if (!clientSecret) {
        console.error('[StripePaymentForm] Missing client secret in payment intent:', paymentIntent);
        const debug = collectDebugInfo(paymentIntent, { message: 'Missing client secret for payment intent' });
        setDebugInfo(debug);
        throw new Error('Missing client secret for payment intent');
      }
      
      console.log('[StripePaymentForm] Confirming card payment with client secret (first few chars):', clientSecret.substring(0, 10) + '...');

      // Confirm card payment
      console.log('[StripePaymentForm] Calling stripe.confirmCardPayment with setup_future_usage:', saveCard ? 'off_session' : 'undefined');
      const result = await stripe.confirmCardPayment(
        clientSecret,
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

      if (result.error) {
        console.error('[StripePaymentForm] Payment confirmation error:', result.error);
        console.error('[StripePaymentForm] Error code:', result.error.code);
        console.error('[StripePaymentForm] Error type:', result.error.type);
        
        // Collect debug information
        const debug = collectDebugInfo(paymentIntent, result.error);
        setDebugInfo(debug);
        
        setError(result.error.message);
        onError?.(result.error.message);
        return;
      } 
      
      const updatedPaymentIntent = result.paymentIntent;
      
      if (!updatedPaymentIntent) {
        console.error('[StripePaymentForm] No payment intent returned from Stripe:', result);
        const debug = collectDebugInfo(paymentIntent, { message: 'No payment intent returned from Stripe' });
        setDebugInfo(debug);
        throw new Error('No payment intent returned from Stripe');
      }
      
      console.log('[StripePaymentForm] Stripe confirmation successful, payment intent:', {
        id: updatedPaymentIntent.id,
        status: updatedPaymentIntent.status,
        paymentMethod: updatedPaymentIntent.payment_method
      });
      
      if (updatedPaymentIntent.status === 'succeeded') {
        try {
          // Extract required values from the Stripe response
          const paymentIntentId = updatedPaymentIntent.id;
          const paymentMethodId = updatedPaymentIntent.payment_method;
          
          console.log(`[StripePaymentForm] Processing backend confirmation with:`, {
            paymentIntentId,
            paymentMethodId,
            bookingId,
            saveCard
          });
          
          // Process the payment on our backend
          const confirmResult = await processPayment(
            paymentIntentId,
            paymentMethodId,
            saveCard,
            bookingId
          );
          
          console.log('[StripePaymentForm] Backend confirmation successful:', confirmResult);
          
          // Call success callback
          onSuccess?.();
        } catch (confirmError) {
          console.error('[StripePaymentForm] Backend payment confirmation error:', confirmError);
          
          // Log full response details
          if (confirmError.response) {
            console.error('[StripePaymentForm] Error status:', confirmError.response.status);
            console.error('[StripePaymentForm] Error data:', confirmError.response.data);
          }
          
          // Collect debug information
          const debug = collectDebugInfo(
            { ...paymentIntent, status: updatedPaymentIntent.status, id: updatedPaymentIntent.id }, 
            confirmError
          );
          setDebugInfo(debug);
          
          // If Stripe confirmed the payment but our backend processing failed,
          // we can still consider it successful for the user
          if (confirmError.response && confirmError.response.status === 422) {
            console.warn('[StripePaymentForm] Backend validation error, but payment was processed by Stripe');
            console.warn('[StripePaymentForm] Treating as success despite 422 error');
            // Show a warning but still consider it a success
            onSuccess?.();
          } else {
            setError(confirmError.message || 'Payment succeeded with Stripe but failed to confirm on our server');
            onError?.(confirmError.message || 'Payment succeeded with Stripe but failed to confirm on our server');
          }
        }
      } else {
        // Payment requires additional action or failed
        console.error('[StripePaymentForm] Payment not succeeded, status:', updatedPaymentIntent.status);
        const debug = collectDebugInfo(
          { ...paymentIntent, status: updatedPaymentIntent.status }, 
          { message: `Payment processing failed. Status: ${updatedPaymentIntent.status}` }
        );
        setDebugInfo(debug);
        
        setError(`Payment processing failed. Status: ${updatedPaymentIntent.status}`);
        onError?.(`Payment processing failed. Status: ${updatedPaymentIntent.status}`);
      }
    } catch (err) {
      console.error('[StripePaymentForm] Payment processing error:', err);
      
      // Log full error details
      if (err.response) {
        console.error('[StripePaymentForm] Response status:', err.response.status);
        console.error('[StripePaymentForm] Response data:', err.response.data);
      }
      
      // Collect debug information
      const debug = collectDebugInfo(paymentIntent, err);
      setDebugInfo(debug);
      
      setError(err.message || 'Payment processing failed. Please try again.');
      onError?.(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
      onProcessingChange?.(false);
    }
  };

  // Debug information display toggler
  const toggleDebugInfo = () => {
    setShowDebug(!showDebug);
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
            <div className="mt-2 flex flex-col space-y-2">
              <p className="text-sm text-amber-600">
                Development Mode: No actual payment will be processed
              </p>
              {/* Error message if present */}
              {error && (
                <p className="text-sm text-red-500">
                  Error: {error}
                </p>
              )}
              <div className="flex space-x-2">
                <button 
                  type="button" 
                  onClick={resetStripeState}
                  className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                >
                  (Developer: Reset Stripe connection state)
                </button>
                
                {debugInfo && (
                  <button 
                    type="button" 
                    onClick={toggleDebugInfo}
                    className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 flex items-center"
                  >
                    <Bug className="h-3 w-3 mr-1" />
                    {showDebug ? 'Hide debug info' : 'Show debug info'}
                  </button>
                )}
              </div>
              
              {/* Debug information */}
              {debugInfo && showDebug && (
                <div className="mt-2 p-3 bg-gray-100 rounded-md text-xs font-mono overflow-auto max-h-48">
                  <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              )}
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
        </div>

        {error && !processing && !showDebug && (
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
          
          {/* Debug information toggle */}
          {debugInfo && (
            <div className="mt-2">
              <button 
                type="button" 
                onClick={toggleDebugInfo}
                className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center"
              >
                <Bug className="h-3 w-3 mr-1" />
                {showDebug ? 'Hide debug info' : 'Show debug info'}
              </button>
              
              {showDebug && (
                <div className="mt-2 p-3 bg-gray-100 rounded-md text-xs font-mono overflow-auto max-h-48">
                  <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
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

      {error && !processing && !showDebug && (
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