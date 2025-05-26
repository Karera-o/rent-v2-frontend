"use client";

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { AlertCircle, CheckCircle, WifiOff } from 'lucide-react';

export function ApiStatusIndicator() {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Try to make a simple request to the API
        const response = await api.get('/payments/public-key', { timeout: 5000 });
        
        if (response.status === 200) {
          setStatus('connected');
          setError(null);
        } else {
          setStatus('error');
          setError(`Unexpected status: ${response.status}`);
        }
      } catch (err) {
        console.error('API Status check error:', err);
        
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (err.response.status === 422) {
            // This is likely a misconfiguration issue
            setStatus('error');
            setError('API request validation error (422). Check payload format.');
          } else if (err.response.status === 429) {
            // Rate limit error
            setStatus('warning');
            setError('API rate limit reached (429). Using mock data.');
          } else {
            setStatus('error');
            setError(`API Error: ${err.response.status}`);
          }
        } else if (err.request) {
          // The request was made but no response was received
          setStatus('disconnected');
          setError('No response from API server. Check connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          setStatus('error');
          setError(`Request setup error: ${err.message}`);
        }
      }
    };
    
    // Only show in development mode
    if (process.env.NODE_ENV === 'development') {
      checkApiStatus();
      
      // Check every 30 seconds
      const interval = setInterval(checkApiStatus, 30000);
      return () => clearInterval(interval);
    }
  }, []);
  
  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  // Don't show anything while checking
  if (status === 'checking') {
    return null;
  }
  
  let icon = null;
  let bgColor = '';
  let textColor = '';
  
  switch (status) {
    case 'connected':
      icon = <CheckCircle className="h-3 w-3 mr-1" />;
      bgColor = 'bg-green-50';
      textColor = 'text-green-700';
      break;
    case 'warning':
      icon = <AlertCircle className="h-3 w-3 mr-1" />;
      bgColor = 'bg-amber-50';
      textColor = 'text-amber-700';
      break;
    case 'disconnected':
      icon = <WifiOff className="h-3 w-3 mr-1" />;
      bgColor = 'bg-gray-50';
      textColor = 'text-gray-700';
      break;
    case 'error':
      icon = <AlertCircle className="h-3 w-3 mr-1" />;
      bgColor = 'bg-red-50';
      textColor = 'text-red-700';
      break;
    default:
      return null;
  }
  
  return (
    <div className={`fixed top-2 right-2 z-50 ${bgColor} ${textColor} text-xs px-2 py-1 rounded-md border border-gray-200 flex items-center shadow-sm`}>
      {icon}
      <span>
        {status === 'connected' ? 'API: OK' : error}
      </span>
    </div>
  );
}

export default ApiStatusIndicator; 