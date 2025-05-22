import api from './api';

const DocumentService = {
  /**
   * Upload a document for a property
   * @param {number} propertyId - Property ID
   * @param {File} documentFile - Document file to upload
   * @param {Object} data - Additional data like document_type and description
   * @returns {Promise} - Promise with document details
   */
  uploadDocument: async (propertyId, documentFile, data = {}) => {
    try {
      // Create a FormData object to send the file
      const formData = new FormData();

      // Add document file
      formData.append('document', documentFile, documentFile.name);
      console.log('Document file being uploaded:', documentFile);
      console.log('Document file name:', documentFile.name);
      console.log('Document file size:', documentFile.size);
      console.log('Document file type:', documentFile.type);

      // Add document type - this is required
      if (data.document_type) {
        formData.append('document_type', data.document_type);
      } else {
        throw new Error('Document type is required');
      }

      // Add description if provided
      if (data.description) {
        formData.append('description', data.description);
      }

      // Log the request for debugging
      console.log(`Uploading document for property ${propertyId}:`, {
        document_type: data.document_type,
        description: data.description
      });

      // Add additional logging to see what's being sent in the FormData
      for (let pair of formData.entries()) {
        console.log(`FormData contains: ${pair[0]}: ${pair[1]}`);
      }

      // Make sure we're not setting Content-Type header as the browser needs to set it with the boundary
      const response = await api.post(`/properties/documents/${propertyId}`, formData, {
        headers: {
          // Don't set Content-Type, let the browser set it
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Error uploading document for property ${propertyId}:`, error);
      throw error.response?.data || { message: 'Failed to upload document' };
    }
  },

  /**
   * Get all documents for a property
   * @param {number} propertyId - Property ID
   * @returns {Promise} - Promise with list of documents
   */
  getPropertyDocuments: async (propertyId) => {
    try {
      const response = await api.get(`/properties/documents/${propertyId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching documents for property ${propertyId}:`, error);
      throw error.response?.data || { message: 'Failed to fetch documents' };
    }
  },

  /**
   * Get document details
   * @param {number} propertyId - Property ID
   * @param {number} documentId - Document ID
   * @returns {Promise} - Promise with document details
   */
  getDocumentDetails: async (propertyId, documentId) => {
    try {
      const response = await api.get(`/properties/documents/${propertyId}/${documentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching document details:`, error);
      throw error.response?.data || { message: 'Failed to fetch document details' };
    }
  },

  /**
   * Get all pending documents (admin only)
   * @returns {Promise} - Promise with list of pending documents
   */
  getPendingDocuments: async () => {
    try {
      const response = await api.get('/admin/documents/pending');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending documents:', error);
      throw error.response?.data || { message: 'Failed to fetch pending documents' };
    }
  },

  /**
   * Approve a document (admin only)
   * @param {number} documentId - Document ID
   * @returns {Promise} - Promise with success message
   */
  approveDocument: async (documentId) => {
    try {
      const response = await api.put(`/admin/documents/${documentId}/approve`);
      return response.data;
    } catch (error) {
      console.error(`Error approving document ${documentId}:`, error);
      throw error.response?.data || { message: 'Failed to approve document' };
    }
  },

  /**
   * Reject a document (admin only)
   * @param {number} documentId - Document ID
   * @param {string} rejectionReason - Reason for rejection
   * @returns {Promise} - Promise with success message
   */
  rejectDocument: async (documentId, rejectionReason) => {
    try {
      const response = await api.put(`/admin/documents/${documentId}/reject`, {
        rejection_reason: rejectionReason
      });
      return response.data;
    } catch (error) {
      console.error(`Error rejecting document ${documentId}:`, error);
      throw error.response?.data || { message: 'Failed to reject document' };
    }
  },

  /**
   * Send feedback on a document without approving or rejecting (admin only)
   * @param {number} documentId - Document ID
   * @param {string} feedbackMessage - Feedback message for the landlord
   * @returns {Promise} - Promise with success message
   */
  sendFeedback: async (documentId, feedbackMessage) => {
    try {
      const response = await api.put(`/admin/documents/${documentId}/feedback`, {
        feedback: feedbackMessage
      });
      return response.data;
    } catch (error) {
      console.error(`Error sending feedback for document ${documentId}:`, error);
      throw error.response?.data || { message: 'Failed to send feedback' };
    }
  },

  /**
   * Mark document feedback as read (landlord only)
   * @param {number} propertyId - Property ID
   * @param {number} documentId - Document ID
   * @returns {Promise} - Promise with success message
   */
  markFeedbackRead: async (propertyId, documentId) => {
    try {
      const response = await api.put(`/properties/documents/${propertyId}/${documentId}/mark-feedback-read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking feedback as read for document ${documentId}:`, error);
      throw error.response?.data || { message: 'Failed to mark feedback as read' };
    }
  },

  /**
   * Add a feedback message to a document's feedback thread (landlord or admin)
   * @param {number} propertyId - Property ID
   * @param {number} documentId - Document ID
   * @param {string} message - Feedback message
   * @returns {Promise} - Promise with the created feedback message
   */
  addFeedbackMessage: async (propertyId, documentId, message) => {
    try {
      const response = await api.post(`/properties/documents/${propertyId}/${documentId}/feedback`, {
        message,
        sender_type: 'landlord'
      });
      return response.data;
    } catch (error) {
      console.error(`Error adding feedback message for document ${documentId}:`, error);
      throw error.response?.data || { message: 'Failed to add feedback message' };
    }
  },

  /**
   * Add an admin feedback message to a document's feedback thread (admin only)
   * @param {number} documentId - Document ID
   * @param {string} message - Feedback message
   * @returns {Promise} - Promise with the created feedback message
   */
  addAdminFeedbackMessage: async (documentId, message) => {
    try {
      const response = await api.post(`/admin/documents/${documentId}/feedback-thread`, {
        message,
        sender_type: 'admin'
      });
      return response.data;
    } catch (error) {
      console.error(`Error adding admin feedback message for document ${documentId}:`, error);
      throw error.response?.data || { message: 'Failed to add admin feedback message' };
    }
  },

  /**
   * Get property information for a document
   * This is a placeholder method that would be implemented in a real application
   * @param {number} documentId - Document ID
   * @returns {Promise} - Promise with property ID for the document
   */
  getDocumentProperty: async (documentId) => {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate it by returning a mock response
      console.log(`Getting property for document ${documentId} (placeholder implementation)`);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Return mock data
      return {
        propertyId: 1, // Default property ID
        success: true
      };
    } catch (error) {
      console.error(`Error getting property for document ${documentId}:`, error);
      throw { message: 'Failed to get property for document' };
    }
  }
};

export default DocumentService;
