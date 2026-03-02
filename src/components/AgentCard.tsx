"use client";

import StatusBadge from "./StatusBadge";
import { Id } from "../../convex/_generated/dataModel";

type Agent = {
  _id: Id<"agents">;
  name: string;
  role: string;
  project: string;
  status: "Active" | "Idle" | "Building";
  responsibilities: string[];
  currentActivity: string;
};

type AgentCardProps = {
  agent: Agent;
};

const agentEmojis: Record<string, string> = {
  Scraper: "🕷️",
  ContentGen: "✍️",
  Delivery: "📦",
  Onboarding: "🎯",
  MarketResearch: "🔍",
  Supplier: "🏭",
  Listing: "📝",
  Pricing: "💰",
  Ads: "📣",
  CustomerService: "💬",
};

export default function AgentCard({ agent }: AgentCardProps) {
  const emoji = agentEmojis[agent.name] || "🤖";

  return (
    <div
      className="rounded-xl p-5 border flex flex-col gap-4"
      style={{ background: "#111111", borderColor: "#222222" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: "#1a1a2e" }}
          >
            {emoji}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{agent.name}</p>
            <p className="text-gray-500 text-xs">{agent.role}</p>
          </div>
        </div>
        <StatusBadge status={agent.status} />
      </div>

      {/* Current activity */}
      <div
        className="rounded-lg px-3 py-2 text-xs text-gray-300"
        style={{ background: "#0a0a0a", borderLeft: "2px solid #3b82f6" }}
      >
        {agent.currentActivity}
      </div>

      {/* Responsibilities */}
      <div>
        <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">
          Responsibilities
        </p>
        <ul className="flex flex-col gap-1">
          {agent.responsibilities.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
              <span className="text-blue-500 mt-0.5 flex-shrink-0">→</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
