import api from './api';

const BookingService = {
  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise} - Promise with created booking data
   */
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings/', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error.response?.data || { message: 'Failed to create booking' };
    }
  },

  /**
   * Create a new booking for a guest (non-authenticated user)
   * @param {Object} bookingData - Booking data with guest information
   * @returns {Promise} - Promise with created booking data
   */
  createGuestBooking: async (bookingData) => {
    try {
      console.log('Creating guest booking with data:', bookingData);
      const response = await api.post('/bookings/guest', bookingData);
      console.log('Guest booking created successfully:', response.data);
      
      // Cache guest booking information for future access
      if (response.data && response.data.id && typeof window !== 'undefined') {
        const cachedBookingKey = `guest_booking_${response.data.id}`;
        const guestInfo = {
          ...response.data,
          guest_email: bookingData.guest_email || bookingData.user_info?.email,
          cached_at: new Date().toISOString()
        };
        localStorage.setItem(cachedBookingKey, JSON.stringify(guestInfo));
        console.log(`Cached guest booking data for ID ${response.data.id} with email: ${guestInfo.guest_email}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating guest booking:', error);
      throw error.response?.data || { message: 'Failed to create guest booking' };
    }
  },

  /**
   * Get booking details by ID
   * @param {number} id - Booking ID
   * @param {string} guestEmail - Guest email (required for unauthenticated users)
   * @returns {Promise} - Promise with booking details
   */
  getBookingById: async (id, guestEmail = null) => {
    try {
      console.log(`Fetching booking with ID: ${id}`);
      
      // Check if user is authenticated
      const isAuthenticated = typeof window !== 'undefined' && (localStorage.getItem('token') || localStorage.getItem('accessToken'));
      console.log(`User authentication status: ${isAuthenticated ? 'Authenticated' : 'Guest'}`);
      
      let response;
      
      if (isAuthenticated) {
        // For authenticated users, use the protected endpoint
        console.log(`Using authenticated endpoint for booking ${id}`);
        response = await api.get(`/bookings/${id}`);
      } else {
        // For guest users, use the guest-access endpoint
        console.log(`Using guest-access endpoint for booking ${id}`);
        
        // If no guest email provided, try to get it from localStorage (cached from booking creation)
        let emailToUse = guestEmail;
        if (!emailToUse && typeof window !== 'undefined') {
          // Try to get guest email from cached booking data
          const cachedBookingKey = `guest_booking_${id}`;
          const cachedBooking = localStorage.getItem(cachedBookingKey);
          if (cachedBooking) {
            try {
              const parsedBooking = JSON.parse(cachedBooking);
              emailToUse = parsedBooking.guest_email;
              console.log(`Using cached guest email for booking ${id}: ${emailToUse}`);
            } catch (e) {
              console.error('Error parsing cached booking data:', e);
            }
          }
        }
        
        if (!emailToUse) {
          throw new Error('Guest email is required to access booking details');
        }
        
        response = await api.post(`/bookings/${id}/guest-access`, {
          guest_email: emailToUse
        });
      }
      
      console.log(`Booking data received for ID ${id}:`, response.data);
      
      // Cache guest booking data for future reference
      if (!isAuthenticated && response.data && typeof window !== 'undefined') {
        const cachedBookingKey = `guest_booking_${id}`;
        localStorage.setItem(cachedBookingKey, JSON.stringify(response.data));
        console.log(`Cached guest booking data for future access: ${id}`);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error);
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      throw error.response?.data || { message: 'Failed to fetch booking details' };
    }
  },

  /**
   * Get all bookings for the current tenant
   * @param {Object} filters - Filter parameters
   * @param {number} page - Page number
   * @param {number} pageSize - Number of items per page
   * @returns {Promise} - Promise with paginated booking data
   */
  getTenantBookings: async (filters = {}, page = 1, pageSize = 10) => {
    try {
      console.log('Fetching tenant bookings with filters:', filters);

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

      // Use the standard API client instead of direct fetch
      const response = await api.get(`/bookings/tenant?${queryParams.toString()}`);
      console.log('Tenant bookings received:', response.data);

      // Validate response structure
      if (!response.data || !Array.isArray(response.data.items)) {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from server');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching tenant bookings:', error);
      // Propagate the error instead of returning mock data
      throw error.response?.data || { message: 'Failed to fetch bookings' };
    }
  },

  /**
   * Cancel a booking
   * @param {number} id - Booking ID
   * @returns {Promise} - Promise with updated booking data
   */
  cancelBooking: async (id) => {
    try {
      const response = await api.put(`/bookings/${id}`, {
        status: 'cancelled'
      });
      return response.data;
    } catch (error) {
      console.error(`Error cancelling booking ${id}:`, error);
      throw error.response?.data || { message: 'Failed to cancel booking' };
    }
  },

  /**
   * Get all bookings for properties owned by the current landlord/agent
   * @param {Object} filters - Filter parameters
   * @param {number} page - Page number
   * @param {number} pageSize - Number of items per page
   * @returns {Promise} - Promise with paginated booking data
   */
  getOwnerBookings: async (filters = {}, page = 1, pageSize = 10) => {
    try {
      console.log('Fetching owner bookings with filters:', filters);

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

      // Use the standard API client
      const response = await api.get(`/bookings/owner?${queryParams.toString()}`);
      console.log('Owner bookings received:', response.data);

      // Validate response structure
      if (!response.data || !Array.isArray(response.data.items)) {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from server');
      }

      // Ensure each booking has a tenant object to prevent errors
      const processedData = {
        ...response.data,
        items: response.data.items.map(booking => {
          // If tenant is missing, add a default tenant object
          if (!booking.tenant) {
            return {
              ...booking,
              tenant: {
                id: null,
                username: booking.guest_name || 'Guest',
                first_name: '',
                last_name: ''
              }
            };
          }
          return booking;
        })
      };

      return processedData;
    } catch (error) {
      console.error('Error fetching owner bookings:', error);
      throw error.response?.data || { message: 'Failed to fetch bookings' };
    }
  }
};

export default BookingService;
