import { NextRequest, NextResponse } from 'next/server';

const raw = process.env.BACKEND_URL;

if (!raw) {
  throw new Error('BACKEND_URL is not defined');
}

const BACKEND_URL = raw.startsWith('http')
  ? raw
  : `https://${raw}`;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { refresh_token } = body;
        
        if (!refresh_token) {
            return NextResponse.json(
                { error: 'Refresh token is required' },
                { status: 400 }
            );
        }
        
        console.log('Refreshing token...');
        
        const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token }),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                errorData || { error: 'Failed to refresh token' },
                { status: response.status }
            );
        }
        
        const data = await response.json();
        console.log('Token refreshed successfully');
        
        return NextResponse.json(data, { status: 201 });
        
    } catch (error) {
        console.error('Error refreshing token:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}