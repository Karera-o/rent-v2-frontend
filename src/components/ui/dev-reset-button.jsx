"use client";

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

export function DevResetButton() {
  const [isResetting, setIsResetting] = useState(false);
  
  const resetStripeState = () => {
    setIsResetting(true);
    
    // Clear any stored mock implementation flags
    if (typeof window !== 'undefined') {
      localStorage.removeItem('stripe_publishable_key');
      localStorage.removeItem('stripe_rate_limited');
      localStorage.removeItem('force_mock_stripe');
      
      // Add a small delay to show the reset animation
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <Button 
      onClick={resetStripeState}
      variant="outline" 
      size="sm"
      className="absolute bottom-4 right-4 text-xs bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
    >
      {isResetting ? (
        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
      ) : (
        <RefreshCw className="h-3 w-3 mr-1" />
      )}
      Reset Stripe State
    </Button>
  );
}

export default DevResetButton; 