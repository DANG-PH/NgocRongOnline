import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://chrysocarpous-adonis-multilobular.ngrok-free.dev';

export async function GET() {

  const response = await fetch(
    `${BACKEND_URL}/user/top10-vang`,
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