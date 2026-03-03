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
    status: v.union(
      v.literal("Todo"),
      v.literal("In Progress"),
      v.literal("Done")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(
      v.literal("Todo"),
      v.literal("In Progress"),
      v.literal("Done")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

// ─── Accurate seed data (as of 2026-03-03) ───────────────────────────────────
const CURRENT_TASKS = [
  // ── CLAWDRAFT — DONE ────────────────────────────────────────────────────────
  {
    title: "Build Clawdraft landing page",
    assignee: "Axiom",
    project: "Clawdraft",
    priority: "High" as const,
    status: "Done" as const,
    createdAt: Date.now() - 86400000 * 14,
  },
  {
    title: "Build interactive demo section (4 iframe demos)",
    assignee: "Axiom",
    project: "Clawdraft",
    priority: "High" as const,
    status: "Done" as const,
    createdAt: Date.now() - 86400000 * 12,
  },
  {
    title: "Configure custom domain — clawdraft.app",
    assignee: "Axiom",
    project: "Clawdraft",
    priority: "High" as const,
    status: "Done" as const,
    createdAt: Date.now() - 86400000 * 11,
  },
  {
    title: "Deploy ContentGen agent (Sunday 8pm delivery)",
    assignee: "ContentGen",
    project: "Clawdraft",
    priority: "High" as const,
    status: "Done" as const,
    createdAt: Date.now() - 86400000 * 6,
  },
  {
    title: "Build Clawdraft Onboarding agent",
    assignee: "Axiom",
    project: "Clawdraft",
    priority: "High" as const,
    status: "Done" as const,
    createdAt: Date.now() - 86400000 * 4,
  },
  // ── CLAWDRAFT — IN PROGRESS / TODO ──────────────────────────────────────────
  {
    title: "Paddle approval pending — awaiting merchant account",
    assignee: "Tyler",
    project: "Clawdraft",
    priority: "High" as const,
    status: "In Progress" as const,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    title: "Get Paddle checkout links once approved → run swap script",
    assignee: "Axiom",
    project: "Clawdraft",
    priority: "High" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Record 60s Loom demo video (WhatsApp delivery screen recording)",
    assignee: "Tyler",
    project: "Clawdraft",
    priority: "High" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Build DIY Kit file bundle + setup guide",
    assignee: "Axiom",
    project: "Clawdraft",
    priority: "High" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Build clawdraft-support agent (Scout)",
    assignee: "Axiom",
    project: "Clawdraft",
    priority: "Medium" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Build clawdraft-sales agent",
    assignee: "Axiom",
    project: "Clawdraft",
    priority: "Medium" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  // ── YOUTUBE CONSULTING ─────────────────────────────────────────────────────
  {
    title: "Shane (LinkedIn lead): awaiting reply",
    assignee: "Tyler",
    project: "YouTube Consulting",
    priority: "High" as const,
    status: "In Progress" as const,
    createdAt: Date.now(),
  },
  {
    title: "LinkedIn posts: Tyler to provide payload for 4 hooks",
    assignee: "Tyler",
    project: "YouTube Consulting",
    priority: "Medium" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Keep 4–5 LinkedIn posts/week cadence",
    assignee: "Tyler",
    project: "YouTube Consulting",
    priority: "Medium" as const,
    status: "In Progress" as const,
    createdAt: Date.now(),
  },
  {
    title: "Close first paid diagnostic ($2K diagnostic + retainer)",
    assignee: "Tyler",
    project: "YouTube Consulting",
    priority: "High" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  // ── HETERODOX NEWS — TODO ───────────────────────────────────────────────────
  {
    title: "Deploy Heterodox News to Vercel",
    assignee: "Tyler",
    project: "Heterodox News",
    priority: "High" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Configure custom domain for Heterodox News site",
    assignee: "Tyler",
    project: "Heterodox News",
    priority: "Medium" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  // ── HETERODOX MEDIA — TODO ──────────────────────────────────────────────────
  {
    title: "Build investor pitch deck for $950K SAFE raise",
    assignee: "Axiom",
    project: "Heterodox Media",
    priority: "High" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Rebuild 5-year financial model (Y1 $1.22M → Y3 $6M)",
    assignee: "Axiom",
    project: "Heterodox Media",
    priority: "High" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Close $950K SAFE round with Emerald's advertiser contact",
    assignee: "Tyler",
    project: "Heterodox Media",
    priority: "High" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  // ── KALSHI BOT ─────────────────────────────────────────────────────────────
  {
    title: "Kalshi: flip DRY_RUN=false once Claude approves ≥0.6 confidence",
    assignee: "Tyler",
    project: "Kalshi Bot",
    priority: "Medium" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Monitor Kalshi bot log output on Hetzner VPS",
    assignee: "Axiom",
    project: "Kalshi Bot",
    priority: "Medium" as const,
    status: "In Progress" as const,
    createdAt: Date.now(),
  },
  // ── ECOM SYSTEM — TODO ──────────────────────────────────────────────────────
  {
    title: "Ecom system build: start fulfillment agent first",
    assignee: "Axiom",
    project: "Ecom System",
    priority: "Medium" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Build product-scout agent (TikTok/Amazon BSR scraping)",
    assignee: "Axiom",
    project: "Ecom System",
    priority: "Medium" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Build store-manager agent (CJ → Shopify listings)",
    assignee: "Axiom",
    project: "Ecom System",
    priority: "Medium" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Build pricing-agent (dynamic repricing)",
    assignee: "Axiom",
    project: "Ecom System",
    priority: "Low" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Build ad-creative agent (Claude copy + Flux images)",
    assignee: "Axiom",
    project: "Ecom System",
    priority: "Low" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Build ecom support-agent (Telegram ticketing)",
    assignee: "Axiom",
    project: "Ecom System",
    priority: "Low" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  // ── HARVESTHUB — BACKGROUND ─────────────────────────────────────────────────
  {
    title: "HarvestHub: no spend until Clawdraft closes first sale",
    assignee: "Tyler",
    project: "HarvestHub",
    priority: "Low" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
];

export const resetAndReseed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("tasks").collect();
    for (const task of existing) {
      await ctx.db.delete(task._id);
    }
    for (const task of CURRENT_TASKS) {
      await ctx.db.insert("tasks", task);
    }
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("tasks").collect();
    if (existing.length > 0) return;
    for (const task of CURRENT_TASKS) {
      await ctx.db.insert("tasks", task);
    }
  },
});
