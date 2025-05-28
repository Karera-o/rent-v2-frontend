import axios from 'axios';

// Create a new instance of axios with the backend API URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Add a request interceptor to handle server-side calls
api.interceptors.request.use(
  async (config) => {
    // Server-side API calls don't need authorization from client cookies
    // If needed, you could add server-side auth here in the future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Log errors for debugging
    console.error('API Error:', error.response?.data || error.message);
    
    // Pass the error along to the calling code
    return Promise.reject(error);
  }
);

export default api; 