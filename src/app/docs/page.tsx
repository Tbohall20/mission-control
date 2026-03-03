"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

type Doc = {
  _id: Id<"documents">;
  title: string;
  path: string;
  project: string;
  type: string;
  content: string;
  size: number;
  updatedAt: number;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DocsPage() {
  const docs = useQuery(api.documents.list, {});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState("All");

  const projects = useMemo(() => {
    if (!docs) return [];
    return ["All", ...Array.from(new Set(docs.map((d) => d.project))).sort()];
  }, [docs]);

  const filtered = useMemo(() => {
    if (!docs) return [];
    return docs.filter((d) => {
      const matchProject = selectedProject === "All" || d.project === selectedProject;
      const q = search.toLowerCase();
      const matchSearch = !q || d.title.toLowerCase().includes(q) || d.path.toLowerCase().includes(q) || d.project.toLowerCase().includes(q);
      return matchProject && matchSearch;
    });
  }, [docs, search, selectedProject]);

  const grouped = useMemo(() => {
    const g: Record<string, Doc[]> = {};
    for (const d of filtered) {
      if (!g[d.project]) g[d.project] = [];
      g[d.project].push(d as Doc);
    }
    return g;
  }, [filtered]);

  const selectedDoc = selectedId ? (docs ?? []).find((d) => d._id === selectedId) as Doc | undefined : undefined;

  const inputStyle: React.CSSProperties = {
    background: "#0a0a0a",
    border: "1px solid #222",
    color: "#fff",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    width: "100%",
    outline: "none",
    fontFamily: "Inter, system-ui, sans-serif",
    boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 0 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ color: "#fff", fontWeight: 700, fontSize: 20, margin: 0 }}>Documents</h2>
        <p style={{ color: "#6B7280", fontSize: 12, marginTop: 4 }}>
          {docs?.length ?? 0} documents indexed · select to view
        </p>
      </div>

      <div style={{ display: "flex", gap: 16, flex: 1, minHeight: 0 }}>
        {/* ── Left sidebar ── */}
        <div
          style={{
            width: 280,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            background: "#111111",
            border: "1px solid #222222",
            borderRadius: 12,
            padding: 16,
            overflow: "hidden",
          }}
        >
          {/* Search */}
          <input
            type="text"
            placeholder="Search documents…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
          />

          {/* Project filter */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {projects.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedProject(p)}
                style={{
                  padding: "3px 10px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: selectedProject === p ? "1px solid #3b82f6" : "1px solid #222",
                  background: selectedProject === p ? "#1a2a4a" : "#0a0a0a",
                  color: selectedProject === p ? "#3b82f6" : "#6B7280",
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Document list */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {docs === undefined ? (
              <div style={{ color: "#4B5563", fontSize: 13, textAlign: "center", paddingTop: 24 }}>
                Loading…
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ color: "#4B5563", fontSize: 13, textAlign: "center", paddingTop: 24 }}>
                No documents found
              </div>
            ) : (
              Object.entries(grouped).map(([project, docList]) => (
                <div key={project} style={{ marginBottom: 16 }}>
                  <p style={{
                    color: "#6B7280",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "0 4px 6px",
                    margin: 0,
                    borderBottom: "1px solid #1a1a1a",
                    marginBottom: 6,
                  }}>
                    {project}
                  </p>
                  {docList.map((doc) => (
                    <button
                      key={doc._id}
                      onClick={() => setSelectedId(doc._id)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        background: selectedId === doc._id ? "#1a2a4a" : "none",
                        border: selectedId === doc._id ? "1px solid #3b82f630" : "1px solid transparent",
                        borderRadius: 8,
                        padding: "8px 10px",
                        cursor: "pointer",
                        marginBottom: 2,
                      }}
                    >
                      <div style={{
                        color: selectedId === doc._id ? "#3b82f6" : "#fff",
                        fontSize: 12,
                        fontWeight: 500,
                        marginBottom: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                        📄 {doc.title}
                      </div>
                      <div style={{ color: "#4B5563", fontSize: 10 }}>
                        {formatBytes(doc.size)} · {doc.type}
                      </div>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Right content panel ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "#111111",
            border: "1px solid #222222",
            borderRadius: 12,
            overflow: "hidden",
            minWidth: 0,
          }}
        >
          {selectedDoc ? (
            <>
              {/* Doc header */}
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #1e1e1e",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                  flexShrink: 0,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 15, margin: "0 0 4px" }}>
                    {selectedDoc.title}
                  </h3>
                  <p style={{ color: "#4B5563", fontSize: 11, margin: 0 }}>
                    {selectedDoc.path} · {formatBytes(selectedDoc.size)} · updated {formatDate(selectedDoc.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={() => downloadText(selectedDoc.content, selectedDoc.title.replace(/[^a-z0-9_\-.]/gi, "_") + ".txt")}
                  style={{
                    background: "#1a2a4a",
                    color: "#3b82f6",
                    border: "1px solid #3b82f630",
                    borderRadius: 8,
                    padding: "7px 14px",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  ⬇ Download
                </button>
              </div>

              {/* Content */}
              <pre
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "20px",
                  margin: 0,
                  fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                  fontSize: 12,
                  lineHeight: 1.7,
                  color: "#9CA3AF",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {selectedDoc.content}
              </pre>
            </>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 40 }}>📄</span>
              <p style={{ color: "#4B5563", fontSize: 14, margin: 0 }}>
                Select a document from the sidebar
              </p>
              {docs !== undefined && docs.length === 0 && (
                <p style={{ color: "#374151", fontSize: 12, margin: 0 }}>
                  No documents indexed yet. Run index-documents.mjs to sync.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
