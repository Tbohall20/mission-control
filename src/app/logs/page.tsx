"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import LogEntry from "@/components/LogEntry";

const PROJECTS = ["All", "Clawdraft", "Ecom System"];

export default function LogsPage() {
  const [selectedProject, setSelectedProject] = useState("All");
  const logs = useQuery(api.logs.list, { project: selectedProject });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Agent Logs</h2>
          <p className="text-gray-500 text-sm mt-1">
            Real-time feed — newest first
          </p>
        </div>

        {/* Project filter + live indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">Project:</span>
            <div className="flex gap-1.5">
              {PROJECTS.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedProject(p)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={
                    selectedProject === p
                      ? {
                          background: "#1a2a4a",
                          color: "#3b82f6",
                          border: "1px solid #3b82f6",
                        }
                      : {
                          background: "#111111",
                          color: "#666666",
                          border: "1px solid #222222",
                        }
                  }
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Log feed */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: "#111111", borderColor: "#222222" }}
      >
        {/* Column headers */}
        <div
          className="grid grid-cols-[2rem_1fr_auto] gap-4 px-4 py-3 border-b"
          style={{
            background: "#0d0d0d",
            borderColor: "#222222",
          }}
        >
          <div />
          <div className="flex items-center gap-8">
            <span className="text-xs text-gray-600 uppercase tracking-wider">
              Agent & Action
            </span>
          </div>
          <span className="text-xs text-gray-600 uppercase tracking-wider">
            Time
          </span>
        </div>

        {/* Entries */}
        {logs === undefined ? (
          <div className="flex flex-col">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-4 px-4 py-4 border-b animate-pulse"
                style={{ borderColor: "#1a1a1a" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex-shrink-0"
                  style={{ background: "#1a1a1a" }}
                />
                <div className="flex-1 space-y-2">
                  <div
                    className="h-3 w-32 rounded"
                    style={{ background: "#1a1a1a" }}
                  />
                  <div
                    className="h-3 w-full rounded"
                    style={{ background: "#1a1a1a" }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-4xl">📋</span>
            <p className="text-gray-500">No logs yet</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {logs.map((log) => (
              <LogEntry key={log._id} log={log} />
            ))}
          </div>
        )}
      </div>

      {/* Count */}
      {logs && logs.length > 0 && (
        <p className="text-center text-xs text-gray-700">
          Showing {logs.length} log{logs.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
