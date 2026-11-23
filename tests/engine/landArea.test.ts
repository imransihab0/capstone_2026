import { describe, expect, it } from "bun:test";
import {
  convertHectaresToUnit,
  DISTRICT_BIGHA_VARIATIONS,
  formatPlotSummary,
  normalizeToHectares,
} from "../../src/engine/landArea.ts";

describe("Land Area Conversion Engine (Zero LLM Arithmetic)", () => {
  it("correctly converts 1 hectare to 1 hectare", () => {
    expect(normalizeToHectares(1, "hectare")).toBe(1);
    expect(convertHectaresToUnit(1, "hectare")).toBe(1);
  });

  it("converts 1 acre to hectares accurately", () => {
    // 1 acre = 0.404686 hectares
    const ha = normalizeToHectares(1, "acre");
    expect(ha).toBe(0.404686);
    expect(convertHectaresToUnit(ha, "acre")).toBeCloseTo(1, 4);
  });

  it("converts 100 decimals (1 acre) to hectares accurately", () => {
    const fromAcre = normalizeToHectares(1, "acre");
    const fromDecimals = normalizeToHectares(100, "decimal");
    expect(fromDecimals).toBe(fromAcre);
    expect(fromDecimals).toBe(0.404686);
  });

  it("converts standard Bengal Bigha (33 decimals) to hectares", () => {
    // 33 decimal = 33 * 0.0040468564224 = 0.133546 ha
    const ha = normalizeToHectares(1, "bigha");
    expect(ha).toBe(0.133546);
    expect(convertHectaresToUnit(ha, "bigha")).toBeCloseTo(1, 4);
  });

  it("converts 1 katha (1/20 standard bigha = 1.65 decimal) to hectares", () => {
    const oneBighaHa = normalizeToHectares(1, "bigha");
    const twentyKathaHa = normalizeToHectares(20, "katha");
    expect(twentyKathaHa).toBeCloseTo(oneBighaHa, 5);
  });

  it("respects regional bigha variations (e.g., Dinajpur 50-decimal bigha)", () => {
    const standardHa = normalizeToHectares(1, "bigha", { district: "tangail" });
    const dinajpurHa = normalizeToHectares(1, "bigha", { district: "dinajpur" });

    expect(standardHa).toBe(0.133546);
    // 50 decimals * 0.0040468564224 = 0.202343 ha
    expect(dinajpurHa).toBe(0.202343);
    expect(dinajpurHa).toBeGreaterThan(standardHa);
  });

  it("handles zero area gracefully", () => {
    expect(normalizeToHectares(0, "bigha")).toBe(0);
    expect(convertHectaresToUnit(0, "acre")).toBe(0);
  });

  it("throws descriptive errors for negative or invalid area inputs", () => {
    expect(() => normalizeToHectares(-5, "bigha")).toThrow(/Invalid land area/);
    expect(() => normalizeToHectares(NaN, "decimal")).toThrow(/Invalid land area/);
  });

  it("formats plot summary correctly", () => {
    const summary = formatPlotSummary(1, "bigha");
    expect(summary.entered).toBe("1 bigha");
    expect(summary.hectares).toBe(0.133546);
    expect(summary.formatted).toBe("1 bigha (~0.133546 ha)");
  });
});
