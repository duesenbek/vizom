/**
 * Subscription Configuration
 * Defines Free vs Pro feature matrix
 * 
 * KEY PRINCIPLE: All chart TYPES are FREE
 * Only premium TEMPLATES are Pro-gated
 */

export const SUBSCRIPTION_TIERS = Object.freeze({
  FREE: 'free',
  PRO: 'pro'
});

export const PRICING = Object.freeze({
  PRO_MONTHLY: 2.99,
  PRO_YEARLY_MONTHLY: 2.39, // $28.68/year billed annually
  PRO_YEARLY_TOTAL: 28.68
});

// All available chart types - ALL FREE
const ALL_CHART_TYPES = [
  'bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea', 
  'scatter', 'bubble', 'area', 'mixed', 'treemap', 'sankey', 
  'funnel', 'gauge', 'heatmap', 'waterfall', 'boxplot', 'candlestick'
];

/**
 * Feature limits by tier
 */
export const FEATURE_LIMITS = Object.freeze({
  [SUBSCRIPTION_TIERS.FREE]: {
    // Chart types - ALL FREE!
    chartTypes: ALL_CHART_TYPES,
    
    // Templates - only basic ones
    maxTemplates: 5,
    templateAccess: 'basic',
    
    // Export - PNG free, others Pro
    exportFormats: ['png'],
    
    // AI Generation
    aiGenerationsPerDay: 5,
    
    // Storage
    maxSavedCharts: 3,
    
    // Features
    customColors: true, // Basic colors free
    advancedAnimations: false,
    prioritySupport: false,
    watermark: true,
    
    // Branding
    showUpgradePrompts: true,
    showProBadges: true
  },
  
  [SUBSCRIPTION_TIERS.PRO]: {
    // Chart types - ALL (same as free)
    chartTypes: ALL_CHART_TYPES,
    
    // Templates - ALL including premium
    maxTemplates: Infinity,
    templateAccess: 'all',
    
    // Export - ALL formats
    exportFormats: ['png', 'svg', 'pdf', 'json'],
    
    // AI Generation - Unlimited
    aiGenerationsPerDay: Infinity,
    
    // Storage - Unlimited
    maxSavedCharts: Infinity,
    
    // Features
    customColors: true,
    advancedAnimations: true,
    prioritySupport: true,
    watermark: false,
    
    // Branding
    showUpgradePrompts: false,
    showProBadges: false
  }
});

/**
 * Chart types - ALL FREE, no Pro gating
 */
export const CHART_TYPES = Object.freeze({
  // Basic Charts
  bar: { name: 'Bar Chart', icon: 'fa-chart-bar', isPro: false, library: 'chartjs' },
  line: { name: 'Line Chart', icon: 'fa-chart-line', isPro: false, library: 'chartjs' },
  pie: { name: 'Pie Chart', icon: 'fa-chart-pie', isPro: false, library: 'chartjs' },
  doughnut: { name: 'Doughnut', icon: 'fa-circle-notch', isPro: false, library: 'chartjs' },
  
  // Statistical Charts
  radar: { name: 'Radar Chart', icon: 'fa-spider', isPro: false, library: 'chartjs' },
  polarArea: { name: 'Polar Area', icon: 'fa-compass', isPro: false, library: 'chartjs' },
  scatter: { name: 'Scatter Plot', icon: 'fa-braille', isPro: false, library: 'chartjs' },
  bubble: { name: 'Bubble Chart', icon: 'fa-circle', isPro: false, library: 'chartjs' },
  
  // Advanced Charts
  area: { name: 'Area Chart', icon: 'fa-mountain', isPro: false, library: 'chartjs' },
  mixed: { name: 'Mixed Chart', icon: 'fa-layer-group', isPro: false, library: 'chartjs' },
  
  // Premium Visualizations (still FREE, just use advanced libraries)
  treemap: { name: 'Treemap', icon: 'fa-th-large', isPro: false, library: 'echarts' },
  sankey: { name: 'Sankey Diagram', icon: 'fa-stream', isPro: false, library: 'echarts' },
  funnel: { name: 'Funnel Chart', icon: 'fa-filter', isPro: false, library: 'echarts' },
  gauge: { name: 'Gauge Chart', icon: 'fa-tachometer-alt', isPro: false, library: 'echarts' },
  heatmap: { name: 'Heatmap', icon: 'fa-th', isPro: false, library: 'echarts' },
  
  // Financial Charts
  waterfall: { name: 'Waterfall', icon: 'fa-water', isPro: false, library: 'echarts' },
  candlestick: { name: 'Candlestick', icon: 'fa-chart-candlestick', isPro: false, library: 'echarts' },
  boxplot: { name: 'Box Plot', icon: 'fa-box', isPro: false, library: 'echarts' }
});

/**
 * Export formats with Pro status
 */
export const EXPORT_FORMATS = Object.freeze({
  png: { name: 'PNG Image', icon: 'fa-image', isPro: false },
  svg: { name: 'SVG Vector', icon: 'fa-vector-square', isPro: true },
  pdf: { name: 'PDF Document', icon: 'fa-file-pdf', isPro: true },
  json: { name: 'JSON Data', icon: 'fa-code', isPro: true }
});

/**
 * Pro feature descriptions for marketing
 * Note: All chart TYPES are free, Pro is for templates & extras
 */
export const PRO_FEATURES = Object.freeze([
  {
    title: '30+ Premium Templates',
    description: 'Stunning pre-built dashboards for business, finance, marketing & science',
    icon: 'fa-layer-group'
  },
  {
    title: 'Advanced Export',
    description: 'Export to SVG, PDF, and JSON formats for any use case',
    icon: 'fa-file-export'
  },
  {
    title: 'Unlimited AI Generation',
    description: 'Generate as many charts as you need with AI assistance',
    icon: 'fa-robot'
  },
  {
    title: 'Unlimited Storage',
    description: 'Save unlimited charts to your account',
    icon: 'fa-cloud'
  },
  {
    title: 'No Watermark',
    description: 'Clean exports without Vizom branding',
    icon: 'fa-ban'
  },
  {
    title: 'Priority Support',
    description: 'Get help faster with priority email support',
    icon: 'fa-headset'
  }
]);

export default {
  SUBSCRIPTION_TIERS,
  PRICING,
  FEATURE_LIMITS,
  CHART_TYPES,
  EXPORT_FORMATS,
  PRO_FEATURES
};
