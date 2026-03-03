import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';
import BriefingView from '../BriefingView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || 'https://superb-yak-348.convex.cloud'
);

export default async function MarketEdgesPage() {
  let data = null;
  try {
    data = await convex.query(api.briefings.getLatest, { type: 'markets' });
  } catch (e) {
    console.error('Failed to fetch market edges:', e);
  }
  return <BriefingView data={data} />;
}
