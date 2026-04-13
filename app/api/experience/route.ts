import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || "http://localhost:5000/api";

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/experience`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_URL}/experience`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': req.headers.get('x-admin-password') || '',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}
