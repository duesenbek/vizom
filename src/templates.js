// Template data with prompts
const templates = {
  'sales-dashboard': {
    title: 'Sales Dashboard',
    category: 'business',
    visualType: 'dashboard',
    description: 'A comprehensive sales dashboard with KPI cards, revenue charts, and top products table. Perfect for monthly sales reports and executive presentations.',
    prompt: `Create a sales dashboard with:
- Total Revenue card: $250,000 (green trend +15%)
- New Customers card: 145 (blue icon)
- Conversion Rate card: 3.2%
- Average Order Value card: $1,724
- Monthly revenue bar chart (last 6 months): Jan $35k, Feb $42k, Mar $48k, Apr $45k, May $52k, Jun $58k
- Top 5 products table with units sold and revenue
Use Tailwind grid layout with cards, shadows, and modern styling`
  },
  'revenue-chart': {
    title: 'Revenue Growth Chart',
    category: 'business',
    visualType: 'line',
    description: 'Track revenue trends over time with a beautiful line chart. Includes smooth animations and gradient fills.',
    prompt: `Create a line chart showing revenue growth over 12 months:
Jan: $45k, Feb: $48k, Mar: $52k, Apr: $49k, May: $55k, Jun: $58k,
Jul: $62k, Aug: $65k, Sep: $68k, Oct: $72k, Nov: $75k, Dec: $80k
Use gradient fill, smooth curves, and professional styling with Tailwind`
  },
  'research-data': {
    title: 'Research Data Table',
    category: 'academic',
    visualType: 'table',
    description: 'Professional table layout for research findings. Features sortable columns, striped rows, and clean typography.',
    prompt: `Generate a research data table with:
Study ID | Sample Size | Mean | Std Dev | P-Value | Significance
Study A | 120 | 4.52 | 0.83 | 0.003 | Yes
Study B | 95 | 3.87 | 0.91 | 0.042 | Yes
Study C | 150 | 4.21 | 0.76 | 0.156 | No
Study D | 110 | 4.89 | 0.68 | 0.001 | Yes
Use professional academic styling with Tailwind, striped rows, and hover effects`
  },
  'survey-results': {
    title: 'Survey Results',
    category: 'academic',
    visualType: 'pie',
    description: 'Visualize survey responses with pie charts. Ideal for questionnaires and feedback analysis.',
    prompt: `Create a pie chart showing survey results:
Strongly Agree: 35%
Agree: 28%
Neutral: 22%
Disagree: 10%
Strongly Disagree: 5%
Use vibrant colors, percentage labels, and legend. Add title "Customer Satisfaction Survey Results"`
  },
  'campaign-performance': {
    title: 'Campaign Performance',
    category: 'marketing',
    visualType: 'dashboard',
    description: 'Track marketing campaign metrics including impressions, clicks, conversions, and ROI.',
    prompt: `Create a marketing campaign performance dashboard with:
- Impressions: 1.2M (card with eye icon)
- Clicks: 45.2K (CTR: 3.77%)
- Conversions: 1,450 (conversion rate: 3.2%)
- ROI: 285% (green indicator)
- Weekly performance line chart showing clicks over 8 weeks
- Campaign comparison bar chart (Email, Social, PPC, Display)
Use marketing-focused colors and modern card layout`
  },
  'social-media': {
    title: 'Social Media Analytics',
    category: 'marketing',
    visualType: 'bar',
    description: 'Dashboard for tracking social media engagement across platforms. Includes follower growth, engagement rate, and top posts.',
    prompt: `Build a social media analytics dashboard with:
- Total Followers: 125.4K (+12% this month)
- Engagement Rate: 4.8%
- Total Posts: 156
- Avg Likes per Post: 2,340
- Follower growth line chart (last 30 days)
- Engagement by platform pie chart (Instagram 45%, Twitter 30%, Facebook 15%, LinkedIn 10%)
- Top 3 posts table with likes, comments, shares
Use social media brand colors and modern dashboard layout`
  }
};

