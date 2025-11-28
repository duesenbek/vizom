/**
 * DeepSeek Chart Prompt Generator
 * Creates optimized prompts for high-quality Chart.js configurations
 */

// Quality checklist for chart generation
const QUALITY_CHECKLIST = `
CHART QUALITY REQUIREMENTS (MUST FOLLOW):
1. LABELS: Clear, readable, not truncated. Capitalize first letter.
2. COLORS: Use this palette: ['#3B82F6','#8B5CF6','#EC4899','#F59E0B','#10B981','#F97316','#6366F1','#14B8A6']
3. LEGEND: Position 'right' for pie/doughnut, 'top' for others. Hide if single dataset.
4. RESPONSIVE: Set responsive:true, maintainAspectRatio:false
5. NUMBERS: Format large numbers (1000→1K). Use 2 decimal places max.
6. TITLE: Always include descriptive title with font size 16, weight 600.
7. GRIDLINES: Show subtle gridlines (color: 'rgba(0,0,0,0.05)') on Y-axis only.
8. TOOLTIPS: Dark background (rgba(15,23,42,0.9)), white text, rounded corners.
9. ANIMATION: Use duration:750, easing:'easeOutQuart'
10. SPACING: Add padding {top:10, right:20, bottom:10, left:10}
`;

// Chart type specific requirements
const CHART_TYPE_SPECS = {
  bar: `
BAR CHART SPECIFICS:
- borderRadius: 6 for rounded bars
- borderWidth: 0 (no border)
- Single color for single dataset, array for comparison
- X-axis: no grid, Y-axis: subtle grid
- beginAtZero: true on Y-axis
`,
  line: `
LINE CHART SPECIFICS:
- tension: 0.4 for smooth curves
- fill: true with 20% opacity background
- borderWidth: 3
- pointRadius: 4, pointHoverRadius: 6
- pointBackgroundColor: '#ffffff'
- pointBorderWidth: 2
`,
  pie: `
PIE CHART SPECIFICS:
- Use array of colors from palette
- borderColor: '#ffffff', borderWidth: 2
- Legend position: 'right'
- No scales needed
`,
  doughnut: `
DOUGHNUT CHART SPECIFICS:
- cutout: '60%'
- Use array of colors from palette
- borderColor: '#ffffff', borderWidth: 2
- Legend position: 'right'
- No scales needed
`,
  scatter: `
SCATTER CHART SPECIFICS:
- pointRadius: 6
- pointHoverRadius: 8
- Use rgba colors with 0.7 opacity
- Show both X and Y axis labels
`,
  radar: `
RADAR CHART SPECIFICS:
- fill: true with 30% opacity
- borderWidth: 2
- pointRadius: 4
- Scale with angleLines and grid
`
};

/**
 * Generate optimized prompt for DeepSeek
 */
export function generateDeepSeekPrompt(parsedData, options = {}) {
  const {
    chartType = 'bar',
    userPrompt = '',
    includeAnnotations = false
  } = options;

  const { labels, data, title, isPercentage } = parsedData;
  
  // Build structured data representation
  const dataPoints = labels.map((label, i) => ({
    label,
    value: data[i],
    formatted: isPercentage ? `${data[i]}%` : data[i]
  }));

  const chartSpec = CHART_TYPE_SPECS[chartType] || CHART_TYPE_SPECS.bar;

  const prompt = `
You are a Chart.js expert. Generate a production-ready Chart.js configuration.

USER REQUEST: ${userPrompt || 'Create a chart from the provided data'}

STRUCTURED DATA:
${JSON.stringify(dataPoints, null, 2)}

CHART TYPE: ${chartType}
SUGGESTED TITLE: ${title || generateSmartTitle(labels, chartType)}

${QUALITY_CHECKLIST}

${chartSpec}

RESPONSE FORMAT:
Return ONLY valid JSON (no markdown, no explanation). Structure:
{
  "type": "${chartType}",
  "data": {
    "labels": [...],
    "datasets": [{ "label": "...", "data": [...], "backgroundColor": ..., ... }]
  },
  "options": {
    "responsive": true,
    "maintainAspectRatio": false,
    "plugins": { "title": {...}, "legend": {...}, "tooltip": {...} },
    "scales": {...},
    "animation": {...}
  }
}

Generate the complete Chart.js config now:
`;

  return prompt.trim();
}

/**
 * Generate smart title based on data context
 */
function generateSmartTitle(labels, chartType) {
  const labelStr = labels.join(' ').toLowerCase();
  
  // Time-based
  if (/jan|feb|mar|apr|q1|q2|q3|q4|2023|2024|2025|month|week/.test(labelStr)) {
    return chartType === 'line' ? 'Trend Over Time' : 'Performance by Period';
  }
  
  // Categories
  if (/product|item|category|type/.test(labelStr)) {
    return 'Performance by Category';
  }
  
  // Regions
  if (/north|south|east|west|region|country/.test(labelStr)) {
    return 'Regional Comparison';
  }
  
  // Default
  if (['pie', 'doughnut'].includes(chartType)) {
    return 'Distribution Breakdown';
  }
  
  return 'Data Comparison';
}

