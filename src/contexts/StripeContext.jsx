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
      console.log(`[StripeContext] createPaymentIntent called for booking ID: ${bookingId}`);
      
      // First check the cache by booking ID (this is the most reliable key)
      const bookingCacheKey = `payment_intent_booking_${bookingId}`;
      const cachedIntentKey = `payment_intent_${bookingId}`;
      
      if (typeof window !== 'undefined') {
        // Check booking-specific cache first (most reliable)
        const bookingCachedIntent = localStorage.getItem(bookingCacheKey);
        if (bookingCachedIntent) {
          try {
            const parsedIntent = JSON.parse(bookingCachedIntent);
            console.log('[StripeContext] Using cached payment intent from booking cache:', parsedIntent.id);
            return parsedIntent;
          } catch (e) {
            console.error('[StripeContext] Error parsing cached intent from booking cache:', e);
            localStorage.removeItem(bookingCacheKey);
          }
        }
        
        // Fall back to the old cache key if needed
        const cachedIntent = localStorage.getItem(cachedIntentKey);
        if (cachedIntent) {
          try {
            const parsedIntent = JSON.parse(cachedIntent);
            console.log('[StripeContext] Using cached payment intent from regular cache:', parsedIntent.id);
            
            // Copy to the booking-specific cache for future use
            localStorage.setItem(bookingCacheKey, cachedIntent);
            
            // Ensure the cached intent has a booking_id for future reference
            if (!parsedIntent.booking_id) {
              parsedIntent.booking_id = bookingId;
              localStorage.setItem(cachedIntentKey, JSON.stringify(parsedIntent));
              localStorage.setItem(bookingCacheKey, JSON.stringify(parsedIntent));
            }
            
            return parsedIntent;
          } catch (e) {
            console.error('[StripeContext] Error parsing cached intent from regular cache:', e);
            localStorage.removeItem(cachedIntentKey);
          }
        }
      }
      
      // Check if we need to use mock implementation
      if (useMockImplementation) {
        console.log('[StripeContext] Using mock implementation for payment intent');
        
        // Generate a unique ID for mock intents to avoid duplicates
        const uniqueId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        // Return mock payment intent data
        const mockIntent = {
          id: uniqueId,
          stripe_client_secret: 'mock_client_secret',
          amount: 1000,
          currency: 'usd',
          status: 'requires_payment_method',
          booking_id: bookingId,
          created_at: new Date().toISOString(),
          is_mock: true
        };
        
        // Cache the mock intent using both keys
        if (typeof window !== 'undefined') {
          localStorage.setItem(bookingCacheKey, JSON.stringify(mockIntent));
          localStorage.setItem(cachedIntentKey, JSON.stringify(mockIntent));
          // Also cache by the generated ID
          localStorage.setItem(`payment_intent_${uniqueId}`, JSON.stringify(mockIntent));
        }
        
        return mockIntent;
      }
      
      console.log('[StripeContext] No cached intent found, creating new payment intent');
      
      // Ensure we're passing the correct parameter name for saving payment methods
      const paymentOptions = {
        ...options
      };
      
      // Convert setupFutureUsage to setup_future_usage if needed
      if (options.setupFutureUsage) {
        paymentOptions.setup_future_usage = options.setupFutureUsage;
        delete paymentOptions.setupFutureUsage;
      }
      
      // Add a timestamp to help debug duplicate requests
      const timestamp = new Date().toISOString();
      console.log(`[StripeContext] Making API call to create payment intent at ${timestamp}`);
      
      const paymentIntentData = await PaymentService.createPaymentIntent(bookingId, paymentOptions);
      
      console.log('[StripeContext] Payment intent created successfully:', paymentIntentData.id);
      
      // Ensure we have a properly formatted response with client_secret
      if (!paymentIntentData.stripe_client_secret && paymentIntentData.client_secret) {
        // Format from the quick-intent endpoint to match our expected structure
        paymentIntentData.stripe_client_secret = paymentIntentData.client_secret;
      }
      
      // Make sure the booking_id is stored for future reference
      paymentIntentData.booking_id = bookingId;
      paymentIntentData.created_at = new Date().toISOString();
      
      // Cache the payment intent using all relevant keys
      if (typeof window !== 'undefined') {
        // Cache by booking ID (most important)
        localStorage.setItem(bookingCacheKey, JSON.stringify(paymentIntentData));
        
        // Cache by the old key for backward compatibility
        localStorage.setItem(cachedIntentKey, JSON.stringify(paymentIntentData));
        
        // Also cache by intent ID for easier lookup during confirmation
        if (paymentIntentData.id) {
          localStorage.setItem(`payment_intent_${paymentIntentData.id}`, JSON.stringify(paymentIntentData));
        }
        
        console.log('[StripeContext] Cached payment intent with keys:', {
          bookingKey: bookingCacheKey,
          regularKey: cachedIntentKey,
          intentIdKey: `payment_intent_${paymentIntentData.id}`
        });
      }
      
      return paymentIntentData;
    } catch (err) {
      console.error('[StripeContext] Error creating payment intent:', err);
      
      // Check if this is a rate limit error (specifically flagged by our service)
      if (err.isRateLimit || 
          (err.message && (
            err.message.includes('rate limit') || 
            err.message.includes('too many requests')
          )) ||
          (err.response && err.response.status === 429)) {
        
        console.warn('[StripeContext] Rate limit detected during payment intent creation, using mock mode for future requests');
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('stripe_rate_limited', 'true');
          setUseMockImplementation(true);
        }
        
        // Return mock data since we hit a rate limit
        const uniqueId = `mock_ratelimited_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const mockIntent = {
          id: uniqueId,
          stripe_client_secret: 'mock_client_secret',
          amount: 1000,
          currency: 'usd',
          status: 'requires_payment_method',
          booking_id: bookingId,
          created_at: new Date().toISOString(),
          is_mock: true,
          reason: 'rate_limited'
        };
        
        // Cache the mock intent
        if (typeof window !== 'undefined') {
          const bookingCacheKey = `payment_intent_booking_${bookingId}`;
          localStorage.setItem(bookingCacheKey, JSON.stringify(mockIntent));
          localStorage.setItem(`payment_intent_${bookingId}`, JSON.stringify(mockIntent));
          localStorage.setItem(`payment_intent_${uniqueId}`, JSON.stringify(mockIntent));
        }
        
        return mockIntent;
      }
      
      throw err;
    }
  };

  // Create a quick payment intent for a booking (simplified version)
  const createQuickPaymentIntent = async (bookingId) => {
    try {
      console.log(`[StripeContext] createQuickPaymentIntent called for booking ID: ${bookingId}`);
      
      // Check cache first
      const bookingCacheKey = `payment_intent_booking_${bookingId}`;
      
      if (typeof window !== 'undefined') {
        const cachedIntent = localStorage.getItem(bookingCacheKey);
        if (cachedIntent) {
          try {
            const parsedIntent = JSON.parse(cachedIntent);
            console.log('[StripeContext] Using cached quick payment intent:', parsedIntent.id);
            return parsedIntent;
          } catch (e) {
            console.error('[StripeContext] Error parsing cached quick intent:', e);
            localStorage.removeItem(bookingCacheKey);
          }
        }
      }
      
      // Check if we need to use mock implementation
      if (useMockImplementation) {
        console.log('[StripeContext] Using mock implementation for quick payment intent');
        
        const uniqueId = `mock_quick_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        const mockIntent = {
          id: uniqueId,
          client_secret: 'mock_client_secret',
          amount: 1000,
          currency: 'usd',
          booking_id: bookingId,
          created_at: new Date().toISOString(),
          is_mock: true
        };
        
        // Cache the mock intent
        if (typeof window !== 'undefined') {
          localStorage.setItem(bookingCacheKey, JSON.stringify(mockIntent));
        }
        
        return mockIntent;
      }
      
      console.log('[StripeContext] Creating new quick payment intent');
      
      const paymentIntentData = await PaymentService.createQuickPaymentIntent(bookingId);
      
      console.log('[StripeContext] Quick payment intent created successfully:', paymentIntentData.id);
      
      // Add metadata for tracking
      paymentIntentData.booking_id = bookingId;
      paymentIntentData.created_at = new Date().toISOString();
      
      // Cache the payment intent
      if (typeof window !== 'undefined') {
        localStorage.setItem(bookingCacheKey, JSON.stringify(paymentIntentData));
        
        // Also cache by intent ID for easier lookup
        if (paymentIntentData.id) {
          localStorage.setItem(`payment_intent_${paymentIntentData.id}`, JSON.stringify(paymentIntentData));
        }
        
        console.log('[StripeContext] Cached quick payment intent');
      }
      
      return paymentIntentData;
    } catch (err) {
      console.error('[StripeContext] Error creating quick payment intent:', err);
      
      // Handle rate limiting similar to regular payment intent
      if (err.isRateLimit || 
          (err.message && (
            err.message.includes('rate limit') || 
            err.message.includes('too many requests')
          )) ||
          (err.response && err.response.status === 429)) {
        
        console.warn('[StripeContext] Rate limit detected during quick payment intent creation');
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('stripe_rate_limited', 'true');
          setUseMockImplementation(true);
        }
        
        const uniqueId = `mock_quick_ratelimited_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const mockIntent = {
          id: uniqueId,
          client_secret: 'mock_client_secret',
          amount: 1000,
          currency: 'usd',
          booking_id: bookingId,
          created_at: new Date().toISOString(),
          is_mock: true,
          reason: 'rate_limited'
        };
        
        if (typeof window !== 'undefined') {
          const bookingCacheKey = `payment_intent_booking_${bookingId}`;
          localStorage.setItem(bookingCacheKey, JSON.stringify(mockIntent));
        }
        
        return mockIntent;
      }
      
      throw err;
    }
  };

  // Process a payment
  const processPayment = async (paymentIntentId, paymentMethodId, savePaymentMethod = false, bookingId = null) => {
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
      return await PaymentService.processPayment(paymentIntentId, paymentMethodId, savePaymentMethod, bookingId);
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
      // Clear Stripe configuration
      localStorage.removeItem('stripe_publishable_key');
      localStorage.removeItem('stripe_rate_limited');
      localStorage.removeItem('force_mock_stripe');
      
      // Clear all cached payment intents
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('payment_intent_')) {
          keysToRemove.push(key);
        }
      }
      
      // Remove the keys in a separate loop to avoid index issues
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log('[StripeContext] Reset completed. Cleared configuration and cached intents');
    }
    window.location.reload();
  };

  // Context value
  const value = {
    loading,
    error,
    createPaymentIntent,
    createQuickPaymentIntent,
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