/**
 * Render templates into the grid dynamically
 */
function renderTemplates() {
  const grid = document.getElementById('template-grid');
  if (!grid) return;
  let html = '';
  Object.entries(templates).forEach(([id, t]) => {
    const vType = t.visualType || 'bar';
    const palette = getCategoryPalette(t.category);
    const badges = buildBadges(id);
    const meta = buildMeta(id);
    const preview = t.preview || generateRichPreview(vType, t.category, palette);
    html += `
      <div class="template-card template-card-min" data-category="${t.category}" data-template-id="${id}">
        <div class="aspect-video rounded-lg flex items-center justify-center relative overflow-hidden bg-white" style="border:1px solid ${palette.border}">
          ${preview}
          <div class="absolute top-2 right-2 category-tag">${t.category.charAt(0).toUpperCase() + t.category.slice(1)}</div>
          <div class="absolute top-2 left-2 flex flex-wrap gap-1">${badges}</div>
        </div>
        <div class="p-2">
          <h3 class="font-semibold text-lg mb-1">${t.title}</h3>
          <div class="flex items-center gap-3 text-xs text-slate-500 mb-2">${meta}</div>
          <p class="text-sm text-slate-600 mb-3">${t.description}</p>
          <div class="flex flex-col gap-2">
            <button class="use-template-btn w-full btn btn-primary text-sm inline-flex items-center justify-center gap-2" data-i18n="templates.cards.use">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/></svg>
              Use
            </button>
            <div class="flex gap-2">
              <button class="preview-btn flex-1 btn btn-outline text-xs inline-flex items-center justify-center gap-2" data-i18n="templates.cards.preview">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-4.553a1.5 1.5 0 10-2.121-2.121L12.879 7.879M19 21H5a2 2 0 01-2-2V7"/></svg>
                Preview
              </button>
              <button class="details-btn flex-1 btn btn-outline text-xs inline-flex items-center justify-center gap-2" data-i18n="templates.cards.details">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V5m0 9v3m-7-7H5m14 0h1"/></svg>
                Details
              </button>
            </div>
          </div>
        </div>
      </div>`;
  });
  grid.innerHTML = html;
}

// Build badges (Popular/New/Free/Pro)
function buildBadges(id) {
  const flags = [];
  const cls = 'inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border border-slate-200 bg-white text-slate-700';
  if (id.includes('01') || id.includes('sales')) flags.push(`<span class="${cls}">Popular</span>`);
  if (id.includes('revenue') || id.endsWith('02')) flags.push(`<span class="${cls}">New</span>`);
  if (id.includes('research') || id.endsWith('03')) flags.push(`<span class="${cls}">Free</span>`);
  if (id.includes('campaign') || id.endsWith('04')) flags.push(`<span class="${cls}">Pro</span>`);
  return flags.join('');
}

// Build meta row: complexity + rating
function buildMeta(id) {
  const complex = (id.includes('dashboard') || id.includes('campaign')) ? 'Advanced' : 'Beginner';
  const ratingVal = (id.includes('sales') || id.includes('revenue')) ? 4.8 : 4.5;
  const stars = '★★★★★'.slice(0, Math.round(ratingVal)) + '☆☆☆☆☆'.slice(0, 5 - Math.round(ratingVal));
  return `
    <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full" style="background:#9ca3af"></span>${complex}</span>
    <span class="inline-flex items-center gap-1">${stars}<span class="text-slate-400">(${ratingVal.toFixed(1)})</span></span>
  `;
}

