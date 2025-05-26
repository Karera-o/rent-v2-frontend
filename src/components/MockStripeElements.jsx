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
    confirmCardPayment: async () => ({
      paymentIntent: { 
        id: 'mock_payment_intent_id',
        client_secret: 'mock_client_secret',
        status: 'succeeded',
        payment_method: 'mock_payment_method_id'
      }
    }),
    confirmCardSetup: async () => ({ setupIntent: { status: 'succeeded' } }),
    createPaymentMethod: async () => ({ paymentMethod: { id: 'mock_payment_method_id' } }),
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