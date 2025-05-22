"use client";

import { useState } from 'react';
import { Twitter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function TwitterLoginButton({ mode = 'signin' }) {
  const [isLoading, setIsLoading] = useState(false);
  const { initTwitterAuth } = useAuth();

  const handleTwitterLogin = async () => {
    try {
      setIsLoading(true);
      console.log('Initializing Twitter authentication');
      
      // Initialize Twitter authentication
      const authData = await initTwitterAuth();
      console.log('Twitter auth initialized:', authData);
      
      // Redirect to Twitter authorization page
      if (authData && authData.auth_url) {
        window.location.href = authData.auth_url;
      } else {
        throw new Error('Failed to initialize Twitter authentication');
      }
    } catch (error) {
      console.error('Twitter login error:', error);
      alert(error.message || `Failed to ${mode === 'signup' ? 'sign up' : 'sign in'} with Twitter. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center my-4">
      <button
        onClick={handleTwitterLogin}
        disabled={isLoading}
        className={`flex items-center justify-center gap-2 w-full max-w-[300px] py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : (
          <>
            <Twitter className="h-5 w-5 text-[#1DA1F2]" />
            {mode === 'signup' ? 'Sign up with Twitter' : 'Sign in with Twitter'}
          </>
        )}
      </button>
    </div>
  );
}
