import api from './api';

const PaymentService = {
  /**
   * Get Stripe publishable key
   * @returns {Promise} - Promise with Stripe publishable key
   */
  getStripePublicKey: async () => {
    try {
      const response = await api.get('/payments/public-key');
      return response.data.publishable_key;
    } catch (error) {
      console.error('Error fetching Stripe public key:', error);
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
    try {
      console.log(`Creating payment intent for booking ID: ${bookingId}`);
      const response = await api.post('/payments/intents', {
        booking_id: bookingId,
        setup_future_usage: options.setupFutureUsage
      });
      console.log(`Payment intent created for booking ID ${bookingId}:`, response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      throw error.response?.data || { message: 'Failed to create payment intent' };
    }
  },

  /**
   * Process a payment
   * @param {string} paymentIntentId - Stripe payment intent ID
   * @param {string} paymentMethodId - Stripe payment method ID
   * @param {boolean} savePaymentMethod - Whether to save the payment method
   * @returns {Promise} - Promise with payment result
   */
  processPayment: async (paymentIntentId, paymentMethodId, savePaymentMethod = false) => {
    try {
      const response = await api.post('/payments/confirm', {
        payment_intent_id: paymentIntentId,
        payment_method_id: paymentMethodId,
        save_payment_method: savePaymentMethod
      });
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error.response?.data || { message: 'Failed to process payment' };
    }
  },

  /**
   * Get saved payment methods for the current user
   * @returns {Promise} - Promise with payment methods data
   */
  getSavedPaymentMethods: async () => {
    try {
      const response = await api.get('/payments/methods');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error.response?.data || { message: 'Failed to fetch payment methods' };
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
  }
};

export default PaymentService;
