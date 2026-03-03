import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { project: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.project && args.project !== "All") {
      return await ctx.db
        .query("tasks")
        .withIndex("by_project", (q) => q.eq("project", args.project!))
        .collect();
    }
    return await ctx.db.query("tasks").collect();
  },
});

export const projects = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("tasks").collect();
    const unique = Array.from(new Set(all.map((t) => t.project))).sort();
    return unique;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    assignee: v.string(),
    project: v.string(),
    priority: v.union(v.literal("High"), v.literal("Medium"), v.literal("Low")),
    status: v.union(v.literal("Todo"), v.literal("In Progress"), v.literal("Done")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", { ...args, createdAt: Date.now() });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(v.literal("Todo"), v.literal("In Progress"), v.literal("Done")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const updateTask = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    status: v.optional(v.union(v.literal("Todo"), v.literal("In Progress"), v.literal("Done"))),
    priority: v.optional(v.union(v.literal("High"), v.literal("Medium"), v.literal("Low"))),
    assignee: v.optional(v.string()),
    project: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const updates = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, updates);
  },
});

export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ─── Accurate seed data — 2026-03-03 18:45 ET ────────────────────────────────
const CURRENT_TASKS = [
  // ── CLAWDRAFT — DONE ────────────────────────────────────────────────────────
  { title: "Build Clawdraft landing page", assignee: "Axiom", project: "Clawdraft", priority: "High" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 14 },
  { title: "Build interactive demo widget (chat UI)", assignee: "Axiom", project: "Clawdraft", priority: "High" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 12 },
  { title: "Configure custom domain — clawdraft.app", assignee: "Axiom", project: "Clawdraft", priority: "High" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 11 },
  { title: "Terms + Privacy pages live (clawdraft.app/terms + /privacy)", assignee: "Axiom", project: "Clawdraft", priority: "High" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 8 },
  { title: "Build onboard.html DFY intake form (Formspree wired)", assignee: "Axiom", project: "Clawdraft", priority: "High" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 5 },
  { title: "Build thankyou.html post-purchase page (DIY + DFY flows)", assignee: "Axiom", project: "Clawdraft", priority: "High" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 5 },
  { title: "Build DIY Kit (SETUP_GUIDE.md + AGENT_CONFIG_TEMPLATE.md + README.md + ZIP)", assignee: "Axiom", project: "Clawdraft", priority: "High" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 5 },
  { title: "Build Clawdraft Onboarding agent (SOUL + ONBOARD_PROMPT + SAMPLE_OUTPUT)", assignee: "Axiom", project: "Clawdraft", priority: "High" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 5 },
  { title: "Deploy ContentGen agent (Sunday 8pm delivery, fitness-creator live)", assignee: "ContentGen", project: "Clawdraft", priority: "High" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 6 },
  { title: "Build Clawdraft support agent (Scout, built)", assignee: "Axiom", project: "Clawdraft", priority: "Medium" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 1 },
  { title: "Build outreach pipeline — 100 leads queued in OUTREACH-LOG.md", assignee: "Axiom", project: "Clawdraft", priority: "High" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 1 },
  { title: "Switch from Paddle to Stripe (Paddle dropped — too slow)", assignee: "Axiom", project: "Clawdraft", priority: "High" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 1 },
  // ── CLAWDRAFT — ACTIVE ──────────────────────────────────────────────────────
  { title: "Tyler creates Stripe payment links ($297 DIY + $497 DFY) — paste in chat", assignee: "Tyler", project: "Clawdraft", priority: "High" as const, status: "In Progress" as const, createdAt: Date.now() },
  { title: "Tyler approves 100 outreach leads (OUTREACH-LOG.md) before send", assignee: "Tyler", project: "Clawdraft", priority: "High" as const, status: "In Progress" as const, createdAt: Date.now() },
  { title: "Tyler connects X + LinkedIn credentials in n8n dashboard", assignee: "Tyler", project: "Clawdraft", priority: "High" as const, status: "In Progress" as const, createdAt: Date.now() },
  { title: "Record 60s Loom demo video (WhatsApp delivery screen recording)", assignee: "Tyler", project: "Clawdraft", priority: "High" as const, status: "Todo" as const, createdAt: Date.now() },
  { title: "TYLER-VOICE.md — Tyler provides 3 LinkedIn examples (HARD BLOCKED)", assignee: "Tyler", project: "Clawdraft", priority: "High" as const, status: "In Progress" as const, createdAt: Date.now() },
  { title: "About / Contact pages on clawdraft.app", assignee: "Axiom", project: "Clawdraft", priority: "Low" as const, status: "Todo" as const, createdAt: Date.now() },
  // ── YOUTUBE CONSULTING ─────────────────────────────────────────────────────
  { title: "Shane (LinkedIn lead) — awaiting reply, 72hr follow-up due March 5", assignee: "Tyler", project: "YouTube Consulting", priority: "High" as const, status: "In Progress" as const, createdAt: Date.now() },
  { title: "Close first paid diagnostic ($1.5K–$2.5K) with any warm lead", assignee: "Tyler", project: "YouTube Consulting", priority: "High" as const, status: "Todo" as const, createdAt: Date.now() },
  { title: "LinkedIn posts: 4–5/week cadence (BLOCKED until TYLER-VOICE.md)", assignee: "Tyler", project: "YouTube Consulting", priority: "Medium" as const, status: "In Progress" as const, createdAt: Date.now() },
  { title: "Siddharth (VaynerMedia EVP) — keep warm, no deal", assignee: "Axiom", project: "YouTube Consulting", priority: "Low" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 1 },
  // ── HETERODOX NEWS ──────────────────────────────────────────────────────────
  { title: "Heterodox News deployed to Vercel (heterodox-news.vercel.app)", assignee: "Axiom", project: "Heterodox News", priority: "High" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 5 },
  { title: "Amber/gold rebrand + Playfair Display font + synopses live", assignee: "Axiom", project: "Heterodox News", priority: "High" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 5 },
  { title: "Configure custom domain for Heterodox News", assignee: "Tyler", project: "Heterodox News", priority: "Medium" as const, status: "Todo" as const, createdAt: Date.now() },
  // ── HETERODOX MEDIA ─────────────────────────────────────────────────────────
  { title: "Investor docs built (EXEC SUMMARY + FINANCIALS + SAFE TERMS + PITCH)", assignee: "Axiom", project: "Heterodox Media", priority: "High" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 5 },
  { title: "Close $950K SAFE round — offline with Emerald + advertiser contacts", assignee: "Tyler", project: "Heterodox Media", priority: "High" as const, status: "In Progress" as const, createdAt: Date.now() },
  // ── TRADING / KALSHI ────────────────────────────────────────────────────────
  { title: "Kalshi bot LIVE on Hetzner VPS (DRY_RUN=true, 14-day paper)", assignee: "Axiom", project: "Kalshi Bot", priority: "High" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 2 },
  { title: "Polymarket MM bot live (paper mode, Avellaneda-Stoikov spread)", assignee: "Axiom", project: "Kalshi Bot", priority: "High" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 1 },
  { title: "Cross-platform arb monitor (Kalshi + Polymarket, cron */5min)", assignee: "Axiom", project: "Kalshi Bot", priority: "High" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 1 },
  { title: "OSINT signal layer — geopolitical news + flight tracking vs Polymarket", assignee: "Axiom", project: "Kalshi Bot", priority: "Medium" as const, status: "Done" as const, createdAt: Date.now() },
  { title: "Paper mode review: March 17 — flip DRY_RUN=false if logs confirm edges", assignee: "Axiom", project: "Kalshi Bot", priority: "High" as const, status: "In Progress" as const, createdAt: Date.now() },
  // ── OPS / INFRASTRUCTURE ────────────────────────────────────────────────────
  { title: "n8n installed on Hetzner VPS (Docker, port 5678, 4 workflow stubs)", assignee: "Axiom", project: "OPS", priority: "High" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 1 },
  { title: "Ollama 0.17.5 + qwen3:1.7b on Hetzner VPS (4GB swap, inference confirmed)", assignee: "Axiom", project: "OPS", priority: "Medium" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 1 },
  { title: "9 OpenClaw cron jobs active (5:30am/7am/8:30am/9am/10pm/Sun/monthly)", assignee: "Axiom", project: "OPS", priority: "High" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 1 },
  { title: "CHRONICLE.md API endpoint live (/api/chronicle, Convex-backed)", assignee: "Axiom", project: "OPS", priority: "Medium" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 1 },
  { title: ".claude/agents/ directory built (12 agent files, 4 dirs)", assignee: "Axiom", project: "OPS", priority: "Low" as const, status: "Done" as const, createdAt: Date.now() - 86400000 * 1 },
  { title: "Visual briefing pages: /briefing /briefing/evening /briefing/markets", assignee: "Axiom", project: "OPS", priority: "High" as const, status: "Done" as const, createdAt: Date.now() },
  { title: "CHRONICLE auto-sync — file watcher (no manual push-chronicle.mjs)", assignee: "Axiom", project: "OPS", priority: "High" as const, status: "In Progress" as const, createdAt: Date.now() },
  { title: "Mission Control full rebuild — live editing, documents panel, real data", assignee: "Axiom", project: "OPS", priority: "High" as const, status: "In Progress" as const, createdAt: Date.now() },
  { title: "SAM.gov contracts pipeline (fixture data — needs SAM API key to go live)", assignee: "Axiom", project: "OPS", priority: "Medium" as const, status: "Done" as const, createdAt: Date.now() },
  { title: "Local business prospector (285 FL businesses, 269 HTML previews, pending Tyler review)", assignee: "Axiom", project: "OPS", priority: "Medium" as const, status: "Done" as const, createdAt: Date.now() },
  // ── ECOM ────────────────────────────────────────────────────────────────────
  { title: "Ecom system architecture done — fulfillment agent is first build", assignee: "Axiom", project: "Ecom System", priority: "Medium" as const, status: "Todo" as const, createdAt: Date.now() },
  // ── HARVESTHUB ──────────────────────────────────────────────────────────────
  { title: "HarvestHub on hold — no spend until Clawdraft closes first sale", assignee: "Tyler", project: "HarvestHub", priority: "Low" as const, status: "Todo" as const, createdAt: Date.now() },
];

export const resetAndReseed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("tasks").collect();
    for (const task of existing) await ctx.db.delete(task._id);
    for (const task of CURRENT_TASKS) await ctx.db.insert("tasks", task);
    return { count: CURRENT_TASKS.length };
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("tasks").collect();
    if (existing.length > 0) return;
    for (const task of CURRENT_TASKS) await ctx.db.insert("tasks", task);
  },
});