/**
 * Parse DeepSeek response and enhance config
 */
export function parseDeepSeekResponse(response) {
  try {
    // Clean response - remove markdown code blocks if present
    let cleaned = response.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    
    const config = JSON.parse(cleaned);
    
    // Validate required fields
    if (!config.type || !config.data) {
      throw new Error('Invalid config: missing type or data');
    }
    
    // Apply quality enhancements
    return enhanceConfig(config);
  } catch (e) {
    console.error('[DeepSeekPrompt] Failed to parse response:', e);
    return null;
  }
}

/**
 * Enhance config with quality defaults
 */
function enhanceConfig(config) {
  const colors = ['#3B82F6','#8B5CF6','#EC4899','#F59E0B','#10B981','#F97316','#6366F1','#14B8A6'];
  const isCircular = ['pie', 'doughnut', 'polarArea'].includes(config.type);
  
  // Ensure options exist
  config.options = config.options || {};
  config.options.responsive = true;
  config.options.maintainAspectRatio = false;
  
  // Ensure plugins
  config.options.plugins = config.options.plugins || {};
  
  // Title
  if (!config.options.plugins.title) {
    config.options.plugins.title = {
      display: true,
      text: 'Chart',
      font: { size: 16, weight: '600' },
      color: '#1E293B'
    };
  }
  
  // Tooltip
  config.options.plugins.tooltip = {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    titleColor: '#ffffff',
    bodyColor: '#CBD5E1',
    cornerRadius: 8,
    padding: 12,
    ...config.options.plugins.tooltip
  };
  
  // Legend
  if (isCircular) {
    config.options.plugins.legend = {
      display: true,
      position: 'right',
      labels: { usePointStyle: true, padding: 15 },
      ...config.options.plugins.legend
    };
  }
  
  // Animation
  config.options.animation = {
    duration: 750,
    easing: 'easeOutQuart',
    ...config.options.animation
  };
  
  // Layout
  config.options.layout = {
    padding: { top: 10, right: 20, bottom: 10, left: 10 },
    ...config.options.layout
  };
  
  // Scales for non-circular charts
  if (!isCircular) {
    config.options.scales = config.options.scales || {};
    config.options.scales.x = {
      grid: { display: false },
      ticks: { color: '#64748B', font: { size: 11 } },
      border: { display: false },
      ...config.options.scales.x
    };
    config.options.scales.y = {
      beginAtZero: true,
      grid: { color: 'rgba(0,0,0,0.05)' },
      ticks: { color: '#64748B', font: { size: 11 } },
      border: { display: false },
      ...config.options.scales.y
    };
  }
  
  // Ensure datasets have colors
  if (config.data?.datasets) {
    config.data.datasets.forEach((dataset, i) => {
      if (!dataset.backgroundColor) {
        dataset.backgroundColor = isCircular 
          ? colors.slice(0, config.data.labels?.length || colors.length)
          : colors[i % colors.length];
      }
      if (!dataset.borderColor) {
        dataset.borderColor = isCircular ? '#ffffff' : colors[i % colors.length];
      }
    });
  }
  
  // Doughnut specific
  if (config.type === 'doughnut') {
    config.options.cutout = config.options.cutout || '60%';
  }
  
  return config;
}

/**
 * Fallback config when DeepSeek fails
 */
export function createFallbackConfig(parsedData, chartType = 'bar') {
  const { labels, data, title } = parsedData;
  const colors = ['#3B82F6','#8B5CF6','#EC4899','#F59E0B','#10B981','#F97316','#6366F1','#14B8A6'];
  const isCircular = ['pie', 'doughnut'].includes(chartType);
  const isLine = chartType === 'line';
  
  return {
    type: chartType,
    data: {
      labels,
      datasets: [{
        label: title || 'Data',
        data,
        backgroundColor: isLine 
          ? `${colors[0]}33`
          : isCircular 
            ? colors.slice(0, data.length)
            : colors[0],
        borderColor: isCircular ? '#ffffff' : colors[0],
        borderWidth: isCircular ? 2 : (isLine ? 3 : 0),
        borderRadius: chartType === 'bar' ? 6 : 0,
        tension: 0.4,
        fill: isLine,
        pointRadius: isLine ? 4 : 0,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: colors[0],
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 10, right: 20, bottom: 10, left: 10 } },
      plugins: {
        title: {
          display: true,
          text: title || generateSmartTitle(labels, chartType),
          font: { size: 16, weight: '600' },
          color: '#1E293B',
          padding: { bottom: 20 }
        },
        legend: {
          display: isCircular,
          position: 'right',
          labels: { usePointStyle: true, padding: 15, color: '#64748B' }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#CBD5E1',
          cornerRadius: 8,
          padding: 12
        }
      },
      scales: isCircular ? {} : {
        x: {
          grid: { display: false },
          ticks: { color: '#64748B', font: { size: 11 } },
          border: { display: false }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { color: '#64748B', font: { size: 11 } },
          border: { display: false }
        }
      },
      animation: { duration: 750, easing: 'easeOutQuart' }
    }
  };
}

export { QUALITY_CHECKLIST, CHART_TYPE_SPECS, generateSmartTitle };
