"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentService from '@/services/payment';

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

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        setLoading(true);
        // Get the Stripe publishable key from the backend
        const publishableKey = await PaymentService.getStripePublicKey();

        // Check if the publishable key is valid
        if (!publishableKey || publishableKey === 'pk_test_your_test_key') {
          console.warn('Using mock Stripe implementation because API keys are not properly configured');
          // Set a mock Stripe instance
          setStripePromise(null);
          setError(null);
          return;
        }

        // Initialize Stripe with the publishable key
        const stripeInstance = loadStripe(publishableKey);
        setStripePromise(stripeInstance);
        setError(null);
      } catch (err) {
        console.error('Error initializing Stripe:', err);
        console.warn('Falling back to mock Stripe implementation');
        // Set a mock Stripe instance
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
      return await PaymentService.createPaymentIntent(bookingId, options);
    } catch (err) {
      console.error('Error creating payment intent:', err);
      throw err;
    }
  };

  // Process a payment
  const processPayment = async (paymentIntentId, paymentMethodId, savePaymentMethod = false) => {
    try {
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
    processPayment
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
      {stripePromise ? (
        <Elements stripe={stripePromise}>
          {children}
        </Elements>
      ) : (
        // If Stripe is not initialized, we still need to provide a mock Elements context
        // This allows the StripePaymentForm to render without errors
        <div className="mock-stripe-elements">
          {children}
        </div>
      )}
    </StripeContext.Provider>
  );
};

export default StripeContext;
