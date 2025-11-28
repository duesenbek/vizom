/**
 * Chart Enhancer - Improves chart quality and readability
 * Applies best practices for data visualization
 */

// Premium color palettes with good contrast
const COLOR_PALETTES = {
  default: [
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#F97316', // Orange
    '#6366F1', // Indigo
    '#14B8A6', // Teal
  ],
  warm: ['#F59E0B', '#F97316', '#EF4444', '#EC4899', '#D946EF', '#A855F7'],
  cool: ['#3B82F6', '#6366F1', '#8B5CF6', '#06B6D4', '#14B8A6', '#10B981'],
  monochrome: ['#1E293B', '#334155', '#475569', '#64748B', '#94A3B8', '#CBD5E1'],
  pastel: ['#93C5FD', '#C4B5FD', '#F9A8D4', '#FCD34D', '#6EE7B7', '#FDBA74'],
};

// Number formatting
const formatNumber = (num, options = {}) => {
  if (typeof num !== 'number' || isNaN(num)) return num;
  
  const { compact = true, decimals = 2, currency = false, percent = false } = options;
  
  if (percent) {
    return `${(num * 100).toFixed(decimals)}%`;
  }
  
  if (currency) {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    }).format(num);
  }
  
  if (compact && Math.abs(num) >= 1000) {
    const units = ['', 'K', 'M', 'B', 'T'];
    let unitIndex = 0;
    let scaledNum = num;
    
    while (Math.abs(scaledNum) >= 1000 && unitIndex < units.length - 1) {
      scaledNum /= 1000;
      unitIndex++;
    }
    
    return `${scaledNum.toFixed(scaledNum % 1 === 0 ? 0 : 1)}${units[unitIndex]}`;
  }
  
  return num % 1 === 0 ? num.toString() : num.toFixed(decimals);
};

// Label truncation with smart ellipsis
const truncateLabel = (label, maxLength = 15) => {
  if (!label || label.length <= maxLength) return label;
  return label.substring(0, maxLength - 1) + '…';
};

// Detect data type for smart formatting
const detectDataType = (data) => {
  if (!Array.isArray(data) || data.length === 0) return 'unknown';
  
  const sample = data.filter(d => d !== null && d !== undefined);
  if (sample.length === 0) return 'unknown';
  
  // Check if all values are between 0 and 1 (likely percentages)
  if (sample.every(d => d >= 0 && d <= 1)) return 'percentage';
  
  // Check if values look like currency (large numbers)
  if (sample.every(d => d >= 100)) return 'currency';
  
  // Check if values are small decimals
  if (sample.every(d => Math.abs(d) < 100 && d % 1 !== 0)) return 'decimal';
  
  return 'number';
};

// Find key insights in data
const findInsights = (labels, data) => {
  if (!data || data.length === 0) return [];
  
  const insights = [];
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const maxIndex = data.indexOf(maxValue);
  const minIndex = data.indexOf(minValue);
  const avg = data.reduce((a, b) => a + b, 0) / data.length;
  
  // Highest value annotation
  if (maxValue > avg * 1.5) {
    insights.push({
      type: 'max',
      index: maxIndex,
      label: labels[maxIndex],
      value: maxValue,
      text: `Highest: ${formatNumber(maxValue)}`
    });
  }
  
  // Trend detection (for line charts)
  if (data.length >= 3) {
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg * 1.2) {
      insights.push({ type: 'trend', direction: 'up', change: ((secondAvg - firstAvg) / firstAvg * 100).toFixed(1) });
    } else if (secondAvg < firstAvg * 0.8) {
      insights.push({ type: 'trend', direction: 'down', change: ((firstAvg - secondAvg) / firstAvg * 100).toFixed(1) });
    }
  }
  
  return insights;
};

/**
 * Enhance Chart.js configuration for better quality
 */