// Category palettes
function getCategoryPalette(category) {
  switch (category) {
    case 'business':
      return { primary: '#3B82F6', secondary: '#93C5FD', accent: '#1D4ED8', grid: '#E5E7EB', border: '#E5E7EB' };
    case 'academic':
      return { primary: '#10B981', secondary: '#6EE7B7', accent: '#047857', grid: '#E5E7EB', border: '#E5E7EB' };
    case 'marketing':
      return { primary: '#8B5CF6', secondary: '#D8B4FE', accent: '#EC4899', grid: '#E5E7EB', border: '#E5E7EB' };
    default:
      return { primary: '#111827', secondary: '#9CA3AF', accent: '#111827', grid: '#E5E7EB', border: '#E5E7EB' };
  }
}

// Type inference for bulk templates
function inferTypeFromId(id, category) {
  const order = ['bar', 'line', 'pie', 'table', 'dashboard'];
  const idx = [...id].reduce((a, c) => a + c.charCodeAt(0), 0) % order.length;
  return order[idx];
}

// Rich SVG previews per type
function generateRichPreview(type, category, palette) {
  switch (type) {
    case 'bar':
      return barPreview(palette);
    case 'line':
      return linePreview(palette);
    case 'pie':
      return piePreview(palette);
    case 'table':
      return tablePreview();
    case 'dashboard':
    default:
      return dashboardPreview(palette);
  }
}

function barPreview(palette) {
  const data = [
    { label: 'Jan', value: 35000, display: '$35K' },
    { label: 'Feb', value: 42000, display: '$42K' },
    { label: 'Mar', value: 48000, display: '$48K' },
    { label: 'Apr', value: 45000, display: '$45K' },
    { label: 'May', value: 52000, display: '$52K' },
    { label: 'Jun', value: 58000, display: '$58K' }
  ];
  const max = Math.max(...data.map(d => d.value));
  const chartHeight = 140;
  const barWidth = 36;
  const gap = 14;
  const startX = 30;
  const baseY = 170;
  
  const bars = data.map((d, i) => {
    const height = (d.value / max) * chartHeight;
    const x = startX + i * (barWidth + gap);
    const y = baseY - height;
    return `
      <g>
        <defs>
          <linearGradient id="barGrad${i}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${palette.primary}" />
            <stop offset="100%" stop-color="${palette.primary}" stop-opacity="0.6" />
          </linearGradient>
        </defs>
        <rect x="${x}" y="${y}" width="${barWidth}" height="${height}" rx="4" fill="url(#barGrad${i})" />
        <text x="${x + barWidth/2}" y="${y - 6}" text-anchor="middle" font-size="9" font-weight="600" fill="${palette.primary}">${d.display}</text>
        <text x="${x + barWidth/2}" y="${baseY + 14}" text-anchor="middle" font-size="10" fill="#6B7280">${d.label}</text>
      </g>
    `;
  }).join('');
  
  return `
  <svg viewBox="0 0 360 200" width="100%" height="100%" style="font-family: Inter, system-ui, sans-serif;">
    <rect width="360" height="200" fill="#FFFFFF"/>
    ${gridLines(30, baseY, 360, palette.grid)}
    <line x1="20" y1="${baseY}" x2="340" y2="${baseY}" stroke="#E5E7EB" stroke-width="2"/>
    ${bars}
  </svg>`;
}

