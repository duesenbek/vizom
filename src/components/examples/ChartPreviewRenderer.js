/**
 * @file ChartPreviewRenderer.js
 * @description Renders mini chart previews for demo cards and quick prompts.
 * Uses Chart.js with lazy loading and debouncing for performance.
 * @version 1.0.0
 */

import chartExamples from './examples.json';

/** @type {Map<string, Chart>} */
const chartInstances = new Map();

/** @type {IntersectionObserver|null} */
let lazyObserver = null;

/** @type {Map<string, number>} */
const debounceTimers = new Map();

/**
 * Color palettes for different chart types
 */
const COLOR_PALETTES = {
  bar: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'],
  line: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
  pie: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4'],
  doughnut: ['#6366F1', '#8B5CF6', '#A855F7', '#C084FC', '#D8B4FE'],
  radar: ['#0EA5E9', '#38BDF8', '#7DD3FC', '#BAE6FD', '#E0F2FE'],
  scatter: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7'],
  area: ['#14B8A6', '#2DD4BF', '#5EEAD4', '#99F6E4', '#CCFBF1'],
  polar: ['#EC4899', '#F472B6', '#F9A8D4', '#FBCFE8', '#FCE7F3'],
  bubble: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'],
  force: ['#6366F1', '#8B5CF6', '#A855F7', '#C084FC', '#D8B4FE'],
  treemap: ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4'],
  sankey: ['#3B82F6', '#60A5FA', '#93C5FD', '#10B981', '#34D399', '#6EE7B7']
};

/**
 * Default chart options for mini previews
 */
const MINI_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 300 },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  },
  scales: {
    x: { display: false },
    y: { display: false }
  }
};

/**
 * Get Chart.js reference
 * @returns {typeof Chart|undefined}
 */
function getChartJS() {
  return typeof Chart !== 'undefined' ? Chart : window.Chart;
}

/**
 * Get examples for a specific chart type
 * @param {string} chartType 
 * @returns {Array}
 */
export function getExamplesForType(chartType) {
  return chartExamples.examples[chartType] || [];
}

/**
 * Get all chart examples
 * @returns {Object}
 */
export function getAllExamples() {
  return chartExamples.examples;
}

/**
 * Get a specific example by ID
 * @param {string} exampleId 
 * @returns {Object|null}
 */
export function getExampleById(exampleId) {
  for (const type of Object.keys(chartExamples.examples)) {
    const example = chartExamples.examples[type].find(e => e.id === exampleId);
    if (example) {
      return { ...example, chartType: type };
    }
  }
  return null;
}

/**
 * Render SVG preview for force graph
 * @param {HTMLElement} container 
 * @param {Object} example 
 */
function renderForceGraphSVG(container, example) {
  const colors = COLOR_PALETTES.force;
  const nodes = example.nodes || [];
  const links = example.links || [];
  const w = container.clientWidth || 100;
  const h = container.clientHeight || 80;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.35;
  
  // Position nodes in a circle
  const nodePositions = nodes.map((_, i) => {
    const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle)
    };
  });
  
  // Build SVG
  const linksSVG = links.map(([from, to]) => {
    const p1 = nodePositions[from];
    const p2 = nodePositions[to];
    if (!p1 || !p2) return '';
    return `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${colors[0]}40" stroke-width="1.5"/>`;
  }).join('');
  
  const nodesSVG = nodePositions.map((pos, i) => 
    `<circle cx="${pos.x}" cy="${pos.y}" r="4" fill="${colors[i % colors.length]}"/>`
  ).join('');
  
  container.innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" class="chart-preview-svg">
      ${linksSVG}
      ${nodesSVG}
    </svg>
  `;
}

/**
 * Render SVG preview for treemap
 * @param {HTMLElement} container 
 * @param {Object} example 
 */
function renderTreemapSVG(container, example) {
  const colors = COLOR_PALETTES.treemap;
  const data = example.data || [];
  const total = data.reduce((a, b) => a + b, 0) || 1;
  const w = container.clientWidth || 100;
  const h = container.clientHeight || 80;
  const padding = 2;
  
  // Simple squarified treemap layout
  let rects = [];
  let x = padding;
  let y = padding;
  let remainingW = w - padding * 2;
  let remainingH = h - padding * 2;
  let remainingData = [...data];
  let remainingTotal = total;
  let horizontal = true;
  
  while (remainingData.length > 0) {
    const value = remainingData.shift();
    const ratio = value / remainingTotal;
    remainingTotal -= value;
    
    if (horizontal) {
      const rectW = remainingW * ratio;
      rects.push({ x, y, w: rectW - 1, h: remainingH - 1 });
      x += rectW;
      remainingW -= rectW;
    } else {
      const rectH = remainingH * ratio;
      rects.push({ x, y, w: remainingW - 1, h: rectH - 1 });
      y += rectH;
      remainingH -= rectH;
    }
    horizontal = !horizontal;
  }
  
  const rectsSVG = rects.map((r, i) => 
    `<rect x="${r.x}" y="${r.y}" width="${Math.max(0, r.w)}" height="${Math.max(0, r.h)}" 
           fill="${colors[i % colors.length]}" rx="2" opacity="0.85"/>`
  ).join('');
  
  container.innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" class="chart-preview-svg">
      ${rectsSVG}
    </svg>
  `;
}

