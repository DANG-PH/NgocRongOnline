import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://accompanied-recommended-networks-drops.trycloudflare.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('Forwarding to backend:', `${BACKEND_URL}/auth/verify-otp`);
    console.log('Request body:', body);

    const response = await fetch(`${BACKEND_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log(' Backend response:', data);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message || 'Xác thực OTP thất bại!',
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error(' Verify OTP API error:', error);
    return NextResponse.json(
      { success: false, message: 'Xác thực OTP thất bại!' },
      { status: 500 }
    );
  }
}
