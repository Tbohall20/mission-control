import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    assignee: v.string(),
    project: v.string(),
    priority: v.union(v.literal("High"), v.literal("Medium"), v.literal("Low")),
    status: v.union(
      v.literal("Todo"),
      v.literal("In Progress"),
      v.literal("Done")
    ),
    createdAt: v.number(),
  }).index("by_project", ["project"]).index("by_status", ["status"]),

  memories: defineTable({
    title: v.string(),
    summary: v.string(),
    tags: v.array(v.string()),
    project: v.string(),
    createdAt: v.number(),
  }).index("by_project", ["project"]),

  agents: defineTable({
    name: v.string(),
    role: v.string(),
    project: v.string(),
    status: v.union(
      v.literal("Active"),
      v.literal("Idle"),
      v.literal("Building")
    ),
    responsibilities: v.array(v.string()),
    currentActivity: v.string(),
  }).index("by_project", ["project"]),

  logs: defineTable({
    timestamp: v.number(),
    project: v.string(),
    agentName: v.string(),
    action: v.string(),
  }).index("by_project", ["project"]).index("by_timestamp", ["timestamp"]),

  products: defineTable({
    name: v.string(),
    status: v.union(
      v.literal("Idea"),
      v.literal("Building"),
      v.literal("Launched")
    ),
    pricing: v.string(),
    valueProp: v.string(),
    liveLink: v.optional(v.string()),
    signups: v.number(),
    revenue: v.number(),
    slotsRemaining: v.optional(v.number()),
    phase: v.union(
      v.literal("Idea"),
      v.literal("Building"),
      v.literal("Soft Launch"),
      v.literal("Live"),
      v.literal("Scaling")
    ),
  }),
});
