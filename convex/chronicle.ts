import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("chronicle").collect();
    if (rows.length === 0) return null;
    // Return the most recently updated entry
    return rows.sort((a, b) => b.updatedAt - a.updatedAt)[0];
  },
});

export const upsert = mutation({
  args: {
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("chronicle").collect();
    const now = Date.now();
    if (existing.length === 0) {
      return await ctx.db.insert("chronicle", {
        content: args.content,
        updatedAt: now,
      });
    }
    // Update the first (only) entry
    await ctx.db.patch(existing[0]._id, {
      content: args.content,
      updatedAt: now,
    });
    return existing[0]._id;
  },
});
