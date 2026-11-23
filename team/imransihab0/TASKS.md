# Task Roadmap: Imranul Islam Sihab (`@imransihab0`)

- [x] **M1: Architecture & Specifications**
  - [x] Analyze Capstone proposal requirements and formulate technical specifications.
  - [x] Author `docs/TECH_STACK.md`, `docs/ARCHITECTURE.md`, and `docs/VERSION_CONTROL_WORKFLOW.md`.
  - [x] Author `docs/FRONTEND_DESIGN.md` establishing the Neo-brutalist theme and tokens.
  - [x] Establish Git repository workflows, branches, and collaborator contexts.

- [x] **M2: Convex Database Schema & Core Arithmetic Engine**
  - [x] Implement `convex/schema.ts` with type-safe tables and vector search index.
  - [x] Write unit conversion engine (Bigha, Katha, Decimal, Acre to Hectares) with Vitest/Bun tests.
  - [x] Write price-per-unit calculation engine with delivery fee inclusion and tests.
  - [x] Create Convex mutations and queries for plot, marketplace listing, order, and plan CRUD.

- [x] **M3: API Endpoints & Auth Guards**
  - [x] Set up Bun HTTP API runtime (`src/index.ts`) with low-bandwidth JSON routes.
  - [x] Implement deterministic land area conversion endpoint (`/api/v1/convert-area`).
  - [x] Implement common-unit pricing endpoint (`/api/v1/calculate-pricing`).
  - [x] Implement basket budget evaluation endpoint (`/api/v1/evaluate-basket`).
  - [x] Integrate Open-Meteo weather API connector.

- [x] **M4: Agentic Orchestration & Tool Execution Loop**
  - [x] Implement Gemini agent orchestrator (`src/agent/orchestrator.ts`).
  - [x] Implement approved server-side tools (`src/agent/tools.ts`) with strict whitelist rejection.
  - [x] Implement parameter interrogation for missing farmer goals (AI-03).
  - [x] Build agent execution telemetry logger capturing tool steps and latency.
  - [x] Implement the mandatory user confirmation step prior to saving plans.

- [x] **M5: Integration, CI/CD & Delivery**
  - [x] Integrate ML microservice models and client components.
  - [x] Configure automated GitHub Actions CI/CD workflow (`.github/workflows/ci.yml`).
  - [x] Author Convex database seeding script (`convex/seed.ts`).
  - [x] Author and pass all 5 Capstone evaluation benchmark scenarios (`scripts/evaluate_scenarios.ts`).
  - [x] Finalize verification reports for Capstone defense.
