import { NextResponse } from 'next/server';

const USERNAME = 'oxvishall';
const JOGRUBER = `https://github-contributions-api.jogruber.de/v4/${USERNAME}`;

type Day = { date: string; count: number; level: number };

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function toISO(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export async function GET() {
  try {
    const res = await fetch(JOGRUBER, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Upstream GitHub stats failed' }, { status: 502 });
    }

    const data = (await res.json()) as {
      total: Record<string, number>;
      contributions: Day[];
    };

    const byDate = new Map<string, Day>();
    for (const day of data.contributions ?? []) {
      byDate.set(day.date, day);
    }

    const today = startOfDay(new Date());
    const thisYear = today.getFullYear();
    const yearAgo = startOfDay(new Date(today));
    yearAgo.setDate(yearAgo.getDate() - 364);

    // Align the graph to Sunday, covering ~53 weeks like GitHub's calendar.
    const graphStart = new Date(yearAgo);
    graphStart.setDate(graphStart.getDate() - graphStart.getDay());

    const days: Day[] = [];
    const cursor = new Date(graphStart);
    while (cursor <= today) {
      const iso = toISO(cursor);
      const hit = byDate.get(iso);
      days.push(hit ?? { date: iso, count: 0, level: 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    let lastYear = 0;
    for (const day of days) {
      const d = new Date(day.date + 'T00:00:00');
      if (d >= yearAgo && d <= today) lastYear += day.count;
    }

    const allTime = Object.values(data.total ?? {}).reduce((sum, n) => sum + n, 0);

    return NextResponse.json(
      {
        username: USERNAME,
        thisYear: data.total?.[String(thisYear)] ?? 0,
        lastYear,
        allTime,
        days,
      },
      {
        headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load GitHub stats', details: (error as Error).message },
      { status: 500 },
    );
  }
}
