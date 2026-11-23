import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Mutation to record a non-financial order request from farmer to seller.
 * Note: Scope boundary strictly omits online payment processing in this release.
 */
export const createOrderRequest = mutation({
  args: {
    farmerId: v.id("users"),
    sellerId: v.id("users"),
    listingId: v.id("listings"),
    quantity: v.number(),
    deliveryAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    if (!listing) {
      throw new Error("Listing not found.");
    }

    const totalAmount = (listing.price + listing.deliveryCharge) * args.quantity;

    const orderId = await ctx.db.insert("orderRequests", {
      farmerId: args.farmerId,
      sellerId: args.sellerId,
      listingId: args.listingId,
      quantity: args.quantity,
      totalAmount,
      status: "pending",
      deliveryAddress: args.deliveryAddress,
      createdAt: Date.now(),
    });

    return { orderId, totalAmount, status: "pending" };
  },
});

export const getOrdersByFarmer = query({
  args: {
    farmerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orderRequests")
      .withIndex("by_farmer", (q) => q.eq("farmerId", args.farmerId))
      .collect();
  },
});

export const getOrdersBySeller = query({
  args: {
    sellerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orderRequests")
      .withIndex("by_seller", (q) => q.eq("sellerId", args.sellerId))
      .collect();
  },
});
