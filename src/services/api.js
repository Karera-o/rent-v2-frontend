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

console.log('[API] Initialized with baseURL:', api.defaults.baseURL);

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    console.log(`[API] Request: ${config.method.toUpperCase()} ${config.url}`);
    
    // Log request data if present (but don't log large form data)
    if (config.data && !(config.data instanceof FormData)) {
      console.log('[API] Request data:', config.data);
    } else if (config.data instanceof FormData) {
      console.log('[API] Request contains FormData (contents not logged)');
    }
    
    // Try to get token from multiple sources
    let token = localStorage.getItem('accessToken');

    // If not in localStorage, try cookies
    if (!token) {
      token = Cookies.get('accessToken');

      // If found in cookies but not in localStorage, sync them
      if (token) {
        console.log('[API] Syncing token from cookies to localStorage');
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
        console.log('[API] Syncing token from localStorage to cookies');
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
      console.log('[API] Adding auth token to request:', config.url);
    } else {
      console.log('[API] No auth token available for request:', config.url);
    }

    // Don't set Content-Type for FormData (let browser set it with boundary)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      console.log('[API] FormData detected, removing Content-Type header');
    }

    // Log the full headers being sent
    console.log('[API] Request headers:', config.headers);

    return config;
  },
  (error) => {
    console.error('[API] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response from ${response.config.url}:`, {
      status: response.status,
      statusText: response.statusText,
      // Don't log full response data as it might be large
      dataPreview: typeof response.data === 'object' ? '[Object data]' : response.data
    });
    return response;
  },
  async (error) => {
    console.error(`[API] Error response:`, {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });

    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('[API] 401 Unauthorized error - attempting token refresh');

      try {
        // Try to refresh the token
        let refreshToken = localStorage.getItem('refreshToken');

        // If not in localStorage, try cookies
        if (!refreshToken) {
          refreshToken = Cookies.get('refreshToken');
        }

        if (!refreshToken) {
          console.error('[API] No refresh token available');
          throw new Error('No refresh token available');
        }

        console.log('[API] Attempting to refresh token');
        const response = await axios.post('/api/token/refresh', {
          refresh: refreshToken,
        }, {
          withCredentials: true,
          baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002/api'
        });

        console.log('[API] Token refresh successful:', response.data);
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
        console.log('[API] Retrying original request with new token');
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        console.error('[API] Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        Cookies.remove('jwt');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    } else if (error.response?.status === 422) {
      // Special handling for validation errors
      console.error('[API] Validation error (422):', {
        url: error.config?.url,
        requestData: error.config?.data,
        responseData: error.response?.data
      });
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

  console.log(`[API] Setting tokens with expiration: access=${accessExpires} days, refresh=${refreshExpires} days`);

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
  console.log('[API] Clearing all auth tokens');
  // Clear from localStorage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  // Clear from cookies
  Cookies.remove('accessToken', { path: '/' });
  Cookies.remove('refreshToken', { path: '/' });
  Cookies.remove('jwt', { path: '/' });
};

export default api;
