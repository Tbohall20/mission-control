/**
 * push-chronicle.mjs
 * Syncs the master CHRONICLE.md to Convex so /api/chronicle is always live.
 * Run: node push-chronicle.mjs  (from mission-control directory)
 */
import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const client = new ConvexHttpClient("https://superb-yak-348.convex.cloud");

const content = readFileSync(join(__dirname, "..", "CHRONICLE.md"), "utf-8");
console.log(`Pushing CHRONICLE.md: ${content.length} bytes, ${content.split('\n').length} lines`);

await client.mutation(api.chronicle.upsert, { content });

const row = await client.query(api.chronicle.get);
const preview = row.content.trim().split('\n').slice(-2).join('\n');
console.log(`✓ Synced to Convex. Updated: ${new Date(row.updatedAt).toISOString()}`);
console.log(`Preview (last 2 lines):\n${preview}`);
