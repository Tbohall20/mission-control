import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { project: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let results = await ctx.db.query("logs").collect();

    if (args.project && args.project !== "All") {
      results = results.filter((l) => l.project === args.project);
    }

    return results.sort((a, b) => b.timestamp - a.timestamp);
  },
});

export const append = mutation({
  args: {
    project: v.string(),
    agentName: v.string(),
    action: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("logs", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("logs").collect();
    if (existing.length > 0) return;

    const now = Date.now();
    const logs = [
      {
        timestamp: now - 1000 * 60 * 2,
        project: "Clawdraft",
        agentName: "Scraper",
        action: "Completed competitor analysis — scraped 50 tools, exported pricing matrix to memory",
      },
      {
        timestamp: now - 1000 * 60 * 8,
        project: "Ecom System",
        agentName: "MarketResearch",
        action: "Shortlisted 3 products in pet accessories niche — avg margin 68%, competition score 22",
      },
      {
        timestamp: now - 1000 * 60 * 15,
        project: "Clawdraft",
        agentName: "ContentGen",
        action: "Generated first draft of landing page copy — headline and 3 sections complete",
      },
      {
        timestamp: now - 1000 * 60 * 32,
        project: "Ecom System",
        agentName: "Supplier",
        action: "Sent inquiry to 8 Alibaba suppliers — waiting on MOQ and sample pricing responses",
      },
      {
        timestamp: now - 1000 * 60 * 45,
        project: "Clawdraft",
        agentName: "Delivery",
        action: "Stripe webhook configured — purchase event now triggers product access grant",
      },
      {
        timestamp: now - 1000 * 60 * 60,
        project: "Ecom System",
        agentName: "Pricing",
        action: "Initialized repricing engine — monitoring 12 competitor ASINs across 3 categories",
      },
      {
        timestamp: now - 1000 * 60 * 90,
        project: "Clawdraft",
        agentName: "Scraper",
        action: "Scraped Google Trends data for 'AI content tools' — 340% YoY growth confirmed",
      },
      {
        timestamp: now - 1000 * 60 * 120,
        project: "Ecom System",
        agentName: "MarketResearch",
        action: "Expanded research to home organization niche — 47 products analyzed, 5 flagged for review",
      },
      {
        timestamp: now - 1000 * 60 * 180,
        project: "Clawdraft",
        agentName: "ContentGen",
        action: "Completed welcome email sequence — 5 emails, 7-day drip, 62% open rate projected",
      },
      {
        timestamp: now - 1000 * 60 * 240,
        project: "Ecom System",
        agentName: "CustomerService",
        action: "Customer service protocols loaded — 24 response templates ready, escalation rules configured",
      },
      {
        timestamp: now - 86400000 * 1,
        project: "Clawdraft",
        agentName: "Onboarding",
        action: "Drafted 3-step onboarding checklist — profile setup, first content creation, sharing workflow",
      },
      {
        timestamp: now - 86400000 * 1 - 3600000,
        project: "Ecom System",
        agentName: "Supplier",
        action: "Vetted 3 suppliers — 1 approved (GreenLeaf Co.), 2 rejected (quality concerns)",
      },
    ];

    for (const log of logs) {
      await ctx.db.insert("logs", log);
    }
  },
});
