import { NextRequest, NextResponse } from 'next/server';

const raw = process.env.BACKEND_URL;

if (!raw) {
  throw new Error('BACKEND_URL is not defined');
}

const BACKEND_URL = raw.startsWith('http')
  ? raw
  : `https://${raw}`;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const response = await fetch(`${BACKEND_URL}/cashier/user-withdraw?user_id=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
    },
    cache: 'no-store',
  });

  const data = await response.json();
  
  return NextResponse.json(data, {
    status: response.status,
    headers: {
      'Cache-Control': 'no-store, must-revalidate',
    },
  });
}