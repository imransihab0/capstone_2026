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

- [ ] **M3: API Endpoints & Auth Guards**
  - [ ] Set up Bun + ElysiaJS / Convex HTTP actions with JWT authentication.
  - [ ] Implement RBAC middleware for `farmer`, `seller`, and `admin` roles.
  - [ ] Integrate Open-Meteo weather API and OpenStreetMap Nominatim geocoding services.

- [ ] **M4: Agentic Orchestration & Tool Execution Loop**
  - [ ] Implement Gemini 2.5 Flash agent loop using Google Gen AI SDK.
  - [ ] Implement approved server-side tools (`search_guidance_docs`, `calculate_quantities`, etc.).
  - [ ] Build agent execution telemetry logger saving traces directly to Convex `agent_logs`.
  - [ ] Implement the mandatory user confirmation step prior to saving plans.
