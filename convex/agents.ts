import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { project: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.project && args.project !== "All") {
      return await ctx.db
        .query("agents")
        .withIndex("by_project", (q) => q.eq("project", args.project!))
        .collect();
    }
    return await ctx.db.query("agents").collect();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("agents"),
    status: v.union(v.literal("Active"), v.literal("Idle"), v.literal("Building")),
    currentActivity: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const update: { status: "Active" | "Idle" | "Building"; currentActivity?: string } = {
      status: args.status,
    };
    if (args.currentActivity !== undefined) {
      update.currentActivity = args.currentActivity;
    }
    await ctx.db.patch(args.id, update);
  },
});

// ─── Current team / agents (as of 2026-03-03) ────────────────────────────────
const CURRENT_AGENTS = [
  // ── COMMAND ─────────────────────────────────────────────────────────────────
  {
    name: "Axiom",
    role: "Master Agent (Command)",
    project: "NEXUS",
    status: "Active" as const,
    responsibilities: [
      "Orchestrate all sub-agents and projects",
      "Maintain session state and memory",
      "Execute Tyler's directives",
      "Consolidate all output before Tyler sees it",
    ],
    currentActivity: "Mission Control update + daily operations",
  },
  // ── KALSHI BOT ───────────────────────────────────────────────────────────────
  {
    name: "Kalshi Bot",
    role: "Prediction Market Trader",
    project: "Kalshi Bot",
    status: "Active" as const,
    responsibilities: [
      "Scan Kalshi markets for edge opportunities",
      "Run 5 trading strategies with log-normal model",
      "Execute trades when confidence ≥ 0.6 (DRY_RUN=true currently)",
      "Log all trade decisions to Hetzner VPS",
    ],
    currentActivity: "LIVE on Hetzner VPS 178.156.136.147, DRY_RUN=true — awaiting confidence threshold",
  },
  // ── CLAWDRAFT AGENTS ─────────────────────────────────────────────────────────
  {
    name: "ContentGen",
    role: "Content Generator",
    project: "Clawdraft",
    status: "Active" as const,
    responsibilities: [
      "Generate X threads, newsletters, LinkedIn posts, YouTube scripts",
      "Apply customer brand voice profile to all outputs",
      "Format and package weekly content",
      "Deliver Sunday 8pm via WhatsApp",
    ],
    currentActivity: "LIVE — Sunday 8pm delivery active",
  },
  {
    name: "Onboarding",
    role: "Customer Onboarding",
    project: "Clawdraft",
    status: "Building" as const,
    responsibilities: [
      "Process new customer brand voice questionnaires",
      "Build and store brand voice profiles in Convex",
      "Trigger ContentGen with first content brief",
      "Send welcome sequence on completion",
    ],
    currentActivity: "BUILT — pending first customer",
  },
  // ── HETERODOX NEWS BOT ───────────────────────────────────────────────────────
  {
    name: "Heterodox News Bot",
    role: "News Aggregator",
    project: "Heterodox News",
    status: "Building" as const,
    responsibilities: [
      "Aggregate news from 44 sources across left/right/center",
      "Categorize and score articles by bias",
      "Feed content to Heterodox News Next.js site",
      "Update feed on scheduled intervals",
    ],
    currentActivity: "BUILT — pending Vercel deploy",
  },
  // ── ECOM AGENTS (PLANNED) ────────────────────────────────────────────────────
  {
    name: "Fulfillment Agent",
    role: "Order Fulfillment",
    project: "Ecom System",
    status: "Building" as const,
    responsibilities: [
      "Process incoming orders automatically",
      "Route orders to CJ Dropshipping",
      "Track fulfillment status",
      "Handle exceptions and delays",
    ],
    currentActivity: "PLANNED — first agent to build",
  },
  {
    name: "Product Scout",
    role: "Market Researcher",
    project: "Ecom System",
    status: "Building" as const,
    responsibilities: [
      "Scan TikTok trending products and Amazon BSR",
      "Score products by margin and competition",
      "Feed shortlist to Supplier agent",
      "Archive research history",
    ],
    currentActivity: "PLANNED — not started",
  },
  {
    name: "Store Manager",
    role: "Listing Creator",
    project: "Ecom System",
    status: "Building" as const,
    responsibilities: [
      "Generate SEO-optimized Shopify product listings",
      "Source and format product images",
      "Publish listings to Shopify store",
      "Monitor listing performance",
    ],
    currentActivity: "PLANNED — not started",
  },
  {
    name: "Pricing Engine",
    role: "Dynamic Pricing",
    project: "Ecom System",
    status: "Building" as const,
    responsibilities: [
      "Monitor competitor pricing in real-time",
      "Implement dynamic repricing rules",
      "Protect margin thresholds automatically",
      "Alert on pricing anomalies",
    ],
    currentActivity: "PLANNED — not started",
  },
  {
    name: "Ad Creative",
    role: "Ads Manager",
    project: "Ecom System",
    status: "Building" as const,
    responsibilities: [
      "Generate ad copy via Claude",
      "Create ad images via Flux/Replicate",
      "Launch and manage ad campaigns",
      "Monitor ROAS and scale winners",
    ],
    currentActivity: "PLANNED — not started",
  },
  {
    name: "Ecom Support",
    role: "Customer Service",
    project: "Ecom System",
    status: "Building" as const,
    responsibilities: [
      "Handle support tickets via Telegram",
      "Process refunds and returns",
      "Respond to reviews",
      "Escalate complex issues to Tyler",
    ],
    currentActivity: "PLANNED — not started",
  },
];

export const resetAndReseed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("agents").collect();
    for (const agent of existing) {
      await ctx.db.delete(agent._id);
    }
    for (const agent of CURRENT_AGENTS) {
      await ctx.db.insert("agents", agent);
    }
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("agents").collect();
    if (existing.length > 0) return;
    for (const agent of CURRENT_AGENTS) {
      await ctx.db.insert("agents", agent);
    }
  },
});
