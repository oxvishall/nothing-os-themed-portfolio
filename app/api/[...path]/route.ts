import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || "http://localhost:5000/api";

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const searchParams = req.nextUrl.searchParams.toString();
  const url = `${API_URL}/${path}${searchParams ? `?${searchParams}` : ''}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: 'Proxy Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const url = `${API_URL}/${path}`;

  try {
    const body = await req.json();
    const res = await fetch(url, {
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
    return NextResponse.json({ error: 'Proxy Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const url = `${API_URL}/${path}`;

  try {
    const body = await req.json();
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': req.headers.get('x-admin-password') || '',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: 'Proxy Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const url = `${API_URL}/${path}`;

  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'x-admin-password': req.headers.get('x-admin-password') || '',
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: 'Proxy Error' }, { status: 500 });
  }
}
