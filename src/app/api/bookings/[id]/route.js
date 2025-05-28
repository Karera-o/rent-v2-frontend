import { NextResponse } from 'next/server';
import api from '@/services/apiServer';

/**
 * Handle GET request for retrieving a booking by ID
 * This endpoint allows both authenticated and guest users to fetch booking details
 * 
 * @param {Request} request - The request object
 * @param {Object} params - The route parameters
 * @returns {Promise<NextResponse>} - The response object
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }
    
    // Get booking details from the backend
    // Use the guest-accessible endpoint for all bookings to ensure it works for both
    // authenticated and guest users
    const response = await api.get(`/bookings/guest/${id}`);
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error fetching booking ${params.id}:`, error);
    
    // Return appropriate error response
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message || 
                         error.message || 
                         'An error occurred while fetching the booking';
    
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
} 