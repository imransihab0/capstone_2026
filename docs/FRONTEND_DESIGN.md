# Agrisense: Neo-Brutalist Frontend Design System & Specification
**Author**: Imranul Islam Sihab (`@imransihab0`) — Team Lead  
**Topic**: Agrisense — Agentic AI Platform for Crop Planning & Fair-Price Agricultural Trade  
**Tech Mandate**: Zero third-party build lock-in (Semantic HTML5, Modern CSS3 Custom Properties, Vanilla JavaScript).

---

## 1. Design Philosophy & Tone

Agrisense rejects sterile, generic corporate software in favor of a bold, tactile, high-contrast **Neo-Brutalist** design language.
- **Audience**: Smallholder farmers, regional agriculture officers (SAAO), and input retailers in Bangladesh.
- **Functional Goal**: Maximum legibility in outdoor daylight, instant comprehension, zero visual clutter, and ultra-fast 3G performance (<250 KB initial bundle).
- **Voice & Copy Tone**: Direct, honest, conversational, human, and transparent. No buzzwords or black-box claims. Always cite data sources and display mathematical units.

---

## 2. Palette & Design Tokens

### 2.1 Color Tokens & Theming
The interface operates in a pure, binary Black & White spectrum with inverted dark mode.

```css
:root {
  /* Light Mode (Default) */
  --bg-primary: #FFFFFF;
  --bg-card: #FFFFFF;
  --bg-muted: #F4F4F4;
  --text-primary: #0A0A0A;
  --text-muted: #4A4A4A;
  --border-color: #0A0A0A;
  --border-width: 2.5px;
  
  /* Hard Drop Shadows (No Blur) */
  --shadow-sm: 3px 3px 0px #0A0A0A;
  --shadow-md: 5px 5px 0px #0A0A0A;
  --shadow-lg: 8px 8px 0px #0A0A0A;
  --shadow-active: 1px 1px 0px #0A0A0A;

  /* Halftone Canvas Background */
  --dot-color: #0A0A0A;
  --dot-bg: #FFFFFF;
  --dot-size: 1px;
  --dot-spacing: 24px;

  /* Accent Badges (Tactile B&W) */
  --tape-color: #FFFFFF;
  --tape-border: #0A0A0A;
}

[data-theme="dark"] {
  /* Inverted Dark Mode */
  --bg-primary: #0A0A0A;
  --bg-card: #141414;
  --bg-muted: #1E1E1E;
  --text-primary: #FFFFFF;
  --text-muted: #A0A0A0;
  --border-color: #FFFFFF;
  
  --shadow-sm: 3px 3px 0px #FFFFFF;
  --shadow-md: 5px 5px 0px #FFFFFF;
  --shadow-lg: 8px 8px 0px #FFFFFF;
  --shadow-active: 1px 1px 0px #FFFFFF;

  --dot-color: #FFFFFF;
  --dot-bg: #0A0A0A;
}
```

### 2.2 Halftone Dotted Background Canvas
Implemented purely through CSS radial gradients with zero image downloads:
```css
body {
  background-color: var(--dot-bg);
  background-image: radial-gradient(
    var(--dot-color) var(--dot-size),
    transparent var(--dot-size)
  );
  background-size: var(--dot-spacing) var(--dot-spacing);
  color: var(--text-primary);
  min-height: 100vh;
}
```

---

## 3. Typography System

We utilize geometric grotesk and monospace typefaces for distinct informational roles:
- **Headings & Hero**: `'Space Grotesk'` (fallback: `'Plus Jakarta Sans'`), font-weight 800, letter-spacing `-0.03em`, tight line-height (`1.05 - 1.15`).
- **Body & Dialogue**: `'Plus Jakarta Sans'`, font-weight 400 / 600, line-height `1.5`, clean readability.
- **Tags, Measurements & Sources**: `'Space Mono'`, uppercase, tracking `0.05em`, font-weight 700.

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=Space+Grotesk:wght@700;800&family=Space+Mono:wght@700&display=swap');

h1, h2, h3, h4 {
  font-family: 'Space Grotesk', 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  letter-spacing: -0.025em;
  text-transform: uppercase;
}

