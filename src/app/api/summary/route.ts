import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

// Hardcoded prod URL — env var had trailing newline corruption, bypassed entirely
const CONVEX_URL = "https://superb-yak-348.convex.cloud";
const convex = new ConvexHttpClient(CONVEX_URL);

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const [tasks, agents, products, logs, memories] = await Promise.all([
      convex.query(api.tasks.list, { project: "All" }),
      convex.query(api.agents.list, {}),
      convex.query(api.products.list, {}),
      convex.query(api.logs.list, {}),
      convex.query(api.memories.list, {}),
    ]);

    // Shape the response
    const summary = {
      meta: {
        generated_at: new Date().toISOString(),
        source: "Mission Control — NEXUS",
        url: "https://mission-control-six-mocha.vercel.app",
        convex_url: CONVEX_URL,
        task_count_live: tasks.length,
      },
      tasks: {
        total: tasks.length,
        by_status: {
          todo:        tasks.filter((t) => t.status === "Todo").length,
          in_progress: tasks.filter((t) => t.status === "In Progress").length,
          done:        tasks.filter((t) => t.status === "Done").length,
        },
        items: tasks.map((t) => ({
          id:       t._id,
          title:    t.title,
          status:   t.status,
          priority: t.priority,
          project:  t.project,
          assignee: t.assignee,
          created:  new Date(t.createdAt).toISOString(),
        })),
      },
      agents: {
        total: agents.length,
        by_status: {
          active:   agents.filter((a) => a.status === "Active").length,
          building: agents.filter((a) => a.status === "Building").length,
          idle:     agents.filter((a) => a.status === "Idle").length,
        },
        items: agents.map((a) => ({
          id:               a._id,
          name:             a.name,
          role:             a.role,
          project:          a.project,
          status:           a.status,
          current_activity: a.currentActivity,
        })),
      },
      vault: {
        total: products.length,
        items: products.map((p) => ({
          id:         p._id,
          name:       p.name,
          status:     p.status,
          phase:      p.phase,
          pricing:    p.pricing,
          value_prop: p.valueProp,
          live_link:  p.liveLink ?? null,
          signups:    p.signups,
          revenue:    p.revenue,
        })),
      },
      launch: {
        total_signups: products.reduce((sum, p) => sum + p.signups, 0),
        total_revenue: products.reduce((sum, p) => sum + p.revenue, 0),
        by_project: products.map((p) => ({
          name:    p.name,
          phase:   p.phase,
          signups: p.signups,
          revenue: p.revenue,
        })),
      },
      logs: {
        total_returned: Math.min(logs.length, 20),
        items: logs
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 20)
          .map((l) => ({
            id:        l._id,
            timestamp: new Date(l.timestamp).toISOString(),
            agent:     l.agentName,
            project:   l.project,
            action:    l.action,
          })),
      },
      memory: {
        total: memories.length,
        items: memories.map((m) => ({
          id:      m._id,
          title:   m.title,
          summary: m.summary,
          project: m.project,
          tags:    m.tags,
          created: new Date(m.createdAt).toISOString(),
        })),
      },
    };

    return NextResponse.json(summary, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        "Surrogate-Control": "no-store",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch summary", detail: message },
      { status: 500 }
    );
  }
}
