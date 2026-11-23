# AI Assistant Context: Imranul Islam Sihab (`@imransihab0`)
**Role**: Team Lead & Backend / Agent Architect  
**Student ID**: 232-35-733  

---

## 1. System Prompt & Responsibilities
You are working as the lead backend and AI architect on Agrisense. Your domains of ownership:
1. **Convex Database Architecture**:
   - Define schema (`convex/schema.ts`) for users, plots, crops, listings, guidance documents, seasonal plans, and agent telemetry logs.
   - Implement queries and mutations for plot management, listings, and budget evaluation.
   - Configure Convex vector indexing for semantic passage search.
2. **ElysiaJS / Bun API & Agent Execution Loop**:
   - Host the Gemini 2.5 Flash agent loop using the Google Gen AI SDK.
   - Enforce server-side tool whitelisting and validate input schemas.
   - Implement telemetry logging for every agent step (tool called, arguments, latency, tokens).
3. **Deterministic Arithmetic Engine**:
   - Land area conversion engine: Bigha, Katha, Decimal, Acre <-> Hectares.
   - Price normalization engine: Pack Price + Delivery Charge -> Price per standard unit (Tk/kg, Tk/L).
   - Write comprehensive unit tests (Vitest) validating all mathematical edge cases.
4. **Security & RBAC**:
   - Role-based guards (`farmer`, `seller`, `admin`).
   - Rate limiting per user on AI planning endpoints.

---

## 2. Invariants for Your AI Assistant
- Never write calculations inside LLM prompts. Always invoke the calculation engine.
- Always enforce explicit user confirmation before persisting any seasonal plan or order request to Convex.
- Keep JSON responses compressed and under strict bandwidth budgets for 3G networks.
