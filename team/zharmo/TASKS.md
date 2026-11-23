# Task Roadmap: Sharmarke Abdi Abdullahi (`@zharmo`)

- [ ] **M1: Agricultural Document Corpus Preparation**
  - [ ] Gather official text excerpts from BARC Fertilizer Recommendation Guide & BRRI manuals.
  - [ ] Format document passages into structured JSON (`data/corpus/farming_guides.json`) with sections and citation IDs.
  - [ ] Provide sample verification questions and ground-truth answers for agent evaluation.

- [ ] **M2: Neo-Brutalist Core UI & Design System**
  - [ ] Implement base HTML5/CSS3 template conforming to `docs/FRONTEND_DESIGN.md`.
  - [ ] Implement halftone dotted canvas background and 2.5px solid border tokens.
  - [ ] Implement instant Dark/Light theme inversion with `localStorage` persistence.
  - [ ] Build navigation header with offline/online indicator and infinite marquee ticker.

- [ ] **M3: Micro-Interactions & React Bits (Vanilla Implementations)**
  - [ ] Implement `SpotlightCard` cursor glow tracking.
  - [ ] Implement `MagnetButton` spring pull effect.
  - [ ] Implement `TiltedCard` 3D perspective pitch and yaw.
  - [ ] Implement `DecryptedText` monospace scramble reveal.
  - [ ] Implement `ClickSpark` canvas burst and `AnimatedCounter` number tickers.

- [ ] **M4: Application Screens & Offline Caching**
  - [ ] Farmer dashboard: Plot registration & land area converter (Bigha/Decimal to Hectares).
  - [ ] Planning screen: Conversational Open Peeps avatar with reactive speech bubbles.
  - [ ] Marketplace screen: Common-unit price comparison table and Fair-Price badges.
  - [ ] Shopping basket: Budget progress bar and alternative product recommendations.
  - [ ] Service Worker (`sw.js`) and IndexedDB sync for offline viewing with timestamps.
