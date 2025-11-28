/**
 * Chart Registry - All available chart types
 * Divided into FREE and PRO tiers
 * Library selection is automatic based on chart type
 */

export const CHART_TYPES = {
  // ==================== CHART.JS (FREE) ====================
  bar: {
    id: 'bar',
    name: 'Bar Chart',
    icon: 'fa-chart-bar',
    library: 'chartjs',
    tier: 'free',
    description: 'Compare categories side-by-side',
    category: 'basic',
    dataFormat: 'labels-values'
  },
  line: {
    id: 'line',
    name: 'Line Chart',
    icon: 'fa-chart-line',
    library: 'chartjs',
    tier: 'free',
    description: 'Show trends over time',
    category: 'basic',
    dataFormat: 'labels-values'
  },
  pie: {
    id: 'pie',
    name: 'Pie Chart',
    icon: 'fa-chart-pie',
    library: 'chartjs',
    tier: 'free',
    description: 'Show proportions of a whole',
    category: 'basic',
    dataFormat: 'labels-values'
  },
  doughnut: {
    id: 'doughnut',
    name: 'Doughnut',
    icon: 'fa-circle-notch',
    library: 'chartjs',
    tier: 'free',
    description: 'Pie chart with center cutout',
    category: 'basic',
    dataFormat: 'labels-values'
  },
  radar: {
    id: 'radar',
    name: 'Radar Chart',
    icon: 'fa-spider',
    library: 'chartjs',
    tier: 'free',
    description: 'Compare multiple variables',
    category: 'basic',
    dataFormat: 'labels-values'
  },
  scatter: {
    id: 'scatter',
    name: 'Scatter Plot',
    icon: 'fa-braille',
    library: 'chartjs',
    tier: 'free',
    description: 'Show correlation between variables',
    category: 'basic',
    dataFormat: 'xy-points'
  },
  polarArea: {
    id: 'polarArea',
    name: 'Polar Area',
    icon: 'fa-compass',
    library: 'chartjs',
    tier: 'free',
    description: 'Radial bar chart',
    category: 'basic',
    dataFormat: 'labels-values'
  },
  bubble: {
    id: 'bubble',
    name: 'Bubble Chart',
    icon: 'fa-circle',
    library: 'chartjs',
    tier: 'free',
    description: 'Three-dimensional scatter plot',
    category: 'basic',
    dataFormat: 'xyz-points'
  },

  // ==================== APEXCHARTS (PRO) ====================
  apexLine: {
    id: 'apexLine',
    name: 'Animated Line',
    icon: 'fa-wave-square',
    library: 'apexcharts',
    tier: 'pro',
    description: 'Smooth animated trend lines',
    category: 'professional',
    dataFormat: 'labels-values'
  },
  heatmap: {
    id: 'heatmap',
    name: 'Heatmap',
    icon: 'fa-th',
    library: 'apexcharts',
    tier: 'pro',
    description: 'Color intensity visualization',
    category: 'professional',
    dataFormat: 'matrix'
  },
  candlestick: {
    id: 'candlestick',
    name: 'Candlestick',
    icon: 'fa-chart-candlestick',
    library: 'apexcharts',
    tier: 'pro',
    description: 'Financial OHLC data',
    category: 'professional',
    dataFormat: 'ohlc'
  },
  rangeArea: {
    id: 'rangeArea',
    name: 'Range Area',
    icon: 'fa-chart-area',
    library: 'apexcharts',
    tier: 'pro',
    description: 'Show min/max ranges',
    category: 'professional',
    dataFormat: 'range'
  },
  timeline: {
    id: 'timeline',
    name: 'Timeline',
    icon: 'fa-timeline',
    library: 'apexcharts',
    tier: 'pro',
    description: 'Gantt-like project timeline',
    category: 'professional',
    dataFormat: 'timeline'
  },
  radialBar: {
    id: 'radialBar',
    name: 'Radial Bar',
    icon: 'fa-circle-notch',
    library: 'apexcharts',
    tier: 'pro',
    description: 'Circular progress indicators',
    category: 'professional',
    dataFormat: 'labels-values'
  },
  treemapApex: {
    id: 'treemapApex',
    name: 'Treemap',
    icon: 'fa-th-large',
    library: 'apexcharts',
    tier: 'pro',
    description: 'Hierarchical data rectangles',
    category: 'professional',
    dataFormat: 'hierarchical'
  },

  // ==================== ECHARTS (PRO) ====================
  treemap: {
    id: 'treemap',
    name: 'Treemap',
    icon: 'fa-th-large',
    library: 'echarts',
    tier: 'pro',
    description: 'Nested hierarchical rectangles',
    category: 'advanced',
    dataFormat: 'hierarchical'
  },
  sunburst: {
    id: 'sunburst',
    name: 'Sunburst',
    icon: 'fa-sun',
    library: 'echarts',
    tier: 'pro',
    description: 'Radial hierarchical chart',
    category: 'advanced',
    dataFormat: 'hierarchical'
  },
  graph: {
    id: 'graph',
    name: 'Network Graph',
    icon: 'fa-project-diagram',
    library: 'echarts',
    tier: 'pro',
    description: 'Node relationships visualization',
    category: 'advanced',
    dataFormat: 'nodes-links'
  },
  funnel: {
    id: 'funnel',
    name: 'Funnel',
    icon: 'fa-filter',
    library: 'echarts',
    tier: 'pro',
    description: 'Conversion stages flow',
    category: 'advanced',
    dataFormat: 'labels-values'
  },
  gauge: {
    id: 'gauge',
    name: 'Gauge',
    icon: 'fa-tachometer-alt',
    library: 'echarts',
    tier: 'pro',
    description: 'Progress/KPI indicator',
    category: 'advanced',
    dataFormat: 'single-value'
  },
  sankey: {
    id: 'sankey',
    name: 'Sankey Diagram',
    icon: 'fa-random',
    library: 'echarts',
    tier: 'pro',
    description: 'Flow and connections',
    category: 'advanced',
    dataFormat: 'nodes-links'
  },
  parallel: {
    id: 'parallel',
    name: 'Parallel Coordinates',
    icon: 'fa-grip-lines-vertical',
    library: 'echarts',
    tier: 'pro',
    description: 'Multivariate data analysis',
    category: 'advanced',
    dataFormat: 'multivariate'
  },

  // ==================== PLOTLY (PRO) ====================
  boxPlot: {
    id: 'boxPlot',
    name: 'Box Plot',
    icon: 'fa-box',
    library: 'plotly',
    tier: 'pro',
    description: 'Statistical distribution',
    category: 'scientific',
    dataFormat: 'distribution'
  },
  violin: {
    id: 'violin',
    name: 'Violin Plot',
    icon: 'fa-guitar',
    library: 'plotly',
    tier: 'pro',
    description: 'Distribution shape visualization',
    category: 'scientific',
    dataFormat: 'distribution'
  },
  waterfall: {
    id: 'waterfall',
    name: 'Waterfall',
    icon: 'fa-water',
    library: 'plotly',
    tier: 'pro',
    description: 'Cumulative breakdown',
    category: 'scientific',
    dataFormat: 'waterfall'
  },
  scatter3d: {
    id: 'scatter3d',
    name: '3D Scatter',
    icon: 'fa-cube',
    library: 'plotly',
    tier: 'pro',
    description: 'Three-dimensional points',
    category: 'scientific',
    dataFormat: 'xyz-points'
  },
  surface3d: {
    id: 'surface3d',
    name: '3D Surface',
    icon: 'fa-mountain',
    library: 'plotly',
    tier: 'pro',
    description: '3D surface visualization',
    category: 'scientific',
    dataFormat: 'matrix'
  },
  contour: {
    id: 'contour',
    name: 'Contour Plot',
    icon: 'fa-layer-group',
    library: 'plotly',
    tier: 'pro',
    description: '2D heatmap with contours',
    category: 'scientific',
    dataFormat: 'matrix'
  }
};

