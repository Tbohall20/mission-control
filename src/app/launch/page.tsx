"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import StatusBadge from "@/components/StatusBadge";

const phaseOrder = ["Idea", "Building", "Soft Launch", "Live", "Scaling"];

const productEmojis: Record<string, string> = {
  Clawdraft: "🦅",
  "Ecom System": "🛒",
};

export default function LaunchPage() {
  const products = useQuery(api.products.list);

  const totalRevenue = (products ?? []).reduce((sum, p) => sum + p.revenue, 0);
  const totalSignups = (products ?? []).reduce((sum, p) => sum + p.signups, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Launch Tracker</h2>
          <p className="text-gray-500 text-sm mt-1">
            Track product launches and revenue
          </p>
        </div>

        {/* Summary stats */}
        <div className="flex gap-3">
          <div
            className="px-4 py-2 rounded-xl border text-center"
            style={{ background: "#111111", borderColor: "#222222" }}
          >
            <p className="text-white font-bold text-lg">{totalSignups}</p>
            <p className="text-gray-600 text-xs">Total Signups</p>
          </div>
          <div
            className="px-4 py-2 rounded-xl border text-center"
            style={{ background: "#111111", borderColor: "#222222" }}
          >
            <p className="text-white font-bold text-lg">
              ${totalRevenue.toLocaleString()}
            </p>
            <p className="text-gray-600 text-xs">Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Product launch cards */}
      {products === undefined ? (
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl h-80 animate-pulse"
              style={{ background: "#111111" }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {products.map((product) => {
            const emoji = productEmojis[product.name] || "📦";
            const currentPhaseIndex = phaseOrder.indexOf(product.phase);

            return (
              <div
                key={product._id}
                className="rounded-xl border p-6 flex flex-col gap-6"
                style={{ background: "#111111", borderColor: "#222222" }}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{emoji}</span>
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-sm">{product.pricing}</p>
                    </div>
                  </div>
                  <StatusBadge status={product.phase} size="md" />
                </div>

                {/* Phase progress */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Launch Phase
                  </p>
                  <div className="flex gap-1.5">
                    {phaseOrder.map((phase, idx) => (
                      <div
                        key={phase}
                        className="flex-1 flex flex-col items-center gap-1"
                      >
                        <div
                          className="w-full h-1.5 rounded-full transition-all"
                          style={{
                            background:
                              idx <= currentPhaseIndex ? "#3b82f6" : "#222222",
                          }}
                        />
                        <span
                          className={`text-xs ${
                            idx === currentPhaseIndex
                              ? "text-blue-400 font-medium"
                              : idx < currentPhaseIndex
                              ? "text-gray-500"
                              : "text-gray-700"
                          }`}
                        >
                          {phase}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div
                    className="rounded-xl p-4 text-center"
                    style={{ background: "#0a0a0a" }}
                  >
                    <p className="text-white font-bold text-2xl">
                      {product.signups}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">Signups</p>
                  </div>
                  <div
                    className="rounded-xl p-4 text-center"
                    style={{ background: "#0a0a0a" }}
                  >
                    <p className="text-white font-bold text-2xl">
                      ${product.revenue.toLocaleString()}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">Revenue</p>
                  </div>
                  <div
                    className="rounded-xl p-4 text-center"
                    style={{ background: "#0a0a0a" }}
                  >
                    <p
                      className={`font-bold text-2xl ${
                        (product.slotsRemaining ?? 999) < 10
                          ? "text-red-400"
                          : "text-white"
                      }`}
                    >
                      {product.slotsRemaining ?? "∞"}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">Slots Left</p>
                  </div>
                </div>

                {/* Value prop */}
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                  {product.valueProp}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-3">
                  {product.liveLink ? (
                    <a
                      href={product.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-center transition-colors"
                      style={{ background: "#3b82f6", color: "#fff" }}
                    >
                      View Live →
                    </a>
                  ) : (
                    <div
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-center"
                      style={{
                        background: "#1a1a1a",
                        color: "#666",
                        border: "1px solid #222",
                      }}
                    >
                      Not Live Yet
                    </div>
                  )}
                  <StatusBadge status={product.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
