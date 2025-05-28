import { NextResponse } from 'next/server';
import api from '@/services/apiServer';

/**
 * Handle POST request for creating a guest booking
 * 
 * @param {Request} request - The request object
 * @returns {Promise<NextResponse>} - The response object
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'property_id', 'check_in_date', 'check_out_date', 
      'guests', 'guest_name', 'guest_email', 'guest_phone'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Ensure user_info is present
    if (!body.user_info || !body.user_info.full_name || !body.user_info.email) {
      return NextResponse.json(
        { error: 'Missing required user information' },
        { status: 400 }
      );
    }

    // Forward the request to the backend API
    const response = await api.post('/bookings/guest', body);
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error creating guest booking:', error);
    
    // Return appropriate error response
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message || 
                         error.message || 
                         'An error occurred while creating the guest booking';
    
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
} 