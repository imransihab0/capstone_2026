import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 1. Users & RBAC
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("farmer"), v.literal("seller"), v.literal("admin")),
    phone: v.string(),
    district: v.string(),
    upazila: v.string(),
    isVerified: v.boolean(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  // 2. Farmer Plots & Land Dimensions
  plots: defineTable({
    userId: v.id("users"),
    name: v.string(),
    district: v.string(),
    upazila: v.string(),
    aezCode: v.string(), // Agro-Ecological Zone (e.g., 'AEZ-8', 'AEZ-9')
    areaEntered: v.number(),
    unitEntered: v.union(
      v.literal("bigha"),
      v.literal("katha"),
      v.literal("decimal"),
      v.literal("acre"),
      v.literal("hectare")
    ),
    areaHectares: v.number(), // Normalized strictly in backend code
    soilN: v.optional(v.number()), // Nitrogen mg/kg
    soilP: v.optional(v.number()), // Phosphorus mg/kg
    soilK: v.optional(v.number()), // Potassium mg/kg
    soilPH: v.optional(v.number()), // pH value (e.g. 6.5)
  }).index("by_user", ["userId"]),

  // 3. Supported Crops & Botanical Guidelines
  crops: defineTable({
    name: v.string(),
    scientificName: v.optional(v.string()),
    cropType: v.string(), // cereal, vegetable, pulse, cash_crop
    sowingSeason: v.union(v.literal("kharif-1"), v.literal("kharif-2"), v.literal("rabi")),
    sowingWindowStart: v.string(), // ISO date or month-day
    sowingWindowEnd: v.string(),
    durationDays: v.number(),
    baseYieldPerHa: v.number(), // in metric tons
    recommendedInputs: v.array(
      v.object({
        inputType: v.string(),
        baseAmountPerHa: v.number(),
        unit: v.string(),
        timing: v.string(),
      })
    ),
  }),

  // 4. Official Guidance Corpus with Semantic Vector Index
  guidanceDocs: defineTable({
    docTitle: v.string(), // e.g. "BARC Fertilizer Recommendation Guide 2024"
    sourceOrg: v.string(), // "BARC", "BRRI", "DAE"
    editionYear: v.number(),
    section: v.string(),
    crop: v.string(),
    aezCode: v.string(),
    content: v.string(),
    embedding: v.array(v.float64()),
  })
    .index("by_aez_crop", ["aezCode", "crop"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["aezCode", "crop"],
    }),

  // 5. Retail Marketplace Input Listings
  listings: defineTable({
    sellerId: v.id("users"),
    productName: v.string(),
    productType: v.string(), // urea, tsp, mop, dap, pesticide, seed
    brand: v.string(),
    packSize: v.number(),
    packUnit: v.string(), // kg, g, L, ml, packet
    price: v.number(), // BDT Tk advertised
    deliveryCharge: v.number(), // BDT Tk
    baseAmountNormalized: v.number(), // In standard base unit (kg or L)
    pricePerUnit: v.number(), // (price + deliveryCharge) / baseAmountNormalized
    stockQuantity: v.number(),
    priceStatus: v.union(
      v.literal("fair"),
      v.literal("overpriced"),
      v.literal("suspiciously_low"),
      v.literal("unverified")
    ),
    updatedAt: v.number(),
  })
    .index("by_product_type", ["productType"])
    .index("by_price_per_unit", ["productType", "pricePerUnit"]),

  // 6. Costed Seasonal Plans
  seasonalPlans: defineTable({
    farmerId: v.id("users"),
    plotId: v.id("plots"),
    cropId: v.id("crops"),
    targetSeason: v.string(),
    budget: v.number(),
    totalEstimatedCost: v.number(),
    status: v.union(v.literal("draft"), v.literal("confirmed"), v.literal("completed")),
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
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_farmer", ["farmerId"]),

  // 7. Full Telemetry Logging for Agent Executions
  agentLogs: defineTable({
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
    timestamp: v.number(),
  }).index("by_user", ["userId"]),

  // 8. Non-Financial Order Requests
  orderRequests: defineTable({
    farmerId: v.id("users"),
    sellerId: v.id("users"),
    listingId: v.id("listings"),
    quantity: v.number(),
    totalAmount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("fulfilled"),
      v.literal("cancelled")
    ),
    deliveryAddress: v.string(),
    createdAt: v.number(),
  })
    .index("by_farmer", ["farmerId"])
    .index("by_seller", ["sellerId"]),
});
