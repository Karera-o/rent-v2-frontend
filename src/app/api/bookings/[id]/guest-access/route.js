import { NextResponse } from 'next/server';
import api from '@/services/apiServer';

/**
 * Handle POST request for guest access to booking details
 * 
 * @param {Request} request - The request object
 * @param {Object} params - Route parameters containing booking ID
 * @returns {Promise<NextResponse>} - The response object
 */
export async function POST(request, { params }) {
  try {
    const body = await request.json();
    const { id } = params;
    
    // Validate required fields
    if (!body.guest_email) {
      return NextResponse.json(
        { error: 'Missing required field: guest_email' },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Missing booking ID' },
        { status: 400 }
      );
    }

    console.log(`[GuestAccess] Fetching booking ${id} for guest email: ${body.guest_email}`);

    // Forward the request to the backend API
    const response = await api.post(`/bookings/${id}/guest-access`, {
      guest_email: body.guest_email
    });
    
    console.log(`[GuestAccess] Successfully fetched booking ${id} for guest`);
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('[GuestAccess] Error fetching booking for guest:', error);
    
    // Return appropriate error response
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message || 
                         error.message || 
                         'An error occurred while fetching booking details';
    
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
} 