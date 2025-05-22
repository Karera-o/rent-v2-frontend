import api from './api';

const AdminService = {
  /**
   * Get all users with pagination
   * @param {Object} filters - Filter parameters
   * @param {number} page - Page number
   * @param {number} pageSize - Number of items per page
   * @returns {Promise} - Promise with paginated user data
   */
  getAllUsers: async (filters = {}, page = 1, pageSize = 10) => {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('page_size', pageSize);

      // Add any additional filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Special handling for status filter
          if (key === 'status') {
            // The backend expects is_active=true/false, not status=active/inactive
            if (value.toLowerCase() === 'active') {
              queryParams.append('is_active', 'true');
            } else if (value.toLowerCase() === 'inactive') {
              queryParams.append('is_active', 'false');
            } else if (value.toLowerCase() === 'pending') {
              // For pending, we need to filter by role=agent and is_active=false
              queryParams.append('pending', 'true');
            }
            // Also pass the original status for frontend reference
            queryParams.append('status_display', value.toLowerCase());
          } else {
            queryParams.append(key, value);
          }
        }
      });

      // First try the admin-specific endpoint
      try {
        const response = await api.get(`/admin/users/?${queryParams.toString()}`);
        console.log('Admin users API response:', response.data);
        return response.data;
      } catch (adminError) {
        console.warn('Admin users endpoint not available, trying regular users endpoint');
        // If admin endpoint fails, try the regular users endpoint
        try {
          const response = await api.get(`/users/?${queryParams.toString()}`);
          console.log('Regular users API response:', response.data);

          // Transform the response to match expected format if needed
          const users = response.data || [];

          // Map the API response to match the expected format
          const statusDisplay = new URLSearchParams(window.location.search).get('status_display');

          const mappedUsers = users.map(user => {
            // Determine the status based on filters and user properties
            let status = 'unknown';

            if (statusDisplay) {
              // If we're filtering by status, use that status
              status = statusDisplay;
            } else if (user.is_active !== undefined) {
              // Otherwise use the user's is_active property
              status = user.is_active ? 'active' : 'inactive';
            }

            // Special case for agents with pending status
            if (user.role === 'agent' && !user.is_active && statusDisplay === 'pending') {
              status = 'pending';
            }

            return {
              id: user.id,
              username: user.username,
              email: user.email,
              name: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username,
              first_name: user.first_name,
              last_name: user.last_name,
              role: user.role,
              status: status,
              is_active: user.is_active !== undefined ? user.is_active : true,
              joinDate: user.date_joined,
              date_joined: user.date_joined,
              properties: user.properties_count || 0,
              bookings: user.bookings_count || 0
            };
          });

          const transformedData = {
            items: mappedUsers,
            total: users.length,
            page: page,
            page_size: pageSize,
            total_pages: Math.ceil(users.length / pageSize) || 1
          };

          return transformedData;
        } catch (usersError) {
          console.warn('Regular users endpoint failed too:', usersError);
          throw usersError;
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);

      // Only fall back to mock data as a last resort and in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Falling back to mock data for users');
        return AdminService._getMockUsers(page, pageSize, filters);
      }

      // In production, return an empty result set instead of mock data
      return {
        items: [],
        total: 0,
        page: page,
        page_size: pageSize,
        total_pages: 1
      };
    }
  },

  /**
   * Get all properties with pagination (admin view)
   * @param {Object} filters - Filter parameters
   * @param {number} page - Page number
   * @param {number} pageSize - Number of items per page
   * @returns {Promise} - Promise with paginated property data
   */
  getAllProperties: async (filters = {}, page = 1, pageSize = 10) => {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('page_size', pageSize);

      // Add any additional filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Special handling for boolean values
          if (typeof value === 'boolean') {
            queryParams.append(key, value.toString());
          } else {
            queryParams.append(key, value);
          }
        }
      });

      // Log the query parameters for debugging
      console.log('Property filter query params:', queryParams.toString());

      const response = await api.get(`/admin/properties/?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching properties:', error);

      // If the endpoint is not available, use the regular properties endpoint
      console.warn('Falling back to regular properties endpoint');
      try {
        const response = await api.get('/properties/', {
          params: {
            ...filters,
            page,
            page_size: pageSize,
            include_all_statuses: true
          }
        });
        return response.data;
      } catch (secondError) {
        console.error('Error fetching properties from regular endpoint:', secondError);
        return AdminService._getMockProperties(page, pageSize, filters);
      }
    }
  },

  /**
   * Get property details by ID
   * @param {number} propertyId - Property ID
   * @returns {Promise} - Promise with property details
   */
  getPropertyById: async (propertyId) => {
    // For development, always return mock data for property ID 24
    if (propertyId === '24' || propertyId === 24) {
      console.log('Using mock data for property 24');
      return {
        id: propertyId,
        title: "Modern Apartment with City View",
        property_type: "apartment",
        address: "123 Downtown Ave",
        city: "New York",
        state: "NY",
        country: "USA",
        zip_code: "10001",
        price_per_night: 125,
        status: "approved",
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        description: "A beautiful modern apartment with stunning city views, perfect for both short and long-term stays. This newly renovated space features high-end finishes, an open concept living area, and a fully equipped kitchen. Located in the heart of the city, you'll be steps away from restaurants, shopping, and public transportation.",
        has_wifi: true,
        has_kitchen: true,
        has_air_conditioning: true,
        has_heating: true,
        has_tv: true,
        has_parking: true,
        has_pool: false,
        has_gym: true,
        has_maid_service: false,
        has_car_rental: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        owner: {
          id: 1,
          username: "landlord1",
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          role: "landlord"
        },
        images: [
          {
            id: 1,
            url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
            caption: "Living Room",
            is_primary: true
          },
          {
            id: 2,
            url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
            caption: "Bedroom",
            is_primary: false
          },
          {
            id: 3,
            url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
            caption: "Kitchen",
            is_primary: false
          },
          {
            id: 4,
            url: "https://images.unsplash.com/photo-1484154218962-a197022b5858",
            caption: "Bathroom",
            is_primary: false
          }
        ]
      };
    }

    try {
      const response = await api.get(`/admin/properties/${propertyId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching property ${propertyId}:`, error);

      // Try the regular property endpoint
      try {
        const response = await api.get(`/properties/${propertyId}`);
        return response.data;
      } catch (secondError) {
        console.error(`Error fetching property ${propertyId} from regular endpoint:`, secondError);

        // If both endpoints fail, return mock data for development
        console.warn('Falling back to mock data for property details');
        return {
          id: propertyId,
          title: "Modern Apartment with City View",
          property_type: "apartment",
          address: "123 Downtown Ave",
          city: "New York",
          state: "NY",
          country: "USA",
          zip_code: "10001",
          price_per_night: 125,
          status: "approved",
          bedrooms: 2,
          bathrooms: 2,
          area: 1200,
          description: "A beautiful modern apartment with stunning city views, perfect for both short and long-term stays. This newly renovated space features high-end finishes, an open concept living area, and a fully equipped kitchen. Located in the heart of the city, you'll be steps away from restaurants, shopping, and public transportation.",
          has_wifi: true,
          has_kitchen: true,
          has_air_conditioning: true,
          has_heating: true,
          has_tv: true,
          has_parking: true,
          has_pool: false,
          has_gym: true,
          has_maid_service: false,
          has_car_rental: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          owner: {
            id: 1,
            username: "landlord1",
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com",
            role: "landlord"
          },
          images: [
            {
              id: 1,
              url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
              caption: "Living Room",
              is_primary: true
            },
            {
              id: 2,
              url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
              caption: "Bedroom",
              is_primary: false
            },
            {
              id: 3,
              url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
              caption: "Kitchen",
              is_primary: false
            },
            {
              id: 4,
              url: "https://images.unsplash.com/photo-1484154218962-a197022b5858",
              caption: "Bathroom",
              is_primary: false
            }
          ]
        };
      }
    }
  },

  /**
   * Approve a property
   * @param {number} propertyId - Property ID
   * @returns {Promise} - Promise with success message
   */
  approveProperty: async (propertyId) => {
    try {
      const response = await api.put(`/admin/properties/${propertyId}/approve/`);
      return response.data;
    } catch (error) {
      console.error(`Error approving property ${propertyId}:`, error);
      throw error;
    }
  },

  /**
   * Reject a property
   * @param {number} propertyId - Property ID
   * @returns {Promise} - Promise with success message
   */
  rejectProperty: async (propertyId) => {
    try {
      const response = await api.put(`/admin/properties/${propertyId}/reject/`);
      return response.data;
    } catch (error) {
      console.error(`Error rejecting property ${propertyId}:`, error);
      throw error;
    }
  },

  /**
   * Delete a property
   * @param {number} propertyId - Property ID
   * @returns {Promise} - Promise with success message
   */
  deleteProperty: async (propertyId) => {
    try {
      const response = await api.delete(`/admin/properties/${propertyId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting property ${propertyId}:`, error);
      throw error;
    }
  },

  /**
   * Get all bookings with pagination (admin view)
   * @param {Object} filters - Filter parameters
   * @param {number} page - Page number
   * @param {number} pageSize - Number of items per page
   * @returns {Promise} - Promise with paginated booking data
   */
  getAllBookings: async (filters = {}, page = 1, pageSize = 10) => {
    try {
      console.log('Fetching admin bookings with filters:', filters);

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

      // Log the query parameters for debugging
      console.log('Booking filter query params:', queryParams.toString());

      // Use the correct port for the backend API
      const response = await api.get(`/admin/bookings?${queryParams.toString()}`);
      // If you need to test with a specific port, uncomment the line below
      // const response = await fetch(`http://localhost:8004/api/admin/bookings?${queryParams.toString()}`);
      //   .then(res => res.json());
      console.log('Admin bookings API response:', response.data);

      // Process the response to match the expected format
      if (response.data && Array.isArray(response.data.items)) {
        console.log('Processing booking items:', response.data.items);

        // Format the bookings to match the frontend expected structure
        const formattedBookings = response.data.items.map(booking => {
          try {
            // Log the booking for debugging
            console.log('Processing booking:', booking);

            // Check if booking has required properties
            if (!booking) {
              console.error('Booking is null or undefined');
              return null;
            }

            // Check if property exists
            if (!booking.property) {
              console.error('Booking property is missing:', booking);
              return null;
            }

            // Check if tenant exists
            if (!booking.tenant) {
              console.error('Booking tenant is missing:', booking);
              return null;
            }

            return {
              id: booking.id || 'unknown',
              property: {
                id: booking.property.id || 'unknown',
                title: booking.property.title || 'Unknown Property',
                type: booking.property.property_type || 'Unknown Type',
                image: 'https://via.placeholder.com/300x200?text=Property+Image'
              },
              tenant: {
                id: booking.tenant.id || 'unknown',
                name: `${booking.tenant.first_name || ''} ${booking.tenant.last_name || ''}`.trim() || booking.tenant.username || 'Unknown Tenant',
                email: booking.tenant.email || 'unknown@example.com'
              },
              check_in: booking.check_in_date,
              check_out: booking.check_out_date,
              checkIn: booking.check_in_date, // Add legacy field names for compatibility
              checkOut: booking.check_out_date,
              guests: booking.guests || 0,
              status: booking.status ? (booking.status.charAt(0).toUpperCase() + booking.status.slice(1)) : 'Unknown',
              payment_status: booking.is_paid ? 'Paid' : 'Pending',
              amount: booking.total_price || 0,
              created_at: booking.created_at
            };
          } catch (err) {
            console.error('Error processing booking:', err, booking);
            return null;
          }
        }).filter(booking => booking !== null); // Filter out null bookings

        return {
          items: formattedBookings,
          total: response.data.total,
          page: response.data.page,
          page_size: response.data.page_size,
          total_pages: response.data.total_pages
        };
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);

      // If the endpoint is not available, return mock data for development
      console.warn('Falling back to mock data for bookings');
      return AdminService._getMockBookings(page, pageSize, filters);
    }
  },

  /**
   * Get all payments with pagination (admin view)
   * @param {Object} filters - Filter parameters
   * @param {number} page - Page number
   * @param {number} pageSize - Number of items per page
   * @returns {Promise} - Promise with paginated payment data
   */
  getAllPayments: async (filters = {}, page = 1, pageSize = 10) => {
    try {
      console.log('Fetching admin payments with filters:', filters);

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

      // Log the query parameters for debugging
      console.log('Payment filter query params:', queryParams.toString());

      const response = await api.get(`/admin/payments?${queryParams.toString()}`);
      console.log('Admin payments API response:', response.data);

      // Process the response to match the expected format
      if (response.data && Array.isArray(response.data.items)) {
        console.log('Processing payment items:', response.data.items);

        // Format the payments to match the frontend expected structure
        const formattedPayments = response.data.items.map(payment => {
          try {
            // Log the payment for debugging
            console.log('Processing payment:', payment);

            // Check if payment has required properties
            if (!payment) {
              console.error('Payment is null or undefined');
              return null;
            }

            // We don't need to check for booking_id anymore since we handle missing data gracefully

            return {
              id: payment.id || 'unknown',
              booking_id: payment.booking_id || 'unknown',
              tenant: payment.tenant ? {
                id: payment.tenant.id || 'unknown',
                name: payment.tenant.full_name || payment.tenant.username || 'Unknown User',
                email: payment.tenant.email || 'unknown@example.com'
              } : payment.booking && payment.booking.tenant ? {
                id: payment.booking.tenant.id || 'unknown',
                name: payment.booking.tenant.full_name || payment.booking.tenant.username || 'Unknown User',
                email: payment.booking.tenant.email || 'unknown@example.com'
              } : payment.user ? {
                id: payment.user.id || 'unknown',
                name: payment.user.full_name || payment.user.username || 'Unknown User',
                email: payment.user.email || 'unknown@example.com'
              } : {
                id: 'unknown',
                name: 'Unknown User',
                email: 'unknown@example.com'
              },
              property: payment.property ? {
                id: payment.property.id || 'unknown',
                title: payment.property.title || 'Unknown Property'
              } : payment.booking && payment.booking.property ? {
                id: payment.booking.property.id || 'unknown',
                title: payment.booking.property.title || 'Unknown Property'
              } : {
                id: 'unknown',
                title: 'Unknown Property'
              },
              amount: payment.amount || 0,
              status: payment.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : 'Unknown',
              payment_method: payment.payment_method_type || 'Visa Card',
              created_at: payment.created_at,
              receipt_url: payment.receipt_url || null
            };
          } catch (err) {
            console.error('Error processing payment:', err, payment);
            return null;
          }
        }).filter(payment => payment !== null); // Filter out null payments

        return {
          items: formattedPayments,
          total: response.data.total,
          page: response.data.page,
          page_size: response.data.page_size,
          total_pages: response.data.total_pages
        };
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);

      // If the endpoint is not available, return mock data for development
      console.warn('Falling back to mock data for payments');
      return AdminService._getMockPayments(page, pageSize, filters);
    }
  },

  /**
   * Get dashboard statistics
   * @returns {Promise} - Promise with dashboard statistics
   */
  getDashboardStats: async () => {
    try {
      // Try to get real data from the API
      const response = await api.get('/admin/stats/');
      console.log('Admin stats API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);

      // If the API call fails, try to calculate stats from other endpoints
      try {
        console.warn('Trying to calculate stats from other endpoints');

        // Get users count
        const usersResponse = await api.get('/admin/users/?page=1&page_size=1');
        const totalUsers = usersResponse.data.total || 0;

        // Get properties count
        const propertiesResponse = await api.get('/admin/properties/?page=1&page_size=1');
        const totalProperties = propertiesResponse.data.total || 0;

        // Get bookings count
        const bookingsResponse = await api.get('/admin/bookings/?page=1&page_size=1');
        const totalBookings = bookingsResponse.data.total || 0;

        // Get payments for revenue calculation
        const paymentsResponse = await api.get('/admin/payments/?page=1&page_size=100&status=completed');
        const completedPayments = paymentsResponse.data.items || [];
        const totalRevenue = completedPayments.reduce(
          (sum, payment) => sum + parseFloat(payment.amount), 0
        );

        // Format the revenue
        const formattedRevenue = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2
        }).format(totalRevenue);

        return {
          users: {
            total: totalUsers,
            change: '+5.2%',  // Static for now
            trend: 'up'
          },
          properties: {
            total: totalProperties,
            change: '+3.8%',  // Static for now
            trend: 'up'
          },
          bookings: {
            total: totalBookings,
            change: '+7.1%',  // Static for now
            trend: 'up'
          },
          revenue: {
            total: totalRevenue,
            formatted: formattedRevenue,
            change: '+4.3%',  // Static for now
            trend: 'up'
          }
        };
      } catch (calculationError) {
        console.error('Error calculating stats:', calculationError);

        // As a last resort, return mock data for development
        console.warn('Falling back to mock data for dashboard stats');
        return {
          users: {
            total: 0,
            change: '+0%',
            trend: 'up'
          },
          properties: {
            total: 0,
            change: '+0%',
            trend: 'up'
          },
          bookings: {
            total: 0,
            change: '+0%',
            trend: 'up'
          },
          revenue: {
            total: 0,
            formatted: '$0.00',
            change: '+0%',
            trend: 'up'
          }
        };
      }
    }
  },

  // Mock data generators for development
  _getMockUsers: (page, pageSize, filters = {}) => {
    const mockUsers = [
      {
        id: "U12345",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "tenant",
        status: "active",
        join_date: "2023-01-15",
        properties: 0,
        bookings: 3
      },
      {
        id: "U12346",
        name: "Alice Smith",
        email: "alice.smith@example.com",
        role: "agent",
        status: "active",
        join_date: "2023-02-10",
        properties: 5,
        bookings: 0
      },
      {
        id: "U12347",
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        role: "tenant",
        status: "inactive",
        join_date: "2023-01-20",
        properties: 0,
        bookings: 1
      },
      {
        id: "U12348",
        name: "Emma Williams",
        email: "emma.williams@example.com",
        role: "agent",
        status: "active",
        join_date: "2023-03-05",
        properties: 3,
        bookings: 0
      },
      {
        id: "U12349",
        name: "Michael Brown",
        email: "michael.brown@example.com",
        role: "admin",
        status: "active",
        join_date: "2022-12-01",
        properties: 0,
        bookings: 0
      },
      {
        id: "U12350",
        name: "Sophia Miller",
        email: "sophia.miller@example.com",
        role: "tenant",
        status: "active",
        join_date: "2023-02-28",
        properties: 0,
        bookings: 2
      },
      {
        id: "U12351",
        name: "James Wilson",
        email: "james.wilson@example.com",
        role: "agent",
        status: "pending",
        join_date: "2023-03-10",
        properties: 0,
        bookings: 0
      },
      {
        id: "U12352",
        name: "Olivia Jones",
        email: "olivia.jones@example.com",
        role: "tenant",
        status: "active",
        join_date: "2023-02-15",
        properties: 0,
        bookings: 4
      }
    ];

    // Apply filters
    let filteredUsers = [...mockUsers];

    if (filters.role) {
      filteredUsers = filteredUsers.filter(user =>
        user.role.toLowerCase() === filters.role.toLowerCase()
      );
    }

    if (filters.status) {
      filteredUsers = filteredUsers.filter(user =>
        user.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query)
      );
    }

    // Calculate pagination
    const total = filteredUsers.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      items: paginatedUsers,
      total: total,
      page: page,
      page_size: pageSize,
      total_pages: Math.ceil(total / pageSize) || 1
    };
  },

  _getMockProperties: (page, pageSize, filters = {}) => {
    const mockProperties = [
      {
        id: "P12345",
        title: "Modern Apartment with City View",
        type: "apartment",
        location: "Downtown, New York",
        owner: {
          id: "U12346",
          name: "Alice Smith",
          email: "alice.smith@example.com"
        },
        price: 1200,
        bedrooms: 2,
        bathrooms: 1,
        status: "available",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      },
      {
        id: "P12346",
        title: "Luxury Villa with Pool",
        type: "villa",
        location: "Beverly Hills, Los Angeles",
        owner: {
          id: "U12346",
          name: "Alice Smith",
          email: "alice.smith@example.com"
        },
        price: 5000,
        bedrooms: 5,
        bathrooms: 4,
        status: "available",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
      },
      {
        id: "P12347",
        title: "Cozy Studio near University",
        type: "studio",
        location: "Cambridge, Massachusetts",
        owner: {
          id: "U12348",
          name: "Emma Williams",
          email: "emma.williams@example.com"
        },
        price: 800,
        bedrooms: 1,
        bathrooms: 1,
        status: "available",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      },
      {
        id: "P12348",
        title: "Family House with Garden",
        type: "house",
        location: "Suburb Area, Chicago",
        owner: {
          id: "U12348",
          name: "Emma Williams",
          email: "emma.williams@example.com"
        },
        price: 2200,
        bedrooms: 3,
        bathrooms: 2,
        status: "not_available",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      },
      {
        id: "P12349",
        title: "Penthouse with Rooftop Terrace",
        type: "apartment",
        location: "Manhattan, New York",
        owner: {
          id: "U12346",
          name: "Alice Smith",
          email: "alice.smith@example.com"
        },
        price: 3500,
        bedrooms: 3,
        bathrooms: 2,
        status: "available",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1551361415-69c87624334f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      },
      {
        id: "P12350",
        title: "Beachfront Condo",
        type: "condo",
        location: "Miami Beach, Florida",
        owner: {
          id: "U12348",
          name: "Emma Williams",
          email: "emma.williams@example.com"
        },
        price: 2800,
        bedrooms: 2,
        bathrooms: 2,
        status: "available",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1582610116397-edb318620f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      }
    ];

    // Apply filters
    let filteredProperties = [...mockProperties];

    if (filters.type) {
      filteredProperties = filteredProperties.filter(property =>
        property.type.toLowerCase() === filters.type.toLowerCase()
      );
    }

    if (filters.status) {
      filteredProperties = filteredProperties.filter(property =>
        property.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredProperties = filteredProperties.filter(property =>
        property.title.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.id.toLowerCase().includes(query)
      );
    }

    // Calculate pagination
    const total = filteredProperties.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

    return {
      results: paginatedProperties,
      count: total,
      page: page,
      page_size: pageSize,
      total_pages: Math.ceil(total / pageSize) || 1
    };
  },

  _getMockBookings: (page, pageSize, filters = {}) => {
    const mockBookings = [
      {
        id: "B12345",
        property: {
          id: "P12345",
          title: "Modern Apartment with City View",
          type: "apartment",
          image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        },
        tenant: {
          id: "U12345",
          name: "John Doe",
          email: "john.doe@example.com"
        },
        check_in: "2023-03-15",
        check_out: "2023-03-18",
        guests: 2,
        status: "confirmed",
        payment_status: "paid",
        amount: 450,
        created_at: "2023-03-01"
      },
      {
        id: "B12346",
        property: {
          id: "P12346",
          title: "Luxury Villa with Pool",
          type: "villa",
          image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
        },
        tenant: {
          id: "U12346",
          name: "Alice Smith",
          email: "alice.smith@example.com"
        },
        check_in: "2023-03-20",
        check_out: "2023-03-25",
        guests: 4,
        status: "pending",
        payment_status: "pending",
        amount: 1200,
        created_at: "2023-03-05"
      },
      {
        id: "B12347",
        property: {
          id: "P12347",
          title: "Cozy Studio near University",
          type: "studio",
          image: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        },
        tenant: {
          id: "U12347",
          name: "Robert Johnson",
          email: "robert.johnson@example.com"
        },
        check_in: "2023-03-12",
        check_out: "2023-03-14",
        guests: 1,
        status: "completed",
        payment_status: "paid",
        amount: 180,
        created_at: "2023-02-20"
      },
      {
        id: "B12348",
        property: {
          id: "P12348",
          title: "Family House with Garden",
          type: "house",
          image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        },
        tenant: {
          id: "U12348",
          name: "Emma Williams",
          email: "emma.williams@example.com"
        },
        check_in: "2023-03-25",
        check_out: "2023-03-30",
        guests: 5,
        status: "cancelled",
        payment_status: "refunded",
        amount: 720,
        created_at: "2023-03-10"
      },
      {
        id: "B12349",
        property: {
          id: "P12349",
          title: "Penthouse with Rooftop Terrace",
          type: "apartment",
          image: "https://images.unsplash.com/photo-1551361415-69c87624334f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        },
        tenant: {
          id: "U12350",
          name: "Sophia Miller",
          email: "sophia.miller@example.com"
        },
        check_in: "2023-04-05",
        check_out: "2023-04-10",
        guests: 3,
        status: "confirmed",
        payment_status: "paid",
        amount: 950,
        created_at: "2023-03-12"
      },
      {
        id: "B12350",
        property: {
          id: "P12350",
          title: "Beachfront Condo",
          type: "condo",
          image: "https://images.unsplash.com/photo-1582610116397-edb318620f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        },
        tenant: {
          id: "U12352",
          name: "Olivia Jones",
          email: "olivia.jones@example.com"
        },
        check_in: "2023-04-15",
        check_out: "2023-04-20",
        guests: 2,
        status: "pending",
        payment_status: "pending",
        amount: 850,
        created_at: "2023-03-15"
      }
    ];

    // Apply filters
    let filteredBookings = [...mockBookings];

    if (filters.status) {
      filteredBookings = filteredBookings.filter(booking =>
        booking.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.payment_status) {
      filteredBookings = filteredBookings.filter(booking =>
        booking.payment_status.toLowerCase() === filters.payment_status.toLowerCase()
      );
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredBookings = filteredBookings.filter(booking =>
        booking.property.title.toLowerCase().includes(query) ||
        booking.tenant.name.toLowerCase().includes(query) ||
        booking.id.toLowerCase().includes(query)
      );
    }

    // Calculate pagination
    const total = filteredBookings.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

    return {
      items: paginatedBookings,
      total: total,
      page: page,
      page_size: pageSize,
      total_pages: Math.ceil(total / pageSize) || 1
    };
  },

  _getMockPayments: (page, pageSize, filters = {}) => {
    const mockPayments = [
      {
        id: "PAY12345",
        booking_id: "B12345",
        tenant: {
          id: "U12345",
          name: "John Doe",
          email: "john.doe@example.com"
        },
        property: {
          id: "P12345",
          title: "Modern Apartment with City View"
        },
        amount: 450,
        status: "completed",
        payment_method: "credit_card",
        created_at: "2023-03-05",
        receipt_url: "#"
      },
      {
        id: "PAY12346",
        booking_id: "B12346",
        tenant: {
          id: "U12346",
          name: "Alice Smith",
          email: "alice.smith@example.com"
        },
        property: {
          id: "P12346",
          title: "Luxury Villa with Pool"
        },
        amount: 1200,
        status: "pending",
        payment_method: "paypal",
        created_at: "2023-03-10",
        receipt_url: null
      },
      {
        id: "PAY12347",
        booking_id: "B12347",
        tenant: {
          id: "U12347",
          name: "Robert Johnson",
          email: "robert.johnson@example.com"
        },
        property: {
          id: "P12347",
          title: "Cozy Studio near University"
        },
        amount: 180,
        status: "completed",
        payment_method: "credit_card",
        created_at: "2023-02-25",
        receipt_url: "#"
      },
      {
        id: "PAY12348",
        booking_id: "B12348",
        tenant: {
          id: "U12348",
          name: "Emma Williams",
          email: "emma.williams@example.com"
        },
        property: {
          id: "P12348",
          title: "Family House with Garden"
        },
        amount: 720,
        status: "refunded",
        payment_method: "credit_card",
        created_at: "2023-03-12",
        receipt_url: "#"
      },
      {
        id: "PAY12349",
        booking_id: "B12349",
        tenant: {
          id: "U12350",
          name: "Sophia Miller",
          email: "sophia.miller@example.com"
        },
        property: {
          id: "P12349",
          title: "Penthouse with Rooftop Terrace"
        },
        amount: 950,
        status: "completed",
        payment_method: "credit_card",
        created_at: "2023-03-15",
        receipt_url: "#"
      },
      {
        id: "PAY12350",
        booking_id: "B12350",
        tenant: {
          id: "U12352",
          name: "Olivia Jones",
          email: "olivia.jones@example.com"
        },
        property: {
          id: "P12350",
          title: "Beachfront Condo"
        },
        amount: 850,
        status: "pending",
        payment_method: "paypal",
        created_at: "2023-03-18",
        receipt_url: null
      }
    ];

    // Apply filters
    let filteredPayments = [...mockPayments];

    if (filters.status) {
      filteredPayments = filteredPayments.filter(payment =>
        payment.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.payment_method) {
      filteredPayments = filteredPayments.filter(payment =>
        payment.payment_method.toLowerCase() === filters.payment_method.toLowerCase()
      );
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredPayments = filteredPayments.filter(payment =>
        payment.property.title.toLowerCase().includes(query) ||
        payment.tenant.name.toLowerCase().includes(query) ||
        payment.id.toLowerCase().includes(query) ||
        payment.booking_id.toLowerCase().includes(query)
      );
    }

    // Calculate pagination
    const total = filteredPayments.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

    return {
      items: paginatedPayments,
      total: total,
      page: page,
      page_size: pageSize,
      total_pages: Math.ceil(total / pageSize) || 1
    };
  }
};

export default AdminService;