body, p, input, select, button {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.mono-tag, .unit-badge, .source-citation, .crypto-price {
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

## 4. Visual Accents & Illustration System

### 4.1 Pablo Stanley's Open Peeps Character System
- **Purpose**: Welcoming, conversational guide representing Bangladeshi farmers, agricultural extension officers, and village retailers.
- **Styling**: Hand-drawn vector comic style with chunky 2.5px black strokes.
- **Interactive Speech Bubbles**:
  - Rectangular white box with a 2.5px border, 5px hard offset shadow, and a triangular directional pointer.
  - Interactive mood switcher: Character changes expressions based on planning state (`curious` -> `analyzing` -> `confirmed`).

### 4.2 Vijay Verma's 3dicons (Clay / Monochrome Style)
- Clay-textured 3D monochrome icons for feature highlights:
  - 🌾 Crop Suitability (Sprout icon)
  - ⚖️ Fair-Price Engine (Balance scale icon)
  - 🌦️ Weather Windows (Cloud & lightning icon)
  - 🛒 Shopping Basket (Woven basket icon)

### 4.3 Tactile Neo-Brutalist Badges & Accents
- **Tape Stickers**: Diagonal tape overlay (`transform: rotate(-3deg);`) pinning cards to the canvas.
- **Hand-Drawn Stars**: Vector symbols (`✦`, `★`, `·`) marking recommended choices and verified dealers.
- **Infinite Marquee Ticker**: Continuous horizontal ticker bar broadcasting live grain market rates and weather alerts.

```css
/* Tactile Tape Sticker */
.tape-sticker {
  position: absolute;
  top: -12px;
  left: 24px;
  background: var(--bg-primary);
  border: var(--border-width) solid var(--border-color);
  padding: 4px 14px;
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  transform: rotate(-2deg);
  box-shadow: 2px 2px 0px var(--border-color);
}

/* Infinite Horizontal Marquee */
.ticker-wrap {
  width: 100%;
  overflow: hidden;
  border-top: var(--border-width) solid var(--border-color);
  border-bottom: var(--border-width) solid var(--border-color);
  background: var(--bg-primary);
  padding: 8px 0;
}
.ticker-move {
  display: inline-block;
  white-space: nowrap;
  animation: ticker 25s linear infinite;
}
@keyframes ticker {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}
```

---

## 5. Micro-Interactions (Zero Build Lock-in Implementations)

All micro-interactions are written in pure Vanilla JavaScript and CSS custom properties:

### 5.1 SpotlightCard (Torch Glow Cursor Tracking)
Calculates cursor coordinates relative to the card bounding rect and updates `--mouse-x` and `--mouse-y` dynamically:
```javascript
document.querySelectorAll('.spotlight-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});
```

### 5.2 Magnet Buttons
Button slightly magnetizes towards the user's cursor within a 35px threshold and snaps back elastically:
```javascript
document.querySelectorAll('.magnet-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0px, 0px)';
  });
});
```

### 5.3 TiltedCard (3D Perspective Pitch & Yaw)
```javascript
document.querySelectorAll('.tilted-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
  });
});
```

### 5.4 DecryptedText (Monospace Glyph Scramble Reveal)
Scrambles letters using cryptographic symbols (`✦`, `█`, `_`, `/`, `&`, `!`) before resolving to plain English/Bangla text on hover.

### 5.5 ClickSpark
Generates an ephemeral SVG/Canvas burst of mini star particles (`✦`, `★`, `·`) on button clicks.

### 5.6 AnimatedCounter
Uses `IntersectionObserver` to count upward smoothly from `0` to the target number (e.g., `8,000 Tk` budget, `94.2%` accuracy) with an ease-out quadratic function.

### 5.7 Theme Inversion
Instant toggle between Light Mode and Dark Mode saved directly to `localStorage['agrisense_theme']`.

---

## 6. Core Component Architecture

1. **Navigation Header**:
   - Brutalist logo mark with live offline indicator (`● ONLINE / 3G SYNCED`).
   - Theme toggle button with tactile click response.
2. **Plot Information & Area Converter**:
   - Accepts land size in Bangladeshi regional units: Bigha (standard 33 decimal), Katha (1.65 decimal), Acre, or Decimal.
   - Instantly renders deterministic conversion to Hectares ($ha$).
3. **Agent Conversation & Step Progressor**:
   - Open Peeps avatar with reactive speech bubble.
   - Tool execution status chips: `[WEATHER CHECKED]`, `[BARC GUIDE SEARCHED]`, `[PRICES NORMALIZED]`.
4. **Marketplace Listing Card with Common Unit Breakdown**:
   - Prominently displays:
     - Pack size (e.g. 500 ml)
     - Pack price + Delivery fee
     - **Normalized Price**: $\text{Tk } 820.00 / \text{L}$
     - Status Badge: `FAIR PRICE` or `UNUSUAL VARIATION (+28%)`.
5. **Costed Seasonal Basket & Alternative Suggester**:
   - Budget meter with progress bar.
   - "Cheaper Alternative Available" accordion showing exact trade-off.
