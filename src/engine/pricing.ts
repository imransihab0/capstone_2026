/**
 * Agrisense: Deterministic Pricing & Unit Normalization Engine
 *
 * CRITICAL INVARIANT: ZERO LLM ARITHMETIC.
 * All common-unit price calculations, delivery fee aggregations, and basket budget fittings
 * are executed deterministically in code with full unit test coverage.
 */

export type PackUnit = "kg" | "g" | "L" | "ml" | "packet" | "bag" | "piece";
export type BaseUnit = "kg" | "L" | "piece";

export interface InputListing {
  id: string;
  sellerId: string;
  sellerName?: string;
  isVerifiedSeller?: boolean;
  productName: string;
  productType: string; // e.g. "urea", "tsp", "mop", "pesticide", "seed"
  brand: string;
  packSize: number;
  packUnit: PackUnit;
  price: number; // Listed price in BDT (Tk)
  deliveryCharge?: number; // Delivery fee in BDT (Tk), defaults to 0
  stockQuantity?: number;
}

export interface NormalizedListing extends InputListing {
  baseAmount: number; // In standard base unit (kg or L)
  baseUnit: BaseUnit;
  totalCost: number; // price + deliveryCharge
  pricePerUnit: number; // totalCost / baseAmount (e.g. Tk / kg, Tk / L)
  priceStatus?: "fair" | "overpriced" | "suspiciously_low" | "unverified";
}

export interface BasketItem {
  listingId: string;
  productType: string;
  productName: string;
  brand: string;
  quantityRequested: number; // Quantity of packs
  packSize: number;
  packUnit: PackUnit;
  unitPrice: number; // Listed price
  deliveryCharge: number;
  totalItemCost: number;
  baseAmountPerPack: number;
  totalBaseAmount: number;
  baseUnit: BaseUnit;
}

export interface BudgetEvaluationResult {
  totalCost: number;
  budgetCap: number;
  isWithinBudget: boolean;
  varianceAmount: number; // Positive = surplus, Negative = deficit
  variancePercentage: number;
  items: BasketItem[];
  cheaperAlternatives?: {
    originalItem: BasketItem;
    recommendedListing: NormalizedListing;
    potentialSavings: number;
    tradeOffNotes: string;
  }[];
}

/**
 * Normalizes any package size into standard international base units (kg, L, or piece).
 */
export function normalizePackSizeToBaseUnit(
  packSize: number,
  packUnit: PackUnit
): { baseAmount: number; baseUnit: BaseUnit } {
  if (packSize <= 0 || !Number.isFinite(packSize)) {
    throw new Error(`Invalid pack size: ${packSize}. Size must be a positive finite number.`);
  }

  switch (packUnit) {
    case "kg":
      return { baseAmount: packSize, baseUnit: "kg" };

    case "g":
      return { baseAmount: Number((packSize / 1000).toFixed(6)), baseUnit: "kg" };

    case "L":
      return { baseAmount: packSize, baseUnit: "L" };

    case "ml":
      return { baseAmount: Number((packSize / 1000).toFixed(6)), baseUnit: "L" };

    case "packet":
    case "bag":
    case "piece":
      return { baseAmount: packSize, baseUnit: "piece" };

    default: {
      const exhaustiveCheck: never = packUnit;
      throw new Error(`Unsupported pack unit: ${exhaustiveCheck}`);
    }
  }
}

/**
 * Calculates the exact price per common unit, inclusive of delivery fee.
 * Formula: (Listing Price + Delivery Charge) / (Pack Size converted to base unit)
 */
export function calculateNormalizedListing(listing: InputListing): NormalizedListing {
  const deliveryCharge = Math.max(0, listing.deliveryCharge || 0);
  const totalCost = Number((listing.price + deliveryCharge).toFixed(2));
  const { baseAmount, baseUnit } = normalizePackSizeToBaseUnit(listing.packSize, listing.packUnit);

  if (baseAmount <= 0) {
    throw new Error(`Base amount must be greater than zero for listing ${listing.id}`);
  }

  const pricePerUnit = Number((totalCost / baseAmount).toFixed(2));

  return {
    ...listing,
    deliveryCharge,
    totalCost,
    baseAmount,
    baseUnit,
    pricePerUnit,
  };
}

/**
 * Ranks an array of listings by real price per common unit (cheapest effective value first).
 */
export function rankListingsByCommonUnitPrice(listings: InputListing[]): NormalizedListing[] {
  const normalized = listings.map(calculateNormalizedListing);
  return normalized.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
}

/**
 * Checks if a unit price deviates significantly from benchmark/market rates.
 */
export function evaluatePriceStatus(
  pricePerUnit: number,
  benchmarkMedian: number,
  thresholds = { highVariance: 0.25, lowVariance: 0.4 }
): "fair" | "overpriced" | "suspiciously_low" {
  if (benchmarkMedian <= 0) return "fair";

  const diffRatio = (pricePerUnit - benchmarkMedian) / benchmarkMedian;

  if (diffRatio > thresholds.highVariance) {
    return "overpriced"; // > 25% above median
  }
  if (diffRatio < -thresholds.lowVariance) {
    return "suspiciously_low"; // > 40% below median (possible adulteration / fake)
  }
  return "fair";
}

/**
 * Deterministically evaluates a farmer's basket against their stated cash budget.
 * If over budget, scans alternative listings of identical product types to suggest cheaper swaps.
 */
export function evaluateBasketBudget(
  items: BasketItem[],
  budgetCap: number,
  catalogPool: InputListing[] = []
): BudgetEvaluationResult {
  const totalCost = Number(items.reduce((sum, item) => sum + item.totalItemCost, 0).toFixed(2));
  const varianceAmount = Number((budgetCap - totalCost).toFixed(2));
  const variancePercentage = budgetCap > 0 ? Number(((varianceAmount / budgetCap) * 100).toFixed(2)) : 0;
  const isWithinBudget = totalCost <= budgetCap;

  const cheaperAlternatives: BudgetEvaluationResult["cheaperAlternatives"] = [];

  if (!isWithinBudget && catalogPool.length > 0) {
    for (const item of items) {
      // Find listings with same product type that have lower price per unit
      const normalizedPool = catalogPool
        .filter((l) => l.productType.toLowerCase() === item.productType.toLowerCase() && l.id !== item.listingId)
        .map(calculateNormalizedListing)
        .sort((a, b) => a.pricePerUnit - b.pricePerUnit);

      const bestAlt = normalizedPool[0];
      if (bestAlt) {
        // Calculate potential cost for equivalent quantity
        const neededBaseAmount = item.totalBaseAmount;
        const packsNeeded = Math.ceil(neededBaseAmount / bestAlt.baseAmount);
        const altTotalCost = packsNeeded * bestAlt.totalCost;

        if (altTotalCost < item.totalItemCost) {
          const savings = Number((item.totalItemCost - altTotalCost).toFixed(2));
          cheaperAlternatives.push({
            originalItem: item,
            recommendedListing: bestAlt,
            potentialSavings: savings,
            tradeOffNotes: `Swapping to ${bestAlt.brand} (${bestAlt.packSize} ${bestAlt.packUnit}) saves Tk ${savings}. Requires buying ${packsNeeded} packs.`,
          });
        }
      }
    }
  }

  return {
    totalCost,
    budgetCap,
    isWithinBudget,
    varianceAmount,
    variancePercentage,
    items,
    cheaperAlternatives: cheaperAlternatives.length > 0 ? cheaperAlternatives : undefined,
  };
}
