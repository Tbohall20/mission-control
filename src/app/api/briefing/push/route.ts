import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || 'https://superb-yak-348.convex.cloud'
);

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, date, rawText } = body;

    if (!type || !rawText) {
      return NextResponse.json({ error: 'Missing type or rawText' }, { status: 400 });
    }

    const validTypes = ['morning', 'evening', 'markets'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid type. Must be morning | evening | markets' }, { status: 400 });
    }

    const today = date || new Date().toISOString().split('T')[0];

    await convex.mutation(api.briefings.upsert, {
      type: type as 'morning' | 'evening' | 'markets',
      date: today,
      rawText,
    });

    return NextResponse.json({
      ok: true,
      type,
      date: today,
      url: `https://mission-control-six-mocha.vercel.app/briefing${type === 'morning' ? '' : '/' + type}`,
    });
  } catch (error) {
    console.error('Briefing push error:', error);
    return NextResponse.json({ error: 'Failed to push briefing' }, { status: 500 });
  }
}
