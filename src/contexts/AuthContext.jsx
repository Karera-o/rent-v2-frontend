"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/services/auth';

// Create the auth context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Custom setter for user that also updates localStorage
  const updateUser = (userData) => {
    setUser(userData);

    // Store username and full name in localStorage for easy access
    if (userData && userData.username) {
      localStorage.setItem('username', userData.username);
      console.log('Username stored in localStorage (from AuthContext):', userData.username);

      // Also store the user's full name if available
      if (userData.first_name || userData.last_name) {
        const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
        if (fullName) {
          localStorage.setItem('fullName', fullName);
          console.log('Full name stored in localStorage:', fullName);
        }
      }
    } else if (userData === null) {
      localStorage.removeItem('username');
      localStorage.removeItem('fullName');
      console.log('User data removed from localStorage (from AuthContext)');
    }
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const userData = await AuthService.getCurrentUser();
          updateUser(userData);
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        AuthService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await AuthService.login(username, password);
      updateUser(userData);
      return userData;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Google login function
  const loginWithGoogle = async (credential, role = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.loginWithGoogle(credential, role);
      console.log('AuthContext loginWithGoogle response:', response);

      // If user doesn't exist and no role provided, return the response for role selection
      if (response.user_exists === false) {
        return response;
      }

      // If we have user data directly in the response
      if (response.id) {
        console.log('Setting user from response.id');
        updateUser(response);
        return response;
      }

      // If we have user data in response.user
      if (response.user) {
        console.log('Setting user from response.user');
        updateUser(response.user);
        return response.user;
      }

      // If we don't have user data, try to get it from the API
      console.log('No user data in response, fetching from API');
      const userData = await AuthService.getUserProfile();
      if (userData) {
        console.log('Setting user from getUserProfile');
        updateUser(userData);
      }

      return response;
    } catch (err) {
      setError(err.message || 'Google login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthService.register(userData);
      return result;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    AuthService.logout();
    updateUser(null);
    router.push('/login');
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await AuthService.updateProfile(profileData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Change password function
  const changePassword = async (oldPassword, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      return await AuthService.changePassword(oldPassword, newPassword);
    } catch (err) {
      setError(err.message || 'Failed to change password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Twitter auth initialization function
  const initTwitterAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      return await AuthService.initTwitterAuth();
    } catch (err) {
      setError(err.message || 'Failed to initialize Twitter authentication');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Twitter login function
  const loginWithTwitter = async (oauth_token, oauth_verifier, role = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.loginWithTwitter(oauth_token, oauth_verifier, role);
      console.log('AuthContext loginWithTwitter response:', response);

      // If user doesn't exist and no role provided, return the response for role selection
      if (response.user_exists === false) {
        return response;
      }

      // If we have user data directly in the response
      if (response.id) {
        console.log('Setting user from response.id');
        updateUser(response);
        return response;
      }

      // If we have user data in response.user
      if (response.user) {
        console.log('Setting user from response.user');
        updateUser(response.user);
        return response.user;
      }

      // If we don't have user data, try to get it from the API
      console.log('No user data in response, fetching from API');
      const userData = await AuthService.getUserProfile();
      if (userData) {
        console.log('Setting user from getUserProfile');
        updateUser(userData);
      }

      return response;
    } catch (err) {
      setError(err.message || 'Twitter login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated: AuthService.isAuthenticated, // Use the service function instead
    login,
    loginWithGoogle,
    initTwitterAuth,
    loginWithTwitter,
    register,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    getUserProfile: AuthService.getUserProfile // Add the getUserProfile method
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