// Simple FREE vs PRO grouping
export const CHART_TIERS = {
  free: {
    name: 'Free Charts',
    icon: 'fa-chart-simple',
    charts: ['bar', 'line', 'pie', 'doughnut', 'radar', 'scatter', 'polarArea', 'bubble']
  },
  pro: {
    name: 'Pro Charts',
    icon: 'fa-crown',
    charts: [
      // ApexCharts
      'apexLine', 'heatmap', 'candlestick', 'rangeArea', 'timeline', 'radialBar', 'treemapApex',
      // ECharts
      'treemap', 'sunburst', 'graph', 'funnel', 'gauge', 'sankey', 'parallel',
      // Plotly
      'boxPlot', 'violin', 'waterfall', 'scatter3d', 'surface3d', 'contour'
    ]
  }
};

// Get chart by ID
export function getChartType(id) {
  return CHART_TYPES[id] || null;
}

// Get FREE charts
export function getFreeCharts() {
  return Object.values(CHART_TYPES).filter(c => c.tier === 'free');
}

// Get PRO charts
export function getProCharts() {
  return Object.values(CHART_TYPES).filter(c => c.tier === 'pro');
}

// Check if chart is available for user
export function isChartAvailable(chartId, userTier = 'free') {
  const chart = CHART_TYPES[chartId];
  if (!chart) return false;
  if (chart.tier === 'free') return true;
  return userTier === 'pro';
}

// Get library for chart type (automatic selection)
export function getLibraryForChart(chartId) {
  const chart = CHART_TYPES[chartId];
  return chart?.library || 'chartjs';
}

export default CHART_TYPES;
