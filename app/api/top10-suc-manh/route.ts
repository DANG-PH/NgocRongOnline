import { NextRequest, NextResponse } from 'next/server';

const raw = process.env.BACKEND_URL;

if (!raw) {
  throw new Error('BACKEND_URL is not defined');
}

const BACKEND_URL = raw.startsWith('http')
  ? raw
  : `https://${raw}`;

export async function GET() {

  const response = await fetch(
    `${BACKEND_URL}/user/top10-suc-manh`,
    {
      method: 'GET',
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