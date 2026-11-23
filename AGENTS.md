# Agrisense: Universal AI Agent Directives & Repo Context
**Project**: Agrisense (SE-331 Software Engineering Design Capstone Project, Daffodil International University)  
**Supervisor**: Md. Rashedul Alam  

---

## 1. System Mission & Core Constraints

You are assisting on **Agrisense**, an Agentic AI platform built for smallholder farmers in Bangladesh to plan seasonal crops and purchase agricultural inputs at fair prices.

### Four Critical Invariants (Never Violate):
1. **Zero LLM Arithmetic**:
   - The LLM MUST NOT calculate land area conversions, fertilizer dosages, application totals, or price comparisons.
   - All arithmetic lives in deterministic TypeScript / Python code with unit tests.
2. **Approved Server-Side Tool Calling Only**:
   - The Gemini agent only interacts with the outside world via registered tools (`search_guidance_docs`, `get_weather_forecast`, `predict_crop_suitability`, `calculate_plot_quantities`, `fetch_normalized_listings`, `evaluate_basket_budget`).
3. **Traceable Agronomic Source Citations**:
   - Every farming recommendation must cite its authoritative source (e.g., BARC Fertilizer Recommendation Guide 2024 or BRRI Rice Production Manual) down to the section.
4. **Low-Bandwidth & Offline Resilience**:
   - Web application payload must be under 250 KB compressed.
   - Plans, shopping lists, and weather alerts must be cached in IndexedDB via Service Workers and remain accessible offline with a visible `Last Updated` timestamp.

---

## 2. Team Member Workspaces & Sub-Contexts

When working with a specific teammate, load their personalized context:
- **`team/imransihab0/`** — Imranul Islam Sihab (Team Lead): API, Gemini Agent Loop, Convex DB, Unit Arithmetic Engine, Frontend Design.
- **`team/imtiazdeepto/`** — Imtiaz Ibna Kamal: ML Pipelines (RF, XGB, SVM, Baselines), Dataset preparation, FastAPI Inference Microservice.
- **`team/zharmo/`** — Sharmarke Abdi Abdullahi: Neo-Brutalist Frontend UI, React Bits / Motion Primitives, Offline Service Worker, Document Corpus Ingestion.

---

## 3. Technology Stack Reference
- **Database**: **Convex** (Reactive queries/mutations, document schema, vector index)
- **API Runtime**: **Bun + ElysiaJS / Convex Actions**
- **Inference Microservice**: **Python (FastAPI)** with scikit-learn & XGBoost
- **AI Orchestrator**: **Google Gemini 2.5 Flash** (Function Calling via Google Gen AI SDK)
- **Frontend**: **Semantic HTML5, CSS3 Custom Properties, Vanilla JS** (Neo-Brutalist Black & White, zero build lock-in)
- **Weather & Geo**: **Open-Meteo API** & **OpenStreetMap Nominatim**