function linePreview(palette) {
  const series1 = [
    { x: 30, y: 140, label: 'Jan', value: '1.2K' },
    { x: 80, y: 120, label: 'Feb', value: '1.5K' },
    { x: 130, y: 100, label: 'Mar', value: '1.8K' },
    { x: 180, y: 90, label: 'Apr', value: '2.1K' },
    { x: 230, y: 70, label: 'May', value: '2.4K' },
    { x: 280, y: 50, label: 'Jun', value: '2.8K' }
  ];
  
  const points1 = series1.map(p => `${p.x},${p.y}`).join(' ');
  const areaPoints = `30,170 ${points1} 280,170`;
  
  const circles = series1.map(p => `
    <circle cx="${p.x}" cy="${p.y}" r="4" fill="#FFFFFF" stroke="${palette.primary}" stroke-width="2">
      <title>${p.label}: ${p.value}</title>
    </circle>
  `).join('');
  
  const labels = series1.map(p => `
    <text x="${p.x}" y="188" text-anchor="middle" font-size="10" fill="#6B7280">${p.label}</text>
  `).join('');
  
  return `
  <svg viewBox="0 0 360 200" width="100%" height="100%" style="font-family: Inter, system-ui, sans-serif;">
    <defs>
      <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${palette.primary}" stop-opacity="0.3" />
        <stop offset="100%" stop-color="${palette.primary}" stop-opacity="0.05" />
      </linearGradient>
    </defs>
    <rect width="360" height="200" fill="#FFFFFF"/>
    ${gridLines(30, 170, 360, palette.grid)}
    <line x1="20" y1="170" x2="340" y2="170" stroke="#E5E7EB" stroke-width="2"/>
    <polygon points="${areaPoints}" fill="url(#lineAreaGrad)" />
    <polyline points="${points1}" fill="none" stroke="${palette.primary}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    ${circles}
    ${labels}
    <g transform="translate(310, 45)">
      <path d="M0 6 L6 0 L12 6" fill="none" stroke="${palette.primary}" stroke-width="2" stroke-linecap="round"/>
      <text x="-8" y="5" font-size="10" font-weight="600" fill="${palette.primary}">↑24%</text>
    </g>
  </svg>`;
}

