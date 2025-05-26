import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies to be sent with requests
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Try to get token from multiple sources
    let token = localStorage.getItem('accessToken');

    // If not in localStorage, try cookies
    if (!token) {
      token = Cookies.get('accessToken');

      // If found in cookies but not in localStorage, sync them
      if (token) {
        console.log('Syncing token from cookies to localStorage');
        localStorage.setItem('accessToken', token);
        const refreshToken = Cookies.get('refreshToken');
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
      }
    } else {
      // If found in localStorage but not in cookies, sync them
      const cookieToken = Cookies.get('accessToken');
      if (!cookieToken) {
        console.log('Syncing token from localStorage to cookies');
        Cookies.set('accessToken', token, {
          expires: 1,
          path: '/',
          sameSite: 'Lax'
        });

        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          Cookies.set('refreshToken', refreshToken, {
            expires: 7,
            path: '/',
            sameSite: 'Lax'
          });
        }
      }
    }

    // Add Authorization header if we have a token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding auth token to request:', config.url);
    } else {
      console.log('No auth token available for request:', config.url);
    }

    // Don't set Content-Type for FormData (let browser set it with boundary)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      console.log('FormData detected, removing Content-Type header');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        let refreshToken = localStorage.getItem('refreshToken');

        // If not in localStorage, try cookies
        if (!refreshToken) {
          refreshToken = Cookies.get('refreshToken');
        }

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        console.log('Attempting to refresh token');
        const response = await axios.post('/api/token/refresh', {
          refresh: refreshToken,
        }, {
          withCredentials: true,
          baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002/api'
        });

        console.log('Token refresh response:', response.data);
        const { access } = response.data;

        // Update tokens in both localStorage and cookies
        localStorage.setItem('accessToken', access);
        Cookies.set('accessToken', access, {
          expires: 1,
          path: '/',
          sameSite: 'Lax'
        });

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        Cookies.remove('jwt');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper functions for token management
export const setAuthTokens = (access, refresh, rememberMe = false) => {
  // Store in localStorage for client-side access
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);

  // Calculate expiration based on rememberMe
  const accessExpires = rememberMe ? 7 : 1; // 7 days if remember me, 1 day if not
  const refreshExpires = rememberMe ? 30 : 7; // 30 days if remember me, 7 days if not

  console.log(`Setting tokens with expiration: access=${accessExpires} days, refresh=${refreshExpires} days`);

  // Also set in cookies for cross-tab persistence
  // Set cookies with appropriate settings
  Cookies.set('accessToken', access, {
    expires: accessExpires, // days
    path: '/',
    sameSite: 'Lax'
  });

  Cookies.set('refreshToken', refresh, {
    expires: refreshExpires, // days
    path: '/',
    sameSite: 'Lax'
  });

  // The JWT cookie should also be set by the server with HttpOnly flag
};

export const clearAuthTokens = () => {
  // Clear from localStorage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  // Clear from cookies
  Cookies.remove('accessToken', { path: '/' });
  Cookies.remove('refreshToken', { path: '/' });
  Cookies.remove('jwt', { path: '/' });
};

export default api;
