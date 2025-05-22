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
   * Get booking details by ID
   * @param {number} id - Booking ID
   * @returns {Promise} - Promise with booking details
   */
  getBookingById: async (id) => {
    try {
      console.log(`Fetching booking with ID: ${id}`);
      const response = await api.get(`/bookings/${id}`);
      console.log(`Booking data received for ID ${id}:`, response.data);
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
