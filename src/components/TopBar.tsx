"use client";

import { usePathname } from "next/navigation";

const panelNames: Record<string, string> = {
  "/tasks": "Tasks Board",
  "/memory": "Memory",
  "/team": "Team",
  "/office": "Office",
  "/launch": "Launch Tracker",
  "/logs": "Agent Logs",
  "/vault": "Product Vault",
  "/ecom": "Ecom Pipeline",
};

const panelIcons: Record<string, string> = {
  "/tasks": "✅",
  "/memory": "🧠",
  "/team": "👥",
  "/office": "🏢",
  "/launch": "🚀",
  "/logs": "📋",
  "/vault": "🗄️",
  "/ecom": "🛒",
};

export default function TopBar() {
  const pathname = usePathname();
  const panelName = panelNames[pathname] || "Mission Control";
  const panelIcon = panelIcons[pathname] || "⚡";

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 py-3 border-b flex-shrink-0"
      style={{
        background: "#0d0d0d",
        borderColor: "#222222",
        height: "52px",
      }}
    >
      {/* Left: Panel name */}
      <div className="flex items-center gap-2">
        <span className="text-base">{panelIcon}</span>
        <h1 className="text-white font-semibold text-sm md:text-base">{panelName}</h1>
      </div>

      {/* Right: branding + time */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs text-gray-500">{dateStr}</p>
          <p className="text-xs text-gray-400 font-medium">{timeStr}</p>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold tracking-wide"
          style={{ borderColor: "#3b82f6", color: "#3b82f6", background: "#1a2a4a" }}
        >
          <span>⚡</span>
          <span className="hidden sm:inline">Command</span>
        </div>
      </div>
    </header>
  );
}
