import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Call the backend API to initialize Twitter authentication
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8006/api';
    const response = await fetch(`${backendUrl}/users/auth/twitter/init`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to initialize Twitter authentication' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Twitter init error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize Twitter authentication' },
      { status: 500 }
    );
  }
}
