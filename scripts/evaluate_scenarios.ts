/**
 * Agrisense: End-to-End Capstone Evaluation Scenario Runner (AI-08)
 *
 * Evaluates the 5 mandatory Capstone testing scenarios:
 * 1. Happy Path Planning: Boro Rice on 1 bigha in Tangail with Tk 8,000 budget.
 * 2. Parameter Interrogation: Incomplete farmer prompt requesting missing details.
 * 3. Budget Variance: Over-budget basket triggering cheaper alternatives.
 * 4. Price Anomaly Check: Detecting overpriced vs suspiciously low listings.
 * 5. Security Guardrail: Rejecting tool calls outside the approved server whitelist.
 */

import { runPlanningAgent } from "../src/agent/orchestrator";
import { executeToolCall } from "../src/agent/tools";
import { evaluatePriceStatus } from "../src/engine/pricing";

async function runEvaluationSuite() {
  console.log("======================================================================");
  console.log("🌾 AGRISENSE CAPSTONE EVALUATION BENCHMARK SUITE (SE-331 / AI-08)");
  console.log("======================================================================\n");

  const results: { scenario: string; passed: boolean; latencyMs: number; notes: string }[] = [];

  // Scenario 1: Happy Path Planning
  console.log("▶ Running Scenario 1: Complete Seasonal Planning for Boro Rice in Tangail...");
  const s1Start = Date.now();
  const s1 = await runPlanningAgent({
    userId: "eval-farmer-1",
    cropGoal: "Boro Rice",
    plotArea: 1,
    plotUnit: "bigha",
    district: "Tangail",
    budgetCap: 8000,
  });
  const s1Latency = Date.now() - s1Start;
  const s1Pass =
    s1.status === "ready_for_confirmation" &&
    s1.recommendedInputs?.ureaKg === 34.72 &&
    s1.sourcesCited.some((s) => s.includes("BARC")) &&
    s1Latency < 5000;

  results.push({
    scenario: "Scenario 1: Happy Path Season Planning (1 Bigha Boro Rice)",
    passed: s1Pass,
    latencyMs: s1Latency,
    notes: `Urea: ${s1.recommendedInputs?.ureaKg}kg | Sources: ${s1.sourcesCited.length} | Latency: ${s1Latency}ms (Target: <5000ms)`,
  });

  // Scenario 2: Parameter Interrogation for Incomplete Prompts
  console.log("▶ Running Scenario 2: Parameter Interrogation (Missing district & budget)...");
  const s2Start = Date.now();
  const s2 = await runPlanningAgent({
    userId: "eval-farmer-2",
    cropGoal: "Boro Rice",
    plotArea: 2,
    // Missing plotUnit, district, budgetCap
  });
  const s2Latency = Date.now() - s2Start;
  const s2Pass = s2.status === "needs_more_info" && s2.missingFields?.includes("district");

  results.push({
    scenario: "Scenario 2: Missing Detail Interrogation Gate (AI-03)",
    passed: s2Pass,
    latencyMs: s2Latency,
    notes: `Correctly flagged missing fields: ${s2.missingFields?.join(", ")}`,
  });

  // Scenario 3: Budget Deficit Handling
  console.log("▶ Running Scenario 3: Low Budget Cap (Tk 1,000 against ~Tk 2,800 cost)...");
  const s3Start = Date.now();
  const s3 = await runPlanningAgent({
    userId: "eval-farmer-3",
    cropGoal: "Boro Rice",
    plotArea: 1,
    plotUnit: "bigha",
    district: "Tangail",
    budgetCap: 1000, // Deliberately low budget
  });
  const s3Latency = Date.now() - s3Start;
  const s3Pass = s3.budgetEvaluation?.isWithinBudget === false;

  results.push({
    scenario: "Scenario 3: Budget Deficit Detection & Deficit Warning (FR-10)",
    passed: s3Pass,
    latencyMs: s3Latency,
    notes: s3.budgetEvaluation?.savingsNotes || "Deficit caught",
  });

  // Scenario 4: Price Anomaly Detection
  console.log("▶ Running Scenario 4: Price Anomaly Detection (Overpriced & Suspiciously Low)...");
  const s4Start = Date.now();
  const fair = evaluatePriceStatus(820, 800);
  const overpriced = evaluatePriceStatus(1150, 800);
  const suspicious = evaluatePriceStatus(350, 800);
  const s4Latency = Date.now() - s4Start;
  const s4Pass = fair === "fair" && overpriced === "overpriced" && suspicious === "suspiciously_low";

  results.push({
    scenario: "Scenario 4: Common-Unit Price Anomaly Classification (FR-08 / O2)",
    passed: s4Pass,
    latencyMs: s4Latency,
    notes: `Fair: ${fair} | High: ${overpriced} | Low: ${suspicious}`,
  });

  // Scenario 5: Security Invariant: Unauthorized Tool Rejection
  console.log("▶ Running Scenario 5: Security Guardrail against Unapproved Tool Calling...");
  const s5Start = Date.now();
  const s5 = await executeToolCall("unapproved_payment_execution", { amount: 5000 });
  const s5Latency = Date.now() - s5Start;
  const s5Pass = s5.success === false && s5.error?.includes("Security Invariant Violated");

  results.push({
    scenario: "Scenario 5: Whitelisted Tool Security Guardrail (O5 / AI-04)",
    passed: s5Pass,
    latencyMs: s5Latency,
    notes: "Rejected unauthorized external invocation cleanly",
  });

  // Print Summary Table
  console.log("\n======================================================================");
  console.log("📊 CAPSTONE EVALUATION REPORT");
  console.log("======================================================================");
  console.table(
    results.map((r) => ({
      Scenario: r.scenario,
      Status: r.passed ? "✅ PASS" : "❌ FAIL",
      "Latency (ms)": r.latencyMs,
      Findings: r.notes,
    }))
  );

  const allPassed = results.every((r) => r.passed);
  console.log(`\nOverall Evaluation Outcome: ${allPassed ? "100% ALL SCENARIOS PASSED" : "FAILURES DETECTED"}`);
}

runEvaluationSuite();
