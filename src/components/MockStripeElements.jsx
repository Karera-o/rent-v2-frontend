"use client";

import { createContext, useContext } from 'react';

// Create mock contexts for Stripe components
const MockStripeContext = createContext({
  elements: null,
  stripe: null,
});

export const useMockStripe = () => useContext(MockStripeContext);
export const useMockElements = () => useContext(MockStripeContext).elements;

// Mock CardElement component
export const MockCardElement = ({ options, onChange, className }) => {
  return (
    <div className={`mock-card-element ${className}`}>
      <div className="p-2 border border-dashed border-gray-300 rounded bg-gray-50 text-center">
        <p className="text-sm text-gray-500">
          Stripe Card Element (Mock)
        </p>
        <p className="text-xs text-gray-400 mt-1">
          API key not configured - this is a development placeholder
        </p>
      </div>
    </div>
  );
};

// Mock Elements provider
export const MockElements = ({ children }) => {
  const mockElements = {
    getElement: () => ({
      // Mock card element methods
      clear: () => {},
      mount: () => {},
      unmount: () => {},
      update: () => {},
    }),
  };

  const mockStripe = {
    // Mock stripe methods
    confirmCardPayment: async (clientSecret, options = {}) => {
      console.log('MOCK: Confirming card payment with client secret:', clientSecret);
      
      // Generate a consistent payment_method_id based on the client secret
      // This helps simulate real behavior where the same card creates the same payment method ID
      const mockPaymentMethodId = `pm_mock_${clientSecret.substring(0, 8)}`;
      
      return {
        paymentIntent: { 
          id: 'mock_payment_intent_id',
          client_secret: clientSecret,
          stripe_client_secret: clientSecret,
          status: 'succeeded',
          payment_method: mockPaymentMethodId,
          amount: 1000,
          currency: 'usd'
        }
      };
    },
    confirmCardSetup: async (clientSecret, options = {}) => {
      console.log('MOCK: Confirming card setup with client secret:', clientSecret);
      
      // Generate a consistent payment_method_id
      const mockPaymentMethodId = `pm_mock_${clientSecret.substring(0, 8)}`;
      
      return { 
        setupIntent: { 
          status: 'succeeded',
          payment_method: mockPaymentMethodId
        } 
      };
    },
    createPaymentMethod: async (options = {}) => {
      console.log('MOCK: Creating payment method');
      
      // Generate a random ID for the payment method
      const randomId = Math.random().toString(36).substring(2, 10);
      return { 
        paymentMethod: { 
          id: `pm_mock_${randomId}`,
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            exp_month: 12,
            exp_year: 2030
          }
        } 
      };
    },
  };

  const value = {
    elements: mockElements,
    stripe: mockStripe,
  };

  return (
    <MockStripeContext.Provider value={value}>
      {children}
    </MockStripeContext.Provider>
  );
};

export default MockElements; 