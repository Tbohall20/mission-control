import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsert = mutation({
  args: {
    type: v.union(v.literal("morning"), v.literal("evening"), v.literal("markets")),
    date: v.string(),
    rawText: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("briefings")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        date: args.date,
        rawText: args.rawText,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("briefings", {
        type: args.type,
        date: args.date,
        rawText: args.rawText,
        updatedAt: Date.now(),
      });
    }
  },
});

export const getLatest = query({
  args: {
    type: v.union(v.literal("morning"), v.literal("evening"), v.literal("markets")),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("briefings")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .first();
  },
});
