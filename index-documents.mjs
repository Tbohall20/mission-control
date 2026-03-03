/**
 * index-documents.mjs
 * Indexes key workspace documents into Convex documents table.
 * Run manually or via cron every hour.
 */
import { ConvexHttpClient } from 'convex/browser';
import { api } from './convex/_generated/api.js';
import fs from 'fs';
import path from 'path';

const CONVEX_URL = 'https://superb-yak-348.convex.cloud';
const WORKSPACE = 'C:\\Users\\Tboha\\.openclaw\\workspace-mastercheif';
const VPS_DOCS = null; // VPS files indexed separately

// Documents to index — path, project, type
const DOCS_TO_INDEX = [
  // ── Core workspace files ──────────────────────────────────────────────────
  { rel: 'MEMORY.md',             project: 'NEXUS',           type: 'md' },
  { rel: 'TASKS.md',              project: 'NEXUS',           type: 'md' },
  { rel: 'SESSION-STATE.md',      project: 'NEXUS',           type: 'md' },
  { rel: 'CHRONICLE.md',          project: 'NEXUS',           type: 'md' },
  { rel: 'HEARTBEAT.md',          project: 'NEXUS',           type: 'md' },
  // ── Clawdraft ─────────────────────────────────────────────────────────────
  { rel: 'OUTREACH-LOG.md',       project: 'Clawdraft',       type: 'md' },
  // ── Trading / Ops ─────────────────────────────────────────────────────────
  { rel: 'TYLER-VOICE.md',        project: 'YouTube Consulting', type: 'md' },
];

// VPS documents (read from remote via SSH — future; for now log as stubs)
const VPS_DOCS_STUBS = [
  { path: '/root/workspace/OSINT-SIGNALS.md',      project: 'Kalshi Bot',    type: 'md', title: 'OSINT Signals Log' },
  { path: '/root/workspace/OSINT-ALERTS.md',       project: 'Kalshi Bot',    type: 'md', title: 'OSINT Alerts' },
  { path: '/root/workspace/ARBITRAGE-LOG.md',      project: 'Kalshi Bot',    type: 'md', title: 'Arbitrage Log' },
  { path: '/root/workspace/ARBITRAGE-ALERTS.md',   project: 'Kalshi Bot',    type: 'md', title: 'Arbitrage Alerts' },
  { path: '/root/workspace/POLYMARKET-PAPER-PNL.md', project: 'Kalshi Bot', type: 'md', title: 'Polymarket Paper P&L' },
  { path: '/root/workspace/POLYMARKET-OPPORTUNITIES.md', project: 'Kalshi Bot', type: 'md', title: 'Polymarket Opportunities' },
  { path: '/root/workspace/CONTRACTS-PIPELINE.md', project: 'OPS',          type: 'md', title: 'SAM.gov Contracts Pipeline' },
  { path: '/root/workspace/LOCAL-PROSPECTS.md',    project: 'OPS',          type: 'md', title: 'Local Business Prospects' },
];

async function run() {
  const client = new ConvexHttpClient(CONVEX_URL);
  let synced = 0;
  let errors = 0;

  console.log(`[${new Date().toISOString()}] Indexing documents...`);

  // Local workspace files
  for (const doc of DOCS_TO_INDEX) {
    const fullPath = path.join(WORKSPACE, doc.rel);
    if (!fs.existsSync(fullPath)) {
      console.log(`  SKIP (not found): ${doc.rel}`);
      continue;
    }
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      const stats = fs.statSync(fullPath);
      const title = path.basename(doc.rel, path.extname(doc.rel));
      await client.mutation(api.documents.upsert, {
        title,
        path: doc.rel,
        project: doc.project,
        type: doc.type,
        content: content.slice(0, 50000), // 50KB cap
        size: stats.size,
      });
      console.log(`  ✓ ${doc.rel} (${Math.round(stats.size / 1024)}KB)`);
      synced++;
    } catch (e) {
      console.error(`  ✗ ${doc.rel}: ${e.message}`);
      errors++;
    }
  }

  // VPS stubs — placeholder entries pointing to VPS paths
  for (const stub of VPS_DOCS_STUBS) {
    try {
      await client.mutation(api.documents.upsert, {
        title: stub.title,
        path: stub.path,
        project: stub.project,
        type: stub.type,
        content: `[VPS Document — ${stub.path}]\n\nThis document lives on the Hetzner VPS (178.156.136.147).\nFetch live content via SSH: cat ${stub.path}`,
        size: 0,
      });
      console.log(`  ✓ VPS stub: ${stub.title}`);
      synced++;
    } catch (e) {
      console.error(`  ✗ VPS stub ${stub.title}: ${e.message}`);
      errors++;
    }
  }

  console.log(`\n✓ Done. Synced: ${synced} | Errors: ${errors}`);
}

run().catch((e) => {
  console.error('Document index error:', e.message);
  process.exit(1);
});
