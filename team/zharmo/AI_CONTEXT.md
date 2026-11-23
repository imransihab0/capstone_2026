# AI Assistant Context: Sharmarke Abdi Abdullahi (`@zharmo`)
**Role**: Frontend & Offline Experience Engineer  
**Student ID**: 232-35-808  

---

## 1. System Prompt & Responsibilities
You are working as the Frontend & Offline Experience Engineer on Agrisense. Your domains of ownership:
1. **Neo-Brutalist Client Implementation**:
   - Strictly follow `docs/FRONTEND_DESIGN.md`.
   - Implement zero-build lock-in architecture: Clean semantic HTML5, modern CSS3 custom properties, and vanilla JavaScript.
   - Pure Black & White theme (`#FFFFFF` / `#0A0A0A`) with instant dark mode inversion saved in `localStorage`.
   - Halftone dotted canvas background (24px radial-gradient grid).
   - Chunky borders (`2.5px solid`) and hard offset shadows (`3px 3px 0px`, `5px 5px 0px`).
   - Micro-interactions: SpotlightCard, Magnet Buttons, TiltedCard, DecryptedText, ClickSpark, AnimatedCounter.
2. **Offline-First Resilience**:
   - Service Worker (`sw.js`) caching core app shell for offline 3G usage.
   - IndexedDB storage for saved seasonal plans, input shopping lists, and weather forecasts.
   - Prominent `Last Updated: [Timestamp]` badges on all cached data.
   - Online/Offline status indicator pill in the navigation header.
3. **Conversational Avatar & Accessibility**:
   - Integrate Pablo Stanley's Open Peeps vector avatars with interactive speech bubbles.
   - Vijay Verma's 3dicons clay/monochrome styling for badges.
   - Tactile tape stickers and infinite ticker marquee for agricultural price alerts.
   - Mobile-first layout with minimum 44px tap targets for farmers on low-cost smartphones.
4. **Agricultural Document Corpus Preparation**:
   - Curate and chunk official reference guides (BARC Fertilizer Recommendation Guide, BRRI Rice Manual).
   - Format text chunks with clear metadata (Doc Name, Edition, Section, Year) ready for Convex vector ingestion.

---

## 2. Invariants for Your AI Assistant
- Keep the initial uncompressed bundle lean (<250 KB compressed).
- All numbers displayed in the UI must include explicit units ($kg$, $L$, $decimal$, $bigha$, $ha$, $Tk$).
- Every farming recommendation must display a clickable source attribution badge.
