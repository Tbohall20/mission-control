"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

// ─── Agent config ──────────────────────────────────────────────────────────────
const AGENT_META: Record<string, { emoji: string; color: string; screenColor: string }> = {
  Scraper:           { emoji: "🕷️", color: "#3b82f6",  screenColor: "#1d4ed8" },
  ContentGen:        { emoji: "✍️", color: "#06b6d4",  screenColor: "#0e7490" },
  Delivery:          { emoji: "📦", color: "#8b5cf6",  screenColor: "#6d28d9" },
  Onboarding:        { emoji: "🎯", color: "#ec4899",  screenColor: "#be185d" },
  MarketResearch:    { emoji: "🔍", color: "#a855f7",  screenColor: "#7e22ce" },
  Supplier:          { emoji: "🏭", color: "#f97316",  screenColor: "#c2410c" },
  Listing:           { emoji: "📝", color: "#10b981",  screenColor: "#047857" },
  Pricing:           { emoji: "💰", color: "#f59e0b",  screenColor: "#b45309" },
  Ads:               { emoji: "📣", color: "#ef4444",  screenColor: "#b91c1c" },
  CustomerService:   { emoji: "💬", color: "#14b8a6",  screenColor: "#0f766e" },
  KalshiBot:         { emoji: "🎰", color: "#22c55e",  screenColor: "#15803d" },
  PolyScanner:       { emoji: "📡", color: "#06b6d4",  screenColor: "#0369a1" },
  YoutubeStrategist: { emoji: "🎥", color: "#ef4444",  screenColor: "#b91c1c" },
};

// ─── Static desk layout ────────────────────────────────────────────────────────
// Each entry: { name, x, y } — positions in the 900×600 floor space
const CLAWDRAFT_POSITIONS: Record<string, { x: number; y: number }> = {
  Scraper:    { x: 80,  y: 180 },
  ContentGen: { x: 200, y: 180 },
  Delivery:   { x: 80,  y: 310 },
  Onboarding: { x: 200, y: 310 },
};

const ECOM_POSITIONS: Record<string, { x: number; y: number }> = {
  MarketResearch: { x: 620, y: 160 },
  Supplier:       { x: 740, y: 160 },
  Listing:        { x: 620, y: 270 },
  Pricing:        { x: 740, y: 270 },
  Ads:            { x: 620, y: 380 },
  CustomerService:{ x: 740, y: 380 },
};

const TRADING_POSITIONS: Record<string, { x: number; y: number }> = {
  KalshiBot:   { x: 390, y: 265 },
  PolyScanner: { x: 510, y: 265 },
};

const CONSULTING_POSITIONS: Record<string, { x: number; y: number }> = {
  YoutubeStrategist: { x: 820, y: 68 },
};

