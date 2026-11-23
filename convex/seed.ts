import { mutation } from "./_generated/server";
import { normalizeToHectares } from "../src/engine/landArea";
import { calculateNormalizedListing } from "../src/engine/pricing";

/**
 * Convex Database Seeding Mutation
 * Populates realistic initial users, crops, BARC guidelines, and marketplace retail products.
 */
export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Seed Users
    const existingUsers = await ctx.db.query("users").collect();
    if (existingUsers.length > 0) {
      return { message: "Database already seeded." };
    }

    const farmerId = await ctx.db.insert("users", {
      name: "Abul Kashem",
      email: "kashem@agrisense.bd",
      role: "farmer",
      phone: "+8801711223344",
      district: "Tangail",
      upazila: "Delduar",
      isVerified: true,
    });

    const sellerId = await ctx.db.insert("users", {
      name: "Bismillah Krishi Bhander",
      email: "bismillah@agrisense.bd",
      role: "seller",
      phone: "+8801811556677",
      district: "Tangail",
      upazila: "Delduar",
      isVerified: true,
    });

    const adminId = await ctx.db.insert("users", {
      name: "DAE Agriculture Extension Officer",
      email: "admin@dae.gov.bd",
      role: "admin",
      phone: "+8801911998877",
      district: "Tangail",
      upazila: "Delduar",
      isVerified: true,
    });

    // 2. Seed Plots
    const plotHectares = normalizeToHectares(1, "bigha", { district: "tangail" });
    const plotId = await ctx.db.insert("plots", {
      userId: farmerId,
      name: "Plot 1 (Char Field)",
      district: "Tangail",
      upazila: "Delduar",
      aezCode: "AEZ-8",
      areaEntered: 1,
      unitEntered: "bigha",
      areaHectares: plotHectares,
      soilN: 48,
      soilP: 24,
      soilK: 38,
      soilPH: 6.4,
    });

    // 3. Seed Crops
    const boroCropId = await ctx.db.insert("crops", {
      name: "Boro Rice (BRRI dhan28/29)",
      scientificName: "Oryza sativa",
      cropType: "cereal",
      sowingSeason: "rabi",
      sowingWindowStart: "11-15",
      sowingWindowEnd: "12-15",
      durationDays: 145,
      baseYieldPerHa: 6.2,
      recommendedInputs: [
        { inputType: "Urea", baseAmountPerHa: 260, unit: "kg", timing: "Split in 3 applications" },
        { inputType: "TSP", baseAmountPerHa: 110, unit: "kg", timing: "Basal application" },
        { inputType: "MoP", baseAmountPerHa: 140, unit: "kg", timing: "Basal & panicle initiation" },
        { inputType: "Gypsum", baseAmountPerHa: 75, unit: "kg", timing: "Basal application" },
        { inputType: "Seed", baseAmountPerHa: 40, unit: "kg", timing: "Seedbed" },
      ],
    });

    // 4. Seed Official BARC Guidelines (with mock vector embeddings)
    const mockVector = new Array(1536).fill(0.01);
    await ctx.db.insert("guidanceDocs", {
      docTitle: "BARC Fertilizer Recommendation Guide 2024",
      sourceOrg: "BARC",
      editionYear: 2024,
      section: "Section 4.1.2: Boro Rice High Yielding Variety",
      crop: "Boro Rice",
      aezCode: "AEZ-8",
      content: "For HYV Boro Rice in AEZ-8, apply per hectare: Urea 260 kg, TSP 110 kg, MoP 140 kg, Gypsum 75 kg. Apply all TSP, Gypsum, and 1/3 MoP basal. Split Urea equally at 20 DAT, 35 DAT, and 50 DAT.",
      embedding: mockVector,
    });

    // 5. Seed Retail Listings with Normalized Prices
    const sampleProducts = [
      {
        productName: "Carbofuran 3G (Small)",
        productType: "pesticide",
        brand: "Furadan",
        packSize: 250,
        packUnit: "g" as const,
        price: 180,
        deliveryCharge: 20,
      },
      {
        productName: "Carbofuran 3G (1kg Pack)",
        productType: "pesticide",
        brand: "Furadan",
        packSize: 1,
        packUnit: "kg" as const,
        price: 620,
        deliveryCharge: 60,
      },
      {
        productName: "Government Standard Urea (50kg)",
        productType: "urea",
        brand: "BCIC Standard",
        packSize: 50,
        packUnit: "kg" as const,
        price: 1350,
        deliveryCharge: 150,
      },
      {
        productName: "Triple Superphosphate TSP (25kg)",
        productType: "tsp",
        brand: "Kafco TSP",
        packSize: 25,
        packUnit: "kg" as const,
        price: 800,
        deliveryCharge: 100,
      },
    ];

    for (const prod of sampleProducts) {
      const calc = calculateNormalizedListing({
        id: "temp",
        sellerId,
        ...prod,
      });

      await ctx.db.insert("listings", {
        sellerId,
        productName: prod.productName,
        productType: prod.productType,
        brand: prod.brand,
        packSize: prod.packSize,
        packUnit: prod.packUnit,
        price: prod.price,
        deliveryCharge: prod.deliveryCharge,
        baseAmountNormalized: calc.baseAmount,
        pricePerUnit: calc.pricePerUnit,
        stockQuantity: 100,
        priceStatus: "fair",
        updatedAt: Date.now(),
      });
    }

    return {
      message: "Database seeded successfully with initial users, plots, crops, and listings.",
      farmerId,
      sellerId,
      plotId,
      boroCropId,
    };
  },
});
