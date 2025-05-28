import { NextResponse } from 'next/server';
import api from '@/services/apiServer';

/**
 * Handle POST request for creating a quick payment intent
 * This endpoint expects booking_id as a path parameter
 * 
 * @param {Request} request - The request object
 * @param {Object} params - Route parameters containing booking ID
 * @returns {Promise<NextResponse>} - The response object
 */
export async function POST(request, { params }) {
  try {
    const { bookingId } = params;
    
    // Validate required path parameter
    if (!bookingId) {
      return NextResponse.json(
        { error: 'Missing booking ID in path' },
        { status: 400 }
      );
    }

    console.log(`[QuickIntent] Creating quick payment intent for booking ID: ${bookingId}`);

    // Forward the request to the backend API with booking_id as path parameter
    const response = await api.post(`/payments/quick-intent/${bookingId}`);
    
    console.log(`[QuickIntent] Quick payment intent created successfully:`, response.data);
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('[QuickIntent] Error creating quick payment intent:', error);
    
    // Return appropriate error response
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message || 
                         error.message || 
                         'An error occurred while creating the quick payment intent';
    
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
} 