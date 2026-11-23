import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Mutation to record an end-to-end agent execution trace for telemetry and capstone evaluation.
 */
export const recordAgentRun = mutation({
  args: {
    userId: v.id("users"),
    sessionId: v.string(),
    userGoal: v.string(),
    toolCalls: v.array(
      v.object({
        toolName: v.string(),
        arguments: v.string(),
        durationMs: v.number(),
        success: v.boolean(),
      })
    ),
    retrievedDocs: v.array(v.id("guidanceDocs")),
    totalLatencyMs: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("agentLogs", {
      userId: args.userId,
      sessionId: args.sessionId,
      userGoal: args.userGoal,
      toolCalls: args.toolCalls,
      retrievedDocs: args.retrievedDocs,
      totalLatencyMs: args.totalLatencyMs,
      timestamp: Date.now(),
    });
  },
});

/**
 * Query to fetch recent agent execution logs for a user/admin.
 */
export const getAgentLogs = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agentLogs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(20);
  },
});
