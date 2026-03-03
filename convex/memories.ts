import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { project: v.optional(v.string()), search: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let results = await ctx.db.query("memories").collect();

    if (args.project && args.project !== "All") {
      results = results.filter((m) => m.project === args.project);
    }

    if (args.search && args.search.trim() !== "") {
      const q = args.search.toLowerCase();
      results = results.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.summary.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return results.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    summary: v.string(),
    tags: v.array(v.string()),
    project: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("memories", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("memories"),
    title: v.optional(v.string()),
    summary: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    project: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const patch = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, patch);
    return await ctx.db.get(id);
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("memories").collect();
    if (existing.length > 0) return;

    const memories = [
      {
        title: "Clawdraft Pricing Decision",
        summary:
          "Decided on two tiers: $97 DIY (self-serve, templates + AI tools) and $497 DFY (done-for-you, full content creation). DIY targets solopreneurs, DFY targets agencies and busy founders.",
        tags: ["pricing", "strategy", "Clawdraft"],
        project: "Clawdraft",
        createdAt: Date.now() - 86400000 * 10,
      },
      {
        title: "Target Audience for Clawdraft",
        summary:
          "Primary: content creators, coaches, and SaaS founders who need consistent content but hate writing. Secondary: marketing agencies wanting to automate client content production.",
        tags: ["audience", "positioning", "Clawdraft"],
        project: "Clawdraft",
        createdAt: Date.now() - 86400000 * 8,
      },
      {
        title: "Ecom System Agent Architecture",
        summary:
          "Six-agent system: MarketResearch finds winning products, Supplier sources them, Listing creates optimized product pages, Pricing monitors and adjusts prices dynamically, Ads runs campaigns, CustomerService handles tickets.",
        tags: ["architecture", "agents", "ecom"],
        project: "Ecom System",
        createdAt: Date.now() - 86400000 * 6,
      },
      {
        title: "Clawdraft Launch Strategy",
        summary:
          "Soft launch to 100 founding members at a 50% discount. Use testimonials and case studies to fuel main launch. Target $10k in first 30 days from DFY tier alone.",
        tags: ["launch", "strategy", "revenue", "Clawdraft"],
        project: "Clawdraft",
        createdAt: Date.now() - 86400000 * 5,
      },
      {
        title: "Ecom Niche Selection Criteria",
        summary:
          "Target products: $20-$80 price point, 3x markup minimum, low competition score (<30 on Helium10), trending upward in Google Trends, not seasonal. Focus on home, pet, and wellness categories.",
        tags: ["niche", "criteria", "products", "ecom"],
        project: "Ecom System",
        createdAt: Date.now() - 86400000 * 4,
      },
      {
        title: "Mission Control App Requirements",
        summary:
          "Build a real-time command center dashboard using Next.js 14 + Convex. 8 panels: Tasks, Memory, Team, Office, Launch Tracker, Agent Logs, Product Vault, Ecom Pipeline. Dark theme, electric blue accents.",
        tags: ["dashboard", "tech", "internal"],
        project: "Clawdraft",
        createdAt: Date.now() - 86400000 * 2,
      },
    ];

    for (const memory of memories) {
      await ctx.db.insert("memories", memory);
    }
  },
});
