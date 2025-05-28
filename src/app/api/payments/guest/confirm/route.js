import { NextResponse } from 'next/server';
import api from '@/services/apiServer';

/**
 * Handle POST request for confirming a guest payment
 * 
 * @param {Request} request - The request object
 * @returns {Promise<NextResponse>} - The response object
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.payment_intent_id) {
      return NextResponse.json(
        { error: 'Missing required field: payment_intent_id' },
        { status: 400 }
      );
    }

    // Forward the request to the backend API
    const response = await api.post('/payments/guest/confirm', body);
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error confirming guest payment:', error);
    
    // Return appropriate error response
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message || 
                         error.message || 
                         'An error occurred while confirming the payment';
    
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
} 