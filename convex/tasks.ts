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

// ─── Accurate seed data (as of 2026-02-25) ───────────────────────────────────
const CURRENT_TASKS = [
  // ── CLAWDRAFT — DONE ────────────────────────────────────────────────────────
  {
    title: "Build Clawdraft landing page",
    assignee: "Axiom",
    project: "Clawdraft",
    priority: "High" as const,
    status: "Done" as const,
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    title: "Build interactive demo section (4 iframe demos)",
    assignee: "Axiom",
    project: "Clawdraft",
    priority: "High" as const,
    status: "Done" as const,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    title: "Configure custom domain — clawdraft.app",
    assignee: "Axiom",
    project: "Clawdraft",
    priority: "High" as const,
    status: "Done" as const,
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    title: "Deploy WhatsApp delivery agent (fitness-creator)",
    assignee: "Delivery",
    project: "Clawdraft",
    priority: "High" as const,
    status: "Done" as const,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    title: "Draft Days 1 & 2 marketing content (X + LinkedIn)",
    assignee: "Axiom",
    project: "Clawdraft",
    priority: "Medium" as const,
    status: "Done" as const,
    createdAt: Date.now() - 86400000 * 2,
  },
  // ── CLAWDRAFT — IN PROGRESS ─────────────────────────────────────────────────
  {
    title: "Lemon Squeezy account approval (payment integration)",
    assignee: "Tyler",
    project: "Clawdraft",
    priority: "High" as const,
    status: "In Progress" as const,
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    title: "Review and publish Days 1 & 2 marketing posts",
    assignee: "Tyler",
    project: "Clawdraft",
    priority: "High" as const,
    status: "In Progress" as const,
    createdAt: Date.now() - 86400000 * 1,
  },
  // ── CLAWDRAFT — TODO ────────────────────────────────────────────────────────
  {
    title: "Swap buy button placeholders with real Lemon Squeezy links",
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
  {
    title: "Build clawdraft-ops agent",
    assignee: "Axiom",
    project: "Clawdraft",
    priority: "Low" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Set up onboarding email sequence",
    assignee: "Onboarding",
    project: "Clawdraft",
    priority: "Medium" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  // ── YOUTUBE CONSULTING — IN PROGRESS / TODO ────────────────────────────────
  {
    title: "Convert Faisal (food challenge) to Channel Audit Accelerator",
    assignee: "Tyler",
    project: "YouTube Consulting",
    priority: "High" as const,
    status: "In Progress" as const,
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    title: "Convert Laurence (Wall of Entertainment) to Channel Audit Accelerator",
    assignee: "Tyler",
    project: "YouTube Consulting",
    priority: "High" as const,
    status: "In Progress" as const,
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    title: "Publish LinkedIn Day 1 content post",
    assignee: "Tyler",
    project: "YouTube Consulting",
    priority: "High" as const,
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
    title: "Close first paid diagnostic ($1.5K–$2.5K)",
    assignee: "Tyler",
    project: "YouTube Consulting",
    priority: "High" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  // ── HETERODOX MEDIA — TODO ──────────────────────────────────────────────────
  {
    title: "Rebuild business plan as real working file",
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
    title: "Build investor pitch deck for $950K SAFE raise",
    assignee: "Axiom",
    project: "Heterodox Media",
    priority: "High" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Draft LLC operating agreement with Class A/B share structure",
    assignee: "Tyler",
    project: "Heterodox Media",
    priority: "Medium" as const,
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
  // ── HARVESTHUB — TODO ───────────────────────────────────────────────────────
  {
    title: "Build vendor + consumer waitlist landing page",
    assignee: "Axiom",
    project: "HarvestHub",
    priority: "High" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Research + register domain (harvesthub.co or alternative)",
    assignee: "Tyler",
    project: "HarvestHub",
    priority: "Medium" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Validate vendor demand — target 50 waitlist signups in 30 days",
    assignee: "Tyler",
    project: "HarvestHub",
    priority: "High" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Write vendor agreement with Florida cottage food compliance language",
    assignee: "Axiom",
    project: "HarvestHub",
    priority: "Medium" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Build brand identity (name, colors, voice, positioning)",
    assignee: "Axiom",
    project: "HarvestHub",
    priority: "Medium" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  // ── ECOM SYSTEM — TODO ──────────────────────────────────────────────────────
  {
    title: "Spin up Hetzner VPS (CAX11, Ubuntu 24.04)",
    assignee: "Tyler",
    project: "Ecom System",
    priority: "High" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Build order-fulfillment agent (first to build)",
    assignee: "Axiom",
    project: "Ecom System",
    priority: "High" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Build product-scout agent (TikTok/Amazon BSR scraping)",
    assignee: "Axiom",
    project: "Ecom System",
    priority: "High" as const,
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
    priority: "Medium" as const,
    status: "Todo" as const,
    createdAt: Date.now(),
  },
  {
    title: "Build ad-creative agent (Claude copy + Flux images)",
    assignee: "Axiom",
    project: "Ecom System",
    priority: "Medium" as const,
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
