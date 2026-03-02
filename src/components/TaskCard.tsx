"use client";

import StatusBadge from "./StatusBadge";
import { Id } from "../../convex/_generated/dataModel";

type Task = {
  _id: Id<"tasks">;
  title: string;
  assignee: string;
  project: string;
  priority: "High" | "Medium" | "Low";
  status: "Todo" | "In Progress" | "Done";
  createdAt: number;
};

type TaskCardProps = {
  task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
  const priorityColors: Record<string, string> = {
    High: "#ef4444",
    Medium: "#f59e0b",
    Low: "#6b7280",
  };

  return (
    <div
      className="rounded-lg p-4 border cursor-default hover:border-gray-600 transition-colors"
      style={{
        background: "#111111",
        borderColor: "#222222",
        borderLeft: `3px solid ${priorityColors[task.priority]}`,
      }}
    >
      <p className="text-white text-sm font-medium leading-snug mb-3">
        {task.title}
      </p>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "#1a2a4a", color: "#3b82f6" }}
          >
            {task.assignee.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-gray-400">{task.assignee}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusBadge status={task.project} />
          <StatusBadge status={task.priority} />
        </div>
      </div>
    </div>
  );
}
