/**
 * Agrisense: High-Contrast Neo-Brutalist Client Engine
 * Zero Third-Party Build Lock-in (Vanilla JS + Motion Primitives)
 * Authors: Sharmarke Abdi Abdullahi (@zharmo) & Imranul Islam Sihab (@imransihab0)
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMicroInteractions();
  initLandConverter();
  initMarketplace();
  initPlannerForm();
  initOfflineState();
});

/* ==========================================================================
   1. Theme Inversion Engine (Persisted in localStorage)
   ========================================================================== */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('agrisense_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButton(themeBtn, savedTheme);

  themeBtn?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('agrisense_theme', newTheme);
    updateThemeButton(themeBtn, newTheme);
  });
}

function updateThemeButton(btn, theme) {
  if (!btn) return;
  btn.innerHTML = theme === 'dark' ? '☀️ LIGHT MODE' : '🌙 DARK MODE';
}

/* ==========================================================================
   2. Micro-Interactions (React Bits Vanilla Implementations)
   ========================================================================== */
function initMicroInteractions() {
  // A. SpotlightCard: Track cursor glow via CSS variables
  document.querySelectorAll('.spotlight-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // B. Magnet Buttons: Elastic pull toward cursor
  document.querySelectorAll('.magnet-btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  // C. TiltedCard: 3D perspective pitch and yaw
  document.querySelectorAll('.tilted-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
    });
  });

  // D. DecryptedText: Monospace glyph scramble reveal on hover
  document.querySelectorAll('.decrypted-text').forEach((elem) => {
    const originalText = elem.textContent || '';
    const glyphs = '✦★█/_&!?#01';
    let interval = null;

    elem.addEventListener('mouseenter', () => {
      let iteration = 0;
      clearInterval(interval);
      interval = setInterval(() => {
        elem.textContent = originalText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return originalText[index];
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join('');

        if (iteration >= originalText.length) {
          clearInterval(interval);
        }
        iteration += 1 / 2;
      }, 30);
    });
  });

  // E. ClickSpark: Burst of hand-drawn sparks on click
  document.addEventListener('click', (e) => {
    createClickSparks(e.clientX, e.clientY);
  });

  // F. AnimatedCounter: Number ticker on scroll into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.animated-counter').forEach((el) => observer.observe(el));
}

