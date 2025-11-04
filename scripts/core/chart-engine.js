// Advanced Chart Engine for VIZOM
class ChartEngine {
  constructor() {
    this.chartTypes = {
      bar: { name: 'Bar Chart', icon: 'fa-chart-column', category: 'comparison' },
      line: { name: 'Line Chart', icon: 'fa-chart-line', category: 'trend' },
      pie: { name: 'Pie Chart', icon: 'fa-chart-pie', category: 'composition' },
      area: { name: 'Area Chart', icon: 'fa-chart-area', category: 'trend' },
      scatter: { name: 'Scatter Plot', icon: 'fa-braille', category: 'correlation' },
      bubble: { name: 'Bubble Chart', icon: 'fa-circle', category: 'correlation' },
      radar: { name: 'Radar Chart', icon: 'fa-spider', category: 'comparison' },
      heatmap: { name: 'Heatmap', icon: 'fa-th', category: 'matrix' },
      histogram: { name: 'Histogram', icon: 'fa-chart-column', category: 'distribution' },
      box: { name: 'Box Plot', icon: 'fa-box', category: 'distribution' },
      funnel: { name: 'Funnel Chart', icon: 'fa-filter', category: 'composition' },
      gauge: { name: 'Gauge Chart', icon: 'fa-gauge', category: 'kpi' },
      progress: { name: 'Progress Bar', icon: 'fa-progress', category: 'kpi' },
      timeline: { name: 'Timeline', icon: 'fa-clock', category: 'temporal' },
      gantt: { name: 'Gantt Chart', icon: 'fa-tasks', category: 'temporal' },
      sankey: { name: 'Sankey Diagram', icon: 'fa-stream', category: 'flow' },
      tree: { name: 'Tree Map', icon: 'fa-tree', category: 'hierarchy' },
      network: { name: 'Network Graph', icon: 'fa-project-diagram', category: 'network' }
    };
    
    this.themes = {
      default: {
        name: 'Default',
        colors: ['#3B82F6', '#8B5CF6', '#06D6A0', '#60A5FA', '#A78BFA'],
        background: '#ffffff',
        grid: '#e5e7eb'
      },
      dark: {
        name: 'Dark',
        colors: ['#60A5FA', '#A78BFA', '#34D399', '#93C5FD', '#C4B5FD'],
        background: '#1f2937',
        grid: '#374151'
      },
      vibrant: {
        name: 'Vibrant',
        colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'],
        background: '#ffffff',
        grid: '#e5e7eb'
      },
      pastel: {
        name: 'Pastel',
        colors: ['#FCA5A5', '#FCD34D', '#86EFAC', '#93C5FD', '#DDD6FE'],
        background: '#ffffff',
        grid: '#e5e7eb'
      },
      monochrome: {
        name: 'Monochrome',
        colors: ['#1f2937', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db'],
        background: '#ffffff',
        grid: '#e5e7eb'
      }
    };

    this.currentTheme = 'default';
    this.animations = true;
    this.interactive = true;
  }

  // Enhanced Chart Rendering
  renderChart(data, type, options = {}) {
    const config = {
      data: this.processData(data, type),
      type,
      theme: this.themes[this.currentTheme],
      animations: this.animations,
      interactive: this.interactive,
      ...options
    };

    switch (type) {
      case 'bar':
        return this.renderBarChart(config);
      case 'line':
        return this.renderLineChart(config);
      case 'pie':
        return this.renderPieChart(config);
      case 'area':
        return this.renderAreaChart(config);
      case 'scatter':
        return this.renderScatterChart(config);
      case 'bubble':
        return this.renderBubbleChart(config);
      case 'radar':
        return this.renderRadarChart(config);
      case 'heatmap':
        return this.renderHeatmap(config);
      case 'histogram':
        return this.renderHistogram(config);
      case 'box':
        return this.renderBoxPlot(config);
      case 'funnel':
        return this.renderFunnelChart(config);
      case 'gauge':
        return this.renderGaugeChart(config);
      case 'progress':
        return this.renderProgressBar(config);
      case 'timeline':
        return this.renderTimeline(config);
      case 'gantt':
        return this.renderGanttChart(config);
      case 'sankey':
        return this.renderSankeyDiagram(config);
      case 'tree':
        return this.renderTreeMap(config);
      case 'network':
        return this.renderNetworkGraph(config);
      default:
        return this.renderBarChart(config);
    }
  }

  // Data Processing
  processData(data, type) {
    if (!data || !Array.isArray(data)) return [];

    switch (type) {
      case 'heatmap':
        return this.processHeatmapData(data);
      case 'scatter':
      case 'bubble':
        return this.processScatterData(data);
      case 'histogram':
        return this.processHistogramData(data);
      case 'box':
        return this.processBoxPlotData(data);
      default:
        return data.map(item => ({
          label: item.label || 'Item',
          value: parseFloat(item.value) || 0,
          ...item
        }));
    }
  }

  processHeatmapData(data) {
    // Convert to matrix format for heatmap
    const rows = {};
    data.forEach(item => {
      const row = item.row || item.label;
      const col = item.column || item.category;
      const value = parseFloat(item.value) || 0;
      
      if (!rows[row]) rows[row] = {};
      rows[row][col] = value;
    });
    return rows;
  }

  processScatterData(data) {
    return data.map(item => ({
      x: parseFloat(item.x) || 0,
      y: parseFloat(item.y) || 0,
      size: parseFloat(item.size) || 5,
      label: item.label || 'Point'
    }));
  }

  processHistogramData(data) {
    const values = data.map(item => parseFloat(item.value) || 0);
    const bins = 10;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;
    
    const histogram = [];
    for (let i = 0; i < bins; i++) {
      const binStart = min + i * binWidth;
      const binEnd = binStart + binWidth;
      const count = values.filter(v => v >= binStart && v < binEnd).length;
      
      histogram.push({
        label: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
        value: count
      });
    }
    
    return histogram;
  }

  processBoxPlotData(data) {
    const values = data.map(item => parseFloat(item.value) || 0).sort((a, b) => a - b);
    const q1 = this.percentile(values, 25);
    const median = this.percentile(values, 50);
    const q3 = this.percentile(values, 75);
    const iqr = q3 - q1;
    const min = Math.max(values[0], q1 - 1.5 * iqr);
    const max = Math.min(values[values.length - 1], q3 + 1.5 * iqr);
    
    return [{
      label: data[0]?.label || 'Data',
      min, q1, median, q3, max
    }];
  }

  percentile(arr, p) {
    const index = (p / 100) * (arr.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    
    return arr[lower] * (1 - weight) + arr[upper] * weight;
  }

  // Advanced Chart Renderers
  renderAreaChart(config) {
    const { data, theme } = config;
    const max = Math.max(...data.map(d => d.value)) || 1;
    const w = 720, h = 380, pad = 40;
    const cw = w - pad * 2, ch = h - pad * 2;
    const step = cw / Math.max(1, data.length - 1);
    
    const points = data.map((d, i) => 
      `${pad + i * step},${pad + (1 - d.value / max) * ch}`
    ).join(' ');
    
    const area = `${pad},${h - pad} ${points} ${pad + cw},${h - pad}`;
    
    return `
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${theme.colors[0]}" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="${theme.colors[0]}" stop-opacity="0.1"/>
          </linearGradient>
        </defs>
        <polygon points="${area}" fill="url(#areaGradient)" />
        <polyline points="${points}" fill="none" stroke="${theme.colors[0]}" stroke-width="3"/>
        ${data.map((d, i) => {
          const x = pad + i * step;
          const y = pad + (1 - d.value / max) * ch;
          return `<circle cx="${x}" cy="${y}" r="4" fill="${theme.colors[0]}">
            <title>${d.label}: ${d.value}</title>
          </circle>`;
        }).join('')}
      </svg>
    `;
  }

  renderScatterChart(config) {
    const { data, theme } = config;
    const maxX = Math.max(...data.map(d => d.x)) || 1;
    const maxY = Math.max(...data.map(d => d.y)) || 1;
    const w = 720, h = 380, pad = 40;
    const cw = w - pad * 2, ch = h - pad * 2;
    
    return `
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <grid x="${pad}" y="${pad}" width="${cw}" height="${ch}" stroke="${theme.grid}"/>
        ${data.map(d => {
          const x = pad + (d.x / maxX) * cw;
          const y = pad + (1 - d.y / maxY) * ch;
          const r = Math.max(3, d.size || 5);
          return `<circle cx="${x}" cy="${y}" r="${r}" fill="${theme.colors[0]}" opacity="0.7">
            <title>${d.label}: (${d.x}, ${d.y})</title>
          </circle>`;
        }).join('')}
      </svg>
    `;
  }

  renderBubbleChart(config) {
    const { data, theme } = config;
    const maxX = Math.max(...data.map(d => d.x)) || 1;
    const maxY = Math.max(...data.map(d => d.y)) || 1;
    const maxR = Math.max(...data.map(d => d.size || 5)) || 5;
    const w = 720, h = 380, pad = 40;
    const cw = w - pad * 2, ch = h - pad * 2;
    
    return `
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <defs>
          <radialGradient id="bubbleGradient">
            <stop offset="0%" stop-color="${theme.colors[0]}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="${theme.colors[0]}" stop-opacity="0.7"/>
          </radialGradient>
        </defs>
        ${data.map((d, i) => {
          const x = pad + (d.x / maxX) * cw;
          const y = pad + (1 - d.y / maxY) * ch;
          const r = Math.max(10, (d.size || 5) / maxR * 30);
          return `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#bubbleGradient)" stroke="${theme.colors[i % theme.colors.length]}" stroke-width="2">
            <title>${d.label}: (${d.x}, ${d.y}) - Size: ${d.size}</title>
          </circle>`;
        }).join('')}
      </svg>
    `;
  }

  renderRadarChart(config) {
    const { data, theme } = config;
    const w = 400, h = 400, cx = w/2, cy = h/2, r = Math.min(w, h)/3;
    const angleStep = (Math.PI * 2) / data.length;
    
    const points = data.map((d, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const value = Math.min(d.value / 100, 1); // Normalize to 0-1
      const x = cx + Math.cos(angle) * r * value;
      const y = cy + Math.sin(angle) * r * value;
      return `${x},${y}`;
    }).join(' ');
    
    const gridPoints = data.map((d, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      return `${x},${y}`;
    }).join(' ');
    
    return `
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <polygon points="${gridPoints}" fill="none" stroke="${theme.grid}" stroke-width="1"/>
        ${data.map((d, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${theme.grid}" stroke-width="1"/>`;
        }).join('')}
        <polygon points="${points}" fill="${theme.colors[0]}" fill-opacity="0.3" stroke="${theme.colors[0]}" stroke-width="2"/>
        ${data.map((d, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = cx + Math.cos(angle) * r * 1.1;
          const y = cy + Math.sin(angle) * r * 1.1;
          return `<text x="${x}" y="${y}" text-anchor="middle" font-size="12" fill="${theme.grid}">${d.label}</text>`;
        }).join('')}
      </svg>
    `;
  }

  renderHeatmap(config) {
    const { data, theme } = config;
    const rows = Object.keys(data);
    const cols = Object.keys(data[rows[0]] || {});
    const w = 600, h = 400, cellW = w / cols.length, cellH = h / rows.length;
    
    const values = rows.flatMap(row => cols.map(col => data[row][col] || 0));
    const max = Math.max(...values) || 1;
    const min = Math.min(...values) || 0;
    
    const getColor = (value) => {
      const normalized = (value - min) / (max - min);
      const intensity = Math.floor(normalized * 255);
      return `rgb(${intensity}, ${100}, ${255 - intensity})`;
    };
    
    return `
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        ${rows.map((row, i) => cols.map((col, j) => {
          const value = data[row][col] || 0;
          return `<rect x="${j * cellW}" y="${i * cellH}" width="${cellW}" height="${cellH}" 
                   fill="${getColor(value)}" stroke="white" stroke-width="1">
            <title>${row} - ${col}: ${value}</title>
          </rect>`;
        }).join('')).join('')}
        ${cols.map((col, j) => 
          `<text x="${j * cellW + cellW/2}" y="-5" text-anchor="middle" font-size="12">${col}</text>`
        ).join('')}
        ${rows.map((row, i) => 
          `<text x="-5" y="${i * cellH + cellH/2}" text-anchor="end" font-size="12">${row}</text>`
        ).join('')}
      </svg>
    `;
  }

  renderGaugeChart(config) {
    const { data, theme } = config;
    const value = data[0]?.value || 0;
    const max = data[0]?.max || 100;
    const percentage = Math.min(value / max, 1);
    const w = 300, h = 200, cx = w/2, cy = h - 20, r = h - 40;
    
    const angle = percentage * Math.PI - Math.PI; // -π to 0
    
    return `
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}" 
              fill="none" stroke="${theme.grid}" stroke-width="20" stroke-linecap="round"/>
        <path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(angle)} ${cy + r * Math.sin(angle)}" 
              fill="none" stroke="${percentage > 0.7 ? '#ef4444' : percentage > 0.3 ? '#f59e0b' : '#10b981'}" 
              stroke-width="20" stroke-linecap="round"/>
        <circle cx="${cx + r * Math.cos(angle)}" cy="${cy + r * Math.sin(angle)}" r="8" fill="${theme.colors[0]}"/>
        <text x="${cx}" y="${cy - 10}" text-anchor="middle" font-size="24" font-weight="bold">${value}</text>
        <text x="${cx}" y="${cy + 10}" text-anchor="middle" font-size="12" fill="${theme.grid}">of ${max}</text>
      </svg>
    `;
  }

  renderProgressBar(config) {
    const { data, theme } = config;
    const value = data[0]?.value || 0;
    const max = data[0]?.max || 100;
    const percentage = Math.min(value / max, 1);
    const w = 400, h = 40;
    
    return `
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <rect x="0" y="0" width="${w}" height="${h}" rx="20" fill="${theme.grid}"/>
        <rect x="0" y="0" width="${w * percentage}" height="${h}" rx="20" fill="${theme.colors[0]}"/>
        <text x="${w/2}" y="${h/2 + 5}" text-anchor="middle" font-size="14" font-weight="bold" fill="white">
          ${Math.round(percentage * 100)}%
        </text>
      </svg>
    `;
  }

  // Theme Management
  setTheme(themeName) {
    if (this.themes[themeName]) {
      this.currentTheme = themeName;
      return true;
    }
    return false;
  }

  getAvailableThemes() {
    return Object.keys(this.themes).map(key => ({
      key,
      ...this.themes[key]
    }));
  }

  // Animation Control
  toggleAnimations() {
    this.animations = !this.animations;
    return this.animations;
  }

  // Interactive Features
  toggleInteractive() {
    this.interactive = !this.interactive;
    return this.interactive;
  }

  // Export Functions
  exportChart(chartElement, format = 'svg') {
    switch (format) {
      case 'svg':
        return this.exportSVG(chartElement);
      case 'png':
        return this.exportPNG(chartElement);
      case 'jpg':
        return this.exportJPG(chartElement);
      default:
        return this.exportSVG(chartElement);
    }
  }

  exportSVG(chartElement) {
    const svg = chartElement.querySelector('svg');
    if (svg) {
      return new XMLSerializer().serializeToString(svg);
    }
    return null;
  }

  exportPNG(chartElement) {
    // Convert SVG to PNG using canvas
    const svg = chartElement.querySelector('svg');
    if (!svg) return null;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(this.exportSVG(chartElement));
    });
  }

  exportJPG(chartElement) {
    // Similar to PNG but with JPEG format
    return this.exportPNG(chartElement).then(dataURL => {
      return dataURL.replace('image/png', 'image/jpeg');
    });
  }
}

// Initialize Chart Engine
window.chartEngine = new ChartEngine();

export { ChartEngine };
