import api from './api';

const PropertyService = {
  /**
   * Get all properties with optional search parameters
   * @param {Object} searchParams - Search parameters
   * @param {number} page - Page number
   * @param {number} pageSize - Number of items per page
   * @returns {Promise} - Promise with paginated property data
   */
  getAllProperties: async (searchParams = {}, page, pageSize) => {
    try {
      // Convert searchParams to the format expected by the backend
      const formattedParams = {};
      
      // Handle pagination parameters
      formattedParams.page = page || searchParams.page || 1;
      formattedParams.page_size = pageSize || searchParams.page_size || 10;
      
      // Handle search query (general search across title, address, city, state)
      if (searchParams.query) {
        formattedParams.query = searchParams.query;
      }
      
      // Handle specific city search - ensure proper capitalization
      if (searchParams.city) {
        // Capitalize first letter of each word in city name
        const cityWords = searchParams.city.split(' ');
        const capitalizedCity = cityWords.map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
        formattedParams.city = capitalizedCity;
      }
      
      // Handle property type filter - ensure proper capitalization
      if (searchParams.property_type) {
        // Capitalize first letter of property type
        formattedParams.property_type = 
          searchParams.property_type.charAt(0).toUpperCase() + 
          searchParams.property_type.slice(1).toLowerCase();
      }
      
      // Handle bedrooms filter (3+ bedrooms)
      if (searchParams.bedrooms) {
        formattedParams.bedrooms = searchParams.bedrooms;
      }
      
      // Handle price range in format "min-max" (e.g., "200-500")
      if (searchParams.price_range) {
        formattedParams.price_range = searchParams.price_range;
      }
      
      // Support for individual min/max price parameters if they exist
      if (searchParams.min_price !== undefined && !searchParams.price_range) {
        const minPrice = searchParams.min_price;
        const maxPrice = searchParams.max_price || 'any';
        formattedParams.price_range = `${minPrice}-${maxPrice}`;
      }

      console.log('Sending search params to API:', formattedParams);

      // Use the exact endpoint format from the example
      const baseUrl = '/properties/';
      const response = await api.get(baseUrl, {
        params: formattedParams
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error.response?.data || { message: 'Failed to fetch properties' };
    }
  },

  /**
   * Get featured properties (limited number of approved properties)
   * @param {number} limit - Number of properties to fetch
   * @returns {Promise} - Promise with property data
   */
  getFeaturedProperties: async (limit = 6) => {
    try {
      const response = await api.get('/properties/', {
        params: {
          page: 1,
          page_size: limit
        }
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      throw error.response?.data || { message: 'Failed to fetch featured properties' };
    }
  },

  /**
   * Get property details by ID
   * @param {number} id - Property ID
   * @returns {Promise} - Promise with property details
   */
  getPropertyById: async (id) => {
    try {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error);
      throw error.response?.data || { message: 'Failed to fetch property details' };
    }
  },

  /**
   * Create a new property
   * @param {Object} propertyData - Property data
   * @returns {Promise} - Promise with created property data
   */
  createProperty: async (propertyData) => {
    try {
      const response = await api.post('/properties/', propertyData);
      return response.data;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error.response?.data || { message: 'Failed to create property' };
    }
  },

  /**
   * Update a property
   * @param {number} id - Property ID
   * @param {Object} propertyData - Updated property data
   * @returns {Promise} - Promise with updated property data
   */
  updateProperty: async (id, propertyData) => {
    try {
      const response = await api.put(`/properties/${id}`, propertyData);
      return response.data;
    } catch (error) {
      console.error(`Error updating property ${id}:`, error);
      throw error.response?.data || { message: 'Failed to update property' };
    }
  },

  /**
   * Delete a property
   * @param {number} id - Property ID
   * @returns {Promise} - Promise with success message
   */
  deleteProperty: async (id) => {
    try {
      const response = await api.delete(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting property ${id}:`, error);
      throw error.response?.data || { message: 'Failed to delete property' };
    }
  },

  /**
   * Get properties belonging to the current landlord
   * @param {Object} searchParams - Search parameters
   * @param {number} page - Page number
   * @param {number} pageSize - Number of items per page
   * @returns {Promise} - Promise with paginated property data
   */
  getLandlordProperties: async (searchParams = {}, page = 1, pageSize = 10) => {
    try {
      // Use the main properties endpoint with owner=current filter
      // The backend should filter properties by the authenticated user
      const response = await api.get('/properties/', {
        params: {
          ...searchParams,
          owner: 'current', // This is a custom parameter we'll handle in the frontend for now
          page,
          page_size: pageSize,
          include_all_statuses: true // Custom parameter to include all statuses
        }
      });

      // Get all properties from the response
      const allProperties = response.data.results || [];

      // Log properties for debugging
      console.log('All properties from API:', allProperties);

      // Get current user info from localStorage
      const currentUsername = localStorage.getItem('username');
      const currentFullName = localStorage.getItem('fullName');
      console.log('Current user from localStorage - Username:', currentUsername, 'Full name:', currentFullName);

      // Filter properties by owner if we have a current user
      let filteredProperties = allProperties;
      if (currentUsername || currentFullName) {
        console.log('Filtering properties by user - Username:', currentUsername, 'Full name:', currentFullName);

        // Log each property's owner for debugging
        allProperties.forEach(property => {
          const ownerInfo = property.owner ?
            `${property.owner.username || 'no username'} (${property.owner.id || 'no id'})` :
            'No owner';
          console.log(`Property ${property.id} - ${property.title} - Owner:`, ownerInfo);
        });

        // Filter properties by owner with more detailed logging
        const ownerFilteredProperties = allProperties.filter(property => {
          // Check if property has an owner
          if (!property.owner) {
            console.log(`Property ${property.id} - ${property.title} - No owner information`);
            return false;
          }

          // Get owner username and id
          const ownerUsername = property.owner.username || '';
          const ownerId = property.owner.id || '';
          const ownerName = property.owner.name || '';

          // Check if current username matches owner username or id
          const matchesUsername = currentUsername && typeof ownerUsername === 'string' &&
                                 (ownerUsername === currentUsername ||
                                  ownerUsername.includes(currentUsername));

          const matchesId = currentUsername && (ownerId === currentUsername);

          // Check if current full name matches owner name
          const matchesName = currentFullName && typeof ownerName === 'string' &&
                             ownerName.includes(currentFullName);

          // Also check if owner name contains current username (as a fallback)
          const nameContainsUsername = currentUsername && typeof ownerName === 'string' &&
                                      ownerName.includes(currentUsername);

          // Log detailed matching information
          console.log(`Property ${property.id} - ${property.title}:`);
          console.log(`  Owner username: ${ownerUsername}, Current username: ${currentUsername}, Matches: ${matchesUsername}`);
          console.log(`  Owner ID: ${ownerId}, Matches ID: ${matchesId}`);
          console.log(`  Owner name: ${ownerName}, Current full name: ${currentFullName}, Matches name: ${matchesName}`);
          console.log(`  Owner name contains username: ${nameContainsUsername}`);

          const isOwner = matchesUsername || matchesId || matchesName || nameContainsUsername;
          console.log(`  Final match result: ${isOwner}`);

          return isOwner;
        });

        console.log('Filtered properties by current user:', ownerFilteredProperties);

        // Always use the filtered list, even if it's empty
        filteredProperties = ownerFilteredProperties;
        console.log('Using filtered properties list with', ownerFilteredProperties.length, 'properties');
      } else {
        console.log('No user information found in localStorage. Returning empty list.');
        // If we can't identify the current user, return an empty list
        filteredProperties = [];
      }

      // Apply status filter if provided
      if (searchParams.status && searchParams.status !== 'all' && searchParams.status !== 'All') {
        filteredProperties = filteredProperties.filter(property =>
          property.status?.toLowerCase() === searchParams.status.toLowerCase()
        );
      }

      return {
        results: filteredProperties,
        count: filteredProperties.length,
        page: page,
        page_size: pageSize,
        total_pages: Math.ceil(filteredProperties.length / pageSize) || 1
      };
    } catch (error) {
      console.error('Error fetching landlord properties:', error);
      throw error.response?.data || { message: 'Failed to fetch landlord properties' };
    }
  },

  /**
   * Upload an image for a property
   * @param {number} propertyId - Property ID
   * @param {File} imageFile - Image file to upload
   * @param {Object} options - Additional options like caption and is_primary
   * @returns {Promise} - Promise with success message
   */
  uploadPropertyImage: async (propertyId, imageFile, options = {}) => {
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('image', imageFile);

      // Add optional parameters if provided
      if (options.caption) {
        formData.append('caption', options.caption);
      }

      if (options.is_primary !== undefined) {
        formData.append('is_primary', options.is_primary);
      }

      const response = await api.post(`/properties/${propertyId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Error uploading image for property ${propertyId}:`, error);
      throw error.response?.data || { message: 'Failed to upload property image' };
    }
  }
};

export default PropertyService;