function piePreview(palette) {
  const segments = [
    { label: 'Product A', percent: 45, color: palette.primary },
    { label: 'Product B', percent: 30, color: palette.accent },
    { label: 'Product C', percent: 25, color: palette.secondary }
  ];
  
  let currentAngle = -90; // Start from top
  const cx = 110, cy = 90, r = 55;
  
  const slices = segments.map((seg, idx) => {
    const angle = (seg.percent / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    // Explode first segment slightly
    const explodeOffset = idx === 0 ? 8 : 0;
    const midAngle = (startAngle + endAngle) / 2;
    const midRad = (midAngle * Math.PI) / 180;
    const offsetX = explodeOffset * Math.cos(midRad);
    const offsetY = explodeOffset * Math.sin(midRad);
    
    const labelAngle = (startAngle + angle / 2) * Math.PI / 180;
    const labelR = r * 0.7;
    const labelX = cx + labelR * Math.cos(labelAngle) + offsetX;
    const labelY = cy + labelR * Math.sin(labelAngle) + offsetY;
    
    return `
      <g transform="translate(${offsetX}, ${offsetY})">
        <path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z" 
              fill="${seg.color}" stroke="#FFFFFF" stroke-width="2">
          <title>${seg.label}: ${seg.percent}%</title>
        </path>
        <text x="${labelX}" y="${labelY}" text-anchor="middle" font-size="11" font-weight="700" fill="#FFFFFF">${seg.percent}%</text>
      </g>
    `;
  }).join('');
  
  const legendItems = segments.map((seg, idx) => `
    <g transform="translate(10, ${150 + idx * 18})">
      <rect width="12" height="12" rx="2" fill="${seg.color}" />
      <text x="18" y="10" font-size="10" fill="#374151">${seg.label} — ${seg.percent}%</text>
    </g>
  `).join('');
  
  return `
  <svg viewBox="0 0 220 200" width="100%" height="100%" style="font-family: Inter, system-ui, sans-serif;">
    <rect width="220" height="200" fill="#FFFFFF"/>
    ${slices}
    ${legendItems}
  </svg>`;
}

function tablePreview() {
  const rows = [
    { name: 'Alpha Pro', revenue: '$580K', growth: '+12.5%', progress: 85, positive: true },
    { name: 'Beta Suite', revenue: '$425K', growth: '+8.2%', progress: 65, positive: true },
    { name: 'Gamma Plus', revenue: '$310K', growth: '+5.1%', progress: 48, positive: true },
    { name: 'Delta Core', revenue: '$195K', growth: '-2.3%', progress: 30, positive: false }
  ];
  
  const headerRow = `
    <g>
      <rect x="20" y="30" width="320" height="28" fill="#F9FAFB" rx="4"/>
      <text x="30" y="50" font-size="11" font-weight="700" fill="#374151">Product</text>
      <text x="160" y="50" font-size="11" font-weight="700" fill="#374151">Revenue</text>
      <text x="240" y="50" font-size="11" font-weight="700" fill="#374151">Growth</text>
      <path d="M325 44 l4 4 l4-4" stroke="#9CA3AF" stroke-width="1.5" fill="none"/>
    </g>
  `;
  
  const dataRows = rows.map((row, idx) => {
    const y = 68 + idx * 30;
    const bgColor = idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
    const growthColor = row.positive ? '#10B981' : '#EF4444';
    const progressColor = row.positive ? '#3B82F6' : '#EF4444';
    
    return `
      <g>
        <rect x="20" y="${y}" width="320" height="28" fill="${bgColor}"/>
        <text x="30" y="${y + 18}" font-size="10" fill="#111827">${row.name}</text>
        <text x="160" y="${y + 18}" font-size="10" font-weight="600" fill="#111827">${row.revenue}</text>
        <text x="240" y="${y + 18}" font-size="10" font-weight="600" fill="${growthColor}">${row.growth}</text>
        <rect x="285" y="${y + 10}" width="50" height="8" rx="4" fill="#E5E7EB"/>
        <rect x="285" y="${y + 10}" width="${row.progress * 0.5}" height="8" rx="4" fill="${progressColor}"/>
      </g>
    `;
  }).join('');
  
  return `
  <svg viewBox="0 0 360 200" width="100%" height="100%" style="font-family: Inter, system-ui, sans-serif;">
    <rect width="360" height="200" fill="#FFFFFF"/>
    <rect x="20" y="28" width="320" height="160" rx="8" fill="none" stroke="#E5E7EB" stroke-width="1"/>
    ${headerRow}
    ${dataRows}
  </svg>`;
}

function dashboardPreview(palette) {
  const kpiCards = `
    <g>
      <rect x="20" y="16" width="100" height="48" rx="8" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1"/>
      <text x="30" y="32" font-size="9" fill="#6B7280">Total Revenue</text>
      <text x="30" y="50" font-size="16" font-weight="700" fill="#111827">$125K</text>
      <text x="85" y="50" font-size="10" font-weight="600" fill="${palette.primary}">↑15%</text>
    </g>
    <g>
      <rect x="130" y="16" width="100" height="48" rx="8" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1"/>
      <text x="140" y="32" font-size="9" fill="#6B7280">Customers</text>
      <text x="140" y="50" font-size="16" font-weight="700" fill="#111827">2,450</text>
      <text x="195" y="50" font-size="10" font-weight="600" fill="${palette.accent}">↑8%</text>
    </g>
    <g>
      <rect x="240" y="16" width="100" height="48" rx="8" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1"/>
      <text x="250" y="32" font-size="9" fill="#6B7280">Conversion</text>
      <text x="250" y="50" font-size="16" font-weight="700" fill="#111827">3.2%</text>
      <text x="295" y="50" font-size="10" font-weight="600" fill="#10B981">↑0.5%</text>
    </g>
  `;
  
  const miniBarData = [45, 60, 52, 70, 65, 80];
  const miniBars = miniBarData.map((h, i) => {
    const x = 30 + i * 18;
    const barHeight = h * 0.6;
    return `<rect x="${x}" y="${130 - barHeight}" width="12" height="${barHeight}" rx="2" fill="${palette.primary}" opacity="${0.6 + i * 0.08}"/>`;
  }).join('');
  
  const miniChart = `
    <g>
      <rect x="20" y="76" width="150" height="100" rx="8" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1"/>
      <text x="30" y="92" font-size="10" font-weight="600" fill="#374151">Weekly Sales</text>
      ${miniBars}
      <line x1="30" y1="130" x2="140" y2="130" stroke="#E5E7EB" stroke-width="1"/>
    </g>
  `;
  
  const miniTable = `
    <g>
      <rect x="180" y="76" width="160" height="100" rx="8" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1"/>
      <text x="190" y="92" font-size="10" font-weight="600" fill="#374151">Top Products</text>
      <text x="190" y="110" font-size="9" fill="#6B7280">Alpha Pro</text>
      <text x="280" y="110" font-size="9" font-weight="600" fill="#111827">$45K</text>
      <rect x="190" y="116" width="140" height="4" rx="2" fill="#E5E7EB"/>
      <rect x="190" y="116" width="105" height="4" rx="2" fill="${palette.primary}"/>
      
      <text x="190" y="132" font-size="9" fill="#6B7280">Beta Suite</text>
      <text x="280" y="132" font-size="9" font-weight="600" fill="#111827">$32K</text>
      <rect x="190" y="138" width="140" height="4" rx="2" fill="#E5E7EB"/>
      <rect x="190" y="138" width="75" height="4" rx="2" fill="${palette.accent}"/>
      
      <text x="190" y="154" font-size="9" fill="#6B7280">Gamma Plus</text>
      <text x="280" y="154" font-size="9" font-weight="600" fill="#111827">$28K</text>
      <rect x="190" y="160" width="140" height="4" rx="2" fill="#E5E7EB"/>
      <rect x="190" y="160" width="65" height="4" rx="2" fill="${palette.secondary}"/>
    </g>
  `;
  
  return `
  <svg viewBox="0 0 360 200" width="100%" height="100%" style="font-family: Inter, system-ui, sans-serif;">
    <rect width="360" height="200" fill="#F8FAFC"/>
    ${kpiCards}
    ${miniChart}
    ${miniTable}
  </svg>`;
}

// Helpers SVG
function gridLines(startY, endY, width, color) {
  const lines = [];
  const step = 35;
  for (let y = startY; y < endY; y += step) {
    lines.push(`<line x1="20" y1="${y}" x2="${width - 20}" y2="${y}" stroke="${color}" stroke-width="0.5" stroke-dasharray="2,2" opacity="0.5"/>`);
  }
  return lines.join('');
}
// Old helper functions removed - replaced by inline implementations in preview functions above

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Render templates (only hand-crafted ones)
  renderTemplates();
  // Init UI behaviors
  initializeFilters();
  initializeTemplateCards();
  initializeModal();
  initializeLazyLoading();
  // Re-apply i18n to dynamic nodes if available
  if (window.VIZOM_I18N?.apply) {
    window.VIZOM_I18N.apply();
  }
});

