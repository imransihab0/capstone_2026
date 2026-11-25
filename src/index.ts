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

    // Serve Static Neo-Brutalist Client (Zero Build Lock-in)
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(Bun.file("public/index.html"));
    }
    if (url.pathname === "/styles.css") {
      return new Response(Bun.file("public/styles.css"), {
        headers: { "Content-Type": "text/css" },
      });
    }
    if (url.pathname === "/app.js") {
      return new Response(Bun.file("public/app.js"), {
        headers: { "Content-Type": "application/javascript" },
      });
    }
    if (url.pathname === "/sw.js") {
      return new Response(Bun.file("public/sw.js"), {
        headers: { "Content-Type": "application/javascript" },
      });
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

    // Market Listings Catalog endpoint (Common-Unit Ranked)
    if (url.pathname === "/api/v1/listings" && req.method === "GET") {
      const sampleCatalog: InputListing[] = [
        { id: "1", sellerId: "s-1", isVerifiedSeller: true, productName: "Carbofuran 3G", brand: "Furadan", productType: "pesticide", packSize: 250, packUnit: "g", price: 180, deliveryCharge: 20 },
        { id: "2", sellerId: "s-2", isVerifiedSeller: true, productName: "Carbofuran 3G (Bulk)", brand: "Furadan", productType: "pesticide", packSize: 1, packUnit: "kg", price: 620, deliveryCharge: 60 },
        { id: "3", sellerId: "s-3", isVerifiedSeller: true, productName: "Granular Urea Bag", brand: "BCIC Standard", productType: "urea", packSize: 50, packUnit: "kg", price: 1350, deliveryCharge: 150 },
        { id: "4", sellerId: "s-4", isVerifiedSeller: true, productName: "Triple Superphosphate (TSP)", brand: "Kafco Brand", productType: "tsp", packSize: 25, packUnit: "kg", price: 800, deliveryCharge: 100 },
        { id: "5", sellerId: "s-5", isVerifiedSeller: true, productName: "Muriate of Potash (MoP)", brand: "BADC Dealer", productType: "mop", packSize: 25, packUnit: "kg", price: 550, deliveryCharge: 80 },
        { id: "6", sellerId: "s-6", isVerifiedSeller: true, productName: "Gypsum Fertilizer", brand: "Govt Subsidized", productType: "gypsum", packSize: 25, packUnit: "kg", price: 350, deliveryCharge: 60 },
      ];
      const ranked = rankListingsByCommonUnitPrice(sampleCatalog);
      return jsonResponse(ranked);
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
