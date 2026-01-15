import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://accompanied-recommended-networks-drops.trycloudflare.com';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = await fetch(
    `${BACKEND_URL}/partner/all-account-buyer`,
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