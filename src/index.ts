/**
 * Agrisense: Bun HTTP API Runtime
 *
 * Exposes type-safe endpoints for the Agentic Orchestrator and Deterministic Calculation Engine.
 */

import { runPlanningAgent, type FarmerGoalInput } from "./agent/orchestrator";
import {
  convertHectaresToUnit,
  formatPlotSummary,
  normalizeToHectares,
  type LandUnit,
} from "./engine/landArea";
import {
  calculateNormalizedListing,
  evaluateBasketBudget,
  rankListingsByCommonUnitPrice,
  type BasketItem,
  type InputListing,
} from "./engine/pricing";

const PORT = Number(process.env.PORT) || 3000;

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return jsonResponse({ ok: true });
    }

    // Health check
    if (url.pathname === "/api/v1/health" && req.method === "GET") {
      return jsonResponse({
        status: "ok",
        platform: "Agrisense API",
        version: "1.0.0",
        timestamp: Date.now(),
        uptime: process.uptime(),
      });
    }

    // Agentic Planning endpoint
    if (url.pathname === "/api/v1/plan" && req.method === "POST") {
      try {
        const body = (await req.json()) as FarmerGoalInput;
        const result = await runPlanningAgent(body);
        return jsonResponse(result);
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 400);
      }
    }

    // Deterministic Land Area Conversion endpoint
    if (url.pathname === "/api/v1/convert-area" && req.method === "POST") {
      try {
        const body = await req.json();
        const { amount, unit, targetUnit, district } = body;
        const summary = formatPlotSummary(Number(amount), unit as LandUnit, { district });

        let convertedToTarget: number | undefined;
        if (targetUnit) {
          convertedToTarget = convertHectaresToUnit(summary.hectares, targetUnit as LandUnit, { district });
        }

        return jsonResponse({
          ...summary,
          targetUnit,
          convertedToTarget,
        });
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 400);
      }
    }

    // Common-Unit Price Normalization endpoint
    if (url.pathname === "/api/v1/calculate-pricing" && req.method === "POST") {
      try {
        const listing = (await req.json()) as InputListing;
        const normalized = calculateNormalizedListing(listing);
        return jsonResponse(normalized);
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 400);
      }
    }

    // Basket Budget Evaluation endpoint
    if (url.pathname === "/api/v1/evaluate-basket" && req.method === "POST") {
      try {
        const body = await req.json();
        const { items, budgetCap, catalog } = body;
        const result = evaluateBasketBudget(items as BasketItem[], Number(budgetCap), (catalog as InputListing[]) || []);
        return jsonResponse(result);
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 400);
      }
    }

    return jsonResponse({ error: "Route not found" }, 404);
  },
});

console.log(`🌾 Agrisense API running at http://localhost:${server.port}`);
