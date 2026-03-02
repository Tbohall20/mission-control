"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/tasks", label: "Tasks", icon: "✅" },
  { href: "/memory", label: "Memory", icon: "🧠" },
  { href: "/team", label: "Team", icon: "👥" },
  { href: "/office", label: "Office", icon: "🏢" },
  { href: "/launch", label: "Launch", icon: "🚀" },
  { href: "/logs", label: "Logs", icon: "📋" },
  { href: "/vault", label: "Vault", icon: "🗄️" },
  { href: "/ecom", label: "Ecom", icon: "🛒" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col w-56 flex-shrink-0 border-r"
      style={{
        background: "#0d0d0d",
        borderColor: "#222222",
        minHeight: "100vh",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2 px-5 py-5 border-b"
        style={{ borderColor: "#222222" }}
      >
        <span className="text-xl">⚡</span>
        <span className="font-bold text-white tracking-tight text-sm">
          Mission Control
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm font-medium ${
                isActive
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
              }`}
              style={
                isActive
                  ? {
                      background: "#1a2a4a",
                      color: "#3b82f6",
                    }
                  : {}
              }
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
              {isActive && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: "#3b82f6" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-4 border-t text-xs text-gray-600"
        style={{ borderColor: "#222222" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
          />
          <span>Systems Online</span>
        </div>
      </div>
    </aside>
  );
}
