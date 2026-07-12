import { ipoData, underwriterData } from "./data.js?v=6";

const STORAGE_PREFIX = "ipohack_";

// === VIEW STATE ===
let currentView = "dashboard";
let activeIpoId = null; 

// === GLOBAL MARKET CONDITION STATE ===
let currentMarketCondition = "bullish"; // default

// === FILTER STATE ===
const filterState = {
  searchQuery: "",
  status: "all",
  sectors: new Set(),
  underwriters: new Set(),
  sort: "default"
};

// === INITIALIZE DOM ===
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupFilters();
  setupTheme();
  setupModalEvents();
  setupMarketSelector();
  
  // Render views
  renderDashboard();
  renderBacktestTable();
  renderUnderwritersList();
});

// === NAVIGATION MANAGER ===
function setupNavigation() {
  const navLinks = document.querySelectorAll("nav .nav-link");
  const views = document.querySelectorAll(".view-panel");
  const heroBanner = document.getElementById("heroBanner");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetView = link.getAttribute("data-view");
      
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      
      views.forEach(v => v.style.display = "none");
      document.getElementById(`view-${targetView}`).style.display = "block";
      
      // Hide hero banner on other views to save space
      if (targetView === "dashboard") {
        heroBanner.style.display = "block";
      } else {
        heroBanner.style.display = "none";
      }

      currentView = targetView;
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

// === THEME MANAGER (DARK/LIGHT MODE) ===
function setupTheme() {
  const toggleBtn = document.getElementById("themeToggleBtn");
  const sunIcon = document.getElementById("themeSunIcon");
  const moonIcon = document.getElementById("themeMoonIcon");
  
  const savedTheme = localStorage.getItem(STORAGE_PREFIX + "theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcons(savedTheme);

  toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem(STORAGE_PREFIX + "theme", nextTheme);
    updateThemeIcons(nextTheme);
  });

  function updateThemeIcons(theme) {
    if (theme === "dark") {
      sunIcon.style.display = "none";
      moonIcon.style.display = "block";
    } else {
      sunIcon.style.display = "block";
      moonIcon.style.display = "none";
    }
  }
}

// === MARKET SELECTOR ===
function setupMarketSelector() {
  const select = document.getElementById("marketConditionSelect");
  if (select) {
    currentMarketCondition = select.value;
    select.addEventListener("change", (e) => {
      currentMarketCondition = e.target.value;
      
      // Re-calculate and re-render everything affected
      renderDashboard();
      renderBacktestTable();
      
      if (activeIpoId) {
        openDetailModal(activeIpoId);
      }
    });
  }
}

