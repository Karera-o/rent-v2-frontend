import api from './api';

const ContactService = {
  /**
   * Send a contact form message
   * @param {Object} contactData - Contact form data
   * @returns {Promise} - Promise with success message
   */
  sendContactMessage: async (contactData) => {
    try {
      // Format the data to match the backend API expectations
      const formattedData = {
        first_name: contactData.firstName,
        last_name: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone,
        subject: contactData.subject,
        message: contactData.message
      };

      // Send the contact message to the backend API
      const response = await api.post('/contact/', formattedData);

      return {
        success: true,
        message: response.data.message || 'Your message has been sent successfully! Our team will get back to you soon.'
      };
    } catch (error) {
      console.error('Error sending contact message:', error);
      throw error.response?.data || { message: 'Failed to send message. Please try again.' };
    }
  }
};

export default ContactService;
