"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import TaskCard from "@/components/TaskCard";

const COLUMNS = ["Todo", "In Progress", "Done"] as const;

const columnColors: Record<string, string> = {
  Todo:        "#6b7280",
  "In Progress": "#3b82f6",
  Done:        "#22c55e",
};

export default function TasksPage() {
  const [selectedProject, setSelectedProject] = useState("All");
  const [activeCol, setActiveCol]             = useState<typeof COLUMNS[number]>("In Progress");
  const tasks    = useQuery(api.tasks.list, { project: selectedProject });
  const projects = useQuery(api.tasks.projects, {});
  const allProjects = ["All", ...(projects ?? [])];

  const getColumnTasks = (status: string) =>
    (tasks ?? []).filter((t) => t.status === status);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-white text-lg md:text-xl font-bold">Tasks Board</h2>
          <p className="text-gray-500 text-xs mt-0.5">
            {tasks?.length ?? 0} tasks across all columns
          </p>
        </div>

        {/* Project filter */}
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-1">
            {allProjects.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedProject(p)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={
                  selectedProject === p
                    ? { background: "#1a2a4a", color: "#3b82f6", border: "1px solid #3b82f6" }
                    : { background: "#111111", color: "#666666", border: "1px solid #222222" }
                }
              >
                {p === "Ecom System" ? "Ecom" : p === "YouTube Consulting" ? "YouTube" : p === "Heterodox Media" ? "Heterodox" : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile column tabs ── */}
      <div className="flex md:hidden gap-1 rounded-xl p-1" style={{ background: "#111" }}>
        {COLUMNS.map((col) => {
          const count = getColumnTasks(col).length;
          return (
            <button
              key={col}
              onClick={() => setActiveCol(col)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
              style={
                activeCol === col
                  ? { background: "#1a1a1a", color: columnColors[col], border: `1px solid ${columnColors[col]}40` }
                  : { color: "#555", border: "1px solid transparent" }
              }
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: columnColors[col] }}
              />
              {col === "In Progress" ? "Active" : col}
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{ background: "#222", color: "#888" }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Desktop: 3-column kanban ── */}
      <div className="hidden md:grid grid-cols-3 gap-5 flex-1 min-h-0">
        {COLUMNS.map((col) => {
          const colTasks = getColumnTasks(col);
          return (
            <div key={col} className="flex flex-col gap-3 min-h-0">
              {/* Column header */}
              <div
                className="flex items-center justify-between px-4 py-3 rounded-lg border"
                style={{ background: "#0d0d0d", borderColor: "#222222" }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: columnColors[col] }} />
                  <span className="text-white font-semibold text-sm">{col}</span>
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#222222", color: "#888888" }}
                >
                  {colTasks.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
                {tasks === undefined ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="rounded-lg h-20 animate-pulse" style={{ background: "#111111" }} />
                  ))
                ) : colTasks.length === 0 ? (
                  <div
                    className="rounded-lg border border-dashed flex items-center justify-center h-20"
                    style={{ borderColor: "#222222" }}
                  >
                    <span className="text-gray-700 text-sm">No tasks</span>
                  </div>
                ) : (
                  colTasks.map((task) => <TaskCard key={task._id} task={task} />)
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Mobile: single active column ── */}
      <div className="flex md:hidden flex-col gap-3 flex-1 overflow-y-auto">
        {tasks === undefined ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg h-20 animate-pulse" style={{ background: "#111111" }} />
          ))
        ) : getColumnTasks(activeCol).length === 0 ? (
          <div
            className="rounded-lg border border-dashed flex flex-col items-center justify-center py-16 gap-2"
            style={{ borderColor: "#222222" }}
          >
            <span className="text-gray-700 text-sm">No tasks here</span>
          </div>
        ) : (
          getColumnTasks(activeCol).map((task) => <TaskCard key={task._id} task={task} />)
        )}
      </div>
    </div>
  );
}
