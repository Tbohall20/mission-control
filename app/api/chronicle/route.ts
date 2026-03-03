import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || 'https://superb-yak-348.convex.cloud'
);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const row = await convex.query(api.chronicle.get);

    if (!row) {
      return new NextResponse('# CHRONICLE.md\n\n_No entries yet._', {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      });
    }

    return new NextResponse(row.content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Chronicle-Updated': new Date(row.updatedAt).toISOString(),
      },
    });
  } catch (error) {
    console.error('Chronicle fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chronicle from Convex' },
      { status: 500 }
    );
  }
}