// === RATING CALCULATION ENGINE (IPOHack Weighted Formula) ===
export function calculateOfficialRating(ipo, marketCondition) {
  // 1. VALUASI (Weight: 1)
  let peScore = 3.0;
  let pbvScore = 3.0;
  
  if (ipo.valuation && ipo.sectorAverages) {
    const pe = ipo.valuation.peRatio;
    const peAvg = ipo.sectorAverages.peRatio;
    
    if (pe === null || pe <= 0) {
      peScore = 2.0; // Startup / Unprofitable has higher risk
    } else {
      const peRatio = pe / peAvg;
      if (peRatio <= 0.7) peScore = 5.0;
      else if (peRatio <= 0.9) peScore = 4.0;
      else if (peRatio <= 1.1) peScore = 3.0;
      else if (peRatio <= 1.4) peScore = 2.0;
      else peScore = 1.0;
    }
    
    const pbv = ipo.valuation.pbvRatio;
    const pbvAvg = ipo.sectorAverages.pbvRatio;
    
    if (pbv === null || pbv <= 0) {
      pbvScore = 2.0;
    } else {
      const pbvRatio = pbv / pbvAvg;
      if (pbvRatio <= 0.7) pbvScore = 5.0;
      else if (pbvRatio <= 0.9) pbvScore = 4.0;
      else if (pbvRatio <= 1.1) pbvScore = 3.0;
      else if (pbvRatio <= 1.4) pbvScore = 2.0;
      else pbvScore = 1.0;
    }
  }
  const valuationScore = (peScore + pbvScore) / 2;

  // 2. HYPE IPO (Weight: 5)
  let hypeScore = 3.0;
  if (ipo.oversubscribed !== undefined) {
    const os = ipo.oversubscribed;
    if (os >= 40.0) hypeScore = 5.0;
    else if (os >= 25.0) hypeScore = 4.0;
    else if (os >= 12.0) hypeScore = 3.0;
    else if (os >= 5.0) hypeScore = 2.0;
    else hypeScore = 1.0;
  }

  // 3. KONDISI MARKET (Weight: 3)
  let marketScore = 3.0;
  if (marketCondition === "bullish") marketScore = 5.0;
  else if (marketCondition === "neutral") marketScore = 3.0;
  else if (marketCondition === "bearish") marketScore = 1.0;

  // 4. UNDERWRITER (Weight: 5)
  let underwriterScore = 3.0;
  if (ipo.underwriters && ipo.underwriters.length > 0) {
    const primaryUw = ipo.underwriters[0];
    const match = primaryUw.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      const uwCode = match[1];
      const uw = underwriterData.find(u => u.code === uwCode);
      if (uw) {
        underwriterScore = uw.reputationScore;
      }
    }
  }

  // 5. OWNER PERUSAHAAN (Weight: 4)
  let ownerScore = 3.0;
  if (ipo.owner && ipo.owner.reputationScore !== undefined) {
    ownerScore = ipo.owner.reputationScore;
  }

  // 6. DANA YANG DIHIMPUN (Weight: 3)
  let danaScore = 3.0;
  if (ipo.useOfProceeds && ipo.useOfProceeds.length > 0) {
    let weightedSum = 0;
    let totalPct = 0;
    ipo.useOfProceeds.forEach(item => {
      let itemVal = 3.0;
      if (item.category === "ekspansi") itemVal = 5.0;
      else if (item.category === "modal-kerja") itemVal = 3.0;
      else if (item.category === "bayar-utang") itemVal = 1.0;
      
      weightedSum += item.percentage * itemVal;
      totalPct += item.percentage;
    });
    if (totalPct > 0) {
      danaScore = weightedSum / totalPct;
    }
  }

  // Final Weighted Score Calculation
  const totalWeight = 21;
  const weightedSum = 
    (valuationScore * 1) + 
    (hypeScore * 5) + 
    (marketScore * 3) + 
    (underwriterScore * 5) + 
    (ownerScore * 4) + 
    (danaScore * 3);
    
  const finalRating = parseFloat((weightedSum / totalWeight).toFixed(1));

  return {
    rating: finalRating,
    breakdown: {
      valuasi: valuationScore,
      hype: hypeScore,
      market: marketScore,
      underwriter: underwriterScore,
      owner: ownerScore,
      dana: danaScore
    }
  };
}

// Helper to get verdict text based on rating score
function getSentimentText(score) {
  if (score >= 4.5) return { text: "AUTO ARA (⭐⭐⭐⭐⭐)", class: "sentiment-positive" };
  if (score >= 3.5) return { text: "LAYAK INVESTASI (⭐⭐⭐⭐)", class: "sentiment-positive" };
  if (score >= 2.5) return { text: "CUKUP (⭐⭐⭐)", class: "sentiment-neutral" };
  if (score >= 1.5) return { text: "KURANG LAYAK (⭐⭐)", class: "sentiment-negative" };
  return { text: "HINDARI / SKIP (⭐)", class: "sentiment-negative" };
}

// Helper to render stars in HTML
function getStarsHTML(score) {
  const fullStars = Math.floor(score);
  const halfStar = score % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  
  let html = "";
  for (let i = 0; i < fullStars; i++) html += '<i class="fa-solid fa-star"></i>';
  if (halfStar) html += '<i class="fa-solid fa-star-half-stroke"></i>';
  for (let i = 0; i < emptyStars; i++) html += '<i class="fa-regular fa-star"></i>';
  return html;
}