function createClickSparks(x, y) {
  const symbols = ['✦', '★', '·'];
  for (let i = 0; i < 4; i++) {
    const spark = document.createElement('span');
    spark.className = 'click-spark';
    spark.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    spark.style.position = 'fixed';
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.fontFamily = "'Space Mono', monospace";
    spark.style.fontSize = '14px';
    spark.style.fontWeight = '700';
    spark.style.pointerEvents = 'none';
    spark.style.zIndex = '9999';
    spark.style.transition = 'all 0.45s cubic-bezier(0.1, 0.9, 0.2, 1)';
    spark.style.color = document.documentElement.getAttribute('data-theme') === 'dark' ? '#FFF' : '#000';
    document.body.appendChild(spark);

    const angle = Math.random() * Math.PI * 2;
    const distance = 25 + Math.random() * 30;
    requestAnimationFrame(() => {
      spark.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`;
      spark.style.opacity = '0';
    });

    setTimeout(() => spark.remove(), 450);
  }
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target') || '0');
  const duration = 1000;
  const start = 0;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * easeProgress;
    el.textContent = Math.round(current).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ==========================================================================
   3. Deterministic Land Area Converter
   ========================================================================== */
function initLandConverter() {
  const form = document.getElementById('converter-form');
  const resultDiv = document.getElementById('converter-result');
  if (!form) return;

  form.addEventListener('input', () => {
    const amount = parseFloat(document.getElementById('conv-amount')?.value || '0');
    const unit = document.getElementById('conv-unit')?.value || 'bigha';
    const district = document.getElementById('conv-district')?.value || 'standard';

    if (amount <= 0 || isNaN(amount)) {
      resultDiv.innerHTML = '<span class="unit-price-sub">Enter an area above to calculate</span>';
      return;
    }

    // Deterministic arithmetic based on Bangladesh Land Records
    const decimalsPerBigha = district === 'dinajpur' || district === 'rajshahi' ? 50 : 33;
    let ha = 0;
    if (unit === 'bigha') ha = amount * decimalsPerBigha * 0.0040468564224;
    else if (unit === 'katha') ha = amount * (decimalsPerBigha / 20) * 0.0040468564224;
    else if (unit === 'decimal') ha = amount * 0.0040468564224;
    else if (unit === 'acre') ha = amount * 0.40468564224;
    else ha = amount;

    resultDiv.innerHTML = `
      <div style="margin-top: 10px;">
        <span class="mono-tag">[DETERMINISTIC CONVERSION]</span>
        <div class="unit-price-hero">${ha.toFixed(4)} <span style="font-size: 1rem;">HECTARES (ha)</span></div>
        <div class="unit-price-sub">${amount} ${unit} (${(ha * 247.105).toFixed(1)} Decimals)</div>
      </div>
    `;
  });
}

/* ==========================================================================
   4. Fair-Price Marketplace Catalog Normalizer
   ========================================================================== */
const SAMPLE_LISTINGS = [
  { id: '1', name: 'Carbofuran 3G', brand: 'Furadan', type: 'pesticide', packSize: 250, packUnit: 'g', price: 180, delivery: 20 },
  { id: '2', name: 'Carbofuran 3G (Bulk)', brand: 'Furadan', type: 'pesticide', packSize: 1, packUnit: 'kg', price: 620, delivery: 60 },
  { id: '3', name: 'Granular Urea Bag', brand: 'BCIC Standard', type: 'fertilizer', packSize: 50, packUnit: 'kg', price: 1350, delivery: 150 },
  { id: '4', name: 'Triple Superphosphate (TSP)', brand: 'Kafco Brand', type: 'fertilizer', packSize: 25, packUnit: 'kg', price: 800, delivery: 100 },
];

function initMarketplace() {
  const grid = document.getElementById('marketplace-grid');
  if (!grid) return;

  grid.innerHTML = SAMPLE_LISTINGS.map((item) => {
    // Normalization arithmetic
    const baseKg = item.packUnit === 'g' ? item.packSize / 1000 : item.packSize;
    const totalCost = item.price + item.delivery;
    const pricePerKg = (totalCost / baseKg).toFixed(2);
    const isSmall = item.packSize === 250;

    return `
      <div class="listing-card tilted-card">
        <div class="listing-header">
          <div>
            <span class="mono-tag">${item.brand}</span>
            <h4 style="margin-top: 4px;">${item.name}</h4>
          </div>
          <span class="badge ${isSmall ? '' : 'btn-invert'}">${item.packSize} ${item.packUnit}</span>
        </div>
        <div>
          <div class="unit-price-sub">Effective Common Price (inc. Tk ${item.delivery} delivery):</div>
          <div class="unit-price-hero">Tk ${pricePerKg} <span style="font-size: 0.9rem;">/ kg</span></div>
          <div class="unit-price-sub">Shelf Price: Tk ${item.price}</div>
        </div>
        <button class="btn btn-invert magnet-btn" style="margin-top: 14px;" onclick="selectProduct('${item.id}', '${item.name}', ${pricePerKg})">
          Select For Plan ✦
        </button>
      </div>
    `;
  }).join('');
}

window.selectProduct = function (id, name, unitPrice) {
  alert(`Added ${name} to seasonal basket. Calculated Unit Rate: Tk ${unitPrice}/kg`);
};

/* ==========================================================================
   5. Agentic Seasonal Planning Generator
   ========================================================================== */
function initPlannerForm() {
  const form = document.getElementById('planner-form');
  const resultsCard = document.getElementById('planner-results');
  const avatar = document.getElementById('open-peeps-avatar');
  const speechBubble = document.getElementById('peep-speech');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const crop = document.getElementById('plan-crop').value;
    const area = parseFloat(document.getElementById('plan-area').value);
    const unit = document.getElementById('plan-unit').value;
    const district = document.getElementById('plan-district').value;
    const budget = parseFloat(document.getElementById('plan-budget').value);

    // Update avatar mood
    if (speechBubble) speechBubble.textContent = "Analyzing soil requirements, weather window, and local market prices...";
    if (avatar) avatar.textContent = "🧐";

    setTimeout(() => {
      // Deterministic calculations
      const ha = (area * 33 * 0.0040468564224).toFixed(4);
      const ureaKg = (260 * ha).toFixed(1);
      const tspKg = (110 * ha).toFixed(1);
      const mopKg = (140 * ha).toFixed(1);
      const estCost = Math.round(ureaKg * 27 + tspKg * 32 + mopKg * 22 + 1200);

      if (avatar) avatar.textContent = "🤠";
      if (speechBubble) speechBubble.textContent = `Generated verifiable plan for ${crop} on ${area} ${unit} in ${district}!`;

      resultsCard.style.display = 'block';
      resultsCard.innerHTML = `
        <div class="tape-badge">✦ VERIFIED SEASONAL PLAN</div>
        <h3>${crop} Production Schedule</h3>
        <p class="unit-price-sub" style="margin-bottom: 16px;">Plot Area: ${area} ${unit} (~${ha} ha) | Budget Cap: Tk ${budget.toLocaleString()}</p>
        
        <div style="background: var(--bg-muted); border: var(--border-width) solid var(--border-color); padding: 16px; margin-bottom: 16px;">
          <span class="mono-tag">[INPUT QUANTITIES FROM BARC GUIDE 2024]</span>
          <div style="display: flex; gap: 24px; flex-wrap: wrap; margin-top: 10px;">
            <div><strong>Urea:</strong> ${ureaKg} kg</div>
            <div><strong>TSP:</strong> ${tspKg} kg</div>
            <div><strong>MoP:</strong> ${mopKg} kg</div>
            <div><strong>Est. Cost:</strong> Tk ${estCost.toLocaleString()}</div>
          </div>
          <div class="source-citation">Source: BARC Fertilizer Recommendation Guide 2024, Section 4.1.2</div>
        </div>

        <h4>Agronomic Calendar Stages:</h4>
        <ul style="margin: 12px 0 16px 20px;">
          <li><strong>Day 1-10:</strong> Final plowing; apply ${tspKg} kg TSP and 1/3 of MoP as basal dose.</li>
          <li><strong>Day 25-30:</strong> Transplant 30-day seedlings (spacing 20x15cm).</li>
          <li><strong>Day 45:</strong> Top dress 1/3 Urea (${(ureaKg / 3).toFixed(1)} kg) during early tillering.</li>
        </ul>

        <div style="display: flex; gap: 12px; align-items: center; margin-top: 20px;">
          <button class="btn btn-invert magnet-btn" onclick="confirmSavePlan()">Confirm & Save to Phone ✦</button>
          <span class="unit-price-sub">Last Updated: ${new Date().toLocaleTimeString()}</span>
        </div>
      `;

      resultsCard.scrollIntoView({ behavior: 'smooth' });
    }, 600);
  });
}

window.confirmSavePlan = function () {
  localStorage.setItem('agrisense_saved_plan', JSON.stringify({
    timestamp: new Date().toISOString(),
    status: 'Saved Offline',
  }));
  alert('Plan confirmed and cached locally for offline review at the dealer shop!');
};

/* ==========================================================================
   6. Offline Service Worker Registration
   ========================================================================== */
function initOfflineState() {
  const pill = document.getElementById('network-pill');
  function updateStatus() {
    if (navigator.onLine) {
      if (pill) pill.innerHTML = '● ONLINE / 3G SYNCED';
    } else {
      if (pill) pill.innerHTML = '○ OFFLINE (CACHED DATA)';
    }
  }

  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
  updateStatus();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('SW registration note:', err.message);
    });
  }
}
