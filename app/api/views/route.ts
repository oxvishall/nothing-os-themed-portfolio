import { NextResponse } from 'next/server';

const API_URL = process.env.API_URL || "http://localhost:5000/api";

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/views`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch views count' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const res = await fetch(`${API_URL}/views`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to increment views count' }, { status: 500 });
  }
}
