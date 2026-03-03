import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import BriefingView from './BriefingView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || 'https://superb-yak-348.convex.cloud'
);

export default async function MorningBriefingPage() {
  let data = null;
  try {
    data = await convex.query(api.briefings.getLatest, { type: 'morning' });
  } catch (e) {
    console.error('Failed to fetch morning briefing:', e);
  }
  return <BriefingView data={data} />;
}
