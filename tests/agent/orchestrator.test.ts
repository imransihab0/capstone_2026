import { describe, expect, it } from "bun:test";
import { runPlanningAgent } from "../../src/agent/orchestrator.ts";
import { executeToolCall } from "../../src/agent/tools.ts";

describe("Agentic Planning Orchestrator & Approved Tool Registry", () => {
  it("rejects unauthorized tool calls outside approved whitelist (AI-04 Invariant)", async () => {
    const res = await executeToolCall("execute_arbitrary_shell_command", { cmd: "ls" });
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/Security Invariant Violated/);
  });

  it("identifies missing required parameters and interrogates farmer (AI-03 Invariant)", async () => {
    // Missing plotUnit, district, and budgetCap
    const result = await runPlanningAgent({
      userId: "u-farmer-1",
      cropGoal: "Boro Rice",
      plotArea: 1,
    });

    expect(result.status).toBe("needs_more_info");
    expect(result.missingFields).toContain("plotUnit");
    expect(result.missingFields).toContain("district");
    expect(result.missingFields).toContain("budgetCap");
    expect(result.interrogationPrompt).toBeDefined();
    expect(result.calendar.length).toBe(0);
  });

  it("executes complete planning loop with deterministic arithmetic & source citations (FR-05, AI-05, AI-06)", async () => {
    const result = await runPlanningAgent({
      userId: "u-farmer-1",
      cropGoal: "Boro Rice",
      plotArea: 1,
      plotUnit: "bigha",
      district: "Tangail",
      budgetCap: 8000,
      soilN: 48,
      soilP: 24,
      soilK: 38,
      soilPH: 6.4,
    });

    expect(result.status).toBe("ready_for_confirmation");
    expect(result.plotDetails).toBeDefined();
    expect(result.plotDetails?.entered).toBe("1 bigha");
    // 1 standard bigha = 0.133546 ha
    expect(result.plotDetails?.hectares).toBe(0.133546);

    // BARC 2024 Base for Boro Rice: 260 kg Urea/ha * 0.133546 ha = 34.72 kg
    expect(result.recommendedInputs?.ureaKg).toBe(34.72);
    expect(result.recommendedInputs?.citation).toContain("BARC Fertilizer Recommendation Guide 2024");

    // Check budget fitting (8000 Tk budget)
    expect(result.budgetEvaluation).toBeDefined();
    expect(result.budgetEvaluation?.budgetCap).toBe(8000);
    expect(result.budgetEvaluation?.isWithinBudget).toBe(true);

    // Verifiable citations recorded
    expect(result.sourcesCited.length).toBeGreaterThan(0);
    expect(result.sourcesCited.some((s) => s.includes("BARC"))).toBe(true);

    // Telemetry trace recorded
    expect(result.telemetry.totalSteps).toBe(4);
    expect(result.telemetry.steps.length).toBe(4);
    expect(result.telemetry.totalLatencyMs).toBeGreaterThan(0);
  });
});
