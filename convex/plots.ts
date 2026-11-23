import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { normalizeToHectares, type LandUnit } from "../src/engine/landArea";

/**
 * Mutation to create a new plot record with deterministic hectare normalization.
 */
export const createPlot = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    district: v.string(),
    upazila: v.string(),
    aezCode: v.string(),
    areaEntered: v.number(),
    unitEntered: v.union(
      v.literal("bigha"),
      v.literal("katha"),
      v.literal("decimal"),
      v.literal("acre"),
      v.literal("hectare")
    ),
    soilN: v.optional(v.number()),
    soilP: v.optional(v.number()),
    soilK: v.optional(v.number()),
    soilPH: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // CRITICAL: Area conversion is calculated strictly deterministically in code
    const areaHectares = normalizeToHectares(args.areaEntered, args.unitEntered as LandUnit, {
      district: args.district,
    });

    const plotId = await ctx.db.insert("plots", {
      userId: args.userId,
      name: args.name,
      district: args.district,
      upazila: args.upazila,
      aezCode: args.aezCode,
      areaEntered: args.areaEntered,
      unitEntered: args.unitEntered,
      areaHectares,
      soilN: args.soilN,
      soilP: args.soilP,
      soilK: args.soilK,
      soilPH: args.soilPH,
    });

    return { plotId, areaHectares };
  },
});

/**
 * Query to fetch all plots belonging to a specific farmer.
 */
export const getFarmerPlots = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("plots")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

/**
 * Query to fetch a single plot by ID.
 */
export const getPlotById = query({
  args: {
    plotId: v.id("plots"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.plotId);
  },
});
