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

// ─── All active projects (as of 2026-02-25) ───────────────────────────────────
const ALL_PRODUCTS = [
  // ── CLAWDRAFT ──────────────────────────────────────────────────────────────
  {
    name: "Clawdraft",
    status: "Launched" as const,
    pricing: "$297 DIY / $497 DFY (founder $297 first 10 DFY)",
    valueProp:
      "Done-for-you weekly content engine. One topic. Four formats — X thread, newsletter, LinkedIn post, YouTube script — delivered to your WhatsApp every Sunday. Powered by AI, customized to your voice.",
    liveLink: "https://clawdraft.app",
    signups: 0,
    revenue: 0,
    slotsRemaining: 10,
    phase: "Soft Launch" as const,
  },
  // ── ECOM SYSTEM ───────────────────────────────────────────────────────────
  {
    name: "Ecom System",
    status: "Building" as const,
    pricing: "Internal — margin capture model",
    valueProp:
      "Fully autonomous dropshipping operation. 6 AI agents handle product scouting, supplier sourcing, listing creation, dynamic pricing, ad creative, and customer service. Built on Shopify + CJ Dropshipping + OpenClaw.",
    liveLink: undefined,
    signups: 0,
    revenue: 0,
    slotsRemaining: 0,
    phase: "Building" as const,
  },
  // ── YOUTUBE CONSULTING ────────────────────────────────────────────────────
  {
    name: "YouTube Consulting",
    status: "Launched" as const,
    pricing: "Diagnostic $1.5K–$2.5K → Sprint $4K–$6K → Retainer $5K–$10K/mo",
    valueProp:
      "EP + YouTube strategist with 1B+ views and 5M+ subscribers across channels. Helps podcast hosts and long-form creators dramatically improve performance through packaging, positioning, and distribution strategy.",
    liveLink: "https://linkedin.com/in/tylerbohall",
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
      "Sovereign media institution for intellectually homeless conservatives. 5 hosts, 780 episodes/year, remote-first. $950K raise at $5.5M pre-money. Projected breakeven Month 9, $6M revenue by Year 3.",
    liveLink: undefined,
    signups: 0,
    revenue: 0,
    slotsRemaining: undefined,
    phase: "Building" as const,
  },
  // ── CRYPTO BOT ────────────────────────────────────────────────────────────
  {
    name: "Crypto Bot",
    status: "Launched" as const,
    pricing: "Internal — paper trading",
    valueProp:
      "EMA200 momentum bot — all 5 conditions required before entry. Running on paper with 2 open BTC longs. 100% win rate on 1 closed trade. Stack: Python on desktop, manual start required.",
    liveLink: undefined,
    signups: 0,
    revenue: 0,
    slotsRemaining: undefined,
    phase: "Live" as const,
  },
  // ── STOCK BOT ─────────────────────────────────────────────────────────────
  {
    name: "Stock Bot",
    status: "Launched" as const,
    pricing: "Internal — paper trading (~$100K Alpaca)",
    valueProp:
      "200-week MA value investing system (Munger framework). Auto-executes conviction 7+ below 200W MA. 75 stocks on watchlist. SPGI closest to buy at -2.42% below MA. Scheduled Monday 8:30am via Task Scheduler.",
    liveLink: undefined,
    signups: 0,
    revenue: 0,
    slotsRemaining: undefined,
    phase: "Live" as const,
  },
  // ── HARVESTHUB ────────────────────────────────────────────────────────────
  {
    name: "HarvestHub",
    status: "Idea" as const,
    pricing: "12% commission + $10–50/mo vendor subscription",
    valueProp:
      "Florida-first online marketplace connecting cottage food producers, small farms, and artisans directly with consumers. Etsy meets farmers market meets subscription box. Built natively around Florida cottage food law (§ 500.80).",
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