/**
 * Initialize filter buttons
 */
function initializeFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      // Update button styles for sidebar
      filterButtons.forEach(b => {
        b.classList.remove('active', 'bg-slate-900', 'text-white');
        b.classList.add('text-slate-700');
      });
      btn.classList.add('active', 'bg-slate-900', 'text-white');
      btn.classList.remove('text-slate-700');
      
      // Filter templates
      filterTemplates(filter);
    });
  });
  
  // View toggle
  const viewGrid = document.getElementById('view-grid');
  const viewList = document.getElementById('view-list');
  const templateGrid = document.getElementById('template-grid');
  
  if (viewGrid && viewList && templateGrid) {
    viewGrid.addEventListener('click', () => {
      templateGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
      viewGrid.classList.add('border-slate-900', 'bg-slate-900', 'text-white');
      viewGrid.classList.remove('border-slate-200', 'text-slate-700');
      viewList.classList.remove('border-slate-900', 'bg-slate-900', 'text-white');
      viewList.classList.add('border-slate-200', 'text-slate-700');
    });
    
    viewList.addEventListener('click', () => {
      templateGrid.className = 'grid grid-cols-1 gap-4';
      viewList.classList.add('border-slate-900', 'bg-slate-900', 'text-white');
      viewList.classList.remove('border-slate-200', 'text-slate-700');
      viewGrid.classList.remove('border-slate-900', 'bg-slate-900', 'text-white');
      viewGrid.classList.add('border-slate-200', 'text-slate-700');
    });
  }
}

