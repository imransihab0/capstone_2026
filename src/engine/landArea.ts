/**
 * Agrisense: Deterministic Land Area Conversion Engine
 *
 * CRITICAL INVARIANT: ZERO LLM ARITHMETIC.
 * All conversions between Bangladeshi local land units (Bigha, Katha, Decimal, Acre)
 * and international agricultural standard units (Hectares) must execute through this engine.
 */

export type LandUnit = "bigha" | "katha" | "decimal" | "acre" | "hectare";

export interface DistrictLandCustom {
  district: string;
  decimalsPerBigha: number;
}

// District variations in Bangladesh (defaults to standard 33 decimal bigha)
export const DISTRICT_BIGHA_VARIATIONS: Record<string, number> = {
  standard: 33,
  dinajpur: 50,
  rajshahi: 50,
  bogura: 33,
  tangail: 33,
  mymensingh: 33,
  rangpur: 33,
  comilla: 33,
  jashore: 33,
  kushtia: 33,
  sylhet: 33,
  barishal: 33,
  dhaka: 33,
};

// Exact metric conversion constants
export const HECTARE_IN_SQ_METERS = 10000;
export const ACRE_IN_SQ_METERS = 4046.8564224;
export const DECIMAL_IN_SQ_METERS = 40.468564224;
export const ACRE_TO_HECTARES = ACRE_IN_SQ_METERS / HECTARE_IN_SQ_METERS; // 0.40468564224
export const DECIMAL_TO_HECTARES = DECIMAL_IN_SQ_METERS / HECTARE_IN_SQ_METERS; // 0.0040468564224

export interface ConversionOptions {
  district?: string;
  customDecimalsPerBigha?: number;
  precision?: number;
}

/**
 * Normalizes any Bangladeshi land unit into hectares (ha).
 *
 * @param amount Number of units entered by the farmer
 * @param unit One of 'bigha', 'katha', 'decimal', 'acre', 'hectare'
 * @param options Optional district variation or precision setting
 * @returns Normalized area in hectares (ha)
 */
export function normalizeToHectares(
  amount: number,
  unit: LandUnit,
  options: ConversionOptions = {}
): number {
  if (amount < 0 || !Number.isFinite(amount)) {
    throw new Error(`Invalid land area amount: ${amount}. Amount must be a positive finite number.`);
  }

  if (amount === 0) return 0;

  const decimalsPerBigha =
    options.customDecimalsPerBigha ||
    (options.district && DISTRICT_BIGHA_VARIATIONS[options.district.toLowerCase()]) ||
    DISTRICT_BIGHA_VARIATIONS.standard;

  let hectares: number;

  switch (unit) {
    case "hectare":
      hectares = amount;
      break;

    case "acre":
      hectares = amount * ACRE_TO_HECTARES;
      break;

    case "decimal":
      hectares = amount * DECIMAL_TO_HECTARES;
      break;

    case "bigha": {
      const totalDecimals = amount * decimalsPerBigha;
      hectares = totalDecimals * DECIMAL_TO_HECTARES;
      break;
    }

    case "katha": {
      // 1 bigha = 20 katha => 1 katha = decimalsPerBigha / 20
      const decimalsPerKatha = decimalsPerBigha / 20;
      const totalDecimals = amount * decimalsPerKatha;
      hectares = totalDecimals * DECIMAL_TO_HECTARES;
      break;
    }

    default: {
      const exhaustiveCheck: never = unit;
      throw new Error(`Unsupported land unit: ${exhaustiveCheck}`);
    }
  }

  const precision = options.precision !== undefined ? options.precision : 6;
  return Number(hectares.toFixed(precision));
}

/**
 * Converts hectares back into any target land unit.
 *
 * @param hectares Land area in hectares
 * @param targetUnit Desired target unit
 * @param options Optional district variation or precision setting
 * @returns Converted amount in the target unit
 */
export function convertHectaresToUnit(
  hectares: number,
  targetUnit: LandUnit,
  options: ConversionOptions = {}
): number {
  if (hectares < 0 || !Number.isFinite(hectares)) {
    throw new Error(`Invalid hectare amount: ${hectares}. Amount must be a positive finite number.`);
  }

  if (hectares === 0) return 0;

  const decimalsPerBigha =
    options.customDecimalsPerBigha ||
    (options.district && DISTRICT_BIGHA_VARIATIONS[options.district.toLowerCase()]) ||
    DISTRICT_BIGHA_VARIATIONS.standard;

  let result: number;

  switch (targetUnit) {
    case "hectare":
      result = hectares;
      break;

    case "acre":
      result = hectares / ACRE_TO_HECTARES;
      break;

    case "decimal":
      result = hectares / DECIMAL_TO_HECTARES;
      break;

    case "bigha": {
      const totalDecimals = hectares / DECIMAL_TO_HECTARES;
      result = totalDecimals / decimalsPerBigha;
      break;
    }

    case "katha": {
      const decimalsPerKatha = decimalsPerBigha / 20;
      const totalDecimals = hectares / DECIMAL_TO_HECTARES;
      result = totalDecimals / decimalsPerKatha;
      break;
    }

    default: {
      const exhaustiveCheck: never = targetUnit;
      throw new Error(`Unsupported target unit: ${exhaustiveCheck}`);
    }
  }

  const precision = options.precision !== undefined ? options.precision : 4;
  return Number(result.toFixed(precision));
}

/**
 * Formats a land area with human-readable localized labeling and the normalized hectare equivalent.
 */
export function formatPlotSummary(
  amount: number,
  unit: LandUnit,
  options: ConversionOptions = {}
): {
  entered: string;
  hectares: number;
  formatted: string;
} {
  const hectares = normalizeToHectares(amount, unit, options);
  const entered = `${amount} ${unit}`;
  const formatted = `${entered} (~${hectares} ha)`;
  return { entered, hectares, formatted };
}
