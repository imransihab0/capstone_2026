import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Mutation to save a seasonal crop plan.
 * INVARIANT: Requires explicit user confirmation gate before persisting.
 */
export const saveSeasonalPlan = mutation({
  args: {
    farmerId: v.id("users"),
    plotId: v.id("plots"),
    cropId: v.id("crops"),
    targetSeason: v.string(),
    budget: v.number(),
    totalEstimatedCost: v.number(),
    userConfirmed: v.boolean(),
    calendar: v.array(
      v.object({
        stage: v.string(),
        date: v.string(),
        action: v.string(),
        adviceSource: v.string(),
      })
    ),
    requiredInputs: v.array(
      v.object({
        productType: v.string(),
        requiredQuantity: v.number(),
        unit: v.string(),
        estimatedCost: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    if (!args.userConfirmed) {
      throw new Error("Safety Invariant: Seasonal plan cannot be saved without explicit farmer confirmation.");
    }

    const planId = await ctx.db.insert("seasonalPlans", {
      farmerId: args.farmerId,
      plotId: args.plotId,
      cropId: args.cropId,
      targetSeason: args.targetSeason,
      budget: args.budget,
      totalEstimatedCost: args.totalEstimatedCost,
      status: "confirmed",
      calendar: args.calendar,
      requiredInputs: args.requiredInputs,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { planId, status: "confirmed" };
  },
});

/**
 * Query to fetch all seasonal plans for a farmer.
 */
export const getFarmerPlans = query({
  args: {
    farmerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("seasonalPlans")
      .withIndex("by_farmer", (q) => q.eq("farmerId", args.farmerId))
      .collect();
  },
});