export function enhanceChartConfig(config, options = {}) {
  if (!config || !config.type) return config;
  
  const {
    palette = 'default',
    showTitle = true,
    showLegend = true,
    showGrid = true,
    formatNumbers = true,
    addAnnotations = false,
    responsive = true,
  } = options;
  
  const colors = COLOR_PALETTES[palette] || COLOR_PALETTES.default;
  const chartType = config.type;
  const isCircular = ['pie', 'doughnut', 'polarArea'].includes(chartType);
  const isLine = ['line', 'area'].includes(chartType);
  
  // Deep clone config
  const enhanced = JSON.parse(JSON.stringify(config));
  
  // Ensure options object exists
  enhanced.options = enhanced.options || {};
  enhanced.options.plugins = enhanced.options.plugins || {};
  
  // 1. Responsive sizing
  enhanced.options.responsive = responsive;
  enhanced.options.maintainAspectRatio = false;
  
  // 2. Apply color palette to datasets
  if (enhanced.data?.datasets) {
    enhanced.data.datasets.forEach((dataset, i) => {
      const color = colors[i % colors.length];
      
      if (isCircular) {
        // Pie/Doughnut: array of colors
        dataset.backgroundColor = dataset.backgroundColor || colors.slice(0, enhanced.data.labels?.length || colors.length);
        dataset.borderColor = '#ffffff';
        dataset.borderWidth = 2;
      } else if (isLine) {
        // Line: single color with fill
        dataset.borderColor = dataset.borderColor || color;
        dataset.backgroundColor = dataset.backgroundColor || `${color}20`;
        dataset.borderWidth = dataset.borderWidth || 3;
        dataset.tension = dataset.tension ?? 0.4;
        dataset.pointRadius = dataset.pointRadius ?? 4;
        dataset.pointHoverRadius = dataset.pointHoverRadius ?? 6;
        dataset.pointBackgroundColor = '#ffffff';
        dataset.pointBorderColor = color;
        dataset.pointBorderWidth = 2;
        dataset.fill = dataset.fill ?? true;
      } else {
        // Bar: solid colors
        dataset.backgroundColor = dataset.backgroundColor || color;
        dataset.borderColor = dataset.borderColor || color;
        dataset.borderRadius = dataset.borderRadius ?? 6;
        dataset.borderWidth = 0;
      }
    });
  }
  
  // 3. Title configuration
  if (showTitle) {
    enhanced.options.plugins.title = {
      display: true,
      text: enhanced.options.plugins.title?.text || config.title || 'Chart',
      font: {
        size: 16,
        weight: '600',
        family: "'Inter', 'system-ui', sans-serif"
      },
      color: '#1E293B',
      padding: { top: 10, bottom: 20 }
    };
  }
  
  // 4. Legend configuration
  enhanced.options.plugins.legend = {
    display: showLegend && (isCircular || (enhanced.data?.datasets?.length > 1)),
    position: isCircular ? 'right' : 'top',
    align: 'center',
    labels: {
      usePointStyle: true,
      pointStyle: 'circle',
      padding: 15,
      font: {
        size: 12,
        family: "'Inter', 'system-ui', sans-serif"
      },
      color: '#64748B',
      boxWidth: 8,
      boxHeight: 8
    }
  };
  
  // 5. Tooltip configuration
  enhanced.options.plugins.tooltip = {
    enabled: true,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    titleColor: '#ffffff',
    bodyColor: '#CBD5E1',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    cornerRadius: 8,
    padding: 12,
    titleFont: { size: 13, weight: '600' },
    bodyFont: { size: 12 },
    displayColors: true,
    boxWidth: 8,
    boxHeight: 8,
    boxPadding: 4,
    callbacks: {
      label: function(context) {
        let label = context.dataset.label || '';
        if (label) label += ': ';
        
        const value = context.parsed.y ?? context.parsed ?? context.raw;
        const dataType = detectDataType(context.dataset.data);
        
        if (dataType === 'percentage') {
          label += (value * 100).toFixed(1) + '%';
        } else if (dataType === 'currency') {
          label += '$' + formatNumber(value);
        } else {
          label += formatNumber(value);
        }
        
        return label;
      }
    }
  };
  
  // 6. Scales configuration (for non-circular charts)
  if (!isCircular) {
    enhanced.options.scales = enhanced.options.scales || {};
    
    // X-axis
    enhanced.options.scales.x = {
      ...enhanced.options.scales.x,
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        color: '#64748B',
        font: { size: 11 },
        maxRotation: 45,
        minRotation: 0,
        callback: function(value, index) {
          const label = this.getLabelForValue(value);
          return truncateLabel(label, 12);
        }
      },
      border: {
        display: false
      }
    };
    
    // Y-axis
    enhanced.options.scales.y = {
      ...enhanced.options.scales.y,
      beginAtZero: true,
      grid: {
        display: showGrid,
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false
      },
      ticks: {
        color: '#64748B',
        font: { size: 11 },
        padding: 8,
        callback: function(value) {
          return formatNumber(value);
        }
      },
      border: {
        display: false
      }
    };
  }
  
  // 7. Doughnut specific
  if (chartType === 'doughnut') {
    enhanced.options.cutout = enhanced.options.cutout || '60%';
  }
  
  // 8. Animation
  enhanced.options.animation = {
    duration: 750,
    easing: 'easeOutQuart'
  };
  
  // 9. Layout padding
  enhanced.options.layout = {
    padding: {
      top: 10,
      right: 20,
      bottom: 10,
      left: 10
    }
  };
  
  return enhanced;
}

/**
 * Generate smart title from data context
 */
export function generateSmartTitle(labels, data, chartType) {
  if (!labels || labels.length === 0) return 'Data Visualization';
  
  // Detect time series
  const timePatterns = ['jan', 'feb', 'mar', 'apr', 'q1', 'q2', 'q3', 'q4', '2020', '2021', '2022', '2023', '2024'];
  const isTimeSeries = labels.some(l => 
    timePatterns.some(p => l.toString().toLowerCase().includes(p))
  );
  
  // Detect categories
  const categoryPatterns = ['sales', 'revenue', 'users', 'growth', 'profit', 'cost'];
  const hasCategory = labels.some(l => 
    categoryPatterns.some(p => l.toString().toLowerCase().includes(p))
  );
  
  if (isTimeSeries) {
    return chartType === 'line' ? 'Trend Over Time' : 'Performance by Period';
  }
  
  if (hasCategory) {
    return 'Performance by Category';
  }
  
  if (chartType === 'pie' || chartType === 'doughnut') {
    return 'Distribution Breakdown';
  }
  
  return 'Data Comparison';
}

/**
 * Create annotation for Chart.js annotation plugin
 */
export function createAnnotations(labels, data, chartType) {
  const insights = findInsights(labels, data);
  const annotations = {};
  
  insights.forEach((insight, i) => {
    if (insight.type === 'max' && chartType !== 'pie') {
      annotations[`max_${i}`] = {
        type: 'label',
        xValue: insight.index,
        yValue: insight.value,
        backgroundColor: 'rgba(16, 185, 129, 0.9)',
        color: '#ffffff',
        font: { size: 11, weight: 'bold' },
        content: ['↑ Peak', formatNumber(insight.value)],
        position: 'start',
        yAdjust: -30
      };
    }
  });
  
  return annotations;
}

export { COLOR_PALETTES, formatNumber, truncateLabel, detectDataType, findInsights };
