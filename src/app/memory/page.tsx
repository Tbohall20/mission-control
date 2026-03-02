"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import StatusBadge from "@/components/StatusBadge";

const PROJECTS = ["All", "Clawdraft", "Ecom System"];

export default function MemoryPage() {
  const [selectedProject, setSelectedProject] = useState("All");
  const [search, setSearch] = useState("");

  const memories = useQuery(api.memories.list, {
    project: selectedProject,
    search: search,
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Memory</h2>
          <p className="text-gray-500 text-sm mt-1">
            {memories?.length ?? 0} documents
          </p>
        </div>

        {/* Project filter */}
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
                    ? { background: "#1a2a4a", color: "#3b82f6", border: "1px solid #3b82f6" }
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

      {/* Search bar */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search by title, content, or tags…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
          style={{ background: "#111111", border: "1px solid #222222" }}
        />
      </div>

      {/* Memory cards grid */}
      {memories === undefined ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl h-40 animate-pulse"
              style={{ background: "#111111" }}
            />
          ))}
        </div>
      ) : memories.length === 0 ? (
        <div
          className="rounded-xl border border-dashed flex flex-col items-center justify-center py-20 gap-3"
          style={{ borderColor: "#222222" }}
        >
          <span className="text-4xl">🧠</span>
          <p className="text-gray-500">No memories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {memories.map((memory) => (
            <div
              key={memory._id}
              className="rounded-xl border p-5 flex flex-col gap-4 hover:border-gray-600 transition-colors"
              style={{ background: "#111111", borderColor: "#222222" }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-white font-semibold text-base leading-snug">
                  {memory.title}
                </h3>
                <StatusBadge status={memory.project} />
              </div>

              {/* Summary */}
              <p className="text-gray-400 text-sm leading-relaxed">{memory.summary}</p>

              {/* Footer */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {memory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{
                        background: "#1a1a1a",
                        color: "#888888",
                        border: "1px solid #2a2a2a",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                {/* Date */}
                <span className="text-xs text-gray-600">
                  {new Date(memory.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