/**
 * Render SVG preview for sankey diagram
 * @param {HTMLElement} container 
 * @param {Object} example 
 */
function renderSankeySVG(container, example) {
  const colors = COLOR_PALETTES.sankey;
  const nodes = example.nodes || [];
  const flows = example.flows || [];
  const w = container.clientWidth || 100;
  const h = container.clientHeight || 80;
  const nodeW = 8;
  const padding = 4;
  
  // Simple left-to-right layout
  const levels = new Map();
  const visited = new Set();
  
  // Assign levels based on flow direction
  function assignLevel(nodeIdx, level) {
    if (visited.has(nodeIdx)) return;
    visited.add(nodeIdx);
    levels.set(nodeIdx, Math.max(levels.get(nodeIdx) || 0, level));
    flows.filter(f => f.from === nodeIdx).forEach(f => assignLevel(f.to, level + 1));
  }
  
  // Start from nodes that have no incoming flows
  const hasIncoming = new Set(flows.map(f => f.to));
  nodes.forEach((_, i) => {
    if (!hasIncoming.has(i)) assignLevel(i, 0);
  });
  
  // Position nodes
  const maxLevel = Math.max(...levels.values(), 0);
  const levelCounts = {};
  const nodePositions = [];
  
  nodes.forEach((_, i) => {
    const level = levels.get(i) || 0;
    levelCounts[level] = (levelCounts[level] || 0) + 1;
  });
  
  const levelCurrentY = {};
  nodes.forEach((_, i) => {
    const level = levels.get(i) || 0;
    const count = levelCounts[level] || 1;
    levelCurrentY[level] = levelCurrentY[level] || padding;
    const x = padding + (level / Math.max(maxLevel, 1)) * (w - nodeW - padding * 2);
    const y = levelCurrentY[level];
    const nodeH = (h - padding * 2) / count - 2;
    nodePositions[i] = { x, y, h: nodeH };
    levelCurrentY[level] += nodeH + 2;
  });
  
  // Draw flows
  const flowsSVG = flows.map((f, i) => {
    const from = nodePositions[f.from];
    const to = nodePositions[f.to];
    if (!from || !to) return '';
    const x1 = from.x + nodeW;
    const y1 = from.y + from.h / 2;
    const x2 = to.x;
    const y2 = to.y + to.h / 2;
    const cx1 = x1 + (x2 - x1) * 0.4;
    const cx2 = x1 + (x2 - x1) * 0.6;
    return `<path d="M${x1},${y1} C${cx1},${y1} ${cx2},${y2} ${x2},${y2}" 
                  fill="none" stroke="${colors[i % colors.length]}60" stroke-width="3"/>`;
  }).join('');
  
  // Draw nodes
  const nodesSVG = nodePositions.map((pos, i) => 
    `<rect x="${pos.x}" y="${pos.y}" width="${nodeW}" height="${pos.h}" 
           fill="${colors[i % colors.length]}" rx="1"/>`
  ).join('');
  
  container.innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" class="chart-preview-svg">
      ${flowsSVG}
      ${nodesSVG}
    </svg>
  `;
}

/**
 * Check if chart type requires SVG rendering (not Chart.js)
 * @param {string} chartType 
 * @returns {boolean}
 */
function requiresSVGRendering(chartType) {
  return ['force', 'treemap', 'sankey'].includes(chartType);
}

/**
 * Render SVG-based chart preview
 * @param {HTMLElement} container 
 * @param {Object} example 
 * @param {string} chartType 
 */
function renderSVGChart(container, example, chartType) {
  switch (chartType) {
    case 'force':
      renderForceGraphSVG(container, example);
      break;
    case 'treemap':
      renderTreemapSVG(container, example);
      break;
    case 'sankey':
      renderSankeySVG(container, example);
      break;
  }
}

/**
 * Build Chart.js config from example data
 * @param {Object} example 
 * @param {string} chartType 
 * @returns {Object}
 */
function buildChartConfig(example, chartType) {
  const colors = COLOR_PALETTES[chartType] || COLOR_PALETTES.bar;
  const type = chartType === 'area' ? 'line' : chartType;
  
  const baseDataset = {
    label: example.title || 'Data',
    data: example.data,
    backgroundColor: chartType === 'line' || chartType === 'radar' 
      ? colors[0] + '40' 
      : colors,
    borderColor: chartType === 'line' || chartType === 'radar' || chartType === 'area'
      ? colors[0]
      : colors,
    borderWidth: chartType === 'pie' || chartType === 'doughnut' ? 0 : 2,
    tension: 0.4,
    fill: chartType === 'area',
    pointRadius: chartType === 'scatter' ? 4 : 0,
    pointBackgroundColor: colors[0]
  };

  // Handle bubble chart special case
  if (chartType === 'bubble' && example.sizes) {
    baseDataset.data = example.data.map((y, i) => ({
      x: i * 10 + 10,
      y: y,
      r: (example.sizes[i] || 50) / 10
    }));
  }

  // Handle scatter chart
  if (chartType === 'scatter') {
    baseDataset.data = example.data.map((y, i) => ({
      x: parseInt(example.labels[i]) || i * 10,
      y: y
    }));
  }

  const config = {
    type,
    data: {
      labels: example.labels,
      datasets: [baseDataset]
    },
    options: {
      ...MINI_CHART_OPTIONS,
      scales: chartType === 'pie' || chartType === 'doughnut' || chartType === 'polar' || chartType === 'radar'
        ? {}
        : MINI_CHART_OPTIONS.scales
    }
  };

  // Radar chart specific options
  if (chartType === 'radar') {
    config.options.scales = {
      r: {
        display: false,
        beginAtZero: true
      }
    };
  }

  // Polar area specific type
  if (chartType === 'polar') {
    config.type = 'polarArea';
    config.options.scales = {
      r: { display: false }
    };
  }

  return config;
}

/**
 * Render a mini chart preview into a canvas element or container
 * @param {HTMLCanvasElement|HTMLElement} canvasOrContainer 
 * @param {Object} example 
 * @param {string} chartType 
 * @returns {Chart|null}
 */
export function renderMiniChart(canvasOrContainer, example, chartType) {
  // Handle SVG-based charts (force, treemap, sankey)
  if (requiresSVGRendering(chartType)) {
    const container = canvasOrContainer.tagName === 'CANVAS' 
      ? canvasOrContainer.parentElement 
      : canvasOrContainer;
    if (container) {
      renderSVGChart(container, example, chartType);
    }
    return null;
  }

  const ChartJS = getChartJS();
  const canvas = canvasOrContainer.tagName === 'CANVAS' 
    ? canvasOrContainer 
    : canvasOrContainer.querySelector('canvas');
    
  if (!ChartJS || !canvas) {
    console.warn('[ChartPreviewRenderer] Chart.js not available or canvas missing');
    return null;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Destroy existing chart if any
  const existingId = canvas.dataset.chartId;
  if (existingId && chartInstances.has(existingId)) {
    try {
      chartInstances.get(existingId).destroy();
    } catch (e) { /* ignore */ }
    chartInstances.delete(existingId);
  }

  const config = buildChartConfig(example, chartType);
  const chart = new ChartJS(ctx, config);
  
  const chartId = `preview-${example.id}-${Date.now()}`;
  canvas.dataset.chartId = chartId;
  chartInstances.set(chartId, chart);

  return chart;
}

/**
 * Render chart preview with debouncing
 * @param {HTMLCanvasElement} canvas 
 * @param {Object} example 
 * @param {string} chartType 
 * @param {number} delay 
 */
export function renderMiniChartDebounced(canvas, example, chartType, delay = 100) {
  const key = canvas.dataset.chartId || example.id;
  
  if (debounceTimers.has(key)) {
    clearTimeout(debounceTimers.get(key));
  }

  const timer = setTimeout(() => {
    renderMiniChart(canvas, example, chartType);
    debounceTimers.delete(key);
  }, delay);

  debounceTimers.set(key, timer);
}

/**
 * Initialize lazy loading observer for chart previews
 * @param {string} selector - CSS selector for preview containers
 */
export function initLazyLoading(selector = '.chart-preview-container') {
  if (lazyObserver) {
    lazyObserver.disconnect();
  }

  lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const container = entry.target;
        const exampleId = container.dataset.exampleId;
        const chartType = container.dataset.chartType;

        if (exampleId && chartType) {
          const example = getExampleById(exampleId);
          if (example) {
            // For SVG-based charts, render directly to container
            if (requiresSVGRendering(chartType)) {
              renderSVGChart(container, example, chartType);
            } else {
              // For Chart.js charts, use canvas
              const canvas = container.querySelector('canvas');
              if (canvas) {
                renderMiniChartDebounced(canvas, example, chartType, 50);
              }
            }
          }
        }

        lazyObserver.unobserve(container);
      }
    });
  }, {
    rootMargin: '50px',
    threshold: 0.1
  });

  document.querySelectorAll(selector).forEach(container => {
    lazyObserver.observe(container);
  });
}

/**
 * Create a chart preview card element
 * @param {Object} example 
 * @param {string} chartType 
 * @param {Object} options 
 * @returns {HTMLElement}
 */
export function createPreviewCard(example, chartType, options = {}) {
  const {
    showTitle = true,
    showDescription = false,
    showTryButton = true,
    onTryClick = null,
    cardClass = '',
    previewHeight = '120px'
  } = options;

  const card = document.createElement('div');
  card.className = `chart-preview-card group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:border-blue-400 cursor-pointer ${cardClass}`;
  card.dataset.exampleId = example.id;
  card.dataset.chartType = chartType;
  card.dataset.prompt = example.prompt;

  card.innerHTML = `
    <div class="chart-preview-container relative bg-slate-50 p-2" 
         data-example-id="${example.id}" 
         data-chart-type="${chartType}"
         style="height: ${previewHeight}">
      <canvas class="chart-preview-canvas w-full h-full"></canvas>
    </div>
    ${showTitle || showDescription ? `
      <div class="p-3 flex-1 flex flex-col">
        ${showTitle ? `<h4 class="text-sm font-semibold text-slate-900 line-clamp-1">${example.title}</h4>` : ''}
        ${showDescription ? `<p class="mt-1 text-xs text-slate-500 line-clamp-2">${example.description}</p>` : ''}
        ${showTryButton ? `
          <button class="try-example-btn mt-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700 mt-2">
            <i class="fas fa-bolt text-[0.65rem]"></i>
            Try this
          </button>
        ` : ''}
      </div>
    ` : ''}
  `;

  // Attach try button handler
  const tryBtn = card.querySelector('.try-example-btn');
  if (tryBtn) {
    tryBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onTryClick) {
        onTryClick(example, chartType);
      } else {
        applyExampleToGenerator(example, chartType);
      }
    });
  }

  // Card click also triggers try
  card.addEventListener('click', () => {
    if (onTryClick) {
      onTryClick(example, chartType);
    } else {
      applyExampleToGenerator(example, chartType);
    }
  });

  return card;
}

/**
 * Apply an example to the generator
 * @param {Object} example 
 * @param {string} chartType 
 */
export function applyExampleToGenerator(example, chartType) {
  // Set chart type
  const chartOption = document.querySelector(`.chart-option[data-type="${chartType}"]`);
  if (chartOption) {
    chartOption.click();
  }

  // Set prompt with data
  const promptInput = document.getElementById('prompt-input');
  if (promptInput) {
    const dataJson = JSON.stringify({
      labels: example.labels,
      data: example.data
    });
    promptInput.value = dataJson;
    promptInput.dispatchEvent(new Event('input', { bubbles: true }));
    promptInput.focus();
  }

  // Trigger chart generation
  const generateBtn = document.getElementById('generate-chart');
  if (generateBtn) {
    setTimeout(() => generateBtn.click(), 100);
  }
}

/**
 * Render all chart type previews in the sidebar
 * @param {HTMLElement} container 
 */
export function renderChartTypePreviews(container) {
  if (!container) return;

  const chartTypes = ['bar', 'line', 'pie', 'doughnut', 'area', 'scatter', 'bubble', 'radar', 'polar', 'force', 'treemap', 'sankey'];
  
  chartTypes.forEach(type => {
    const examples = getExamplesForType(type);
    if (examples.length > 0) {
      const firstExample = examples[0];
      const previewContainer = container.querySelector(`[data-type="${type}"] .chart-preview-container`);
      
      if (previewContainer) {
        // For SVG-based charts, don't add canvas
        if (!requiresSVGRendering(type)) {
          const canvas = previewContainer.querySelector('canvas') || document.createElement('canvas');
          if (!previewContainer.contains(canvas)) {
            canvas.className = 'chart-preview-canvas w-full h-full';
            previewContainer.appendChild(canvas);
          }
        }
        
        previewContainer.dataset.exampleId = firstExample.id;
        previewContainer.dataset.chartType = type;
      }
    }
  });

  initLazyLoading('.chart-preview-container');
}

/**
 * Render quick prompt cards with real chart previews
 * @param {HTMLElement} container 
 * @param {Object} options 
 */
export function renderQuickPromptCards(container, options = {}) {
  if (!container) return;

  const {
    chartTypes = ['bar', 'line', 'pie', 'scatter'],
    examplesPerType = 1,
    onTryClick = null
  } = options;

  container.innerHTML = '';

  chartTypes.forEach(type => {
    const examples = getExamplesForType(type);
    const selectedExamples = examples.slice(0, examplesPerType);

    selectedExamples.forEach(example => {
      const card = createPreviewCard(example, type, {
        showTitle: true,
        showDescription: false,
        showTryButton: true,
        onTryClick,
        previewHeight: '80px'
      });
      container.appendChild(card);
    });
  });

  // Initialize lazy loading after cards are added
  setTimeout(() => initLazyLoading('.chart-preview-container'), 0);
}

/**
 * Cleanup all chart instances
 */
export function cleanup() {
  chartInstances.forEach((chart, id) => {
    try {
      chart.destroy();
    } catch (e) { /* ignore */ }
  });
  chartInstances.clear();
  debounceTimers.forEach(timer => clearTimeout(timer));
  debounceTimers.clear();
  
  if (lazyObserver) {
    lazyObserver.disconnect();
    lazyObserver = null;
  }
}

// Export for global access
if (typeof window !== 'undefined') {
  window.ChartPreviewRenderer = {
    getExamplesForType,
    getAllExamples,
    getExampleById,
    renderMiniChart,
    renderMiniChartDebounced,
    initLazyLoading,
    createPreviewCard,
    applyExampleToGenerator,
    renderChartTypePreviews,
    renderQuickPromptCards,
    cleanup
  };
}

export default {
  getExamplesForType,
  getAllExamples,
  getExampleById,
  renderMiniChart,
  renderMiniChartDebounced,
  initLazyLoading,
  createPreviewCard,
  applyExampleToGenerator,
  renderChartTypePreviews,
  renderQuickPromptCards,
  cleanup
};
