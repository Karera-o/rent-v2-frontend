"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';
import RoleSelectionModal from './RoleSelectionModal';

export default function GoogleLoginButton({ mode = 'signin' }) {
  const [isLoading, setIsLoading] = useState(false);
  const [googleCredential, setGoogleCredential] = useState(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const { loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      console.log('Google login success:', credentialResponse);

      // Extract the credential (ID token) from the response
      const { credential } = credentialResponse;

      // First, check if the user exists
      try {
        const response = await loginWithGoogle(credential);
        console.log('Google auth response:', response);

        // If user doesn't exist, show the role selection modal
        if (response.user_exists === false) {
          console.log('User does not exist, showing role selection modal');
          setGoogleCredential(credential);
          setShowRoleSelection(true);
          setIsLoading(false);
          return;
        }

        // If we get here, the user exists and we have tokens
        console.log('User exists, redirecting to dashboard');

        // Log the full response to debug
        console.log('Full response from Google login:', response);

        // Get the user's role
        const userRole = response.role || (response.user && response.user.role);
        console.log('User role from response:', userRole);

        // Redirect based on user role
        if (userRole === 'admin') {
          router.push('/dashboard/admin');
        } else if (userRole === 'agent') {
          console.log('User is an agent, redirecting to landlord dashboard');
          router.push('/dashboard/landlord');
        } else if (userRole === 'tenant') {
          console.log('User is a tenant, redirecting to user dashboard');
          router.push('/dashboard/user');
        } else {
          // Fallback in case role is not recognized
          console.warn('Unknown user role:', userRole);

          // Try to get the role from localStorage as a last resort
          const storedRole = localStorage.getItem('userRole');
          console.log('User role from localStorage:', storedRole);

          if (storedRole === 'agent') {
            console.log('User is an agent (from localStorage), redirecting to landlord dashboard');
            router.push('/dashboard/landlord');
          } else if (storedRole === 'admin') {
            console.log('User is an admin (from localStorage), redirecting to admin dashboard');
            router.push('/dashboard/admin');
          } else {
            // If still no role, try to get it from the API
            const storedUser = await AuthService.getUserProfile();
            console.log('User profile from API:', storedUser);

            if (storedUser && storedUser.role === 'agent') {
              console.log('User is an agent (from API), redirecting to landlord dashboard');
              router.push('/dashboard/landlord');
            } else if (storedUser && storedUser.role === 'admin') {
              console.log('User is an admin (from API), redirecting to admin dashboard');
              router.push('/dashboard/admin');
            } else {
              console.log('Defaulting to user dashboard');
              router.push('/dashboard/user');
            }
          }
        }
      } catch (error) {
        console.error('Google login error:', error);
        // Show the error message to the user
        let errorMessage = error.message || `Failed to ${mode === 'signup' ? 'sign up' : 'sign in'} with Google. Please try again.`;

        // Check if the error is about existing account with different role
        if (errorMessage.includes('You already have an account with the role')) {
          errorMessage = `You already have an account with a different role. Please sign in with that role instead.`;
        }

        alert(errorMessage);
      }
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = async (role) => {
    try {
      setIsLoading(true);
      setShowRoleSelection(false); // Hide the modal immediately

      console.log('Selected role:', role);

      // Login with the credential and selected role
      const userData = await loginWithGoogle(googleCredential, role);
      console.log('Google login with role successful, user data:', userData);

      // Get the user's role from the response or use the selected role
      const userRole = userData.role || (userData.user && userData.user.role) || role;
      console.log('Final user role for redirect:', userRole);

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
      console.error('Google login error:', error);
      // Show the error message to the user
      let errorMessage = error.message || `Failed to ${mode === 'signup' ? 'sign up' : 'sign in'} with Google. Please try again.`;

      // Check if the error is about existing account with different role
      if (errorMessage.includes('You already have an account with the role')) {
        errorMessage = `You already have an account with a different role. Please sign in with that role instead.`;
      }

      alert(errorMessage);
      setShowRoleSelection(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelectionCancel = () => {
    setShowRoleSelection(false);
    setGoogleCredential(null);
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
  };

  return (
    <>
      <div className="w-full flex justify-center my-4">
        <div className={`${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="outline"
            shape="rectangular"
            text={mode === 'signup' ? 'signup_with' : 'signin_with'}
            locale="en"
            width="300"
          />
        </div>
      </div>

      {/* Role selection modal - rendered outside the button container */}
      {showRoleSelection && (
        <RoleSelectionModal
          onRoleSelect={handleRoleSelect}
          onCancel={handleRoleSelectionCancel}
          isLoading={isLoading}
          mode={mode}
        />
      )}
    </>
  );
}
