# Agrisense: Convex Database Specification

This directory holds the Convex backend functions, schema definitions, and vector search indices powering Agrisense.

---

## 1. Convex Architecture Benefits for Agrisense
- **Full Type-Safety**: End-to-end TypeScript types shared directly between Convex functions and ElysiaJS / Web Client.
- **Integrated Vector Search**: Document chunk embeddings (`vector(1536)`) for BARC and BRRI agricultural guides are indexed alongside standard operational tables. No secondary vector database needed.
- **Realtime Reactivity**: Live updates for seller product listings, order requests, and agent telemetry.
- **Deterministic Transactions**: All unit conversion and price arithmetic execute in ACID transactions with zero LLM guesswork.

---

## 2. Table Summary

| Table | Description | Key Indices |
| :--- | :--- | :--- |
| `users` | Accounts with roles (`farmer`, `seller`, `admin`) | `by_email`, `by_role` |
| `plots` | Farm plots with local and normalized hectare areas | `by_user` |
| `crops` | Botanical parameters, growth stages, fertilizer guidelines | Primary key |
| `guidanceDocs` | Chunked passages from BARC/BRRI manuals with vector embeddings | `by_aez_crop`, `by_embedding` (Vector: 1536d) |
| `listings` | Retail input catalog with normalized price per standard unit | `by_product_type`, `by_price_per_unit` |
| `seasonalPlans` | AI-generated, farmer-confirmed schedules & shopping lists | `by_farmer` |
| `agentLogs` | Full audit logs of agent tool calls, latency, and citations | `by_user` |
| `orderRequests` | Intent-to-buy requests between farmers and verified sellers | `by_farmer`, `by_seller` |

---

## 3. Setup & Development
To initialize Convex in this project:
```bash
npx convex dev
```
Environment variables required in `.env.local`:
```env
CONVEX_DEPLOYMENT=...
VITE_CONVEX_URL=...
GEMINI_API_KEY=...
```
