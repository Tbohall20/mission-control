"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import StatusBadge from "@/components/StatusBadge";

const agentEmojis: Record<string, string> = {
  MarketResearch: "🔍",
  Supplier: "🏭",
  Listing: "📝",
  Pricing: "💰",
  Ads: "📣",
  CustomerService: "💬",
};

const agentDescriptions: Record<string, string> = {
  MarketResearch: "Discovers winning products and profitable niches",
  Supplier: "Sources and vets suppliers from global markets",
  Listing: "Creates optimized product listings for maximum conversion",
  Pricing: "Monitors and adjusts prices dynamically for margin protection",
  Ads: "Launches and scales paid advertising campaigns",
  CustomerService: "Handles tickets, refunds, and review management",
};

const ECOM_AGENTS = [
  "MarketResearch",
  "Supplier",
  "Listing",
  "Pricing",
  "Ads",
  "CustomerService",
];

function formatTimeAgo(ms: number): string {
  const minutes = Math.floor((Date.now() - ms) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function EcomPage() {
  const agents = useQuery(api.agents.list, { project: "Ecom System" });
  const logs = useQuery(api.logs.list, { project: "Ecom System" });

  const ecomAgentMap = new Map(
    (agents ?? []).map((a) => [a.name, a])
  );

  // Calculate stats
  const activeCount = (agents ?? []).filter(
    (a) => a.status === "Active"
  ).length;
  const buildingCount = (agents ?? []).filter(
    (a) => a.status === "Building"
  ).length;
  const idleCount = (agents ?? []).filter((a) => a.status === "Idle").length;

  // Last log per agent
  const lastLogPerAgent: Record<string, number> = {};
  (logs ?? []).forEach((log) => {
    if (
      !lastLogPerAgent[log.agentName] ||
      log.timestamp > lastLogPerAgent[log.agentName]
    ) {
      lastLogPerAgent[log.agentName] = log.timestamp;
    }
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Ecom Pipeline</h2>
          <p className="text-gray-500 text-sm mt-1">
            Dedicated control room for ecom agents
          </p>
        </div>

        {/* Status summary */}
        <div className="flex gap-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border"
            style={{ background: "#111111", borderColor: "#222222" }}
          >
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-green-400 font-bold text-sm">{activeCount}</span>
            <span className="text-gray-600 text-xs">Active</span>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border"
            style={{ background: "#111111", borderColor: "#222222" }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#3b82f6" }}
            />
            <span className="text-blue-400 font-bold text-sm">{buildingCount}</span>
            <span className="text-gray-600 text-xs">Building</span>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border"
            style={{ background: "#111111", borderColor: "#222222" }}
          >
            <span className="w-2 h-2 rounded-full bg-gray-600" />
            <span className="text-gray-400 font-bold text-sm">{idleCount}</span>
            <span className="text-gray-600 text-xs">Idle</span>
          </div>
        </div>
      </div>

      {/* Pipeline flow visualization */}
      <div
        className="rounded-xl border p-5"
        style={{ background: "#111111", borderColor: "#222222" }}
      >
        <p className="text-xs text-gray-600 uppercase tracking-wider mb-4">
          Pipeline Flow
        </p>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {ECOM_AGENTS.map((name, idx) => {
            const agent = ecomAgentMap.get(name);
            const emoji = agentEmojis[name] || "🤖";
            const isRunning =
              agent?.status === "Active" || agent?.status === "Building";

            return (
              <div key={name} className="flex items-center gap-2 flex-shrink-0">
                <div
                  className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl"
                  style={{
                    background: isRunning ? "#0d1a2e" : "#0a0a0a",
                    border: `1px solid ${isRunning ? "#3b82f640" : "#222"}`,
                    minWidth: "90px",
                  }}
                >
                  <span className="text-xl">{emoji}</span>
                  <span className="text-xs text-white font-medium text-center">
                    {name}
                  </span>
                  {agent && <StatusBadge status={agent.status} />}
                </div>
                {idx < ECOM_AGENTS.length - 1 && (
                  <span className="text-gray-700 text-lg">→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Agent status table */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: "#111111", borderColor: "#222222" }}
      >
        {/* Table header */}
        <div
          className="grid px-5 py-3 border-b text-xs text-gray-600 uppercase tracking-wider"
          style={{
            background: "#0d0d0d",
            borderColor: "#222222",
            gridTemplateColumns: "2rem 1fr 120px 140px 1fr auto",
            gap: "1rem",
          }}
        >
          <div />
          <div>Agent</div>
          <div>Status</div>
          <div>Last Active</div>
          <div>Current Activity</div>
          <div>Alerts</div>
        </div>

        {/* Rows */}
        {agents === undefined ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="grid px-5 py-4 border-b animate-pulse"
              style={{
                borderColor: "#1a1a1a",
                gridTemplateColumns: "2rem 1fr 120px 140px 1fr auto",
                gap: "1rem",
              }}
            >
              {Array.from({ length: 6 }).map((_, j) => (
                <div
                  key={j}
                  className="h-4 rounded"
                  style={{ background: "#1a1a1a" }}
                />
              ))}
            </div>
          ))
        ) : (
          ECOM_AGENTS.map((name) => {
            const agent = ecomAgentMap.get(name);
            const emoji = agentEmojis[name] || "🤖";
            const lastActive = lastLogPerAgent[name];
            const isRunning =
              agent?.status === "Active" || agent?.status === "Building";

            return (
              <div
                key={name}
                className="grid items-center px-5 py-4 border-b hover:bg-white/[0.02] transition-colors"
                style={{
                  borderColor: "#1a1a1a",
                  gridTemplateColumns: "2rem 1fr 120px 140px 1fr auto",
                  gap: "1rem",
                }}
              >
                {/* Emoji */}
                <span className="text-lg">{emoji}</span>

                {/* Name + description */}
                <div>
                  <p className="text-white font-medium text-sm">{name}</p>
                  <p className="text-gray-600 text-xs mt-0.5">
                    {agentDescriptions[name]}
                  </p>
                </div>

                {/* Status */}
                <div>
                  {agent ? (
                    <StatusBadge status={agent.status} />
                  ) : (
                    <span className="text-gray-600 text-xs">—</span>
                  )}
                </div>

                {/* Last active */}
                <div className="text-sm">
                  {lastActive ? (
                    <span className="text-gray-400">
                      {formatTimeAgo(lastActive)}
                    </span>
                  ) : (
                    <span className="text-gray-700">No logs yet</span>
                  )}
                </div>

                {/* Current activity */}
                <div className="text-sm">
                  {agent ? (
                    <span className="text-gray-400 text-xs">
                      {agent.currentActivity}
                    </span>
                  ) : (
                    <span className="text-gray-700">—</span>
                  )}
                </div>

                {/* Alert badge */}
                <div>
                  {!isRunning && agent?.status === "Idle" ? (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: "#1a1a1a",
                        color: "#555",
                        border: "1px solid #2a2a2a",
                      }}
                    >
                      Standby
                    </span>
                  ) : (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: "#0d2010",
                        color: "#22c55e",
                        border: "1px solid #22c55e30",
                      }}
                    >
                      ✓ OK
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Recent ecom logs */}
      {logs && logs.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-semibold text-sm">Recent Activity</h3>
          <div
            className="rounded-xl border overflow-hidden"
            style={{ background: "#111111", borderColor: "#222222" }}
          >
            {logs.slice(0, 5).map((log) => (
              <div
                key={log._id}
                className="flex items-start gap-3 px-4 py-3 border-b hover:bg-white/[0.02] transition-colors"
                style={{ borderColor: "#1a1a1a" }}
              >
                <span className="text-base flex-shrink-0">
                  {agentEmojis[log.agentName] || "🤖"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white text-xs font-medium">
                      {log.agentName}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {log.action}
                  </p>
                </div>
                <span className="text-xs text-gray-700 flex-shrink-0">
                  {formatTimeAgo(log.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
