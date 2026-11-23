# Agrisense: Technology Stack Specification
**Course**: SE-331 Software Engineering Design Capstone Project  
**Institution**: Daffodil International University (DIU), Department of Software Engineering  
**Group**: 17 | **Supervisor**: Md. Rashedul Alam  

---

## 1. Overview & Core Philosophy
Agrisense is an Agentic AI platform designed for smallholder farmers in Bangladesh to conduct data-driven seasonal crop planning and fair-price agricultural input procurement.

The system is built on four core principles:
1. **Zero LLM Arithmetic**: All mathematical calculations, unit conversions, and price aggregations run in deterministic backend/Convex code with unit test coverage—never inside the language model.
2. **Deterministic Agent Guardrails**: The AI agent functions strictly as an orchestrator using a whitelist of approved server-side tools.
3. **Traceable Ground Truth**: Every agronomic recommendation is backed by retrievable official documents (BARC Fertilizer Recommendation Guide, BRRI manuals) with explicit citations.
4. **Rural Network Accessibility**: High-contrast, lightweight UI usable on low-end smartphones under 3G conditions, featuring offline persistence and timestamped price validation.

---

## 2. Technology Stack Breakdown

| Component | Selected Technology | Purpose & Justification |
| :--- | :--- | :--- |
| **Database & Vector Store** | **Convex** | Real-time reactive document database, serverless mutations/queries, ACID transactions, and integrated vector search for semantic retrieval of agricultural guidance manuals. |
| **Frontend UI** | **Semantic HTML5, Modern CSS3 Variables, Vanilla JS** | Zero third-party build lock-in. Neo-brutalist high-contrast design system, ultra-lightweight (<250 KB initial payload), responsive for mobile 3G. |
| **Micro-Interactions** | **React Bits & Motion Primitives (Vanilla Ports)** | SpotlightCard, Magnet Buttons, TiltedCard, DecryptedText, ClickSpark, AnimatedCounter, instant B&W/Dark theme inversion. |
| **Backend & API Runtime** | **Bun + ElysiaJS / Convex Actions** | High-performance TypeScript runtime for routing, agent tool execution, JWT authentication, and rate limiting. |
| **Agentic AI Orchestrator** | **Google Gemini 2.5 Flash (Gen AI SDK)** | Fast inference and native function calling for intent classification, tool invocation loop, and conversational Banglish/English explanation. |
| **ML Inference Service** | **Python (FastAPI)** | Microservice hosting 4 trained and evaluated ML models for crop suitability and price anomaly detection. |
| **Machine Learning Libraries** | **scikit-learn, XGBoost, pandas, NumPy** | Model training (Logistic Regression, Random Forest, XGBoost, SVM) with k-fold cross-validation and evaluation metrics (Accuracy, F1, MAE, R²). |
| **Weather & Geospatial Data** | **Open-Meteo API & OpenStreetMap Nominatim** | Real-time 7-day agro-meteorological forecasts and Upazila-to-AEZ (Agro-Ecological Zone) mapping. |
| **Offline Storage** | **Service Workers + IndexedDB / LocalStorage** | Cache saved seasonal plans, input shopping lists, and weather alerts for offline review at village shops. |
| **Testing & CI/CD** | **Vitest, pytest, GitHub Actions** | Unit and integration testing across TypeScript backend and Python ML inference service. |

---

## 3. Database Layer: Convex Architecture

Convex replaces legacy relational databases to provide real-time reactivity, end-to-end type safety, and vector indexing within a single managed backend.

### Key Data Collections:
- `users`: Farmer, Seller, and Admin accounts with RBAC authentication.
- `plots`: Farmer plots containing area, entered unit (`bigha`, `katha`, `decimal`, `acre`), normalized area in hectares, Upazila, and soil N-P-K-pH test records.
- `crops`: Supported crop varieties, growth stages, sowing windows, and base yield expectations.
- `guidance_docs`: Chunked passages from BARC, BRRI, and DAE manuals with vector embeddings (`vector(1536)` or `vector(768)`).
- `listings`: Input retailer listings (fertilizer, seed, pesticide), pack size, raw price, delivery charge, and normalized price-per-common-unit (`Tk/kg` or `Tk/L`).
- `seasonal_plans`: Generated crop schedules, calendars, input requirements, budget caps, and offline sync metadata.
- `agent_logs`: Full observability logging (session ID, tool calls, arguments, retrieved doc IDs, latency, token usage).
- `order_requests`: Non-financial procurement intentions connecting farmers with vetted local sellers.

---

## 4. Machine Learning Service Architecture

Served via a modular FastAPI service at `/api/v1/predict`:
1. **Crop Suitability Classification (`/predict/crop-suitability`)**:
   - Inputs: Soil parameters ($N, P, K, pH$), Temperature, Humidity, Rainfall.
   - Algorithms Evaluated: Logistic Regression (baseline), Random Forest, XGBoost, Support Vector Machine (SVM).
   - Metrics: Accuracy, Macro Precision, Macro Recall, Macro F1-score.
2. **Price Anomaly Detection (`/predict/price-status`)**:
   - Inputs: Product category, normalized unit price, local historical prices, delivery charge.
   - Outputs: `Fair`, `Overpriced`, or `Suspiciously Low`.

---

## 5. Agentic AI & Tool Safety Guardrails

The Gemini 2.5 Flash agent operates in a closed loop with strict invariants:
- **No Direct DB Writes**: Plans and orders require explicit user confirmation before persisting.
- **Approved Tool Whitelist**:
  - `search_farming_guidance(query, aez_code, crop)`: Retrieves vector-indexed passages.
  - `get_weather_forecast(latitude, longitude)`: Calls Open-Meteo.
  - `calculate_plot_quantities(plot_id, crop_id, target_yield)`: Executes deterministic arithmetic.
  - `fetch_normalized_listings(product_type, max_unit_price)`: Queries Convex listings sorted by total price per unit.
  - `evaluate_basket_budget(items, budget)`: Computes subtotal, warns on deficit, and suggests cheaper substitutes.
