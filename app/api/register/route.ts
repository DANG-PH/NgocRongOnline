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
    
    
    // Gọi backend API
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    
    console.log('Backend response:', data);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { error: 'Đăng ký thất bại!' },
      { status: 500 }
    );
  }
}