import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    signups: v.optional(v.number()),
    revenue: v.optional(v.number()),
    slotsRemaining: v.optional(v.number()),
    phase: v.optional(
      v.union(
        v.literal("Idea"),
        v.literal("Building"),
        v.literal("Soft Launch"),
        v.literal("Live"),
        v.literal("Scaling")
      )
    ),
    status: v.optional(
      v.union(v.literal("Idea"), v.literal("Building"), v.literal("Launched"))
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

// ─── All active projects (as of 2026-03-03) ───────────────────────────────────
const ALL_PRODUCTS = [
  // ── CLAWDRAFT ──────────────────────────────────────────────────────────────
  {
    name: "Clawdraft",
    status: "Launched" as const,
    pricing: "$297 DIY / $497 DFY",
    valueProp:
      "Done-for-you weekly content engine. One topic. Four formats — X thread, newsletter, LinkedIn post, YouTube script — delivered to your WhatsApp every Sunday. Powered by AI, customized to your voice. LIVE — awaiting Paddle approval to activate checkout.",
    liveLink: "https://clawdraft.app",
    signups: 0,
    revenue: 0,
    slotsRemaining: 10,
    phase: "Soft Launch" as const,
  },
  // ── HETERODOX NEWS ────────────────────────────────────────────────────────
  {
    name: "Heterodox News",
    status: "Building" as const,
    pricing: "Free (ad-supported / membership)",
    valueProp:
      "AI-powered news aggregator covering 44 sources across left, right, and center. Next.js site built and ready. Needs Vercel deploy + custom domain to go live.",
    liveLink: undefined,
    signups: 0,
    revenue: 0,
    slotsRemaining: undefined,
    phase: "Soft Launch" as const,
  },
  // ── YOUTUBE CONSULTING ────────────────────────────────────────────────────
  {
    name: "YouTube Consulting",
    status: "Launched" as const,
    pricing: "$2K diagnostic + retainer",
    valueProp:
      "EP + YouTube strategist with 1B+ views and 5M+ subscribers across channels. Helps podcast hosts and long-form creators dramatically improve performance through packaging, positioning, and distribution strategy. Shane lead active — diagnostic offer sent.",
    liveLink: "https://linkedin.com/in/tylerbohall",
    signups: 0,
    revenue: 0,
    slotsRemaining: undefined,
    phase: "Live" as const,
  },
  // ── KALSHI BOT ────────────────────────────────────────────────────────────
  {
    name: "Kalshi Bot",
    status: "Launched" as const,
    pricing: "Internal — live trading (DRY_RUN=true)",
    valueProp:
      "Prediction market trading bot running 5 strategies with log-normal model. LIVE on Hetzner VPS 178.156.136.147. DRY_RUN=true — will flip to live once Claude approves ≥0.6 confidence threshold. 4 bugs fixed + log-normal model deployed 2026-03-03.",
    liveLink: undefined,
    signups: 0,
    revenue: 0,
    slotsRemaining: undefined,
    phase: "Live" as const,
  },
  // ── HETERODOX MEDIA ───────────────────────────────────────────────────────
  {
    name: "Heterodox Media",
    status: "Building" as const,
    pricing: "Sponsorships → Memberships → Events → Licensing",
    valueProp:
      "Sovereign media institution for intellectually homeless conservatives. 5 hosts, 780 episodes/year, remote-first. $950K raise at $5.5M pre-money. Co-founders: Tyler + Emerald Robinson. Pitch docs ready. OFFLINE — awaiting funding.",
    liveLink: undefined,
    signups: 0,
    revenue: 0,
    slotsRemaining: undefined,
    phase: "Building" as const,
  },
  // ── NEXUS MISSION CONTROL ────────────────────────────────────────────────
  {
    name: "NEXUS Mission Control",
    status: "Launched" as const,
    pricing: "Internal — command dashboard",
    valueProp:
      "Real-time mission control dashboard for all active projects and agents. Built with Next.js + Convex. LIVE at mission-control-six-mocha.vercel.app. Tracks tasks, agents, logs, and launch status across all projects.",
    liveLink: "https://mission-control-six-mocha.vercel.app",
    signups: 0,
    revenue: 0,
    slotsRemaining: undefined,
    phase: "Live" as const,
  },
  // ── ECOM SYSTEM ───────────────────────────────────────────────────────────
  {
    name: "Ecom System",
    status: "Building" as const,
    pricing: "Internal — margin capture model",
    valueProp:
      "Fully autonomous dropshipping operation. 6 AI agents handle product scouting, supplier sourcing, listing creation, dynamic pricing, ad creative, and customer service. Architecture done — not started. Fulfillment agent is first to build.",
    liveLink: undefined,
    signups: 0,
    revenue: 0,
    slotsRemaining: 0,
    phase: "Building" as const,
  },
  // ── HARVESTHUB ────────────────────────────────────────────────────────────
  {
    name: "HarvestHub",
    status: "Idea" as const,
    pricing: "12% commission + $10–50/mo vendor subscription",
    valueProp:
      "Florida-first online marketplace connecting cottage food producers, small farms, and artisans directly with consumers. BACKGROUND — no spend until Clawdraft closes first sale.",
    liveLink: undefined,
    signups: 0,
    revenue: 0,
    slotsRemaining: undefined,
    phase: "Idea" as const,
  },
];

export const resetAndReseed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").collect();
    for (const product of existing) {
      await ctx.db.delete(product._id);
    }
    for (const product of ALL_PRODUCTS) {
      await ctx.db.insert("products", product);
    }
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").collect();
    if (existing.length > 0) return;
    for (const product of ALL_PRODUCTS) {
      await ctx.db.insert("products", product);
    }
  },
});
