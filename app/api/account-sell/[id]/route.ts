import { NextRequest, NextResponse } from 'next/server';

const raw = process.env.BACKEND_URL;

if (!raw) {
  throw new Error('BACKEND_URL is not defined');
}

const BACKEND_URL = raw.startsWith('http')
  ? raw
  : `https://${raw}`;


export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = await fetch(`${BACKEND_URL}/partner/account-sell/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
    },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
