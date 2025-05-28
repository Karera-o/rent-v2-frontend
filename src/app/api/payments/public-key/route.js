import { NextResponse } from 'next/server';
import api from '@/services/apiServer';

/**
 * Handle GET request for retrieving the Stripe public key
 * This endpoint allows both authenticated and guest users to fetch the public key
 * 
 * @param {Request} request - The request object
 * @returns {Promise<NextResponse>} - The response object
 */
export async function GET(request) {
  try {
    // Get Stripe public key from the backend
    const response = await api.get('/payments/public-key');
    
    return NextResponse.json({
      publishable_key: response.data.publishable_key
    });
  } catch (error) {
    console.error('Error fetching Stripe public key:', error);
    
    // Return appropriate error response
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message || 
                         error.message || 
                         'An error occurred while fetching the Stripe public key';
    
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
} 