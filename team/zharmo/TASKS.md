# Task Roadmap: Sharmarke Abdi Abdullahi (`@zharmo`)

- [x] **M1: Agricultural Document Corpus Preparation**
  - [x] Gather official text excerpts from BARC Fertilizer Recommendation Guide & BRRI manuals.
  - [x] Format document passages into structured JSON (`data/corpus/farming_guides.json`) with sections and citation IDs.
  - [x] Provide sample verification questions and ground-truth answers for agent evaluation.

- [x] **M2: Neo-Brutalist Core UI & Design System**
  - [x] Implement base HTML5/CSS3 template conforming to `docs/FRONTEND_DESIGN.md`.
  - [x] Implement halftone dotted canvas background and 2.5px solid border tokens.
  - [x] Implement instant Dark/Light theme inversion with `localStorage` persistence.
  - [x] Build navigation header with offline/online indicator and infinite marquee ticker.

- [x] **M3: Micro-Interactions & React Bits (Vanilla Implementations)**
  - [x] Implement `SpotlightCard` cursor glow tracking.
  - [x] Implement `MagnetButton` spring pull effect.
  - [x] Implement `TiltedCard` 3D perspective pitch and yaw.
  - [x] Implement `DecryptedText` monospace scramble reveal.
  - [x] Implement `ClickSpark` canvas burst and `AnimatedCounter` number tickers.

- [x] **M4: Application Screens & Offline Caching**
  - [x] Farmer dashboard: Plot registration & land area converter (Bigha/Decimal to Hectares).
  - [x] Planning screen: Conversational Open Peeps avatar with reactive speech bubbles.
  - [x] Marketplace screen: Common-unit price comparison table and Fair-Price badges.
  - [x] Shopping basket: Budget progress bar and alternative product recommendations.
  - [x] Service Worker (`sw.js`) and IndexedDB sync for offline viewing with timestamps.
