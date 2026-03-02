"use client";

import StatusBadge from "./StatusBadge";
import { Id } from "../../convex/_generated/dataModel";

type Log = {
  _id: Id<"logs">;
  timestamp: number;
  project: string;
  agentName: string;
  action: string;
};

type LogEntryProps = {
  log: Log;
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

function formatTimestamp(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function LogEntry({ log }: LogEntryProps) {
  const emoji = agentEmojis[log.agentName] || "🤖";
  const timeStr = new Date(log.timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div
      className="flex items-start gap-4 px-4 py-4 border-b hover:bg-white/[0.02] transition-colors"
      style={{ borderColor: "#1a1a1a" }}
    >
      {/* Emoji avatar */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
        style={{ background: "#1a1a2e" }}
      >
        {emoji}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-white text-sm font-medium">{log.agentName}</span>
          <StatusBadge status={log.project} />
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">{log.action}</p>
      </div>

      {/* Timestamp */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-xs text-gray-600">{formatTimestamp(log.timestamp)}</span>
        <span className="text-xs text-gray-700">{timeStr}</span>
      </div>
    </div>
  );
}
