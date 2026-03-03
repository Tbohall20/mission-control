/**
 * auto-sync-chronicle.mjs
 * Runs every 10 minutes via OpenClaw cron.
 * Only pushes if CHRONICLE.md has changed since last sync (hash-based).
 */
import { ConvexHttpClient } from 'convex/browser';
import { api } from './convex/_generated/api.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE = 'C:\\Users\\Tboha\\.openclaw\\workspace-mastercheif';
const CHRONICLE_PATH = path.join(WORKSPACE, 'CHRONICLE.md');
const HASH_CACHE = path.join(__dirname, '.chronicle-hash');
const CONVEX_URL = 'https://superb-yak-348.convex.cloud';

function hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

async function run() {
  if (!fs.existsSync(CHRONICLE_PATH)) {
    console.log('CHRONICLE.md not found — skipping');
    return;
  }

  const content = fs.readFileSync(CHRONICLE_PATH, 'utf8');
  const currentHash = hash(content);

  const cachedHash = fs.existsSync(HASH_CACHE)
    ? fs.readFileSync(HASH_CACHE, 'utf8').trim()
    : '';

  if (currentHash === cachedHash) {
    console.log(`[${new Date().toISOString()}] Chronicle unchanged — skip`);
    return;
  }

  console.log(`[${new Date().toISOString()}] Chronicle changed — syncing...`);

  const client = new ConvexHttpClient(CONVEX_URL);
  await client.mutation(api.chronicle.upsert, { content });

  fs.writeFileSync(HASH_CACHE, currentHash, 'utf8');
  console.log(`[${new Date().toISOString()}] ✓ Chronicle synced (${content.length} bytes, ${content.split('\n').length} lines)`);
}

run().catch((e) => {
  console.error('Chronicle auto-sync error:', e.message);
  process.exit(1);
});
