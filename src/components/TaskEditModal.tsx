"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
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

type Props = {
  task: Task;
  onClose: () => void;
};

export default function TaskEditModal({ task, onClose }: Props) {
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState<Task["status"]>(task.status);
  const [priority, setPriority] = useState<Task["priority"]>(task.priority);
  const [assignee, setAssignee] = useState(task.assignee);
  const [project, setProject] = useState(task.project);
  const [notes, setNotes] = useState(task.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const updateTask = useMutation(api.tasks.updateTask);
  const deleteTask = useMutation(api.tasks.deleteTask);

  const handleSave = async () => {
    if (!title.trim()) { setError("Title cannot be empty."); return; }
    setSaving(true);
    setError("");
    try {
      await updateTask({ id: task._id, title: title.trim(), status, priority, assignee: assignee.trim(), project: project.trim(), notes: notes.trim() });
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this task? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await deleteTask({ id: task._id });
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setDeleting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: "#0a0a0a",
    border: "1px solid #333",
    color: "#fff",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 14,
    width: "100%",
    outline: "none",
    fontFamily: "Inter, system-ui, sans-serif",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: 4,
    display: "block",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#111111",
          border: "1px solid #222222",
          borderRadius: 16,
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px 16px",
            borderBottom: "1px solid #1e1e1e",
          }}
        >
          <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 16, margin: 0 }}>Edit Task</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#6B7280",
              cursor: "pointer",
              fontSize: 20,
              lineHeight: 1,
              padding: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
              placeholder="Task title"
            />
          </div>

          {/* Status + Priority row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Task["status"])}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task["priority"])}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Assignee + Project row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Assignee</label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                style={inputStyle}
                placeholder="e.g. Axiom"
              />
            </div>
            <div>
              <label style={labelStyle}>Project</label>
              <input
                type="text"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                style={inputStyle}
                placeholder="e.g. Clawdraft"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              style={{
                ...inputStyle,
                resize: "vertical",
                minHeight: 80,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
              placeholder="Additional context, links, blockers…"
            />
          </div>

          {/* Error */}
          {error && (
            <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{error}</p>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                flex: 1,
                background: saving ? "#1a2a4a" : "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 0",
                fontSize: 14,
                fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
                transition: "background 0.15s",
              }}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                background: "none",
                color: deleting ? "#6B7280" : "#ef4444",
                border: "1px solid #ef444440",
                borderRadius: 8,
                padding: "10px 16px",
                fontSize: 14,
                fontWeight: 600,
                cursor: deleting ? "not-allowed" : "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
            <button
              onClick={onClose}
              style={{
                background: "none",
                color: "#9CA3AF",
                border: "1px solid #222222",
                borderRadius: 8,
                padding: "10px 16px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
