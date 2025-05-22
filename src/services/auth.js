import api, { setAuthTokens, clearAuthTokens } from './api';
import Cookies from 'js-cookie';

const AuthService = {
  /**
   * Login user with username/email and password
   * @param {string} username - Username or email
   * @param {string} password - User password
   * @param {boolean} rememberMe - Whether to remember the user
   * @returns {Promise} - Promise with user data
   */
  login: async (usernameOrEmail, password, rememberMe = false) => {
    try {
      // Determine if input is email or username
      const isEmail = usernameOrEmail.includes('@');
      let username = usernameOrEmail;

      console.log(`Logging in with ${isEmail ? 'email' : 'username'}: ${usernameOrEmail}`);

      // If it's an email, we need to try to find the username first
      if (isEmail) {
        try {
          // Try to login directly with email as username
          console.log('Attempting login with email as username');
          const response = await api.post('/token/pair', { username: usernameOrEmail, password });
          console.log('Login response:', response.data);

          // If successful, process the response
          if (response.data.access && response.data.refresh) {
            const { access, refresh } = response.data;
            setAuthTokens(access, refresh, rememberMe);
            console.log('Tokens stored with rememberMe:', rememberMe);

            try {
              const userResponse = await api.get('/users/profile');
              console.log('User profile response:', userResponse.data);
              return userResponse.data;
            } catch (profileError) {
              console.error('Error fetching user profile:', profileError);
              return {
                username: usernameOrEmail,
                email: usernameOrEmail,
                role: 'tenant'
              };
            }
          }
        } catch (emailLoginError) {
          console.log('Email login failed, will try with username lookup');
          // Continue to try with username lookup
        }
      }

      // Standard username login
      console.log('Logging in with username:', username);
      const response = await api.post('/token/pair', { username, password });
      console.log('Login response:', response.data);

      // Check if the response contains the expected tokens
      if (!response.data.access || !response.data.refresh) {
        console.error('Invalid token response:', response.data);
        throw { message: 'Invalid authentication response from server' };
      }

      const { access, refresh } = response.data;

      // Store tokens in both localStorage and cookies
      setAuthTokens(access, refresh, rememberMe);
      console.log('Tokens stored with rememberMe:', rememberMe);

      // Log token storage
      console.log('Tokens stored in localStorage and cookies');
      console.log('Access token in localStorage:', !!localStorage.getItem('accessToken'));
      console.log('Refresh token in localStorage:', !!localStorage.getItem('refreshToken'));
      console.log('Access token in cookies:', !!Cookies.get('accessToken'));
      console.log('Refresh token in cookies:', !!Cookies.get('refreshToken'));

      // Get user profile with the new token
      try {
        const userResponse = await api.get('/users/profile');
        console.log('User profile response:', userResponse.data);

        // Store username, full name, and role in localStorage for easy access
        if (userResponse.data && userResponse.data.username) {
          localStorage.setItem('username', userResponse.data.username);
          console.log('Username stored in localStorage:', userResponse.data.username);

          // Store the user's role
          if (userResponse.data.role) {
            localStorage.setItem('userRole', userResponse.data.role);
            console.log('User role stored in localStorage (from login):', userResponse.data.role);
          }

          // Also store the user's full name if available
          if (userResponse.data.first_name || userResponse.data.last_name) {
            const fullName = `${userResponse.data.first_name || ''} ${userResponse.data.last_name || ''}`.trim();
            if (fullName) {
              localStorage.setItem('fullName', fullName);
              console.log('Full name stored in localStorage:', fullName);
            }
          }
        }

        return userResponse.data;
      } catch (profileError) {
        console.error('Error fetching user profile:', profileError);
        // If we can't get the profile but have tokens, create a minimal user object

        // Store username in localStorage even in this case
        localStorage.setItem('username', username);
        console.log('Username stored in localStorage (fallback):', username);

        return {
          username,
          email: username.includes('@') ? username : `${username}@example.com`,
          role: 'tenant' // Default role, will be updated when profile is available
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);

        // Handle specific error cases
        if (error.response.status === 401) {
          throw { message: 'Invalid username or password' };
        }

        throw error.response.data || { message: 'Login failed' };
      } else if (error.request) {
        console.error('Error request:', error.request);
        throw { message: 'No response received from server. Please try again.' };
      } else {
        console.error('Error message:', error.message);
        throw { message: error.message || 'Login failed' };
      }
    }
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise with user data
   */
  register: async (userData) => {
    try {
      console.log('Registering user with data:', userData);

      // Ensure all required fields are present
      if (!userData.username || !userData.email || !userData.password) {
        throw new Error('Missing required fields: username, email, and password are required');
      }

      // Use the correct endpoint path without trailing slash
      const response = await api.post('/users/register', userData);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration API error:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        throw error.response.data || { message: 'Registration failed' };
      } else if (error.request) {
        console.error('Error request:', error.request);
        throw { message: 'No response received from server. Please try again.' };
      } else {
        console.error('Error message:', error.message);
        throw { message: error.message || 'Registration failed' };
      }
    }
  },

  /**
   * Logout user by removing tokens and user data
   */
  logout: () => {
    clearAuthTokens();
    // Also clear user data from localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    localStorage.removeItem('userRole');
    console.log('User data removed from localStorage');
  },

  /**
   * Get current user profile
   * @returns {Promise} - Promise with user data
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/profile');

      // Store username, full name, and role in localStorage for easy access
      if (response.data && response.data.username) {
        localStorage.setItem('username', response.data.username);
        console.log('Username stored in localStorage (from getCurrentUser):', response.data.username);

        // Store the user's role
        if (response.data.role) {
          localStorage.setItem('userRole', response.data.role);
          console.log('User role stored in localStorage (from getCurrentUser):', response.data.role);
        }

        // Also store the user's full name if available
        if (response.data.first_name || response.data.last_name) {
          const fullName = `${response.data.first_name || ''} ${response.data.last_name || ''}`.trim();
          if (fullName) {
            localStorage.setItem('fullName', fullName);
            console.log('Full name stored in localStorage (from getCurrentUser):', fullName);
          }
        }
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get user profile' };
    }
  },

  /**
   * Login with Google
   * @param {string} credential - Google ID token
   * @param {string} role - User role (tenant or agent)
   * @returns {Promise} - Promise with user data
   */
  loginWithGoogle: async (credential, role = null) => {
    try {
      console.log('Logging in with Google token:', credential.substring(0, 10) + '...');

      // If role is provided, include it in the request
      const requestData = {
        credential: credential
      };

      if (role) {
        console.log('Setting role in request:', role, typeof role);
        requestData.role = role;
      }

      const response = await api.post('/users/auth/google', requestData);

      console.log('Google login response:', response.data);

      // If user doesn't exist, return the response data for role selection
      if (response.data.user_exists === false) {
        return response.data;
      }

      // If user exists, set the tokens and return the user data
      if (response.data.access_token && response.data.refresh_token) {
        const { access_token, refresh_token } = response.data;
        setAuthTokens(access_token, refresh_token, true);

        // Store username, full name, and role in localStorage for easy access
        if (response.data.user && response.data.user.username) {
          localStorage.setItem('username', response.data.user.username);
          console.log('Username stored in localStorage (from Google login):', response.data.user.username);

          // Store the user's role
          if (response.data.user.role) {
            localStorage.setItem('userRole', response.data.user.role);
            console.log('User role stored in localStorage (from Google login):', response.data.user.role);
          }

          // Also store the user's full name if available
          if (response.data.user.first_name || response.data.user.last_name) {
            const fullName = `${response.data.user.first_name || ''} ${response.data.user.last_name || ''}`.trim();
            if (fullName) {
              localStorage.setItem('fullName', fullName);
              console.log('Full name stored in localStorage (from Google login):', fullName);
            }
          }
        }

        return response.data.user;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Google login error:', error);
      if (error.response) {
        throw error.response.data || { message: 'Google login failed' };
      } else if (error.request) {
        throw { message: 'No response received from server. Please try again.' };
      } else {
        throw { message: error.message || 'Google login failed' };
      }
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user has a valid token
   */
  isAuthenticated: () => {
    // Check multiple sources for authentication tokens
    const localToken = localStorage.getItem('accessToken');
    const cookieToken = Cookies.get('accessToken');
    const jwtCookie = Cookies.get('jwt');

    console.log('Auth check - localStorage token:', !!localToken);
    console.log('Auth check - cookie token:', !!cookieToken);
    console.log('Auth check - jwt cookie:', !!jwtCookie);

    // If we have a token in localStorage but not in cookies, sync them
    if (localToken && !cookieToken) {
      console.log('Syncing token from localStorage to cookies');
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        setAuthTokens(localToken, refreshToken, true);
      }
    }

    // If we have a token in cookies but not in localStorage, sync them
    if (cookieToken && !localToken) {
      console.log('Syncing token from cookies to localStorage');
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        localStorage.setItem('accessToken', cookieToken);
        localStorage.setItem('refreshToken', refreshToken);
      }
    }

    // Return true if any token source is available
    return !!(localToken || cookieToken || jwtCookie);
  },

  /**
   * Get user profile
   * @returns {Promise} - Promise with user data
   */
  getUserProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      console.log('User profile response:', response.data);

      // Store the user's role in localStorage
      if (response.data && response.data.role) {
        localStorage.setItem('userRole', response.data.role);
        console.log('User role stored in localStorage (from getUserProfile):', response.data.role);
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Return a minimal user object if we can't get the profile
      return {
        username: 'user',
        email: 'user@example.com',
        role: 'tenant' // Default role
      };
    }
  },

  /**
   * Change user password
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} - Promise with success message
   */
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await api.post('/users/change-password', {
        old_password: oldPassword,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to change password' };
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} - Promise with updated user data
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  /**
   * Initialize Twitter authentication
   * @returns {Promise} - Promise with Twitter auth data
   */
  initTwitterAuth: async () => {
    try {
      const response = await api.get('/users/auth/twitter/init');
      console.log('Twitter auth init response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Twitter auth init error:', error);
      if (error.response) {
        throw error.response.data || { message: 'Failed to initialize Twitter authentication' };
      } else if (error.request) {
        throw { message: 'No response received from server. Please try again.' };
      } else {
        throw { message: error.message || 'Failed to initialize Twitter authentication' };
      }
    }
  },

  /**
   * Login with Twitter
   * @param {string} oauth_token - OAuth token
   * @param {string} oauth_verifier - OAuth verifier
   * @param {string} role - User role (tenant or agent)
   * @returns {Promise} - Promise with user data
   */
  loginWithTwitter: async (oauth_token, oauth_verifier, role = null) => {
    try {
      console.log('Logging in with Twitter token:', oauth_token.substring(0, 10) + '...');

      // Prepare request data
      const requestData = {
        oauth_token,
        oauth_verifier
      };

      if (role) {
        console.log('Setting role in request:', role, typeof role);
        requestData.role = role;
      }

      const response = await api.post('/users/auth/twitter/callback', requestData);
      console.log('Twitter login response:', response.data);

      // If user doesn't exist, return the response data for role selection
      if (response.data.user_exists === false) {
        return response.data;
      }

      // If user exists, set the tokens and return the user data
      if (response.data.access_token && response.data.refresh_token) {
        const { access_token, refresh_token } = response.data;
        setAuthTokens(access_token, refresh_token, true);

        // Store username, full name, and role in localStorage for easy access
        if (response.data.user && response.data.user.username) {
          localStorage.setItem('username', response.data.user.username);
          console.log('Username stored in localStorage (from Twitter login):', response.data.user.username);

          // Store the user's role
          if (response.data.user.role) {
            localStorage.setItem('userRole', response.data.user.role);
            console.log('User role stored in localStorage (from Twitter login):', response.data.user.role);
          }

          // Also store the user's full name if available
          if (response.data.user.first_name || response.data.user.last_name) {
            const fullName = `${response.data.user.first_name || ''} ${response.data.user.last_name || ''}`.trim();
            if (fullName) {
              localStorage.setItem('fullName', fullName);
              console.log('Full name stored in localStorage (from Twitter login):', fullName);
            }
          }
        }

        return response.data.user;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Twitter login error:', error);
      if (error.response) {
        throw error.response.data || { message: 'Twitter login failed' };
      } else if (error.request) {
        throw { message: 'No response received from server. Please try again.' };
      } else {
        throw { message: error.message || 'Twitter login failed' };
      }
    }
  }
};

export default AuthService;
