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

export const resetAndReseed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("logs").collect();
    for (const log of existing) {
      await ctx.db.delete(log._id);
    }
    // Re-insert fresh logs below
    const now = Date.now();
    const logs = [
      {
        timestamp: now - 1000 * 60 * 5,
        project: "NEXUS",
        agentName: "Axiom",
        action: "Mission Control dashboard updated — tasks, agents, projects, and logs synced to 2026-03-03",
      },
      {
        timestamp: now - 1000 * 60 * 30,
        project: "Kalshi Bot",
        agentName: "Kalshi Bot",
        action: "4 bugs fixed + log-normal model deployed — DRY_RUN=true, monitoring for ≥0.6 confidence threshold",
      },
      {
        timestamp: now - 1000 * 60 * 90,
        project: "Heterodox News",
        agentName: "Axiom",
        action: "Heterodox News site built — Next.js app, 44 sources, left/right/center coverage. Awaiting Vercel deploy",
      },
      {
        timestamp: now - 1000 * 60 * 120,
        project: "YouTube Consulting",
        agentName: "Axiom",
        action: "Shane LinkedIn lead: diagnostic offer sent — $2K diagnostic + retainer, awaiting reply",
      },
      {
        timestamp: now - 1000 * 60 * 180,
        project: "NEXUS",
        agentName: "Axiom",
        action: "Wired 4 cron jobs: 07:00 briefing, 08:30 standup, 21:00 review, Sunday 08:00 weekly",
      },
      {
        timestamp: now - 1000 * 60 * 210,
        project: "NEXUS",
        agentName: "Axiom",
        action: "Created SESSION-STATE.md + working-buffer.md — session state management established",
      },
      {
        timestamp: now - 1000 * 60 * 240,
        project: "NEXUS",
        agentName: "Axiom",
        action: "Updated SOUL.md + AGENTS.md — chain of command and daily rhythm documented",
      },
      {
        timestamp: now - 1000 * 60 * 270,
        project: "Clawdraft",
        agentName: "ContentGen",
        action: "ContentGen LIVE — Sunday 8pm delivery cadence confirmed, awaiting first paying customer",
      },
      {
        timestamp: now - 1000 * 60 * 300,
        project: "Clawdraft",
        agentName: "Onboarding",
        action: "Clawdraft Onboarding agent built — pending first customer signup after Paddle approval",
      },
      {
        timestamp: now - 86400000 * 2,
        project: "Clawdraft",
        agentName: "Axiom",
        action: "Clawdraft site live at clawdraft.app — $297 DIY / $497 DFY pricing locked, Paddle approval submitted",
      },
      {
        timestamp: now - 86400000 * 3,
        project: "Kalshi Bot",
        agentName: "Kalshi Bot",
        action: "Kalshi bot deployed to Hetzner VPS 178.156.136.147 — DRY_RUN=true, 5 strategies active",
      },
      {
        timestamp: now - 86400000 * 5,
        project: "Heterodox Media",
        agentName: "Axiom",
        action: "Pitch docs ready — co-founders Tyler + Emerald Robinson, $950K SAFE at $5.5M pre-money",
      },
    ];
    for (const log of logs) {
      await ctx.db.insert("logs", log);
    }
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("logs").collect();
    if (existing.length > 0) return;

    const now = Date.now();
    const logs = [
      // ── TODAY: 2026-03-03 ────────────────────────────────────────────────────
      {
        timestamp: now - 1000 * 60 * 5,
        project: "NEXUS",
        agentName: "Axiom",
        action: "Mission Control dashboard updated — tasks, agents, projects, and logs synced to 2026-03-03",
      },
      {
        timestamp: now - 1000 * 60 * 30,
        project: "Kalshi Bot",
        agentName: "Kalshi Bot",
        action: "4 bugs fixed + log-normal model deployed — DRY_RUN=true, monitoring for ≥0.6 confidence threshold",
      },
      {
        timestamp: now - 1000 * 60 * 90,
        project: "Heterodox News",
        agentName: "Axiom",
        action: "Heterodox News site built — Next.js app, 44 sources, left/right/center coverage. Awaiting Vercel deploy",
      },
      {
        timestamp: now - 1000 * 60 * 120,
        project: "YouTube Consulting",
        agentName: "Axiom",
        action: "Shane LinkedIn lead: diagnostic offer sent — $2K diagnostic + retainer, awaiting reply",
      },
      {
        timestamp: now - 1000 * 60 * 180,
        project: "NEXUS",
        agentName: "Axiom",
        action: "Wired 4 cron jobs: 07:00 briefing, 08:30 standup, 21:00 review, Sunday 08:00 weekly",
      },
      {
        timestamp: now - 1000 * 60 * 210,
        project: "NEXUS",
        agentName: "Axiom",
        action: "Created SESSION-STATE.md + working-buffer.md — session state management established",
      },
      {
        timestamp: now - 1000 * 60 * 240,
        project: "NEXUS",
        agentName: "Axiom",
        action: "Updated SOUL.md + AGENTS.md — chain of command and daily rhythm documented",
      },
      {
        timestamp: now - 1000 * 60 * 270,
        project: "Clawdraft",
        agentName: "ContentGen",
        action: "ContentGen LIVE — Sunday 8pm delivery cadence confirmed, awaiting first paying customer",
      },
      {
        timestamp: now - 1000 * 60 * 300,
        project: "Clawdraft",
        agentName: "Onboarding",
        action: "Clawdraft Onboarding agent built — pending first customer signup after Paddle approval",
      },
      // ── PRIOR SESSION LOGS ────────────────────────────────────────────────────
      {
        timestamp: now - 86400000 * 2,
        project: "Clawdraft",
        agentName: "Axiom",
        action: "Clawdraft site live at clawdraft.app — $297 DIY / $497 DFY pricing locked, Paddle approval submitted",
      },
      {
        timestamp: now - 86400000 * 3,
        project: "Kalshi Bot",
        agentName: "Kalshi Bot",
        action: "Kalshi bot deployed to Hetzner VPS 178.156.136.147 — DRY_RUN=true, 5 strategies active",
      },
      {
        timestamp: now - 86400000 * 5,
        project: "Heterodox Media",
        agentName: "Axiom",
        action: "Pitch docs ready — co-founders Tyler + Emerald Robinson, $950K SAFE at $5.5M pre-money",
      },
    ];

    for (const log of logs) {
      await ctx.db.insert("logs", log);
    }
  },
});
