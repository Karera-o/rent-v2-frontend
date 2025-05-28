import { NextResponse } from 'next/server';
import api from '@/services/apiServer';

/**
 * Handle POST request for creating a guest payment intent
 * 
 * @param {Request} request - The request object
 * @returns {Promise<NextResponse>} - The response object
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.booking_id) {
      return NextResponse.json(
        { error: 'Missing required field: booking_id' },
        { status: 400 }
      );
    }

    // Forward the request to the backend API
    const response = await api.post('/payments/guest/intent', body);
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error creating guest payment intent:', error);
    
    // Return appropriate error response
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message || 
                         error.message || 
                         'An error occurred while creating the payment intent';
    
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
} 