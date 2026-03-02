"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import AgentCard from "@/components/AgentCard";

const PROJECTS = ["All", "Clawdraft", "Ecom System"];

export default function TeamPage() {
  const [selectedProject, setSelectedProject] = useState("All");
  const agents = useQuery(api.agents.list, { project: selectedProject });

  const clawdraftAgents = (agents ?? []).filter(
    (a) => a.project === "Clawdraft"
  );
  const ecomAgents = (agents ?? []).filter(
    (a) => a.project === "Ecom System"
  );

  const renderSection = (title: string, sectionAgents: typeof agents) => {
    if (!sectionAgents || sectionAgents.length === 0) return null;
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-white font-bold text-base">{title}</h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "#1a2a4a", color: "#3b82f6" }}
          >
            {sectionAgents.length} agents
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "#222222" }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sectionAgents.map((agent) => (
            <AgentCard key={agent._id} agent={agent} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Team</h2>
          <p className="text-gray-500 text-sm mt-1">
            {agents?.length ?? 0} agents across all projects
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

      {/* Loading */}
      {agents === undefined && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl h-52 animate-pulse"
              style={{ background: "#111111" }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      {agents !== undefined && (
        <div className="flex flex-col gap-8">
          {(selectedProject === "All" || selectedProject === "Clawdraft") &&
            renderSection("⚡ Clawdraft", clawdraftAgents)}

          {(selectedProject === "All" || selectedProject === "Ecom System") &&
            renderSection("🛒 Ecom System", ecomAgents)}

          {agents.length === 0 && (
            <div
              className="rounded-xl border border-dashed flex flex-col items-center justify-center py-20 gap-3"
              style={{ borderColor: "#222222" }}
            >
              <span className="text-4xl">👥</span>
              <p className="text-gray-500">No agents found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
