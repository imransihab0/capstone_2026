# Agrisense: System Architecture
**Capstone Project**: SE-331 Software Engineering Design  
**Platform**: Agrisense — Agentic AI Platform for Crop Planning & Fair-Price Agricultural Trade  

---

## 1. System Overview & The 5-Layer Model

Agrisense separates concerns into 5 distinct architectural layers to ensure fault tolerance, offline resilience, and mathematical integrity.

```mermaid
flowchart TD
    subgraph UI_Layer ["1. User Interface Layer (Neo-Brutalist Client)"]
        UI1["Semantic HTML5 + Modern CSS3 Variables"]
        UI2["Motion Primitives & React Bits (Vanilla)"]
        UI3["Service Worker & Offline Cache (IndexedDB)"]
    end

    subgraph Comm_Layer ["2. Communication & API Layer"]
        API1["Bun + ElysiaJS / Convex HTTP Actions"]
        API2["Auth & Role Guards (Farmer / Seller / Admin)"]
        API3["Rate Limiting & Compression (<250KB payload)"]
    end

    subgraph Data_Layer ["3. Data Layer (Convex Reactive Backend)"]
        DB1["Document Collections: Plots, Crops, Listings, Orders"]
        DB2["Convex Vector Search: Embedded BARC/BRRI Guides"]
        DB3["Deterministic Calculation Engine (Unit Pricing & Conversion)"]
    end

    subgraph Intel_Layer ["4. Intelligence Layer"]
        AGENT["Agentic Orchestrator (Gemini 2.5 Flash SDK)"]
        TOOLS["Approved Server-Side Tool Registry"]
        ML["FastAPI ML Inference Microservice (RF, XGB, SVM)"]
        EXT["External APIs: Open-Meteo & OpenStreetMap"]
    end

    subgraph Action_Layer ["5. Action & Verification Layer"]
        ACT1["Interactive Crop Schedule & Calendar"]
        ACT2["Common-Unit Price Comparison Engine"]
        ACT3["Costed Shopping Basket & Alternative Suggestions"]
        ACT4["User Confirmation Gate (Save Plan / Place Order)"]
    end

    UI_Layer <--> Comm_Layer
    Comm_Layer <--> Data_Layer
    Comm_Layer <--> Intel_Layer
    Intel_Layer <--> Action_Layer
    Action_Layer --> UI_Layer
```

---

## 2. Detailed Layer Specifications

### Layer 1: User Interface Layer
- **Neo-Brutalist Styling**: High contrast `#0A0A0A` and `#FFFFFF` with 2.5px solid borders, halftone dotted backgrounds, and hard drop shadows (`3px 3px 0px`, `5px 5px 0px`).
- **Offline First**: Service Worker intercepts network requests; saved crop plans, shopping lists, and past weather alerts are accessible with zero connection.
- **Timestamping**: Displays clear `Last Updated: [Time]` badges across all pricing and weather data to prevent stale decisions.

### Layer 2: Communication Layer
- **Ultra-lean Payloads**: Structured JSON responses optimized for 3G mobile data speeds in rural Bangladesh.
- **Strict Role-Based Access Control**:
  - `farmer`: Create/edit owned plots, generate plans, compare prices, submit order requests.
  - `seller`: Register shop, publish/update inventory listings, view received order requests.
  - `admin`: Audit price warnings, verify sellers, inspect agent telemetry logs.

### Layer 3: Data Layer (Convex)
- **Reactive Queries**: Real-time updates when seller inventory changes.
- **Embedded Document Search**: Built-in vector index querying chunks of official manuals (BARC Fertilizer Recommendation Guide, BRRI Rice Manual).
- **Arithmetic Invariance**: Land area conversion ($1\text{ bigha} = 0.3306\text{ acre} \approx 0.1338\text{ ha}$) and common unit price calculation:
  $$\text{Effective Price per Unit} = \frac{\text{Listed Pack Price} + \text{Delivery Fee}}{\text{Pack Size in Base Units (kg or L)}}$$

### Layer 4: Intelligence Layer
- **Gemini 2.5 Flash Agent**: Functions in an iterative tool-use loop:
  1. Parse farmer goal (e.g., "Grow Boro Rice on 1 bigha in Tangail with Tk 8,000 budget").
  2. Inspect plot record; query farmer for missing parameters if required.
  3. Invoke `search_farming_guidance`, `get_weather_forecast`, and `predict_crop_suitability`.
  4. Invoke `calculate_plot_quantities` and `fetch_normalized_listings`.
  5. Assemble costed basket and evaluate budget constraints.
- **FastAPI Inference Microservice**:
  - Handles `/predict/crop-suitability` and `/predict/price-status`.
  - Runs team-trained Scikit-learn and XGBoost pipelines.

### Layer 5: Action & Verification Layer
- **Mandatory Confirmation**: No seasonal plan or order request is written to the database without explicit farmer confirmation.
- **Source Badging**: Every recommendation block displays an interactive badge:
  - `[SOURCE: BARC Guide 2024, Sec. 4.2]` (Official Document)
  - `[MODEL: Random Forest v1.2, 94.2% Acc]` (ML Estimation)
  - `[MARKETPLACE: Verified Seller]` (Live Listing)
