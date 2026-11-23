import { describe, expect, it } from "bun:test";
import {
  calculateNormalizedListing,
  evaluateBasketBudget,
  evaluatePriceStatus,
  normalizePackSizeToBaseUnit,
  rankListingsByCommonUnitPrice,
  type BasketItem,
  type InputListing,
} from "../../src/engine/pricing.ts";

describe("Pricing & Unit Normalization Engine (Zero LLM Arithmetic)", () => {
  it("normalizes pack units to base units accurately", () => {
    expect(normalizePackSizeToBaseUnit(500, "g")).toEqual({ baseAmount: 0.5, baseUnit: "kg" });
    expect(normalizePackSizeToBaseUnit(250, "ml")).toEqual({ baseAmount: 0.25, baseUnit: "L" });
    expect(normalizePackSizeToBaseUnit(50, "kg")).toEqual({ baseAmount: 50, baseUnit: "kg" });
    expect(normalizePackSizeToBaseUnit(1, "L")).toEqual({ baseAmount: 1, baseUnit: "L" });
  });

  it("solves Proposal Scenario P1: comparing 250g packet at Tk 180 vs 1kg packet at Tk 620", () => {
    const listingSmall: InputListing = {
      id: "l-small",
      sellerId: "s-1",
      productName: "Carbofuran Granules",
      productType: "pesticide",
      brand: "Furadan",
      packSize: 250,
      packUnit: "g",
      price: 180,
      deliveryCharge: 20, // Total = 200 Tk for 0.25 kg -> 800 Tk / kg
    };

    const listingLarge: InputListing = {
      id: "l-large",
      sellerId: "s-2",
      productName: "Carbofuran Granules",
      productType: "pesticide",
      brand: "Furadan",
      packSize: 1,
      packUnit: "kg",
      price: 620,
      deliveryCharge: 60, // Total = 680 Tk for 1.0 kg -> 680 Tk / kg
    };

    const normSmall = calculateNormalizedListing(listingSmall);
    const normLarge = calculateNormalizedListing(listingLarge);

    expect(normSmall.totalCost).toBe(200);
    expect(normSmall.pricePerUnit).toBe(800); // 800 Tk/kg

    expect(normLarge.totalCost).toBe(680);
    expect(normLarge.pricePerUnit).toBe(680); // 680 Tk/kg

    // The 1kg packet is cheaper per kg despite higher upfront price
    const ranked = rankListingsByCommonUnitPrice([listingSmall, listingLarge]);
    expect(ranked[0].id).toBe("l-large");
    expect(ranked[1].id).toBe("l-small");
  });

  it("detects price anomalies (>25% overpriced or >40% suspiciously low)", () => {
    const medianBenchmark = 800; // Tk / kg
    expect(evaluatePriceStatus(820, medianBenchmark)).toBe("fair");
    expect(evaluatePriceStatus(1100, medianBenchmark)).toBe("overpriced"); // +37.5%
    expect(evaluatePriceStatus(400, medianBenchmark)).toBe("suspiciously_low"); // -50%
  });

  it("evaluates a basket against budget and suggests cheaper alternatives when over budget", () => {
    const basket: BasketItem[] = [
      {
        listingId: "l-expensive",
        productType: "urea",
        productName: "Urea Fertilizer",
        brand: "Brand A",
        quantityRequested: 2,
        packSize: 50,
        packUnit: "kg",
        unitPrice: 1500,
        deliveryCharge: 100,
        totalItemCost: 3200, // 2 * 1600
        baseAmountPerPack: 50,
        totalBaseAmount: 100,
        baseUnit: "kg",
      },
    ];

    const catalogPool: InputListing[] = [
      {
        id: "l-cheaper",
        sellerId: "s-3",
        productName: "Standard Government Dealer Urea",
        productType: "urea",
        brand: "Govt Subsidized",
        packSize: 50,
        packUnit: "kg",
        price: 1350,
        deliveryCharge: 50, // Total 1400 per 50kg bag
      },
    ];

    // Budget is 3000 Tk, but basket is 3200 Tk (over by 200 Tk)
    const result = evaluateBasketBudget(basket, 3000, catalogPool);

    expect(result.isWithinBudget).toBe(false);
    expect(result.varianceAmount).toBe(-200);
    expect(result.cheaperAlternatives).toBeDefined();
    expect(result.cheaperAlternatives?.length).toBe(1);
    expect(result.cheaperAlternatives![0].potentialSavings).toBe(400); // 3200 - (2 * 1400) = 400 Tk
  });
});
