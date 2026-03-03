import { ConvexHttpClient } from 'convex/browser';
import { api } from './convex/_generated/api.js';

const CONVEX_URL = 'https://superb-yak-348.convex.cloud';
const client = new ConvexHttpClient(CONVEX_URL);

async function run() {
  console.log('Reseeding Mission Control with current data...');
  console.log('Target:', CONVEX_URL);
  console.log('Timestamp:', new Date().toISOString());
  console.log('');

  try {
    const tasksResult = await client.mutation(api.tasks.resetAndReseed, {});
    console.log('✓ Tasks reseeded:', tasksResult?.count ?? 'ok');
  } catch (e) {
    console.error('✗ Tasks reseed failed:', e.message);
  }

  try {
    const agentsResult = await client.mutation(api.agents.resetAndReseed, {});
    console.log('✓ Agents reseeded:', agentsResult?.count ?? 'ok');
  } catch (e) {
    console.error('✗ Agents reseed failed:', e.message);
  }

  try {
    const productsResult = await client.mutation(api.products.resetAndReseed, {});
    console.log('✓ Products reseeded:', productsResult?.count ?? 'ok');
  } catch (e) {
    console.error('✗ Products reseed failed:', e.message);
  }

  console.log('\nDone. Verify at: https://mission-control-six-mocha.vercel.app/api/summary');
}

run().catch(console.error);