// ─── Desk component ────────────────────────────────────────────────────────────
function AgentDesk({
  name, x, y, status, onClick, selected,
}: {
  name: string; x: number; y: number;
  status: string; onClick: () => void; selected: boolean;
}) {
  const meta    = AGENT_META[name] ?? { emoji: "🤖", color: "#3b82f6", screenColor: "#1d4ed8" };
  const isOn    = status === "Active" || status === "Building";
  const isActive = status === "Active";
  const c = meta.color;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {/* Selection ring */}
      {selected && (
        <rect x="-38" y="-52" width="76" height="90" rx="12"
          fill="none" stroke={c} strokeWidth="2" opacity="0.8" />
      )}

      {/* Desk surface */}
      <rect x="-30" y="-16" width="60" height="36" rx="6"
        fill={isOn ? "#0f1a2e" : "#0a0a0a"}
        stroke={isOn ? c : "#1e1e1e"}
        strokeWidth={isOn ? "1.5" : "1"}
      />

      {/* Monitor */}
      <rect x="-14" y="-38" width="28" height="20" rx="4"
        fill={isOn ? meta.screenColor : "#080808"}
        stroke={isOn ? c : "#1a1a1a"}
        strokeWidth="1"
      />
      {/* Monitor glow */}
      {isOn && (
        <rect x="-14" y="-38" width="28" height="20" rx="4"
          fill="none" stroke={c} strokeWidth="1"
          opacity="0.4"
          filter="url(#glow)"
        />
      )}
      {/* Monitor stand */}
      <rect x="-3" y="-18" width="6" height="4" rx="1" fill="#111" />
      <rect x="-8" y="-15" width="16" height="2" rx="1" fill="#111" />

      {/* Screen activity bars */}
      {isOn && [[-7,10],[-3,6],[1,12],[5,8],[9,10]].map(([bx, bh], i) => (
        <rect key={i}
          x={bx} y={-28 + (14 - bh)}
          width="3" height={bh}
          rx="1"
          fill={c}
          opacity="0.8"
        >
          <animate attributeName="height"
            values={`${bh};${Math.max(3, bh - 4)};${bh}`}
            dur={`${1.2 + i * 0.15}s`}
            repeatCount="indefinite" />
          <animate attributeName="y"
            values={`${-28 + (14 - bh)};${-28 + (14 - Math.max(3, bh - 4))};${-28 + (14 - bh)}`}
            dur={`${1.2 + i * 0.15}s`}
            repeatCount="indefinite" />
        </rect>
      ))}

      {/* Avatar circle */}
      <circle cx="0" cy="18" r="14"
        fill={isOn ? `${c}18` : "#111"}
        stroke={isOn ? c : "#222"}
        strokeWidth={isOn ? "1.5" : "1"}
      />
      {isOn && (
        <circle cx="0" cy="18" r="14"
          fill="none" stroke={c}
          strokeWidth="2" opacity="0.3"
          filter="url(#glow)"
        />
      )}
      <text x="0" y="23" textAnchor="middle" fontSize="13">{meta.emoji}</text>

      {/* Status dot */}
      <circle cx="10" cy="8" r="4"
        fill={isActive ? "#22c55e" : isOn ? c : "#374151"}
        stroke="#000" strokeWidth="1"
      >
        {isOn && (
          <animate attributeName="opacity"
            values="1;0.5;1" dur="2s" repeatCount="indefinite" />
        )}
      </circle>

      {/* Name label */}
      <text x="0" y="42" textAnchor="middle"
        fontSize="9" fontWeight="600"
        fill={isOn ? "#e5e7eb" : "#4b5563"}
        fontFamily="'Inter', sans-serif"
        letterSpacing="0.3"
      >
        {(AGENT_META[name]?.emoji ?? "") + " " + name.replace(/([A-Z])/g, ' $1').trim().replace(/^./, s => s.toUpperCase())}
      </text>
    </g>
  );
}

