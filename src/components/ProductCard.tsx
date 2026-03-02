"use client";

import StatusBadge from "./StatusBadge";
import { Id } from "../../convex/_generated/dataModel";

type Product = {
  _id: Id<"products">;
  name: string;
  status: "Idea" | "Building" | "Launched";
  pricing: string;
  valueProp: string;
  liveLink?: string;
  signups: number;
  revenue: number;
  slotsRemaining?: number;
  phase: "Idea" | "Building" | "Soft Launch" | "Live" | "Scaling";
};

type ProductCardProps = {
  product: Product;
};

const productEmojis: Record<string, string> = {
  Clawdraft: "🦅",
  "Ecom System": "🛒",
};

export default function ProductCard({ product }: ProductCardProps) {
  const emoji = productEmojis[product.name] || "📦";

  return (
    <div
      className="rounded-xl border p-6 flex flex-col gap-5"
      style={{ background: "#111111", borderColor: "#222222" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: "#0a0a0a" }}
          >
            {emoji}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{product.name}</h3>
            <p className="text-gray-500 text-xs mt-0.5">{product.pricing}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={product.status} size="md" />
          <StatusBadge status={product.phase} size="sm" />
        </div>
      </div>

      {/* Value prop */}
      <p className="text-gray-400 text-sm leading-relaxed">{product.valueProp}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div
          className="rounded-lg p-3 text-center"
          style={{ background: "#0a0a0a" }}
        >
          <p className="text-white font-bold text-lg">{product.signups}</p>
          <p className="text-gray-600 text-xs mt-0.5">Signups</p>
        </div>
        <div
          className="rounded-lg p-3 text-center"
          style={{ background: "#0a0a0a" }}
        >
          <p className="text-white font-bold text-lg">
            ${product.revenue.toLocaleString()}
          </p>
          <p className="text-gray-600 text-xs mt-0.5">Revenue</p>
        </div>
        <div
          className="rounded-lg p-3 text-center"
          style={{ background: "#0a0a0a" }}
        >
          <p className="text-white font-bold text-lg">
            {product.slotsRemaining ?? "∞"}
          </p>
          <p className="text-gray-600 text-xs mt-0.5">Slots Left</p>
        </div>
      </div>

      {/* Live link */}
      {product.liveLink && (
        <a
          href={product.liveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium transition-colors"
          style={{ color: "#3b82f6" }}
        >
          <span>🔗</span>
          <span>View Live</span>
          <span>→</span>
        </a>
      )}
      {!product.liveLink && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>🔗</span>
          <span>Not live yet</span>
        </div>
      )}
    </div>
  );
}
