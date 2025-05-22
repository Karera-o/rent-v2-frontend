"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import RoleSelectionModal from '@/components/RoleSelectionModal';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function TwitterCallbackPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [twitterData, setTwitterData] = useState(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const { loginWithTwitter } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleTwitterCallback = async () => {
      try {
        // Get the OAuth token and verifier from the URL
        const url = new URL(window.location.href);
        const oauth_token = url.searchParams.get('oauth_token');
        const oauth_verifier = url.searchParams.get('oauth_verifier');
        
        if (!oauth_token || !oauth_verifier) {
          throw new Error('Missing OAuth parameters');
        }
        
        console.log('Twitter callback with token:', oauth_token.substring(0, 10) + '...');
        
        // Call the backend to authenticate with Twitter
        const response = await loginWithTwitter(oauth_token, oauth_verifier);
        console.log('Twitter auth response:', response);
        
        // If user doesn't exist, show the role selection modal
        if (response.user_exists === false) {
          console.log('User does not exist, showing role selection modal');
          setTwitterData({ oauth_token, oauth_verifier });
          setShowRoleSelection(true);
          setIsLoading(false);
          return;
        }
        
        // If we get here, the user exists and we have tokens
        console.log('User exists, redirecting to dashboard');
        
        // Get the user's role
        const userRole = response.role || (response.user && response.user.role);
        console.log('User role from response:', userRole);
        
        // Redirect based on user role
        if (userRole === 'admin') {
          router.push('/dashboard/admin');
        } else if (userRole === 'agent') {
          console.log('User is an agent, redirecting to landlord dashboard');
          router.push('/dashboard/landlord');
        } else {
          console.log('User is a tenant, redirecting to user dashboard');
          router.push('/dashboard/user');
        }
      } catch (error) {
        console.error('Twitter callback error:', error);
        setError(error.message || 'Failed to authenticate with Twitter');
      } finally {
        setIsLoading(false);
      }
    };
    
    handleTwitterCallback();
  }, [loginWithTwitter, router]);

  const handleRoleSelect = async (role) => {
    try {
      setIsLoading(true);
      setShowRoleSelection(false); // Hide the modal immediately
      
      console.log('Selected role:', role);
      
      // Login with Twitter and the selected role
      const userData = await loginWithTwitter(
        twitterData.oauth_token,
        twitterData.oauth_verifier,
        role
      );
      
      console.log('Twitter login with role successful, user data:', userData);
      
      // Redirect based on user role
      if (role === 'agent') {
        console.log('User is an agent, redirecting to landlord dashboard');
        router.push('/dashboard/landlord');
      } else {
        console.log('User is a tenant, redirecting to user dashboard');
        router.push('/dashboard/user');
      }
    } catch (error) {
      console.error('Twitter login error:', error);
      // Show the error message to the user
      let errorMessage = error.message || 'Failed to sign in with Twitter. Please try again.';
      
      // Check if the error is about existing account with different role
      if (errorMessage.includes('You already have an account with the role')) {
        errorMessage = `You already have an account with a different role. Please sign in with that role instead.`;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRoleSelectionCancel = () => {
    setShowRoleSelection(false);
    router.push('/login');
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Authenticating with Twitter...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {showRoleSelection ? (
        <RoleSelectionModal
          onRoleSelect={handleRoleSelect}
          onCancel={handleRoleSelectionCancel}
          isLoading={isLoading}
          mode="signup"
        />
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6">Twitter Authentication</h1>
          <p className="text-gray-700 mb-6 text-center">
            Processing your authentication. Please wait...
          </p>
        </div>
      )}
    </div>
  );
}
