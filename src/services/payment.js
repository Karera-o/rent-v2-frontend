import api from './api';
import PaymentDebugService from './payment-debug';

const PaymentService = {
  /**
   * Get Stripe publishable key
   * @returns {Promise} - Promise with Stripe publishable key
   */
  getStripePublicKey: async () => {
    console.log('[PaymentService] Fetching Stripe public key');
    PaymentDebugService.logApiRequest('/payments/public-key', 'GET');
    
    try {
      // Use the exact endpoint from the documentation
      const response = await api.get('/payments/public-key');
      console.log('[PaymentService] Stripe public key fetched successfully:', response.data);
      
      PaymentDebugService.logApiResponse('/payments/public-key', 'GET', response.status, { 
        publishable_key: response.data.publishable_key ? '[REDACTED]' : 'missing' 
      });
      
      return response.data.publishable_key;
    } catch (error) {
      console.error('[PaymentService] Error fetching Stripe public key:', error);
      
      PaymentDebugService.logError('Failed to fetch Stripe public key', error);
      
      // Check for rate limiting (429) or other specific errors
      if (error.response && error.response.status === 429) {
        throw { message: 'Rate limit exceeded. Please try again later.', isRateLimit: true };
      }
      throw error.response?.data || { message: 'Failed to fetch Stripe public key' };
    }
  },

  /**
   * Create a payment intent for a booking
   * @param {number} bookingId - Booking ID
   * @param {Object} options - Additional options
   * @returns {Promise} - Promise with payment intent data
   */
  createPaymentIntent: async (bookingId, options = {}) => {
    console.log(`[PaymentService] Creating payment intent for booking ID: ${bookingId}, options:`, options);
    
    try {
      // Determine if we should use the authenticated or guest endpoint
      const isAuthenticated = typeof window !== 'undefined' && (localStorage.getItem('token') || localStorage.getItem('accessToken'));
      console.log(`[PaymentService] User authentication status: ${isAuthenticated ? 'Authenticated' : 'Guest'}`);
      
      let endpoint = '/api/payments/intents';
      let headers = {};
      
      // For unauthenticated users, use the guest endpoint
      if (!isAuthenticated) {
        endpoint = '/api/payments/guest/intent';
        console.log('[PaymentService] Using guest endpoint for payment intent:', endpoint);
      } else {
        // Add authorization header if authenticated
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        headers = { Authorization: `Bearer ${token}` };
        console.log('[PaymentService] Using authenticated endpoint for payment intent:', endpoint);
      }
      
      // Create request body, ensure setup_future_usage parameter is used correctly
      const requestBody = {
        booking_id: bookingId
      };
      
      // Add setup_future_usage if provided
      if (options.setup_future_usage) {
        requestBody.setup_future_usage = options.setup_future_usage;
      } else if (options.setupFutureUsage) {
        // For backward compatibility
        requestBody.setup_future_usage = options.setupFutureUsage;
      }
      
      console.log('[PaymentService] Creating payment intent with request body:', requestBody);
      
      PaymentDebugService.logApiRequest(endpoint, 'POST', requestBody);
      
      const response = await api.post(endpoint, requestBody, { headers });
      
      console.log(`[PaymentService] Payment intent created successfully:`, response.data);
      
      PaymentDebugService.logApiResponse(endpoint, 'POST', response.status, {
        id: response.data.id,
        status: response.data.status || 'unknown',
        amount: response.data.amount,
        has_client_secret: !!(response.data.client_secret || response.data.stripe_client_secret)
      });
      
      // Format the response to ensure consistent structure
      const formattedResponse = {
        id: response.data.id,
        stripe_client_secret: response.data.client_secret || response.data.stripe_client_secret,
        amount: response.data.amount,
        currency: response.data.currency || 'usd',
        status: response.data.status || 'requires_payment_method'
      };
      
      console.log('[PaymentService] Formatted payment intent response:', formattedResponse);
      return formattedResponse;
    } catch (error) {
      console.error('[PaymentService] Error creating payment intent:', error);
      
      PaymentDebugService.logError('Failed to create payment intent', error);
      
      // Handle rate limiting specifically
      if (error.response && error.response.status === 429) {
        throw { message: 'Rate limit exceeded. Please try again later.', isRateLimit: true };
      }
      
      if (error.response) {
        console.error('[PaymentService] Error response status:', error.response.status);
        console.error('[PaymentService] Error response data:', error.response.data);
        console.error('[PaymentService] Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('[PaymentService] Error request:', error.request);
      } else {
        console.error('[PaymentService] Error message:', error.message);
      }
      
      throw error.response?.data || { message: 'Failed to create payment intent' };
    }
  },

  /**
   * Process a payment
   * @param {string} paymentIntentId - Stripe payment intent ID
   * @param {string} paymentMethodId - Stripe payment method ID
   * @param {boolean} savePaymentMethod - Whether to save the payment method
   * @param {number} bookingId - The booking ID associated with this payment
   * @returns {Promise} - Promise with payment result
   */
  processPayment: async (paymentIntentId, paymentMethodId, savePaymentMethod = false, bookingId = null) => {
    console.log(`[PaymentService] Processing payment for intent: ${paymentIntentId}`);
    console.log(`[PaymentService] Payment method ID: ${paymentMethodId || 'Not provided'}`);
    console.log(`[PaymentService] Save payment method: ${savePaymentMethod}`);
    console.log(`[PaymentService] Booking ID: ${bookingId || 'Not provided directly'}`);
    
    try {
      // Check if user is authenticated
      const isAuthenticated = typeof window !== 'undefined' && (localStorage.getItem('token') || localStorage.getItem('accessToken'));
      console.log(`[PaymentService] User authentication status: ${isAuthenticated ? 'Authenticated' : 'Guest'}`);
      
      // If no booking ID was provided, try to find it in cached data
      if (!bookingId) {
        console.log('[PaymentService] No booking ID provided, attempting to find in cache');
        
        // Extract booking ID from cached payment intent if available
        const cachedIntentKey = `payment_intent_${paymentIntentId}`;
        
        if (typeof window !== 'undefined') {
          try {
            const cachedIntent = localStorage.getItem(cachedIntentKey);
            if (cachedIntent) {
              const parsedIntent = JSON.parse(cachedIntent);
              bookingId = parsedIntent.booking_id || parsedIntent.booking?.id;
              console.log(`[PaymentService] Found booking ID from cached intent: ${bookingId}`);
            }
          } catch (e) {
            console.error('[PaymentService] Error parsing cached intent for booking ID:', e);
          }
        }
      }
      
      // Build payload based on user type
      let endpoint = '/api/payments/confirm';
      let payload = {
        payment_intent_id: paymentIntentId,
        data: {
          booking_id: bookingId
        }
      };
      
      // For unauthenticated users, use guest endpoint
      if (!isAuthenticated) {
        endpoint = '/payments/guest/confirm';
        payload = {
          payment_intent_id: paymentIntentId,
          booking_id: bookingId
        };
        
        // Only include optional fields if they have values
        if (paymentMethodId) {
          payload.payment_method_id = paymentMethodId;
        }
        
        console.log('[PaymentService] Using guest endpoint for payment confirmation:', endpoint);
      } else {
        // Add additional fields for authenticated users
        if (paymentMethodId) {
          payload.payment_method_id = paymentMethodId;
        }
        
        if (savePaymentMethod) {
          payload.save_payment_method = savePaymentMethod;
        }
        
        console.log('[PaymentService] Using authenticated endpoint for payment confirmation:', endpoint);
      }
      
      console.log('[PaymentService] Confirming payment with payload:', JSON.stringify(payload, null, 2));
      
      PaymentDebugService.logApiRequest(endpoint, 'POST', payload);
      
      const response = await api.post(endpoint, payload);
      
      console.log('[PaymentService] Payment confirmation successful:', response.data);
      
      PaymentDebugService.logApiResponse(endpoint, 'POST', response.status, {
        id: response.data.id,
        status: response.data.status || 'unknown'
      });
      
      return response.data;
    } catch (error) {
      console.error('[PaymentService] Error processing payment:', error);
      
      PaymentDebugService.logError('Failed to process payment', error);
      
      // Log the full error details to help debug
      if (error.response) {
        console.error('[PaymentService] Error response status:', error.response.status);
        console.error('[PaymentService] Error response data:', error.response.data);
        console.error('[PaymentService] Error response headers:', error.response.headers);
        
        // Log specific status code to make it more visible
        if (error.response.status === 422) {
          console.error('[PaymentService] VALIDATION ERROR (422) - Server rejected the request payload');
          console.error('[PaymentService] This usually means the payload format is incorrect');
          
          PaymentDebugService.addLog('ERROR', 'Validation Error (422) - Server rejected the request', {
            paymentIntentId,
            paymentMethodId,
            savePaymentMethod,
            responseData: error.response.data
          });
        }
      } else if (error.request) {
        console.error('[PaymentService] Error request:', error.request);
      } else {
        console.error('[PaymentService] Error message:', error.message);
      }
      
      // Handle rate limiting specifically
      if (error.response && error.response.status === 429) {
        throw { message: 'Rate limit exceeded. Please try again later.', isRateLimit: true };
      }
      
      // Return a more descriptive error message
      throw error.response?.data || { message: 'Failed to process payment' };
    }
  },

  /**
   * Get saved payment methods for the current user
   * @returns {Promise} - Promise with payment methods data
   */
  getSavedPaymentMethods: async () => {
    try {
      // Add authorization header
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await api.get('/payments/methods', { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error.response?.data || { message: 'Failed to fetch payment methods' };
    }
  },

  /**
   * Save a payment method
   * @param {string} paymentMethodId - Payment method ID
   * @param {boolean} setAsDefault - Whether to set as default
   * @returns {Promise} - Promise with saved payment method data
   */
  savePaymentMethod: async (paymentMethodId, setAsDefault = true) => {
    try {
      // Add authorization header
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await api.post('/payments/methods', {
        payment_method_id: paymentMethodId,
        set_as_default: setAsDefault
      }, { headers });
      
      return response.data;
    } catch (error) {
      console.error('Error saving payment method:', error);
      throw error.response?.data || { message: 'Failed to save payment method' };
    }
  },

  /**
   * Get payment details by ID
   * @param {number} id - Payment ID
   * @returns {Promise} - Promise with payment details
   */
  getPaymentById: async (id) => {
    try {
      const response = await api.get(`/payments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payment ${id}:`, error);
      throw error.response?.data || { message: 'Failed to fetch payment details' };
    }
  },

  /**
   * Get all payments for a specific booking
   * @param {number} bookingId - Booking ID
   * @param {Object} filters - Filter parameters
   * @param {number} page - Page number
   * @param {number} pageSize - Number of items per page
   * @returns {Promise} - Promise with paginated payment data
   */
  getBookingPayments: async (bookingId, filters = {}, page = 1, pageSize = 10) => {
    try {
      console.log(`Fetching payments for booking ID: ${bookingId}`);

      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('page_size', pageSize);

      // Add any additional filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/payments/booking/${bookingId}?${queryParams.toString()}`);
      console.log(`Payments received for booking ID ${bookingId}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payments for booking ${bookingId}:`, error);
      throw error.response?.data || { message: 'Failed to fetch booking payments' };
    }
  },

  /**
   * Get all payments for the current user (landlord/agent)
   * @param {Object} filters - Filter parameters
   * @param {number} page - Page number
   * @param {number} pageSize - Number of items per page
   * @returns {Promise} - Promise with paginated payment data
   */
  getUserPayments: async (filters = {}, page = 1, pageSize = 10) => {
    try {
      console.log('Fetching landlord payments with filters:', filters);

      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('page_size', pageSize);

      // Add any additional filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      // Use the new landlord payments endpoint
      const response = await api.get(`/payments/landlord?${queryParams.toString()}`);
      
      if (!response.data || !response.data.items) {
        console.error('Invalid payment response:', response);
        return {
          total: 0,
          page: page,
          page_size: pageSize,
          total_pages: 0,
          items: []
        };
      }

      // Process payments to ensure tenant data is available
      const processedPayments = response.data.items.map(payment => {
        // Make sure booking has tenant data
        if (payment.booking && !payment.booking.tenant) {
          return {
            ...payment,
            booking: {
              ...payment.booking,
              tenant: {
                id: null,
                username: payment.booking.guest_name || 'Guest',
                first_name: '',
                last_name: ''
              }
            }
          };
        }
        return payment;
      });

      const result = {
        total: response.data.total,
        page: response.data.page,
        page_size: response.data.page_size,
        total_pages: response.data.total_pages,
        items: processedPayments
      };

      console.log('Landlord payments processed:', result);
      return result;
    } catch (error) {
      console.error('Error fetching landlord payments:', error);
      
      // If the endpoint is not available, fall back to the old method
      console.log('Falling back to old method for fetching payments');
      return PaymentService._getLandlordPaymentsLegacy(filters, page, pageSize);
    }
  },

  /**
   * Legacy method to get landlord payments (fallback if the new endpoint is not available)
   * @private
   */
  _getLandlordPaymentsLegacy: async (filters = {}, page = 1, pageSize = 10) => {
    try {
      // First, get all bookings for the landlord
      const BookingService = (await import('./booking')).default;
      const bookingsResponse = await BookingService.getOwnerBookings({}, 1, 100);

      if (!bookingsResponse || !bookingsResponse.items || !Array.isArray(bookingsResponse.items)) {
        console.error('Invalid bookings response:', bookingsResponse);
        return {
          total: 0,
          page: page,
          page_size: pageSize,
          total_pages: 0,
          items: []
        };
      }

      // Get all booking IDs
      const bookingIds = bookingsResponse.items.map(booking => booking.id);

      // If no bookings, return empty result
      if (bookingIds.length === 0) {
        return {
          total: 0,
          page: page,
          page_size: pageSize,
          total_pages: 0,
          items: []
        };
      }

      // For each booking, get the payments
      const allPayments = [];

      // We'll use Promise.all to fetch payments for all bookings in parallel
      await Promise.all(bookingIds.map(async (bookingId) => {
        try {
          // Build query parameters for each booking
          const queryParams = new URLSearchParams();
          queryParams.append('page', 1);
          queryParams.append('page_size', 100); // Get all payments for each booking

          // Add any additional filters
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              queryParams.append(key, value);
            }
          });

          const response = await api.get(`/payments/booking/${bookingId}?${queryParams.toString()}`);

          if (response.data && response.data.items && Array.isArray(response.data.items)) {
            allPayments.push(...response.data.items);
          }
        } catch (err) {
          console.error(`Error fetching payments for booking ${bookingId}:`, err);
          // Continue with other bookings even if one fails
        }
      }));

      // Process payments to ensure tenant data is available
      const processedPayments = allPayments.map(payment => {
        // Make sure booking has tenant data
        if (payment.booking && !payment.booking.tenant) {
          return {
            ...payment,
            booking: {
              ...payment.booking,
              tenant: {
                id: null,
                username: payment.booking.guest_name || 'Guest',
                first_name: '',
                last_name: ''
              }
            }
          };
        }
        return payment;
      });

      // Sort payments by date (newest first)
      processedPayments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      // Apply pagination manually
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedPayments = processedPayments.slice(startIndex, endIndex);

      // Calculate total pages
      const totalPages = Math.ceil(processedPayments.length / pageSize);

      const result = {
        total: processedPayments.length,
        page: page,
        page_size: pageSize,
        total_pages: totalPages,
        items: paginatedPayments
      };

      console.log('User payments processed (legacy method):', result);
      return result;
    } catch (error) {
      console.error('Error fetching user payments (legacy method):', error);
      throw error.response?.data || { message: 'Failed to fetch payments' };
    }
  },

  /**
   * Get payment statistics for the landlord/agent
   * @returns {Promise} - Promise with payment statistics
   */
  getPaymentStatistics: async () => {
    try {
      // Use our updated getUserPayments method to get all payments
      // We'll set a large page size to get as many payments as possible
      const response = await PaymentService.getUserPayments({}, 1, 1000);

      // Calculate statistics from the payments data
      const payments = response.items || [];

      const completedPayments = payments.filter(p => p.status === 'completed');
      const pendingPayments = payments.filter(p => p.status === 'pending');

      const totalRevenue = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
      const completedRevenue = completedPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
      const pendingRevenue = pendingPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

      return {
        totalRevenue,
        completedRevenue,
        pendingRevenue,
        totalPayments: payments.length,
        completedPayments: completedPayments.length,
        pendingPayments: pendingPayments.length
      };
    } catch (error) {
      console.error('Error fetching payment statistics:', error);
      throw error.response?.data || { message: 'Failed to fetch payment statistics' };
    }
  },

  /**
   * Create a quick payment intent for a booking (simplified version)
   * This method uses the quick-intent endpoint which only requires booking_id
   * @param {number} bookingId - Booking ID
   * @returns {Promise} - Promise with payment intent data
   */
  createQuickPaymentIntent: async (bookingId) => {
    console.log(`[PaymentService] Creating quick payment intent for booking ID: ${bookingId}`);
    
    try {
      const endpoint = `/payments/quick-intent`;
      
      const requestBody = {
        booking_id: bookingId
      };
      
      console.log(`[PaymentService] Using quick intent endpoint: ${endpoint}`);
      console.log(`[PaymentService] Request body:`, requestBody);
      
      PaymentDebugService.logApiRequest(endpoint, 'POST', {});
      
      const response = await api.post(endpoint, requestBody);
  //     const endpoint = '/payments/guest-intents';
  
  // const requestBody = {
  //   booking_id: bookingId,
  //   setup_future_usage: null
  // };
  
  // console.log(`[PaymentService] Using guest intents endpoint: ${endpoint}`);
  // console.log(`[PaymentService] Request body:`, requestBody);
  
  // PaymentDebugService.logApiRequest(endpoint, 'POST', requestBody);
  
  // const response = await api.post(endpoint, requestBody);
      
  //     console.log(`[PaymentService] Quick payment intent created successfully:`, response.data);
      
      PaymentDebugService.logApiResponse(endpoint, 'POST', response.status, {
        id: response.data.id,
        amount: response.data.amount,
        has_client_secret: !!response.data.client_secret
      });
      
      // Format the response to ensure consistent structure
      const formattedResponse = {
        id: response.data.id,
        client_secret: response.data.client_secret,
        amount: response.data.amount,
        currency: response.data.currency || 'usd'
      };
      
      console.log('[PaymentService] Formatted quick payment intent response:', formattedResponse);
      return formattedResponse;
    } catch (error) {
      console.error('[PaymentService] Error creating quick payment intent:', error);
      
      PaymentDebugService.logError('Failed to create quick payment intent', error);
      
      // Handle rate limiting specifically
      if (error.response && error.response.status === 429) {
        throw { message: 'Rate limit exceeded. Please try again later.', isRateLimit: true };
      }
      
      if (error.response) {
        console.error('[PaymentService] Error response status:', error.response.status);
        console.error('[PaymentService] Error response data:', error.response.data);
      }
      
      throw error.response?.data || { message: 'Failed to create quick payment intent' };
    }
  }
};

export default PaymentService;
