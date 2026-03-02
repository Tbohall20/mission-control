"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ProductCard from "@/components/ProductCard";

export default function VaultPage() {
  const products = useQuery(api.products.list);

  const launched = (products ?? []).filter((p) => p.status === "Launched");
  const building = (products ?? []).filter((p) => p.status === "Building");
  const ideas = (products ?? []).filter((p) => p.status === "Idea");

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Product Vault</h2>
          <p className="text-gray-500 text-sm mt-1">
            All products — past, present, and future
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-3">
          <div
            className="px-3 py-2 rounded-xl border text-center"
            style={{ background: "#111111", borderColor: "#222222" }}
          >
            <p className="text-green-400 font-bold">{launched.length}</p>
            <p className="text-gray-600 text-xs">Launched</p>
          </div>
          <div
            className="px-3 py-2 rounded-xl border text-center"
            style={{ background: "#111111", borderColor: "#222222" }}
          >
            <p className="text-blue-400 font-bold">{building.length}</p>
            <p className="text-gray-600 text-xs">Building</p>
          </div>
          <div
            className="px-3 py-2 rounded-xl border text-center"
            style={{ background: "#111111", borderColor: "#222222" }}
          >
            <p className="text-purple-400 font-bold">{ideas.length}</p>
            <p className="text-gray-600 text-xs">Ideas</p>
          </div>
        </div>
      </div>

      {/* Products */}
      {products === undefined ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl h-72 animate-pulse"
              style={{ background: "#111111" }}
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div
          className="rounded-xl border border-dashed flex flex-col items-center justify-center py-20 gap-3"
          style={{ borderColor: "#222222" }}
        >
          <span className="text-4xl">🗄️</span>
          <p className="text-gray-500">No products in vault yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {building.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">
                  🔨 In Development
                </h3>
                <div className="flex-1 h-px" style={{ background: "#222222" }} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {building.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          )}

          {launched.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">
                  ✅ Launched
                </h3>
                <div className="flex-1 h-px" style={{ background: "#222222" }} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {launched.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          )}

          {ideas.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">
                  💡 Ideas
                </h3>
                <div className="flex-1 h-px" style={{ background: "#222222" }} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {ideas.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
