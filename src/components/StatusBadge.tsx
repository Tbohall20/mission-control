"use client";

type StatusBadgeProps = {
  status: string;
  size?: "sm" | "md";
};

const statusConfig: Record<string, { bg: string; text: string; dot?: string }> = {
  // Agent statuses
  Active: { bg: "bg-green-500/20", text: "text-green-400", dot: "bg-green-400" },
  Idle: { bg: "bg-gray-500/20", text: "text-gray-400", dot: "bg-gray-400" },
  Building: { bg: "bg-blue-500/20", text: "text-blue-400", dot: "bg-blue-400" },
  // Task priorities
  High: { bg: "bg-red-500/20", text: "text-red-400" },
  Medium: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  Low: { bg: "bg-gray-500/20", text: "text-gray-400" },
  // Task statuses
  Todo: { bg: "bg-gray-500/20", text: "text-gray-400" },
  "In Progress": { bg: "bg-blue-500/20", text: "text-blue-400" },
  Done: { bg: "bg-green-500/20", text: "text-green-400" },
  // Product statuses
  Idea: { bg: "bg-purple-500/20", text: "text-purple-400" },
  Launched: { bg: "bg-green-500/20", text: "text-green-400" },
  // Phases
  "Soft Launch": { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  Live: { bg: "bg-green-500/20", text: "text-green-400" },
  Scaling: { bg: "bg-blue-500/20", text: "text-blue-400" },
  // Projects
  Clawdraft: { bg: "bg-blue-500/20", text: "text-blue-400" },
  "Ecom System": { bg: "bg-purple-500/20", text: "text-purple-400" },
};

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status] || { bg: "bg-gray-500/20", text: "text-gray-400" };
  const padding = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${padding}`}
    >
      {config.dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      )}
      {status}
    </span>
  );
}
