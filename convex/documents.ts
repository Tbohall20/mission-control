import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { project: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.project && args.project !== "All") {
      return await ctx.db
        .query("documents")
        .withIndex("by_project", (q) => q.eq("project", args.project!))
        .collect();
    }
    return await ctx.db.query("documents").collect();
  },
});

export const get = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const upsert = mutation({
  args: {
    title: v.string(),
    path: v.string(),
    project: v.string(),
    type: v.string(),
    content: v.string(),
    size: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("path"), args.path))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, updatedAt: Date.now() });
      return existing._id;
    }
    return await ctx.db.insert("documents", { ...args, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("documents").collect();
    for (const doc of all) await ctx.db.delete(doc._id);
    return { deleted: all.length };
  },
});
