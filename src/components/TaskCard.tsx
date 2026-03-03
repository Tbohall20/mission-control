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
  notes?: string;
  createdAt: number;
};

type TaskCardProps = {
  task: Task;
  onClick?: () => void;
};

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const priorityColors: Record<string, string> = {
    High: "#ef4444",
    Medium: "#f59e0b",
    Low: "#6b7280",
  };

  return (
    <div
      onClick={onClick}
      className="rounded-lg p-4 border transition-colors"
      style={{
        background: "#111111",
        borderColor: "#222222",
        borderLeft: `3px solid ${priorityColors[task.priority]}`,
        cursor: onClick ? "pointer" : "default",
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#444444";
          (e.currentTarget as HTMLDivElement).style.background = "#161616";
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#222222";
        (e.currentTarget as HTMLDivElement).style.background = "#111111";
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
      {task.notes && (
        <p className="text-xs mt-2 truncate" style={{ color: "#6B7280" }}>
          📝 {task.notes}
        </p>
      )}
    </div>
  );
}
