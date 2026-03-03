"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

type Entry = {
  timestamp: string;
  body: string;
};

function parseChronicle(content: string): Entry[] {
  // Split on lines that start with a year-month pattern e.g. [2026-
  const lines = content.split("\n");
  const entries: Entry[] = [];
  let current: string[] = [];
  let currentTs = "";

  for (const line of lines) {
    const tsMatch = line.match(/^\[(\d{4}-\d{2}-\d{2}[^\]]*)\]/);
    if (tsMatch) {
      if (currentTs) {
        entries.push({ timestamp: currentTs, body: current.join("\n").trim() });
      }
      currentTs = tsMatch[1];
      current = [line.slice(tsMatch[0].length).trim()];
    } else {
      current.push(line);
    }
  }
  if (currentTs) {
    entries.push({ timestamp: currentTs, body: current.join("\n").trim() });
  }

  // Most recent first
  return entries.reverse();
}

function formatRelative(tsStr: string) {
  // Parse timestamps like "2026-03-03 18:45 ET" or "2026-03-03T18:45:00Z"
  const parsed = new Date(tsStr.replace(" ET", "").replace(" EST", "").replace(" EDT", ""));
  if (isNaN(parsed.getTime())) return tsStr;
  const diffMs = Date.now() - parsed.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${diffDays}d ago`;
}

export default function ChroniclePage() {
  const chronicle = useQuery(api.chronicle.get, {});
  const [tick, setTick] = useState(0);

  // Auto-refresh every 60s
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const entries: Entry[] = chronicle?.content ? parseChronicle(chronicle.content) : [];
  const lastUpdated = chronicle?.updatedAt
    ? new Date(chronicle.updatedAt).toLocaleString("en-US", {
        month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, flexShrink: 0 }}>
        <div>
          <h2 style={{ color: "#fff", fontWeight: 700, fontSize: 20, margin: 0 }}>Chronicle</h2>
          <p style={{ color: "#6B7280", fontSize: 12, marginTop: 4 }}>
            {chronicle === undefined
              ? "Loading…"
              : chronicle === null
              ? "No chronicle data yet"
              : `${entries.length} entries · auto-refreshes every 60s`}
          </p>
        </div>
        {lastUpdated && (
          <div
            style={{
              background: "#111111",
              border: "1px solid #222222",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 12,
              color: "#6B7280",
            }}
          >
            Last updated: <span style={{ color: "#9CA3AF", fontWeight: 600 }}>{lastUpdated}</span>
          </div>
        )}
      </div>

      {/* Entries */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {chronicle === undefined ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: "#111111",
                border: "1px solid #1e1e1e",
                borderRadius: 10,
                height: 72,
                animation: "pulse 2s infinite",
              }}
            />
          ))
        ) : chronicle === null || entries.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 40 }}>📜</span>
            <p style={{ color: "#4B5563", fontSize: 14 }}>No chronicle entries yet.</p>
            <p style={{ color: "#374151", fontSize: 12 }}>
              Run push-chronicle.mjs or wait for auto-sync.
            </p>
          </div>
        ) : (
          entries.slice(0, 50).map((entry, i) => (
            <div
              key={i}
              style={{
                background: "#111111",
                border: "1px solid #1e1e1e",
                borderRadius: 10,
                padding: "14px 18px",
                borderLeft: "3px solid #3b82f630",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span
                  style={{
                    background: "#1a2a4a",
                    color: "#3b82f6",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: 5,
                    fontFamily: "monospace",
                    whiteSpace: "nowrap",
                  }}
                >
                  {entry.timestamp}
                </span>
                <span style={{ color: "#374151", fontSize: 11 }}>
                  {formatRelative(entry.timestamp)}
                </span>
              </div>
              <p
                style={{
                  color: "#9CA3AF",
                  fontSize: 13,
                  lineHeight: 1.65,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {entry.body}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