/**
 * Filter templates by category
 */
function filterTemplates(category) {
  const cards = document.querySelectorAll('.template-card');
  
  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'block';
      // Fade in animation
      card.style.opacity = '0';
      setTimeout(() => {
        card.style.transition = 'opacity 0.3s ease';
        card.style.opacity = '1';
      }, 10);
    } else {
      card.style.display = 'none';
    }
  });
}

/**
 * Initialize template card buttons
 */
function initializeTemplateCards() {
  const useButtons = document.querySelectorAll('.use-template-btn');
  const previewButtons = document.querySelectorAll('.preview-btn');
  
  useButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.template-card');
      const templateId = card.dataset.templateId;
      useTemplate(templateId);
    });
  });
  
  previewButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.template-card');
      const templateId = card.dataset.templateId;
      showPreview(templateId);
    });
  });
}

/**
 * Use template - redirect to generator with prompt
 */
function useTemplate(templateId) {
  const template = templates[templateId];
  if (!template) return;
  
  // Store template prompt in sessionStorage
  sessionStorage.setItem('templatePrompt', template.prompt);
  if (template.preview) {
    sessionStorage.setItem('templateHTML', template.preview);
  }
  
  // Redirect to generator
  window.location.href = 'generator.html';
}

/**
 * Show template preview in modal
 */
function showPreview(templateId) {
  const template = templates[templateId];
  if (!template) return;
  
  const modal = document.getElementById('template-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalPreviewMedia = document.getElementById('modal-preview-media');
  const useBtn = document.getElementById('modal-use-template');
  
  // Generate preview if not present
  const vType = template.visualType || 'bar';
  const palette = getCategoryPalette(template.category);
  const preview = template.preview || generateRichPreview(vType, template.category, palette);
  
  // Update modal content
  modalTitle.textContent = template.title;
  
  // Update preview media
  if (modalPreviewMedia) {
    modalPreviewMedia.innerHTML = preview;
  }
  
  modalDescription.innerHTML = `
    <div class="space-y-3">
      <div>
        <span class="inline-block px-3 py-1 rounded-full text-xs font-medium category-tag">
          ${template.category.charAt(0).toUpperCase() + template.category.slice(1)}
        </span>
      </div>
      <p class="text-base">${template.description}</p>
      <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div class="text-sm font-medium text-slate-700 mb-2">Template Includes:</div>
        <pre class="text-xs text-slate-600 whitespace-pre-wrap font-mono">${template.prompt}</pre>
      </div>
    </div>
  `;
  
  // Set up use button
  useBtn.onclick = () => {
    useTemplate(templateId);
  };
  
  // Show modal
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

/**
 * Get category color classes
 */
function getCategoryColor(category) {
  // Minimalist neutral pill; color palette controlled by CSS
  return 'category-tag';
}

/**
 * Initialize modal controls
 */
function initializeModal() {
  const modal = document.getElementById('template-modal');
  const closeBtn = document.getElementById('close-modal');
  const cancelBtn = document.getElementById('modal-close');
  
  // Close modal handlers
  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };
  
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

/**
 * Initialize lazy loading for template cards with Intersection Observer
 */
function initializeLazyLoading() {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          
          // Add fade-in animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
          
          // Stop observing once loaded
          observer.unobserve(card);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });
    
    // Observe all template cards
    document.querySelectorAll('.template-card').forEach(card => {
      observer.observe(card);
    });
  }
}
