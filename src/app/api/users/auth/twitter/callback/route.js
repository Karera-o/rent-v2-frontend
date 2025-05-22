import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    const { oauth_token, oauth_verifier, role } = data;
    
    if (!oauth_token || !oauth_verifier) {
      return NextResponse.json(
        { error: 'Missing OAuth parameters' },
        { status: 400 }
      );
    }
    
    // Call the backend API to authenticate with Twitter
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8006/api';
    
    const requestData = {
      oauth_token,
      oauth_verifier
    };
    
    if (role) {
      requestData.role = role;
    }
    
    const response = await fetch(`${backendUrl}/users/auth/twitter/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to authenticate with Twitter' },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Twitter callback error:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate with Twitter' },
      { status: 500 }
    );
  }
}
