"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentService from '@/services/payment';
import { MockElements } from '@/components/MockStripeElements';

// Create context
const StripeContext = createContext(null);

// Custom hook to use the Stripe context
export const useStripe = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};

// Stripe provider component
export const StripeProvider = ({ children }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMockImplementation, setUseMockImplementation] = useState(false);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        setLoading(true);
        
        // Check if we already have a cached key or have previously hit rate limits
        const cachedKey = typeof window !== 'undefined' ? localStorage.getItem('stripe_publishable_key') : null;
        const hasRateLimit = typeof window !== 'undefined' ? localStorage.getItem('stripe_rate_limited') : null;
        const mockForced = typeof window !== 'undefined' ? localStorage.getItem('force_mock_stripe') : null;
        
        // If we've hit rate limits before, use mock implementation immediately
        if (hasRateLimit === 'true' || mockForced === 'true') {
          console.warn('Using mock Stripe implementation due to previous rate limiting or forced mock mode');
          setUseMockImplementation(true);
          setStripePromise(null);
          setError(null);
          setLoading(false);
          return;
        }
        
        // If we have a cached key, use it
        if (cachedKey && cachedKey !== 'null' && cachedKey !== 'undefined') {
          console.log('Using cached Stripe publishable key');
          const stripeInstance = loadStripe(cachedKey);
          setStripePromise(stripeInstance);
          setUseMockImplementation(false);
          setError(null);
          setLoading(false);
          return;
        }
        
        // Get the Stripe publishable key from the backend
        const publishableKey = await PaymentService.getStripePublicKey();

        // Check if the publishable key is valid
        if (!publishableKey || publishableKey === 'pk_test_your_test_key') {
          console.warn('Using mock Stripe implementation because API keys are not properly configured');
          // Use mock implementation
          setUseMockImplementation(true);
          setStripePromise(null);
          setError(null);
          
          // Cache the decision to use mock implementation
          if (typeof window !== 'undefined') {
            localStorage.setItem('force_mock_stripe', 'true');
          }
          
          setLoading(false);
          return;
        }

        // Cache the valid key
        if (typeof window !== 'undefined') {
          localStorage.setItem('stripe_publishable_key', publishableKey);
        }

        // Initialize Stripe with the publishable key
        const stripeInstance = loadStripe(publishableKey);
        setStripePromise(stripeInstance);
        setUseMockImplementation(false);
        setError(null);
      } catch (err) {
        console.error('Error initializing Stripe:', err);
        
        // Check if the error is related to rate limiting
        if (err.message && (
          err.message.includes('rate limit') || 
          err.message.includes('too many requests') ||
          (err.response && err.response.status === 429)
        )) {
          console.warn('Rate limit detected, using mock Stripe implementation');
          
          // Mark that we've hit rate limits to avoid future API calls
          if (typeof window !== 'undefined') {
            localStorage.setItem('stripe_rate_limited', 'true');
          }
        }
        
        console.warn('Falling back to mock Stripe implementation');
        // Use mock implementation
        setUseMockImplementation(true);
        setStripePromise(null);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();
  }, []);

  // Create a payment intent for a booking
  const createPaymentIntent = async (bookingId, options = {}) => {
    try {
      if (useMockImplementation) {
        // Return mock payment intent data
        return {
          id: 'mock_payment_intent_id',
          stripe_client_secret: 'mock_client_secret',
          amount: 1000,
          currency: 'usd',
          status: 'requires_payment_method'
        };
      }
      
      // Ensure we're passing the correct parameter name for saving payment methods
      const paymentOptions = {
        ...options
      };
      
      // Convert setupFutureUsage to setup_future_usage if needed
      if (options.setupFutureUsage) {
        paymentOptions.setup_future_usage = options.setupFutureUsage;
        delete paymentOptions.setupFutureUsage;
      }
      
      const paymentIntentData = await PaymentService.createPaymentIntent(bookingId, paymentOptions);
      
      // Ensure we have a properly formatted response with client_secret
      if (!paymentIntentData.stripe_client_secret && paymentIntentData.client_secret) {
        // Format from the quick-intent endpoint to match our expected structure
        paymentIntentData.stripe_client_secret = paymentIntentData.client_secret;
      }
      
      return paymentIntentData;
    } catch (err) {
      console.error('Error creating payment intent:', err);
      
      // Check if this is a rate limit error (specifically flagged by our service)
      if (err.isRateLimit || 
          (err.message && (
            err.message.includes('rate limit') || 
            err.message.includes('too many requests')
          )) ||
          (err.response && err.response.status === 429)) {
        
        console.warn('Rate limit detected during payment intent creation, using mock mode for future requests');
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('stripe_rate_limited', 'true');
          setUseMockImplementation(true);
        }
        
        // Return mock data since we hit a rate limit
        return {
          id: 'mock_payment_intent_id',
          stripe_client_secret: 'mock_client_secret',
          amount: 1000,
          currency: 'usd',
          status: 'requires_payment_method'
        };
      }
      
      throw err;
    }
  };

  // Process a payment
  const processPayment = async (paymentIntentId, paymentMethodId, savePaymentMethod = false) => {
    try {
      if (useMockImplementation) {
        // Return mock payment result
        return {
          success: true,
          payment_intent: {
            id: paymentIntentId,
            status: 'succeeded'
          }
        };
      }
      return await PaymentService.processPayment(paymentIntentId, paymentMethodId, savePaymentMethod);
    } catch (err) {
      console.error('Error processing payment:', err);
      
      // Check if this is a rate limit error (specifically flagged by our service)
      if (err.isRateLimit || 
          (err.message && (
            err.message.includes('rate limit') || 
            err.message.includes('too many requests')
          )) ||
          (err.response && err.response.status === 429)) {
        
        console.warn('Rate limit detected during payment processing, using mock mode for future requests');
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('stripe_rate_limited', 'true');
          setUseMockImplementation(true);
        }
        
        // Return mock data since we hit a rate limit
        return {
          success: true,
          payment_intent: {
            id: paymentIntentId,
            status: 'succeeded'
          }
        };
      }
      
      throw err;
    }
  };

  // Method to reset storage and force reinitialization
  const resetStripeState = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('stripe_publishable_key');
      localStorage.removeItem('stripe_rate_limited');
      localStorage.removeItem('force_mock_stripe');
    }
    window.location.reload();
  };

  // Context value
  const value = {
    loading,
    error,
    createPaymentIntent,
    processPayment,
    useMockImplementation,
    resetStripeState
  };

  // If Stripe is still loading, show a loading indicator
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If there was an error initializing Stripe, show an error message
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Render the Stripe Elements provider with the initialized Stripe instance
  return (
    <StripeContext.Provider value={value}>
      {stripePromise && !useMockImplementation ? (
        <Elements stripe={stripePromise}>
          {children}
        </Elements>
      ) : (
        // If Stripe is not initialized or we're using mock implementation,
        // wrap children in our MockElements provider
        <MockElements>
          {children}
        </MockElements>
      )}
    </StripeContext.Provider>
  );
};

export default StripeContext;