// ─── Detail panel ──────────────────────────────────────────────────────────────
function DetailPanel({ agent, onClose }: {
  agent: { name: string; role: string; status: string; project: string; currentActivity: string; responsibilities: string[] } | null;
  onClose: () => void;
}) {
  if (!agent) return null;
  const meta  = AGENT_META[agent.name] ?? { emoji: "🤖", color: "#3b82f6", screenColor: "#1d4ed8" };
  const c = meta.color;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-72 flex flex-col gap-4 p-5 overflow-y-auto z-50"
      style={{ background: "#050505", borderLeft: `1px solid ${c}30`, boxShadow: `-16px 0 40px rgba(0,0,0,.7)` }}
    >
      <button onClick={onClose}
        className="self-end text-gray-600 hover:text-gray-400 text-lg leading-none transition-colors">✕</button>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: `${c}18`, border: `1px solid ${c}50`, boxShadow: `0 0 20px ${c}20` }}>
          {meta.emoji}
        </div>
        <div>
          <h3 className="text-white font-bold text-base">{agent.name.replace(/([A-Z])/g, ' $1').trim()}</h3>
          <p className="text-gray-500 text-xs mt-0.5">{agent.role}</p>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
          style={{
            background: agent.status === "Active" ? "#14532d" : agent.status === "Building" ? `${c}22` : "#1f2937",
            color: agent.status === "Active" ? "#4ade80" : agent.status === "Building" ? c : "#6b7280",
          }}>
          {agent.status}
        </span>
      </div>

      {/* Activity */}
      <div className="rounded-xl p-3" style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}>
        <p className="text-gray-600 text-xs uppercase tracking-wide mb-1.5 font-semibold">Activity</p>
        <p className="text-gray-300 text-xs leading-relaxed">{agent.currentActivity}</p>
      </div>

      {/* Responsibilities */}
      <div>
        <p className="text-gray-600 text-xs uppercase tracking-wide mb-2 font-semibold">Responsibilities</p>
        <div className="flex flex-col gap-1.5">
          {agent.responsibilities.map((r, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: c }} />
              <p className="text-gray-400 text-xs leading-relaxed">{r}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-3 py-1.5 rounded-lg text-xs font-medium text-center mt-auto"
        style={{ background: `${c}15`, color: c, border: `1px solid ${c}25` }}>
        {agent.project}
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function OfficePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const agents = useQuery(api.agents.list, { project: "All" });

  const agentMap = Object.fromEntries((agents ?? []).map(a => [a.name, a]));
  const selectedAgent = selected ? agentMap[selected] ?? null : null;

  const activeCount   = (agents ?? []).filter(a => a.status === "Active").length;
  const buildingCount = (agents ?? []).filter(a => a.status === "Building").length;

  const handleClick = (name: string) => setSelected(p => p === name ? null : name);

  return (
    <div className="flex flex-col gap-3" style={{ height: "calc(100vh - 100px)", paddingRight: selectedAgent ? 288 : 0 }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 flex-shrink-0">
        <div>
          <h2 className="text-white text-lg md:text-xl font-bold tracking-tight">Operations Floor</h2>
          <p className="text-gray-600 text-xs mt-0.5">Click any agent to inspect</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-500">{activeCount} Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-gray-500">{buildingCount} Building</span>
          </div>
        </div>
      </div>

      {/* Floor */}
      <div className="flex-1 min-h-0 rounded-2xl overflow-hidden relative"
        style={{ background: "#060608", border: "1px solid #131313" }}
      >
        {agents === undefined ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-700 text-sm animate-pulse">Loading agents…</div>
          </div>
        ) : (
          <svg width="100%" height="100%" viewBox="0 0 900 490" preserveAspectRatio="none" style={{ display: "block" }}>
            <defs>
              {/* Glow filter */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="glow-soft" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>

              {/* Floor pattern */}
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0f0f12" strokeWidth="1" />
              </pattern>
              <pattern id="grid2" width="120" height="120" patternUnits="userSpaceOnUse">
                <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#141420" strokeWidth="1.5" />
              </pattern>
            </defs>

            {/* Floor */}
            <rect width="900" height="490" fill="#07070a" />
            <rect width="900" height="490" fill="url(#grid)" />
            <rect width="900" height="490" fill="url(#grid2)" />

            {/* Ambient room glow */}
            <radialGradient id="roomGlow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#1a2a4a" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#07070a" stopOpacity="0" />
            </radialGradient>
            <rect width="900" height="490" fill="url(#roomGlow)" />

            {/* ── COMMAND CENTER ── */}
            <g>
              {/* Zone border */}
              <rect x="340" y="20" width="220" height="110" rx="16"
                fill="#0e0a02" stroke="#f59e0b22" strokeWidth="1.5" />
              {/* Zone glow */}
              <rect x="340" y="20" width="220" height="110" rx="16"
                fill="none" stroke="#f59e0b" strokeWidth="1"
                opacity="0.15" filter="url(#glow-soft)" />
              {/* Zone label */}
              <text x="450" y="36" textAnchor="middle"
                fontSize="8" fontWeight="700" letterSpacing="2"
                fill="#f59e0b" opacity="0.7" fontFamily="'Inter', sans-serif">
                ⚡ COMMAND
              </text>

              {/* Axiom desk — bigger, centered */}
              <g transform="translate(450, 80)" onClick={() => {}} style={{ cursor: "default" }}>
                {/* Desk */}
                <rect x="-40" y="-20" width="80" height="44" rx="8"
                  fill="#120e01" stroke="#f59e0b40" strokeWidth="2" />
                {/* Glow */}
                <rect x="-40" y="-20" width="80" height="44" rx="8"
                  fill="none" stroke="#f59e0b" strokeWidth="2"
                  opacity="0.2" filter="url(#glow)" />
                {/* Monitor — wider */}
                <rect x="-22" y="-46" width="44" height="26" rx="5"
                  fill="#0c0800" stroke="#f59e0b40" strokeWidth="1.5" />
                <rect x="-22" y="-46" width="44" height="26" rx="5"
                  fill="none" stroke="#f59e0b" strokeWidth="1.5"
                  opacity="0.3" filter="url(#glow)" />
                {/* Activity bars */}
                {[[-14,14],[-8,10],[-2,16],[4,12],[10,10],[16,14]].map(([bx,bh],i) => (
                  <rect key={i} x={bx} y={-46 + (26 - bh) + 2} width="4" height={bh - 4} rx="1"
                    fill="#f59e0b" opacity="0.7">
                    <animate attributeName="height"
                      values={`${bh-4};${Math.max(2,bh-8)};${bh-4}`}
                      dur={`${1.1 + i * 0.12}s`} repeatCount="indefinite" />
                  </rect>
                ))}
                <rect x="-4" y="-20" width="8" height="5" rx="1" fill="#1a1000" />
                <rect x="-10" y="-17" width="20" height="2.5" rx="1" fill="#1a1000" />

                {/* Avatar */}
                <circle cx="0" cy="22" r="18"
                  fill="#f59e0b18" stroke="#f59e0b60" strokeWidth="2" />
                <circle cx="0" cy="22" r="18"
                  fill="none" stroke="#f59e0b" strokeWidth="2.5"
                  opacity="0.25" filter="url(#glow)" />
                <text x="0" y="29" textAnchor="middle" fontSize="17">⚡</text>

                {/* Pulse ring */}
                <circle cx="0" cy="22" r="18"
                  fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.4">
                  <animate attributeName="r" values="18;26;18" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
                </circle>

                <text x="0" y="54" textAnchor="middle" fontSize="10" fontWeight="700"
                  fill="#f59e0b" fontFamily="'Inter', sans-serif" letterSpacing="1">
                  AXIOM
                </text>
                <text x="0" y="65" textAnchor="middle" fontSize="8"
                  fill="#f59e0b60" fontFamily="'Inter', sans-serif">
                  Master Agent
                </text>
              </g>
            </g>

            {/* ── CLAWDRAFT ZONE ── */}
            <g>
              <rect x="26" y="140" width="250" height="230" rx="16"
                fill="#030a18" stroke="#3b82f622" strokeWidth="1.5" />
              <rect x="26" y="140" width="250" height="230" rx="16"
                fill="none" stroke="#3b82f6" strokeWidth="1"
                opacity="0.1" filter="url(#glow-soft)" />
              <text x="151" y="158" textAnchor="middle"
                fontSize="9" fontWeight="700" letterSpacing="2"
                fill="#3b82f6" opacity="0.75" fontFamily="'Inter', sans-serif">
                📝 CLAWDRAFT STUDIO
              </text>

              {Object.entries(CLAWDRAFT_POSITIONS).map(([name, pos]) => {
                const agent = agentMap[name];
                return agent ? (
                  <AgentDesk key={name} name={name} x={pos.x} y={pos.y}
                    status={agent.status} selected={selected === name}
                    onClick={() => handleClick(name)} />
                ) : null;
              })}
            </g>

            {/* ── ECOM ZONE ── */}
            <g>
              <rect x="596" y="120" width="278" height="310" rx="16"
                fill="#0d0318" stroke="#a855f722" strokeWidth="1.5" />
              <rect x="596" y="120" width="278" height="310" rx="16"
                fill="none" stroke="#a855f7" strokeWidth="1"
                opacity="0.1" filter="url(#glow-soft)" />
              <text x="735" y="138" textAnchor="middle"
                fontSize="9" fontWeight="700" letterSpacing="2"
                fill="#a855f7" opacity="0.75" fontFamily="'Inter', sans-serif">
                🛒 ECOM DIVISION
              </text>

              {Object.entries(ECOM_POSITIONS).map(([name, pos]) => {
                const agent = agentMap[name];
                return agent ? (
                  <AgentDesk key={name} name={name} x={pos.x} y={pos.y}
                    status={agent.status} selected={selected === name}
                    onClick={() => handleClick(name)} />
                ) : null;
              })}
            </g>

            {/* ── TRADING ZONE ── */}
            <g>
              <rect x="330" y="152" width="250" height="180" rx="16"
                fill="#001508" stroke="#22c55e22" strokeWidth="1.5" />
              <rect x="330" y="152" width="250" height="180" rx="16"
                fill="none" stroke="#22c55e" strokeWidth="1.5"
                opacity="0.12" filter="url(#glow-soft)" />
              {/* Corner accent lines */}
              <line x1="330" y1="175" x2="345" y2="175" stroke="#22c55e" strokeWidth="1" opacity="0.3" />
              <line x1="565" y1="175" x2="580" y2="175" stroke="#22c55e" strokeWidth="1" opacity="0.3" />
              <text x="455" y="170" textAnchor="middle"
                fontSize="9" fontWeight="700" letterSpacing="2"
                fill="#22c55e" opacity="0.8" fontFamily="'Inter', sans-serif">
                💹 TRADING FLOOR
              </text>
              {/* DRY RUN badge */}
              <rect x="406" y="176" width="98" height="14" rx="4"
                fill="#22c55e18" stroke="#22c55e33" strokeWidth="1" />
              <text x="455" y="186" textAnchor="middle"
                fontSize="7" fontWeight="600" letterSpacing="1.5"
                fill="#22c55e" opacity="0.6" fontFamily="'Inter', sans-serif">
                DRY_RUN MODE
              </text>

              {Object.entries(TRADING_POSITIONS).map(([name, pos]) => {
                const agent = agentMap[name];
                return agent ? (
                  <AgentDesk key={name} name={name} x={pos.x} y={pos.y}
                    status={agent.status} selected={selected === name}
                    onClick={() => handleClick(name)} />
                ) : null;
              })}
            </g>

            {/* ── CONSULTING ZONE ── */}
            <g>
              <rect x="748" y="14" width="144" height="108" rx="16"
                fill="#180406" stroke="#ef444422" strokeWidth="1.5" />
              <rect x="748" y="14" width="144" height="108" rx="16"
                fill="none" stroke="#ef4444" strokeWidth="1.5"
                opacity="0.12" filter="url(#glow-soft)" />
              <text x="820" y="30" textAnchor="middle"
                fontSize="9" fontWeight="700" letterSpacing="2"
                fill="#ef4444" opacity="0.75" fontFamily="'Inter', sans-serif">
                🎙 CONSULTING
              </text>

              {Object.entries(CONSULTING_POSITIONS).map(([name, pos]) => {
                const agent = agentMap[name];
                return agent ? (
                  <AgentDesk key={name} name={name} x={pos.x} y={pos.y}
                    status={agent.status} selected={selected === name}
                    onClick={() => handleClick(name)} />
                ) : null;
              })}
            </g>

            {/* ── MEETING TABLE ── */}
            <g transform="translate(450, 380)">
              <ellipse cx="0" cy="0" rx="70" ry="44"
                fill="#0a0a0a" stroke="#1e1e1e" strokeWidth="1.5" />
              <ellipse cx="0" cy="0" rx="70" ry="44"
                fill="none" stroke="#22c55e" strokeWidth="1"
                opacity="0.12" filter="url(#glow)" />
              {/* Chairs */}
              {[[-70,0],[-50,-36],[0,-48],[50,-36],[70,0],[50,36],[0,48],[-50,36]].map(([cx,cy],i) => (
                <circle key={i} cx={cx} cy={cy} r="8"
                  fill="#0d0d0d" stroke="#1e2e1e" strokeWidth="1" />
              ))}
              <text x="0" y="4" textAnchor="middle" fontSize="8"
                fill="#22c55e40" fontFamily="'Inter', sans-serif"
                fontWeight="600" letterSpacing="1">
                WAR ROOM
              </text>
            </g>

            {/* ── DECORATIVE — server racks / plants ── */}
            {/* Top-left server rack */}
            <g transform="translate(26, 30)">
              <rect width="40" height="68" rx="4" fill="#0a0a0a" stroke="#1a1a2e" strokeWidth="1" />
              {[0,1,2,3,4,5].map(i => (
                <g key={i} transform={`translate(4, ${6 + i * 10})`}>
                  <rect width="32" height="7" rx="2" fill="#0d0d18" stroke="#1e1e3a" strokeWidth="0.5" />
                  <circle cx="5" cy="3.5" r="2" fill={i % 2 === 0 ? "#22c55e" : "#3b82f6"} opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.3;0.8"
                      dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              ))}
            </g>
            {/* Top-right server rack — moved below consulting zone */}
            <g transform="translate(858, 420)">
              <rect width="40" height="62" rx="4" fill="#0a0a0a" stroke="#1a1a2e" strokeWidth="1" />
              {[0,1,2,3,4,5].map(i => (
                <g key={i} transform={`translate(4, ${5 + i * 9})`}>
                  <rect width="32" height="6" rx="2" fill="#0d0d18" stroke="#1e1e3a" strokeWidth="0.5" />
                  <circle cx="5" cy="3" r="2" fill={i % 3 === 0 ? "#a855f7" : "#f59e0b"} opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.2;0.8"
                      dur={`${1.8 + i * 0.25}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              ))}
            </g>
            {/* Bottom-left plant */}
            <g transform="translate(26, 420)">
              <rect x="8" y="42" width="24" height="18" rx="3" fill="#0a0a0a" stroke="#1a2e1a" strokeWidth="1" />
              <ellipse cx="20" cy="38" rx="18" ry="22" fill="#0a1a0a" stroke="#1a3a1a" strokeWidth="1" opacity="0.9" />
              <ellipse cx="20" cy="38" rx="18" ry="22" fill="none" stroke="#22c55e" strokeWidth="0.5" opacity="0.15" />
            </g>
            {/* Bottom-right plant */}
            <g transform="translate(836, 420)">
              <rect x="8" y="42" width="24" height="18" rx="3" fill="#0a0a0a" stroke="#1a2e1a" strokeWidth="1" />
              <ellipse cx="20" cy="38" rx="18" ry="22" fill="#0a1a0a" stroke="#1a3a1a" strokeWidth="1" opacity="0.9" />
              <ellipse cx="20" cy="38" rx="18" ry="22" fill="none" stroke="#22c55e" strokeWidth="0.5" opacity="0.15" />
            </g>

            {/* Floor label */}
            <text x="450" y="482" textAnchor="middle"
              fontSize="8" fontFamily="'Inter', sans-serif"
              fill="#1a1a1a" letterSpacing="4">
              NEXUS · OPERATIONS FLOOR
            </text>
          </svg>
        )}
      </div>

      {/* Detail panel */}
      <DetailPanel agent={selectedAgent as any} onClose={() => setSelected(null)} />
    </div>
  );
}
