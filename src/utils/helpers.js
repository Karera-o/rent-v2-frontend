// Helper functions for the application

/**
 * Fix document URLs to point to the backend server
 * @param {string} url - Document URL from the API
 * @returns {string} - Fixed document URL
 */
export const fixDocumentUrl = (url) => {
  if (!url) return '';
  
  // If the URL is already absolute (starts with http:// or https://), return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Get the backend URL from the environment or use the default
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003/api';
  
  // Extract the base URL (without /api)
  const baseUrl = backendUrl.replace(/\/api$/, '');
  
  // If the URL starts with /media, append it to the base URL
  if (url.startsWith('/media')) {
    return `${baseUrl}${url}`;
  }
  
  // If the URL is a relative path to media, add the leading slash
  if (url.startsWith('media/')) {
    return `${baseUrl}/${url}`;
  }
  
  // Default case: just prepend the base URL
  return `${baseUrl}/${url}`;
};

/**
 * Format a date string to a more readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format a price to a readable format with currency symbol
 * @param {number} price - Price in cents
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price) => {
  if (price === undefined || price === null) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price / 100);
};

/**
 * Truncate a string to a specified length and add ellipsis
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated string
 */
export const truncateString = (str, length = 100) => {
  if (!str) return '';
  if (str.length <= length) return str;
  return `${str.substring(0, length)}...`;
};

/**
 * Format a phone number to a readable format
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
};

/**
 * Capitalize the first letter of each word in a string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