// === RENDER DASHBOARD & FILTER LOGIC ===
function setupFilters() {
  // Search input
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (e) => {
    filterState.searchQuery = e.target.value.toLowerCase().trim();
    renderDashboard();
  });

  // Status pills
  const statusPills = document.querySelectorAll("#statusFilterPills .filter-pill");
  statusPills.forEach(pill => {
    pill.addEventListener("click", () => {
      statusPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      filterState.status = pill.getAttribute("data-status");
      renderDashboard();
    });
  });

  // Populate sectors in sidebar
  const sectors = [...new Set(ipoData.map(ipo => ipo.sector))];
  const sectorContainer = document.getElementById("sectorCheckboxes");
  sectorContainer.innerHTML = sectors.map(sec => `
    <label class="filter-checkbox">
      <input type="checkbox" value="${sec}" class="sector-checkbox">
      <span>${sec}</span>
    </label>
  `).join("");

  document.querySelectorAll(".sector-checkbox").forEach(cb => {
    cb.addEventListener("change", () => {
      if (cb.checked) {
        filterState.sectors.add(cb.value);
      } else {
        filterState.sectors.delete(cb.value);
      }
      renderDashboard();
    });
  });

  // Extract all underwriters safely
  const underwritersSet = new Set();
  ipoData.forEach(ipo => {
    ipo.underwriters.forEach(uw => underwritersSet.add(uw));
  });
  const underwriters = [...underwritersSet].sort();
  const uwContainer = document.getElementById("underwriterCheckboxes");
  uwContainer.innerHTML = underwriters.map(uw => `
    <label class="filter-checkbox">
      <input type="checkbox" value="${uw}" class="uw-checkbox">
      <span title="${uw}">${uw}</span>
    </label>
  `).join("");

  document.querySelectorAll(".uw-checkbox").forEach(cb => {
    cb.addEventListener("change", () => {
      if (cb.checked) {
        filterState.underwriters.add(cb.value);
      } else {
        filterState.underwriters.delete(cb.value);
      }
      renderDashboard();
    });
  });

  // Sort dropdown
  const sortSelect = document.getElementById("sortSelect");
  sortSelect.addEventListener("change", (e) => {
    filterState.sort = e.target.value;
    renderDashboard();
  });

  // Underwriter search listener
  const uwSearchInput = document.getElementById("uwSearchInput");
  if (uwSearchInput) {
    uwSearchInput.addEventListener("input", renderUnderwritersList);
  }

  // Reset filter button
  const resetBtn = document.getElementById("resetFiltersBtn");
  resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    filterState.searchQuery = "";
    
    statusPills.forEach(p => p.classList.remove("active"));
    statusPills[0].classList.add("active");
    filterState.status = "all";

    document.querySelectorAll(".sector-checkbox").forEach(cb => cb.checked = false);
    filterState.sectors.clear();

    document.querySelectorAll(".uw-checkbox").forEach(cb => cb.checked = false);
    filterState.underwriters.clear();

    sortSelect.value = "default";
    filterState.sort = "default";

    renderDashboard();
  });
}

