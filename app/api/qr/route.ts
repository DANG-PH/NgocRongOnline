import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://chrysocarpous-adonis-multilobular.ngrok-free.dev';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // const userId = request.nextUrl.searchParams.get('userId');
  // if (!userId) {
  //   return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  // }

  const amount = request.nextUrl.searchParams.get('amount');
  if (!amount) {
    return NextResponse.json({ error: 'amount is required' }, { status: 400 });
  }

  // const username = request.nextUrl.searchParams.get('username');
  // if (!username) {
  //   return NextResponse.json({ error: 'username is required' }, { status: 400 });
  // }

  const response = await fetch(
    `${BACKEND_URL}/pay/qr?amount=${amount}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      cache: 'no-store',
    }
  );

  const data = await response.json().catch(() => ({
    error: 'Invalid JSON from backend',
  }));

  return NextResponse.json(data, {
    status: response.status,
    headers: {
      'Cache-Control': 'no-store, must-revalidate',
    },
  });
}