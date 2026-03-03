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
    const update: { status: "Active" | "Idle" | "Building"; currentActivity?: string } = { status: args.status };
    if (args.currentActivity !== undefined) update.currentActivity = args.currentActivity;
    await ctx.db.patch(args.id, update);
  },
});

// ─── Live agent status — 2026-03-03 18:45 ET ─────────────────────────────────
const CURRENT_AGENTS = [
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
    currentActivity: "Mission Control rebuild + data sync — 2026-03-03",
  },
  {
    name: "Kalshi Bot",
    role: "Prediction Market Trader",
    project: "Kalshi Bot",
    status: "Active" as const,
    responsibilities: [
      "Scan Kalshi + Polymarket for edge opportunities",
      "Run weather_arb, crypto_arb, economic_arb, polymarket_scan strategies",
      "Log all decisions — DRY_RUN=true until March 17 review",
      "VPS: 178.156.136.147, systemd auto-restart",
    ],
    currentActivity: "LIVE on Hetzner VPS — DRY_RUN=true — paper review March 17",
  },
  {
    name: "Polymarket MM Bot",
    role: "Market Maker (Paper Mode)",
    project: "Kalshi Bot",
    status: "Active" as const,
    responsibilities: [
      "Avellaneda-Stoikov spread calculation",
      "Glosten-Milgrom adverse selection model",
      "VPIN toxicity + GTD order management",
      "Log paper P&L to POLYMARKET-PAPER-PNL.md",
    ],
    currentActivity: "LIVE on VPS — /opt/polymarket-mm/ — paper P&L logging active",
  },
  {
    name: "Cross-Platform Arb Monitor",
    role: "Arbitrage Scanner",
    project: "Kalshi Bot",
    status: "Active" as const,
    responsibilities: [
      "Compare Kalshi vs Polymarket prices on same events",
      "Flag price gaps ≥3% with volume filter",
      "Log to ARBITRAGE-ALERTS.md every 5 minutes",
      "162 Kalshi markets + Polymarket gamma feed",
    ],
    currentActivity: "LIVE — cron */5 * * * * — scanning 162 Kalshi markets",
  },
  {
    name: "OSINT Monitor",
    role: "Geopolitical Signal Scanner",
    project: "Kalshi Bot",
    status: "Active" as const,
    responsibilities: [
      "OpenSky flight tracking in 4 conflict zones",
      "RSS news signals from Reuters, Al Jazeera, BBC, Defense One",
      "Cross-reference vs active Polymarket markets",
      "Alert on edges ≥5% AND volume ≥$500K",
    ],
    currentActivity: "LIVE on VPS — /opt/osint-monitor/ — $500K volume filter active",
  },
  {
    name: "ContentGen",
    role: "Content Generator (Clawdraft)",
    project: "Clawdraft",
    status: "Active" as const,
    responsibilities: [
      "Generate X threads, newsletters, LinkedIn posts, YouTube scripts",
      "Apply customer brand voice profile to all outputs",
      "Format and package weekly content delivery",
      "Deliver Sunday 8pm via WhatsApp",
    ],
    currentActivity: "LIVE — Sunday 8pm delivery active — fitness-creator running",
  },
  {
    name: "Onboarding Agent",
    role: "Customer Onboarding (Clawdraft)",
    project: "Clawdraft",
    status: "Building" as const,
    responsibilities: [
      "Process new customer brand voice questionnaires",
      "Build personalized AGENT_CONFIG.md + SETUP_GUIDE.md",
      "Deliver via email within minutes of purchase",
      "Trigger ContentGen with first content brief",
    ],
    currentActivity: "BUILT — waiting for first customer via onboard.html",
  },
  {
    name: "n8n Automation",
    role: "Workflow Orchestrator",
    project: "OPS",
    status: "Building" as const,
    responsibilities: [
      "4 workflow stubs: Clawdraft social, outreach, lead capture, content dist.",
      "Connects X, LinkedIn, Reddit for social automation",
      "Docker on Hetzner VPS port 127.0.0.1:5678",
      "Awaiting Tyler to connect social account credentials",
    ],
    currentActivity: "LIVE on VPS (Docker f16bd6ebf509) — awaiting social credentials",
  },
  {
    name: "Local Biz Prospector",
    role: "Outreach Automation",
    project: "OPS",
    status: "Active" as const,
    responsibilities: [
      "OSM Overpass API scrapes FL cities for small businesses",
      "Generates HTML preview pages for each business",
      "Writes outreach drafts with personalization",
      "Daily cron at 7am ET — 285 businesses found",
    ],
    currentActivity: "LIVE — 285 businesses found, 269 previews — pending Tyler review",
  },
  {
    name: "SAM.gov Scraper",
    role: "Contract Pipeline",
    project: "OPS",
    status: "Building" as const,
    responsibilities: [
      "Scrape SAM.gov for $500–$50K fulfillable contracts",
      "Score by margin (55% minimum threshold)",
      "Daily cron 6am ET on VPS",
      "Pipeline saved to CONTRACTS-PIPELINE.md",
    ],
    currentActivity: "BUILT — fixture data only (SAM API key needed for live data)",
  },
  {
    name: "Heterodox News Bot",
    role: "News Aggregator",
    project: "Heterodox News",
    status: "Active" as const,
    responsibilities: [
      "Aggregate 40 RSS sources across left/right/center",
      "30-min cache, 4s timeout per feed",
      "Synopses via Anthropic (disabled in dev)",
      "Deployed at heterodox-news.vercel.app",
    ],
    currentActivity: "LIVE at heterodox-news.vercel.app — custom domain pending",
  },
  {
    name: "Fulfillment Agent",
    role: "Order Fulfillment (Ecom)",
    project: "Ecom System",
    status: "Building" as const,
    responsibilities: [
      "Process incoming orders automatically",
      "Route to CJ Dropshipping API",
      "Track fulfillment status and handle delays",
      "First agent to build in ecom stack",
    ],
    currentActivity: "PLANNED — not started — next in ecom build order",
  },
];

export const resetAndReseed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("agents").collect();
    for (const agent of existing) await ctx.db.delete(agent._id);
    for (const agent of CURRENT_AGENTS) await ctx.db.insert("agents", agent);
    return { count: CURRENT_AGENTS.length };
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("agents").collect();
    if (existing.length > 0) return;
    for (const agent of CURRENT_AGENTS) await ctx.db.insert("agents", agent);
  },
});