function renderDashboard() {
  const grid = document.getElementById("ipoCardsGrid");
  const countText = document.getElementById("ipoCountText");
  
  // Filter logic
  let filtered = ipoData.filter(ipo => {
    const matchesSearch = 
      ipo.ticker.toLowerCase().includes(filterState.searchQuery) ||
      ipo.name.toLowerCase().includes(filterState.searchQuery) ||
      ipo.underwriters.some(uw => uw.toLowerCase().includes(filterState.searchQuery));

    const matchesStatus = filterState.status === "all" || ipo.status === filterState.status;

    const matchesSector = filterState.sectors.size === 0 || filterState.sectors.has(ipo.sector);

    const matchesUnderwriter = filterState.underwriters.size === 0 || 
      ipo.underwriters.some(uw => filterState.underwriters.has(uw));

    return matchesSearch && matchesStatus && matchesSector && matchesUnderwriter;
  });

  // Sort logic
  if (filterState.sort === "rating-desc") {
    filtered.sort((a, b) => {
      const ratingA = calculateOfficialRating(a, currentMarketCondition).rating;
      const ratingB = calculateOfficialRating(b, currentMarketCondition).rating;
      return ratingB - ratingA;
    });
  } else if (filterState.sort === "price-asc") {
    filtered.sort((a, b) => {
      const priceA = a.price || (a.priceRange[0] + a.priceRange[1]) / 2;
      const priceB = b.price || (b.priceRange[0] + b.priceRange[1]) / 2;
      return priceA - priceB;
    });
  } else if (filterState.sort === "price-desc") {
    filtered.sort((a, b) => {
      const priceA = a.price || (a.priceRange[0] + a.priceRange[1]) / 2;
      const priceB = b.price || (b.priceRange[0] + b.priceRange[1]) / 2;
      return priceB - priceA;
    });
  } else if (filterState.sort === "shares-desc") {
    filtered.sort((a, b) => b.sharesOffered - a.sharesOffered);
  }

  // Update emiten count text
  countText.textContent = `Menampilkan ${filtered.length} Perusahaan IPO`;

  // Render cards
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
        <i class="fa-regular fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem; color: var(--text-muted);"></i>
        <p>Tidak ditemukan perusahaan IPO yang sesuai dengan kriteria filter Anda.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(ipo => {
    const official = calculateOfficialRating(ipo, currentMarketCondition);
    const officialScore = official.rating;
    const sentiment = getSentimentText(officialScore);
    const starsHTML = getStarsHTML(officialScore);

    let statusText = ipo.status.replace("-", " ");
    if (ipo.status === "allocation") {
      statusText = "allotment";
    }
    
    const priceText = ipo.price 
      ? `Rp ${ipo.price}` 
      : `Rp ${ipo.priceRange[0]} - ${ipo.priceRange[1]}`;

    const targetCapitalText = ipo.totalRaised 
      ? `Rp ${ipo.totalRaised} M` 
      : `Rp ${ipo.totalRaisedRange[0]} M - ${ipo.totalRaisedRange[1]} M`;

    return `
      <div class="card" data-id="${ipo.id}">
        <div class="card-header">
          <div class="company-badge">
            <div class="company-logo-placeholder">
              <img src="assets/logos/${ipo.id}.png" alt="${ipo.ticker}" class="company-logo">
            </div>
            <div class="company-title-wrapper">
              <span class="company-ticker">${ipo.ticker}</span>
              <span class="company-name" title="${ipo.name}">${ipo.name}</span>
            </div>
          </div>
          <span class="status-badge status-${ipo.status}">${statusText}</span>
        </div>

        <div class="card-body-stats">
          <div class="card-stat-item">
            <span class="stat-label">Harga Penawaran</span>
            <span class="stat-value">${priceText}</span>
          </div>
          <div class="card-stat-item">
            <span class="stat-label">Target Dana</span>
            <span class="stat-value" style="color: var(--primary);">${targetCapitalText}</span>
          </div>
          <div class="card-stat-item">
            <span class="stat-label">Sektor</span>
            <span class="stat-value" style="font-size: 0.9rem; font-weight: 500;">${ipo.sector}</span>
          </div>
          <div class="card-stat-item">
            <span class="stat-label">Tanggal Listing</span>
            <span class="stat-value" style="font-size: 0.85rem; font-weight: 500;">${ipo.listingDate}</span>
          </div>
        </div>

        <div class="card-footer-wrapper">
          <div class="card-footer-ratings">
            <span class="rating-total-votes" style="color: var(--warning); font-weight: 700;">
              ${starsHTML} <span style="color: var(--text-primary); font-size: 0.9rem;">${officialScore}</span>
            </span>
          </div>
          <div class="sentiment-gauge-bg">
            <div class="sentiment-gauge-fill ${sentiment.class}" style="width: ${officialScore * 20}%"></div>
          </div>
          <div style="font-size: 0.75rem; text-align: right; color: var(--text-muted); margin-top: 0.25rem; font-weight: 600;">
            Rating Resmi: <span class="${sentiment.class.replace('sentiment-', 'text-')}" style="font-weight: 700;">${sentiment.text}</span>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Attach card click handlers
  document.querySelectorAll("#ipoCardsGrid .card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");
      openDetailModal(id);
    });
  });
}

// === DETAIL MODAL LOGIC ===
function setupModalEvents() {
  const modal = document.getElementById("ipoDetailModal");
  const closeBtn = document.getElementById("modalCloseBtn");
  
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    activeIpoId = null;
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      activeIpoId = null;
    }
  });
}

function openDetailModal(id) {
  const ipo = ipoData.find(x => x.id === id);
  if (!ipo) return;

  activeIpoId = id;
  
  // Set basic data
  document.getElementById("modalLogo").innerHTML = `<img src="assets/logos/${ipo.id}.png" alt="${ipo.ticker}" class="company-logo">`;
  document.getElementById("modalTicker").textContent = ipo.ticker;
  document.getElementById("modalName").textContent = ipo.name;
  
  const statusBadge = document.getElementById("modalStatusBadge");
  statusBadge.className = `status-badge status-${ipo.status}`;
  let statusText = ipo.status.replace("-", " ");
  if (ipo.status === "allocation") {
    statusText = "allotment";
  }
  statusBadge.textContent = statusText;

  document.getElementById("modalDescription").innerHTML = `
    ${ipo.description}<br><br>
    <a href="${ipo.prospectusUrl}" target="_blank" class="nav-link" style="display: inline-flex; align-items: center; gap: 0.5rem; background: var(--bg-tertiary); padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid var(--border-color); font-weight: 600;">
      <i class="fa-solid fa-file-pdf" style="color: var(--danger);"></i> Baca Dokumen Prospektus Resmi
    </a>
  `;
  
  document.getElementById("modalUnderwriters").textContent = ipo.underwriters.join(", ");
  document.getElementById("modalUnderwriterTrackRecord").textContent = ipo.underwriterTrackRecord;
  
  document.getElementById("modalSharesOffered").textContent = formatNumber(ipo.sharesOffered) + " Lembar";
  
  const targetCapitalText = ipo.totalRaised 
    ? `Rp ${ipo.totalRaised} Miliar` 
    : `Rp ${ipo.totalRaisedRange[0]} M - ${ipo.totalRaisedRange[1]} Miliar`;
  document.getElementById("modalCapitalRaised").textContent = targetCapitalText;

  const riskBadge = document.getElementById("modalRiskFactor");
  riskBadge.textContent = ipo.riskFactor;
  if (ipo.riskFactor === "High") riskBadge.style.color = "var(--danger)";
  else if (ipo.riskFactor === "Medium") riskBadge.style.color = "var(--warning)";
  else riskBadge.style.color = "var(--primary)";

  document.getElementById("modalRiskDetails").textContent = `Faktor Risiko Utama: ${ipo.riskDetails}`;

  // Populate Owner Details
  document.getElementById("modalOwnerName").textContent = ipo.owner.name;
  document.getElementById("modalOwnerNotes").textContent = ipo.owner.notes;

  // Render Official Rating Breakdown
  const official = calculateOfficialRating(ipo, currentMarketCondition);
  const ratingVal = official.rating;
  const breakdown = official.breakdown;
  const verdict = getSentimentText(ratingVal);

  document.getElementById("modalOfficialScoreNum").textContent = `${ratingVal} / 5.0`;
  document.getElementById("modalOfficialStars").innerHTML = getStarsHTML(ratingVal);
  
  const verdictEl = document.getElementById("modalOfficialVerdict");
  verdictEl.textContent = verdict.text.split(" (")[0]; // remove stars from text
  verdictEl.className = `official-score-verdict ${verdict.class}`;
  verdictEl.style.color = ""; // let CSS color class take effect

  const paramsBreakdown = [
    { key: "valuasi", label: "Valuasi (PE/PBV vs Sektor)", icon: "fa-scale-balanced", weight: 1 },
    { key: "hype", label: "Hype IPO (Oversubscribed)", icon: "fa-fire", weight: 5 },
    { key: "market", label: "Kondisi Market", icon: "fa-cloud-sun", weight: 3 },
    { key: "underwriter", label: "Reputasi Underwriter", icon: "fa-building-columns", weight: 5 },
    { key: "owner", label: "Owner / Pengendali", icon: "fa-user-tie", weight: 4 },
    { key: "dana", label: "Penggunaan Dana IPO", icon: "fa-pie-chart", weight: 3 }
  ];

  const breakdownContainer = document.getElementById("modalOfficialBreakdown");
  breakdownContainer.innerHTML = paramsBreakdown.map(p => {
    const score = breakdown[p.key];
    const stars = getStarsHTML(score);
    return `
      <div class="breakdown-row">
        <span class="breakdown-label" title="${p.label}">
          <i class="fa-solid ${p.icon}"></i> ${p.label.split(" (")[0]}
        </span>
        <div class="breakdown-rating-wrap">
          <span class="breakdown-stars">${stars}</span>
          <span style="font-weight: 700; color: var(--text-primary); font-size: 0.8rem; min-width: 28px; text-align: right;">${score.toFixed(1)}</span>
          <span class="breakdown-weight" title="Bobot: ${p.weight}">x${p.weight}</span>
        </div>
      </div>
    `;
  }).join("");

  // Valuation meters rendering
  const peVal = ipo.valuation.peRatio;
  const pbvVal = ipo.valuation.pbvRatio;
  const peAvg = ipo.sectorAverages.peRatio;
  const pbvAvg = ipo.sectorAverages.pbvRatio;

  document.getElementById("valPeText").innerHTML = `<b>${peVal > 0 ? peVal + "x" : "N/A"}</b> (Sektor: ${peAvg}x)`;
  document.getElementById("valPbvText").innerHTML = `<b>${pbvVal}x</b> (Sektor: ${pbvAvg}x)`;

  const peRatioCalc = Math.max(10, Math.min(90, (peAvg / (peVal || peAvg)) * 50));
  const pbvRatioCalc = Math.max(10, Math.min(90, (pbvAvg / pbvVal) * 50));

  const peFill = document.getElementById("valPeFill");
  peFill.style.width = `${peRatioCalc}%`;
  peFill.className = `valuation-meter-bar-fill ${peVal <= peAvg && peVal > 0 ? 'sentiment-positive' : 'sentiment-negative'}`;

  const pbvFill = document.getElementById("valPbvFill");
  pbvFill.style.width = `${pbvRatioCalc}%`;
  pbvFill.className = `valuation-meter-bar-fill ${pbvVal <= pbvAvg ? 'sentiment-positive' : 'sentiment-negative'}`;

  document.getElementById("valPeMarker").style.left = "50%";
  document.getElementById("valPbvMarker").style.left = "50%";

  // Use of Proceeds Bars
  const proceedsContainer = document.getElementById("modalUseOfProceeds");
  proceedsContainer.innerHTML = ipo.useOfProceeds.map(item => {
    let catBadgeColor = "var(--text-muted)";
    let catText = "Modal Kerja";
    if (item.category === "ekspansi") {
      catBadgeColor = "var(--primary)";
      catText = "Ekspansi";
    } else if (item.category === "bayar-utang") {
      catBadgeColor = "var(--danger)";
      catText = "Bayar Utang";
    }
    
    return `
      <div class="proceeds-item-row">
        <div style="flex: 1; display: flex; flex-direction: column; gap: 0.15rem;">
          <span class="proceeds-text-desc" style="font-weight: 500;" title="${item.purpose}">${item.purpose}</span>
          <span style="font-size: 0.72rem; color: ${catBadgeColor}; font-weight: 600;">Kategori: ${catText}</span>
        </div>
        <div class="proceeds-bar-container">
          <div class="proceeds-bar-fill" style="width: ${item.percentage}%; background-color: ${catBadgeColor};"></div>
        </div>
        <span class="proceeds-percentage-badge" style="color: ${catBadgeColor};">${item.percentage}%</span>
      </div>
    `;
  }).join("");

  // Financial Chart Twin columns rendering
  renderFinancialChart(ipo.financials);

  // Open the Modal
  document.getElementById("ipoDetailModal").classList.add("active");
}

function renderFinancialChart(financials) {
  const chartWrapper = document.getElementById("chartVisualWrapper");
  
  let maxVal = 100;
  financials.forEach(f => {
    const rev = Math.abs(f.revenue);
    const prof = Math.abs(f.netProfit);
    if (rev > maxVal) maxVal = rev;
    if (prof > maxVal) maxVal = prof;
  });

  chartWrapper.innerHTML = financials.map(f => {
    const revPercent = Math.max(5, (f.revenue / maxVal) * 100);
    const isLoss = f.netProfit < 0;
    const profitPercent = Math.max(5, (Math.abs(f.netProfit) / maxVal) * 100);

    return `
      <div class="chart-bar-group">
        <div class="chart-bar-twin-columns">
          
          <div class="chart-column column-revenue" style="height: ${revPercent}%;">
            <div class="column-tooltip">Pendapatan: Rp ${f.revenue} M</div>
          </div>
          
          <div class="chart-column ${isLoss ? 'sentiment-negative' : 'column-profit'}" 
               style="height: ${profitPercent}%; ${isLoss ? 'border-radius: 0 0 4px 4px; border-bottom: 2px solid var(--danger);' : ''}">
            <div class="column-tooltip">Laba Bersih: Rp ${f.netProfit} M ${isLoss ? '(Rugi)' : ''}</div>
          </div>

        </div>
        <span class="chart-bar-label">${f.year}</span>
      </div>
    `;
  }).join("");
}

// === RENDER UNDERWRITERS LIST & SEARCH ===
function renderUnderwritersList() {
  const container = document.getElementById("underwritersListGrid");
  if (!container) return;
  
  const query = document.getElementById("uwSearchInput").value.toLowerCase().trim();
  
  const filteredUws = underwriterData.filter(uw => 
    uw.code.toLowerCase().includes(query) || 
    uw.name.toLowerCase().includes(query)
  );
  
  if (filteredUws.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
        <p>Tidak ditemukan underwriter yang sesuai dengan pencarian Anda.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filteredUws.map(uw => {
    const starsHTML = getStarsHTML(uw.reputationScore);
    
    const lossRate = Math.round(100 - uw.winRate);
    const gainSign = uw.avgGain >= 0 ? "+" : "";
    const gainColor = uw.avgGain >= 0 ? "var(--primary)" : "var(--danger)";
    const gainBorder = uw.avgGain >= 0 ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)";
    
    const repClass = Math.floor(uw.reputationScore);
    
    return `
      <div class="uw-card rep-${repClass}">
        <div class="uw-card-header">
          <div class="uw-title-wrapper">
            <span class="uw-name-text">${uw.name}</span>
            <div class="uw-rating-stars">${starsHTML}</div>
          </div>
          <span class="uw-code-badge">${uw.code}</span>
        </div>
        
        <div class="uw-stats-row">
          <div class="uw-stat-box">
            <span class="uw-stat-val-big">${uw.totalIpos}</span>
            <span class="uw-stat-label-small">Total IPO</span>
          </div>
          <div class="uw-stat-box" style="border-color: rgba(16, 185, 129, 0.2);">
            <span class="uw-stat-val-big" style="color: var(--primary);">${uw.winRate}%</span>
            <span class="uw-stat-label-small">Win Rate 1D</span>
          </div>
          <div class="uw-stat-box" style="border-color: rgba(245, 158, 11, 0.2);">
            <span class="uw-stat-val-big" style="color: var(--warning);">${uw.avgAra}x</span>
            <span class="uw-stat-label-small">Avg. ARA</span>
          </div>
          <div class="uw-stat-box" style="border-color: ${gainBorder};">
            <span class="uw-stat-val-big" style="color: ${gainColor};">${gainSign}${uw.avgGain}%</span>
            <span class="uw-stat-label-small">Avg. Gain H-1</span>
          </div>
        </div>
        
        <div class="uw-bar-container" style="margin-bottom: 0;">
          <div class="uw-bar-label-row">
            <span>Rasio Win Rate 1D</span>
            <span>${uw.winRate}% Win / ${lossRate}% Loss</span>
          </div>
          <div class="uw-ratio-bar-bg">
            <div class="uw-ratio-bar-ara" style="width: ${uw.winRate}%;" title="Win Rate: ${uw.winRate}%"></div>
            <div class="uw-ratio-bar-arb" style="width: ${lossRate}%;" title="Loss: ${lossRate}%"></div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// === RENDER BACKTEST TABLE ===
function renderBacktestTable() {
  const tableBody = document.getElementById("backtestTableBody");
  if (!tableBody) return;
  
  const listedIpos = ipoData.filter(ipo => ipo.status === "listed" && ipo.actualPerformance);
  
  tableBody.innerHTML = listedIpos.map(ipo => {
    const official = calculateOfficialRating(ipo, currentMarketCondition);
    const rating = official.rating;
    const stars = getStarsHTML(rating);
    
    const day1 = ipo.actualPerformance.day1Return;
    const day1Status = ipo.actualPerformance.day1Status;
    
    let badgeClass = "up";
    if (day1Status === "ARA") badgeClass = "ara";
    if (day1Status === "ARB") badgeClass = "arb";
    
    const returnText = day1 > 0 ? `+${day1}%` : `${day1}%`;
    const perfBadge = `<span class="perf-badge ${badgeClass}">${day1Status} (${returnText})</span>`;
    
    let predictionStatus = "Sesuai Ekspektasi";
    let predictionColor = "var(--primary)";
    
    if (rating >= 4.0 && day1Status === "ARA") {
      predictionStatus = "Sangat Akurat (ARA)";
    } else if (rating < 2.5 && day1Status === "ARB") {
      predictionStatus = "Sangat Akurat (ARB)";
    } else if (rating >= 2.5 && rating < 4.0 && day1Status === "Naik") {
      predictionStatus = "Tepat (Moderat)";
    } else if ((rating >= 4.0 && day1Status === "ARB") || (rating < 2.5 && day1Status === "ARA")) {
      predictionStatus = "Meleset";
      predictionColor = "var(--danger)";
    } else {
      predictionStatus = "Sesuai";
      predictionColor = "var(--info)";
    }
    
    const accuracyBadge = `<span class="accuracy-badge" style="color: ${predictionColor}; background-color: ${predictionColor}10;"><i class="fa-solid fa-circle-check"></i> ${predictionStatus}</span>`;
    
    return `
      <tr>
        <td>
          <div style="font-weight: 700; color: var(--text-primary);">${ipo.ticker}</div>
          <div style="font-size: 0.8rem; color: var(--text-secondary);">${ipo.name}</div>
        </td>
        <td>${ipo.sector}</td>
        <td>
          <div style="font-weight: 500; font-size: 0.85rem;">${ipo.owner.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary);">Skor Owner: ${ipo.owner.reputationScore}/5</div>
        </td>
        <td style="text-align: center;">
          <div style="font-weight: 700; font-size: 1rem; color: var(--warning);">${stars}</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">Skor: ${rating}</div>
        </td>
        <td style="text-align: center;">${perfBadge}</td>
        <td style="text-align: center;">${accuracyBadge}</td>
      </tr>
    `;
  }).join("");
}

// === UTILS ===
function formatNumber(num) {
  if (num >= 1.0e+9) return (num / 1.0e+9).toFixed(2) + " Miliar";
  if (num >= 1.0e+6) return (num / 1.0e+6).toFixed(2) + " Juta";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
