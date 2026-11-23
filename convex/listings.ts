import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  calculateNormalizedListing,
  type InputListing,
  type PackUnit,
} from "../src/engine/pricing";

/**
 * Mutation for input retailers to create or update product listings.
 * Automatically computes base amount and price per common unit (Tk/kg or Tk/L) inclusive of delivery.
 */
export const createListing = mutation({
  args: {
    sellerId: v.id("users"),
    productName: v.string(),
    productType: v.string(), // e.g., "urea", "tsp", "mop", "pesticide", "seed"
    brand: v.string(),
    packSize: v.number(),
    packUnit: v.string(), // "kg", "g", "L", "ml", "packet"
    price: v.number(),
    deliveryCharge: v.number(),
    stockQuantity: v.number(),
  },
  handler: async (ctx, args) => {
    // Normalization logic executes deterministically
    const listingCalc = calculateNormalizedListing({
      id: "temp",
      sellerId: args.sellerId,
      productName: args.productName,
      productType: args.productType,
      brand: args.brand,
      packSize: args.packSize,
      packUnit: args.packUnit as PackUnit,
      price: args.price,
      deliveryCharge: args.deliveryCharge,
    });

    const listingId = await ctx.db.insert("listings", {
      sellerId: args.sellerId,
      productName: args.productName,
      productType: args.productType,
      brand: args.brand,
      packSize: args.packSize,
      packUnit: args.packUnit,
      price: args.price,
      deliveryCharge: args.deliveryCharge,
      baseAmountNormalized: listingCalc.baseAmount,
      pricePerUnit: listingCalc.pricePerUnit,
      stockQuantity: args.stockQuantity,
      priceStatus: "unverified",
      updatedAt: Date.now(),
    });

    return {
      listingId,
      pricePerUnit: listingCalc.pricePerUnit,
      baseAmount: listingCalc.baseAmount,
    };
  },
});

/**
 * Query to fetch listings for a product type, ordered by real price per unit (cheapest value first).
 */
export const getRankedListingsByType = query({
  args: {
    productType: v.string(),
  },
  handler: async (ctx, args) => {
    const listings = await ctx.db
      .query("listings")
      .withIndex("by_price_per_unit", (q) => q.eq("productType", args.productType))
      .collect();

    // Convex returns them sorted by index [productType, pricePerUnit] ascending
    return listings;
  },
});

/**
 * Query to fetch all active retail listings.
 */
export const getAllListings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("listings").collect();
  },
});
