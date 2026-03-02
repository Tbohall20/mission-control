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

export const resetAndReseed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("agents").collect();
    for (const agent of existing) {
      await ctx.db.delete(agent._id);
    }
    // Re-run seed with corrected data
    const agents = [
      { name: "Scraper", role: "Reddit Trend Scraper", project: "Clawdraft", status: "Building" as const, responsibilities: ["Daily Reddit scrape at 6am","Score and rank trending topics","Feed top topic to ContentGen","Archive trend history"], currentActivity: "Not yet deployed" },
      { name: "ContentGen", role: "Content Generator", project: "Clawdraft", status: "Building" as const, responsibilities: ["Generate X threads, newsletters, LinkedIn, YouTube scripts","Apply brand voice profile","Format and package content","Adapt weekly topic across 4 formats"], currentActivity: "Not yet deployed" },
      { name: "Delivery", role: "WhatsApp Delivery", project: "Clawdraft", status: "Building" as const, responsibilities: ["Deliver weekly content via WhatsApp","Handle scheduling and timing","Manage delivery confirmations","Log all deliveries"], currentActivity: "Not yet deployed" },
      { name: "Onboarding", role: "Customer Onboarding", project: "Clawdraft", status: "Building" as const, responsibilities: ["Process brand voice questionnaires","Build brand voice profiles","Trigger ContentGen with first brief","Send welcome sequence"], currentActivity: "Not yet deployed" },
      { name: "MarketResearch", role: "Market Researcher", project: "Ecom System", status: "Building" as const, responsibilities: ["Scan trends and identify winning products","Analyze competition and margin potential","Score and rank products","Feed shortlist to Supplier"], currentActivity: "Not yet deployed" },
      { name: "Supplier", role: "Supplier Sourcer", project: "Ecom System", status: "Building" as const, responsibilities: ["Source products via CJ Dropshipping","Compare pricing and MOQs","Verify supplier reliability","Pass approved SKUs to Listing"], currentActivity: "Not yet deployed" },
      { name: "Listing", role: "Listing Creator", project: "Ecom System", status: "Building" as const, responsibilities: ["Generate SEO-optimized Shopify listings","Write titles and descriptions","Source product images","Publish listings to Shopify"], currentActivity: "Not yet deployed" },
      { name: "Pricing", role: "Pricing Engine", project: "Ecom System", status: "Building" as const, responsibilities: ["Monitor competitor pricing","Implement dynamic repricing","Protect margin thresholds","Alert on pricing anomalies"], currentActivity: "Not yet deployed" },
      { name: "Ads", role: "Ads Manager", project: "Ecom System", status: "Building" as const, responsibilities: ["Launch and manage ad campaigns","Monitor ROAS and kill underperformers","Scale winning campaigns","Weekly performance reports"], currentActivity: "Not yet deployed" },
      { name: "CustomerService", role: "Customer Service", project: "Ecom System", status: "Building" as const, responsibilities: ["Handle support via Telegram","Process refunds and returns","Respond to reviews","Escalate to Tyler when needed"], currentActivity: "Not yet deployed" },
    ];
    for (const agent of agents) {
      await ctx.db.insert("agents", agent);
    }
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("agents").collect();
    if (existing.length > 0) return;

    const agents = [
      // CLAWDRAFT AGENTS
      {
        name: "Scraper",
        role: "Reddit Trend Scraper",
        project: "Clawdraft",
        status: "Building" as const,
        responsibilities: [
          "Daily Reddit scrape at 6am across target subreddits",
          "Score and rank trending topics by engagement",
          "Feed top topic to ContentGen each week",
          "Archive trend history for pattern analysis",
        ],
        currentActivity: "Not yet deployed",
      },
      {
        name: "ContentGen",
        role: "Content Generator",
        project: "Clawdraft",
        status: "Building" as const,
        responsibilities: [
          "Generate X threads, newsletters, LinkedIn posts, YouTube scripts",
          "Apply customer brand voice profile to all outputs",
          "Format and package content for delivery",
          "Adapt weekly topic angle across 4 formats",
        ],
        currentActivity: "Not yet deployed",
      },
      {
        name: "Delivery",
        role: "WhatsApp Delivery",
        project: "Clawdraft",
        status: "Building" as const,
        responsibilities: [
          "Deliver weekly content packages to customers via WhatsApp",
          "Handle delivery scheduling and timing",
          "Manage delivery confirmations and retries",
          "Log all deliveries to Agent Logs",
        ],
        currentActivity: "Not yet deployed",
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
        currentActivity: "Not yet deployed",
      },
      // ECOM AGENTS
      {
        name: "MarketResearch",
        role: "Market Researcher",
        project: "Ecom System",
        status: "Building" as const,
        responsibilities: [
          "Scan trends and identify winning product opportunities",
          "Analyze competition, demand, and margin potential",
          "Score and rank products for the pipeline",
          "Feed shortlist to Supplier agent",
        ],
        currentActivity: "Not yet deployed",
      },
      {
        name: "Supplier",
        role: "Supplier Sourcer",
        project: "Ecom System",
        status: "Building" as const,
        responsibilities: [
          "Source products via CJ Dropshipping",
          "Compare pricing, MOQs, and shipping times",
          "Verify supplier reliability scores",
          "Pass approved SKUs to Listing agent",
        ],
        currentActivity: "Not yet deployed",
      },
      {
        name: "Listing",
        role: "Listing Creator",
        project: "Ecom System",
        status: "Building" as const,
        responsibilities: [
          "Generate SEO-optimized Shopify product listings",
          "Write titles, descriptions, and bullet points",
          "Source and format product images",
          "Publish listings to Shopify store",
        ],
        currentActivity: "Not yet deployed",
      },
      {
        name: "Pricing",
        role: "Pricing Engine",
        project: "Ecom System",
        status: "Building" as const,
        responsibilities: [
          "Monitor competitor pricing in real-time",
          "Implement dynamic repricing rules",
          "Protect margin thresholds automatically",
          "Alert on pricing anomalies via Telegram",
        ],
        currentActivity: "Not yet deployed",
      },
      {
        name: "Ads",
        role: "Ads Manager",
        project: "Ecom System",
        status: "Building" as const,
        responsibilities: [
          "Launch and manage ad campaigns",
          "Monitor ROAS and kill underperformers",
          "Scale winning campaigns automatically",
          "Report weekly ad performance summary",
        ],
        currentActivity: "Not yet deployed",
      },
      {
        name: "CustomerService",
        role: "Customer Service",
        project: "Ecom System",
        status: "Building" as const,
        responsibilities: [
          "Handle support tickets via Telegram",
          "Process refunds and returns",
          "Respond to reviews",
          "Escalate complex issues to Tyler",
        ],
        currentActivity: "Not yet deployed",
      },
    ];

    for (const agent of agents) {
      await ctx.db.insert("agents", agent);
    }
  },
});
