"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/tasks",  label: "Tasks",  icon: "✅" },
  { href: "/office", label: "Office", icon: "🏢" },
  { href: "/launch", label: "Launch", icon: "🚀" },
  { href: "/team",   label: "Team",   icon: "👥" },
  { href: "/vault",  label: "Vault",  icon: "🗄️" },
  { href: "/logs",   label: "Logs",   icon: "📋" },
  { href: "/ecom",   label: "Ecom",   icon: "🛒" },
  { href: "/memory", label: "Memory", icon: "🧠" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t overflow-x-auto"
      style={{ background: "#0d0d0d", borderColor: "#222222" }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center gap-0.5 px-3 py-2 flex-shrink-0 min-w-[60px] transition-all"
            style={{
              color: isActive ? "#3b82f6" : "#555555",
              borderTop: isActive ? "2px solid #3b82f6" : "2px solid transparent",
            }}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.02em" }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
