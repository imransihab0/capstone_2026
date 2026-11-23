# Agrisense: Capstone Defense & Demonstration Guide
**Course**: SE-331 Software Engineering Design Capstone Project  
**Institution**: Daffodil International University, Department of Software Engineering  
**Group**: 17 | **Supervisor**: Md. Rashedul Alam  

---

## 1. Presentation Structure & Member Roles (15-Minute Defense)

### Segment 1: Introduction & Problem Statement (00:00 - 03:00)
**Speaker**: Imranul Islam Sihab ([`@imransihab0`](https://github.com/imransihab0), Team Lead)
- **Problem**: Smallholder farmers in Bangladesh juggle fragmented information sources (local dealers with conflicted price setting, official guides in inaccessible per-hectare units, uncomparable pack sizes, and heavy apps that fail under volatile 3G connectivity).
- **Core Invariants**:
  1. Zero LLM Arithmetic (All unit conversions & pricing math run in deterministic code).
  2. Approved Server-Side Tool Calling Whitelist only.
  3. Ground-Truth Agronomic Citations on every recommendation (BARC 2024 / BRRI).
  4. Ultra-lightweight (<250 KB) offline-first resilience.

### Segment 2: Machine Learning & Comparative Analysis (03:00 - 06:30)
**Speaker**: Imtiaz Ibna Kamal ([`@imtiazdeepto`](https://github.com/imtiazdeepto), ML Engineer)
- **4-Algorithm Comparison** (Mandatory Objective O3 / AI-02):
  - Logistic Regression (Baseline): $81.2\%$ Accuracy
  - Random Forest Classifier: **$94.2\%$ Accuracy** ($F_1: 0.939$) — *Selected for best balance*
  - XGBoost Classifier: $93.8\%$ Accuracy ($F_1: 0.934$)
  - Support Vector Machine (SVM): $88.7\%$ Accuracy ($F_1: 0.882$)
- **FastAPI Microservice Architecture**:
  - Demonstrates `/api/v1/predict/crop-suitability` and `/api/v1/predict/price-status`.

### Segment 3: Frontend Design & Offline Resilience (06:30 - 10:00)
**Speaker**: Sharmarke Abdi Abdullahi ([`@zharmo`](https://github.com/zharmo), Frontend Engineer)
- **Neo-Brutalist High-Contrast B&W Design System**:
  - Halftone dotted canvas, chunky 2.5px borders, hard 3px/5px offset drop shadows.
  - Zero build lock-in (pure HTML5, CSS3 Custom Properties, Vanilla JS).
  - Micro-interactions: SpotlightCard torch glow, Magnet Buttons, TiltedCard 3D perspective, DecryptedText, and ClickSpark.
- **Offline 3G Resilience**:
  - Service Worker (`sw.js`) and IndexedDB local caching with timestamped price and weather badges (`Last Updated: [Time]`).

### Segment 4: Live Interactive Demonstration & Q&A (10:00 - 15:00)
**All Members**: Walkthrough of live application features.

---

## 2. Live Demo Script (Step-by-Step)

### Demo Step 1: The High-Contrast Neo-Brutalist Client
1. Start the full-stack server:
   ```bash
   bun run src/index.ts
   ```
2. Open `http://localhost:3000` in the browser.
3. Show the **Dark Mode / Light Mode** inversion toggle (persisted in `localStorage`).
4. Highlight the **Pablo Stanley Open Peeps** conversational guide with interactive speech bubbles and mood transitions.

### Demo Step 2: Deterministic Land Area Converter
1. Scroll to the **Land Area Normalizer**.
2. Input `1` with unit `Bigha (Standard 33 Decimal)`.
3. Point out the instant deterministic conversion: `0.133546 ha` ($1,335.46\text{ m}^2$).
4. Switch district to `Dinajpur / North (50 Dec/Bigha)` and show the calibrated recalculation to `0.202343 ha`.
5. Emphasize that **no LLM was queried for this math**; it executes through unit-tested TypeScript code.

### Demo Step 3: Marketplace Common-Unit Price Ranking (Proposal Scenario P1)
1. Navigate to the **Fair-Price Marketplace Catalog**.
2. Compare Listing A (**Carbofuran 250g** at Tk 180 + Tk 20 delivery) vs Listing B (**Carbofuran 1kg** at Tk 620 + Tk 60 delivery).
3. Demonstrate that while the 250g pack seems cheaper upfront (Tk 180 vs Tk 620), the normalized common unit rate reveals:
   - 250g pack = $\text{Tk } 800.00 / \text{kg}$
   - 1kg pack = $\text{Tk } 680.00 / \text{kg}$
4. The system ranks the 1kg pack first based on **true economic value**.

### Demo Step 4: Closed-Loop Agent Planning & Source Citations
1. In the **Seasonal Crop Planning** form, enter:
   - Crop: `Boro Rice (BRRI dhan28/29)`
   - Area: `1 Bigha`
   - District: `Tangail`
   - Budget: `Tk 8,000`
2. Click **Build Verifiable Plan ✦**.
3. Point out:
   - Open Peeps avatar mood switches to analyzing.
   - Sourced quantities: Urea $34.72\text{ kg}$, TSP $14.69\text{ kg}$, MoP $18.70\text{ kg}$.
   - Clickable citation badge: `[BARC Fertilizer Recommendation Guide 2024, Section 4.1.2]`.
   - Budget meter shows estimated cost (Tk 2,820) with Tk 5,180 surplus.

### Demo Step 5: Offline Operation Test
1. Click **Confirm & Save to Phone ✦**.
2. Open Chrome DevTools -> **Network** tab -> toggle **Offline**.
3. Refresh the page:
   - App shell loads instantly from Service Worker.
   - Saved plan and shopping list remain completely readable.
   - Network status pill displays `○ OFFLINE (CACHED DATA)`.
   - Displays clear `Last Updated: [Timestamp]` badge.

---

## 3. Defense Q&A Preparation Cheat Sheet

| Likely Examiner Question | Recommended Response |
| :--- | :--- |
| **"Why not let Gemini calculate the fertilizer totals?"** | Language models suffer from stochastic arithmetic errors and hallucinations. In agriculture, an overdosage of Urea by 25% burns crops, and underdosage destroys yield. We strictly enforce deterministic TypeScript code for all math. |
| **"Why Convex over standard PostgreSQL?"** | Convex combines real-time reactive subscriptions, ACID transactions, and integrated 1536d vector search in one typed runtime. This eliminates synchronization overhead between a relational DB and a separate vector store. |
| **"How did you prevent data leakage in ML evaluation?"** | We used Stratified $k$-fold cross-validation ($k=5$) with an independent $20\%$ hold-out test set that was never seen during feature scaling or model training. |
| **"Why Neo-Brutalism for rural farmers?"** | Neo-Brutalism uses high contrast (#0A0A0A and #FFFFFF) and thick outlines (2.5px), which maximizes readability under bright outdoor sunlight on cheap TN/IPS smartphone screens, while eliminating heavy JS UI frameworks to maintain a <250 KB payload. |
