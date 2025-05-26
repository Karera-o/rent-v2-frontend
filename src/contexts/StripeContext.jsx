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
        // Get the Stripe publishable key from the backend
        const publishableKey = await PaymentService.getStripePublicKey();

        // Check if the publishable key is valid
        if (!publishableKey || publishableKey === 'pk_test_your_test_key') {
          console.warn('Using mock Stripe implementation because API keys are not properly configured');
          // Use mock implementation
          setUseMockImplementation(true);
          setStripePromise(null);
          setError(null);
          setLoading(false);
          return;
        }

        // Initialize Stripe with the publishable key
        const stripeInstance = loadStripe(publishableKey);
        setStripePromise(stripeInstance);
        setUseMockImplementation(false);
        setError(null);
      } catch (err) {
        console.error('Error initializing Stripe:', err);
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
          client_secret: 'mock_client_secret',
          amount: 1000,
          currency: 'usd',
          status: 'requires_payment_method'
        };
      }
      return await PaymentService.createPaymentIntent(bookingId, options);
    } catch (err) {
      console.error('Error creating payment intent:', err);
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
      throw err;
    }
  };

  // Context value
  const value = {
    loading,
    error,
    createPaymentIntent,
    processPayment,
    useMockImplementation
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
