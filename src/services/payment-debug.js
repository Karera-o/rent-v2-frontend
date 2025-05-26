/**
 * Payment Debug Service
 * 
 * This service helps with tracking and debugging payment-related issues
 * by providing centralized logging and error tracking functions.
 */

// Store debug logs in memory (will be cleared on page refresh)
const debugLogs = [];
const MAX_LOGS = 50;

// Function to add a log entry
const addLog = (type, message, data = null) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type,
    message,
    data
  };
  
  console.log(`[PaymentDebug] ${type}: ${message}`, data || '');
  
  // Add to beginning of array to show newest first
  debugLogs.unshift(logEntry);
  
  // Limit number of logs kept in memory
  if (debugLogs.length > MAX_LOGS) {
    debugLogs.pop();
  }
  
  // In development, also store in localStorage for persistence
  if (process.env.NODE_ENV === 'development') {
    try {
      localStorage.setItem('payment_debug_logs', JSON.stringify(debugLogs));
    } catch (err) {
      console.error('[PaymentDebug] Failed to store logs in localStorage:', err);
    }
  }
  
  return logEntry;
};

// Function to collect payment-related information
const collectPaymentInfo = (paymentData = {}) => {
  const { 
    paymentIntent, 
    cardElement, 
    clientSecret, 
    stripeResponse,
    backendResponse,
    error
  } = paymentData;
  
  const info = {
    timestamp: new Date().toISOString(),
    paymentIntent: paymentIntent ? {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      hasClientSecret: !!paymentIntent.stripe_client_secret || !!paymentIntent.client_secret
    } : null,
    cardComplete: cardElement?.complete || false,
    clientSecret: clientSecret ? `${clientSecret.substring(0, 10)}...` : null,
    stripeResponse: stripeResponse ? {
      status: stripeResponse.status,
      paymentIntentId: stripeResponse.id,
      paymentMethodId: stripeResponse.payment_method
    } : null,
    backendResponse: backendResponse || null,
    error: error ? {
      message: error.message,
      code: error.code,
      type: error.type,
      responseStatus: error.response?.status,
      responseData: error.response?.data
    } : null,
    environment: {
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
      isAuthenticated: !!localStorage.getItem('token') || !!localStorage.getItem('accessToken'),
      mockMode: !!localStorage.getItem('use_mock_implementation')
    }
  };
  
  addLog('INFO', 'Payment debug information collected', info);
  return info;
};

// Function to log an API request
const logApiRequest = (endpoint, method, data) => {
  const logEntry = addLog('API_REQUEST', `${method} ${endpoint}`, data);
  return logEntry;
};

// Function to log an API response
const logApiResponse = (endpoint, method, status, data) => {
  const logEntry = addLog('API_RESPONSE', `${method} ${endpoint} (${status})`, data);
  return logEntry;
};

// Function to log errors
const logError = (message, error) => {
  const errorDetails = {
    message: error.message,
    stack: error.stack,
    response: error.response ? {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data
    } : null
  };
  
  const logEntry = addLog('ERROR', message, errorDetails);
  return logEntry;
};

// Function to get all logs
const getLogs = () => {
  return [...debugLogs];
};

// Function to clear logs
const clearLogs = () => {
  debugLogs.length = 0;
  
  // Also clear from localStorage
  if (process.env.NODE_ENV === 'development') {
    localStorage.removeItem('payment_debug_logs');
  }
};

// Load any existing logs from localStorage on initialization
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  try {
    const savedLogs = localStorage.getItem('payment_debug_logs');
    if (savedLogs) {
      const parsedLogs = JSON.parse(savedLogs);
      if (Array.isArray(parsedLogs)) {
        parsedLogs.forEach(log => debugLogs.push(log));
        console.log(`[PaymentDebug] Loaded ${parsedLogs.length} logs from localStorage`);
      }
    }
  } catch (err) {
    console.error('[PaymentDebug] Failed to load logs from localStorage:', err);
  }
}

const PaymentDebugService = {
  addLog,
  collectPaymentInfo,
  logApiRequest,
  logApiResponse,
  logError,
  getLogs,
  clearLogs
};

export default PaymentDebugService; 