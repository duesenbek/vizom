/**
 * MiniChartPreview - Real mini-chart previews for promo/example cards
 * Renders live Chart.js/D3 charts in small containers with lazy loading
 */

// Real datasets for each chart type
export const DEMO_DATASETS = {
  // Bar Chart - Quarterly Sales
  'bar-quarterly-sales': {
    type: 'bar',
    title: 'Quarterly Sales',
    prompt: 'Show quarterly sales for 2024: Q1 $180K, Q2 $220K, Q3 $260K, Q4 $310K',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{
        data: [180, 220, 260, 310],
        backgroundColor: ['#3B82F6', '#60A5FA', '#93C5FD', '#2563EB'],
        borderRadius: 4
      }]
    }
  },

  // Line Chart - Temperature Trend
  'line-temperature-trend': {
    type: 'line',
    title: 'Temperature Trend',
    prompt: 'Monthly temperature trend: Jan -2°C, Feb 0°C, Mar 4°C, Apr 9°C, May 14°C, Jun 19°C, Jul 22°C, Aug 21°C, Sep 17°C, Oct 10°C, Nov 4°C, Dec 0°C',
    data: {
      labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      datasets: [{
        data: [-2, 0, 4, 9, 14, 19, 22, 21, 17, 10, 4, 0],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }]
    }
  },

  // Pie Chart - Market Share
  'pie-market-share': {
    type: 'pie',
    title: 'Market Share',
    prompt: 'Tech market share: Apple 35%, Google 28%, Microsoft 22%, Amazon 15%',
    data: {
      labels: ['Apple', 'Google', 'Microsoft', 'Amazon'],
      datasets: [{
        data: [35, 28, 22, 15],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
      }]
    }
  },

  // Doughnut Chart - Budget Allocation
  'doughnut-budget-allocation': {
    type: 'doughnut',
    title: 'Budget Allocation',
    prompt: 'Budget allocation: R&D 30%, Marketing 25%, Operations 20%, Sales 15%, Admin 10%',
    data: {
      labels: ['R&D', 'Marketing', 'Operations', 'Sales', 'Admin'],
      datasets: [{
        data: [30, 25, 20, 15, 10],
        backgroundColor: ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B']
      }]
    }
  },

  // Area Chart - Revenue Growth
  'area-revenue-growth': {
    type: 'line',
    title: 'Revenue Growth',
    prompt: 'Revenue growth 2024: Jan $45K, Feb $98K, Mar $156K, Apr $225K, May $302K, Jun $395K',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        data: [45, 98, 156, 225, 302, 395],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
        tension: 0.4
      }]
    }
  },

  // Scatter Plot - Age vs Income
  'scatter-age-income': {
    type: 'scatter',
    title: 'Age vs Income',
    prompt: 'Age vs Income correlation: 25y/$32K, 30y/$45K, 35y/$58K, 40y/$72K, 45y/$85K, 50y/$92K',
    data: {
      datasets: [{
        data: [
          { x: 25, y: 32 },
          { x: 30, y: 45 },
          { x: 35, y: 58 },
          { x: 40, y: 72 },
          { x: 45, y: 85 },
          { x: 50, y: 92 }
        ],
        backgroundColor: '#8B5CF6',
        pointRadius: 6
      }]
    }
  },

  // Bubble Chart - Market Analysis
  'bubble-market-analysis': {
    type: 'bubble',
    title: 'Market Analysis',
    prompt: 'Market analysis: Product A (revenue $50K, growth 20%, market size 30), Product B (revenue $80K, growth 15%, market size 45), Product C (revenue $35K, growth 35%, market size 20)',
    data: {
      datasets: [{
        data: [
          { x: 50, y: 20, r: 15 },
          { x: 80, y: 15, r: 22 },
          { x: 35, y: 35, r: 10 },
          { x: 65, y: 25, r: 18 }
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(139, 92, 246, 0.6)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(245, 158, 11, 0.6)'
        ]
      }]
    }
  },

  // Radar Chart - Skill Assessment
  'radar-skill-assessment': {
    type: 'radar',
    title: 'Skill Assessment',
    prompt: 'Developer skills: JavaScript 90%, Python 75%, SQL 80%, DevOps 65%, Design 50%, Communication 85%',
    data: {
      labels: ['JS', 'Python', 'SQL', 'DevOps', 'Design', 'Comm'],
      datasets: [{
        data: [90, 75, 80, 65, 50, 85],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3B82F6',
        pointBackgroundColor: '#3B82F6'
      }]
    }
  },

  // Polar Area - Activity Breakdown
  'polar-activity-breakdown': {
    type: 'polarArea',
    title: 'Daily Activity',
    prompt: 'Daily activity breakdown: Work 8h, Exercise 1.5h, Leisure 3h, Sleep 7h, Commute 1.5h, Meals 2h',
    data: {
      labels: ['Work', 'Exercise', 'Leisure', 'Sleep', 'Commute', 'Meals'],
      datasets: [{
        data: [8, 1.5, 3, 7, 1.5, 2],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(99, 102, 241, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ]
      }]
    }
  },

  // Force Graph - Social Network (D3)
  'force-social-network': {
    type: 'force',
    title: 'Social Network',
    prompt: 'Social network: Alice connects to Bob, Charlie, David. Bob connects to Eve. Charlie connects to Frank.',
    data: {
      nodes: [
        { id: 'Alice', group: 1 },
        { id: 'Bob', group: 1 },
        { id: 'Charlie', group: 2 },
        { id: 'David', group: 2 },
        { id: 'Eve', group: 3 },
        { id: 'Frank', group: 3 }
      ],
      links: [
        { source: 'Alice', target: 'Bob' },
        { source: 'Alice', target: 'Charlie' },
        { source: 'Alice', target: 'David' },
        { source: 'Bob', target: 'Eve' },
        { source: 'Charlie', target: 'Frank' }
      ]
    }
  },

  // Treemap - Disk Usage (D3)
  'treemap-disk-usage': {
    type: 'treemap',
    title: 'Disk Usage',
    prompt: 'Disk usage: Documents 25GB, Photos 40GB, Videos 60GB, Music 15GB, Apps 30GB, System 20GB',
    data: {
      name: 'Disk',
      children: [
        { name: 'Videos', value: 60 },
        { name: 'Photos', value: 40 },
        { name: 'Apps', value: 30 },
        { name: 'Docs', value: 25 },
        { name: 'System', value: 20 },
        { name: 'Music', value: 15 }
      ]
    }
  },

  // Sankey - User Flow (D3)
  'sankey-user-flow': {
    type: 'sankey',
    title: 'User Flow',
    prompt: 'User flow: Homepage 1000 -> Products 600, About 200, Contact 100. Products -> Cart 300, Exit 300. Cart -> Checkout 200, Exit 100.',
    data: {
      nodes: [
        { name: 'Home' },
        { name: 'Products' },
        { name: 'Cart' },
        { name: 'Checkout' },
        { name: 'Exit' }
      ],
      links: [
        { source: 0, target: 1, value: 600 },
        { source: 1, target: 2, value: 300 },
        { source: 2, target: 3, value: 200 },
        { source: 1, target: 4, value: 300 },
        { source: 2, target: 4, value: 100 }
      ]
    }
  }
};

/**
 * MiniChartPreview class - handles rendering of mini chart previews
 */
export class MiniChartPreview {
  constructor() {
    this.chartInstances = new Map();
    this.observer = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the preview system with lazy loading
   */
  async init() {
    if (this.isInitialized) return;

    // Wait for Chart.js to be available
    await this.waitForChartJS();

    // Setup intersection observer for lazy loading
    this.setupLazyLoading();

    // Initial render for visible elements
    this.renderVisiblePreviews();

    this.isInitialized = true;
    console.log('[MiniChartPreview] Initialized with lazy loading');
  }

  /**
   * Wait for Chart.js to be loaded
   */
  async waitForChartJS(timeout = 5000) {
    const start = Date.now();
    while (!window.Chart && Date.now() - start < timeout) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (!window.Chart) {
      console.warn('[MiniChartPreview] Chart.js not loaded, using SVG fallback');
    }
  }

  /**
   * Setup intersection observer for lazy loading
   */
  setupLazyLoading() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const container = entry.target;
            this.renderPreview(container);
            this.observer.unobserve(container);
          }
        });
      },
      { rootMargin: '50px', threshold: 0.1 }
    );

    // Observe all preview containers
    document.querySelectorAll('.chart-preview-container').forEach(container => {
      this.observer.observe(container);
    });
  }

  /**
   * Render all visible previews immediately
   */
  renderVisiblePreviews() {
    document.querySelectorAll('.chart-preview-container').forEach(container => {
      const rect = container.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        this.renderPreview(container);
        if (this.observer) {
          this.observer.unobserve(container);
        }
      }
    });
  }

  /**
   * Render a single preview
   */
  renderPreview(container) {
    const chartType = container.dataset.chartType;
    const exampleId = container.dataset.exampleId;
    const dataset = DEMO_DATASETS[exampleId];

    if (!dataset) {
      console.warn(`[MiniChartPreview] No dataset found for: ${exampleId}`);
      return;
    }

    // Check if it's a D3 chart type
    if (['force', 'treemap', 'sankey'].includes(chartType)) {
      this.renderD3Preview(container, dataset);
    } else {
      this.renderChartJSPreview(container, dataset);
    }
  }

  /**
   * Render Chart.js preview
   */
  renderChartJSPreview(container, dataset) {
    if (!window.Chart) {
      this.renderSVGFallback(container, dataset);
      return;
    }

    const canvas = container.querySelector('.chart-preview-canvas');
    if (!canvas) return;

    // Destroy existing chart if any - check both our map and Chart.js registry
    const existingChart = this.chartInstances.get(canvas);
    if (existingChart) {
      try {
        existingChart.destroy();
      } catch (e) {
        // Ignore destroy errors
      }
      this.chartInstances.delete(canvas);
    }

    // Also check Chart.js internal registry
    const chartId = canvas.id || canvas.getAttribute('data-chart-id');
    if (window.Chart && window.Chart.getChart) {
      const registeredChart = window.Chart.getChart(canvas);
      if (registeredChart) {
        try {
          registeredChart.destroy();
        } catch (e) {
          // Ignore destroy errors
        }
      }
    }

    // Clear canvas
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const config = this.getMiniChartConfig(dataset);

    try {
      const chart = new window.Chart(ctx, config);
      this.chartInstances.set(canvas, chart);
    } catch (error) {
      // Silent fallback to SVG - don't log error
      this.renderSVGFallback(container, dataset);
    }
  }

  /**
   * Get mini chart configuration (simplified for small size)
   */
  getMiniChartConfig(dataset) {
    const baseConfig = {
      type: dataset.type === 'area' ? 'line' : dataset.type,
      data: JSON.parse(JSON.stringify(dataset.data)),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400 },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: this.getScalesConfig(dataset.type),
        elements: {
          point: { radius: 0 },
          line: { borderWidth: 2 },
          bar: { borderRadius: 2 }
        }
      }
    };

    // Special handling for different chart types
    if (dataset.type === 'radar') {
      baseConfig.options.scales = {
        r: {
          display: false,
          beginAtZero: true
        }
      };
    }

    if (dataset.type === 'polarArea') {
      baseConfig.options.scales = {};
    }

    return baseConfig;
  }

  /**
   * Get scales configuration based on chart type
   */
  getScalesConfig(type) {
    if (['pie', 'doughnut', 'radar', 'polarArea'].includes(type)) {
      return {};
    }

    return {
      x: {
        display: false,
        grid: { display: false }
      },
      y: {
        display: false,
        grid: { display: false },
        beginAtZero: true
      }
    };
  }

  /**
   * Render D3 preview (force, treemap, sankey)
   */
  renderD3Preview(container, dataset) {
    if (!window.d3) {
      this.renderSVGFallback(container, dataset);
      return;
    }

    // Clear container
    container.innerHTML = '';

    const width = container.clientWidth || 100;
    const height = container.clientHeight || 48;

    // Validate dimensions
    if (!width || !height || width <= 0 || height <= 0) {
      return;
    }

    const svg = window.d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`);

    switch (dataset.type) {
      case 'force':
        this.renderForceGraph(svg, dataset.data, width, height);
        break;
      case 'treemap':
        this.renderTreemap(svg, dataset.data, width, height);
        break;
      case 'sankey':
        this.renderSankeyMini(svg, dataset.data, width, height);
        break;
    }
  }

  /**
   * Render mini force graph
   */
  renderForceGraph(svg, data, width, height) {
    const d3 = window.d3;
    const colors = ['#3B82F6', '#10B981', '#F59E0B'];

    // Create simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id(d => d.id).distance(15))
      .force('charge', d3.forceManyBody().strength(-20))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Draw links
    const link = svg.append('g')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', '#CBD5E1')
      .attr('stroke-width', 1);

    // Draw nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(data.nodes)
      .join('circle')
      .attr('r', 4)
      .attr('fill', d => colors[d.group - 1] || colors[0]);

    // Update positions
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => Math.max(4, Math.min(width - 4, d.x)))
        .attr('cy', d => Math.max(4, Math.min(height - 4, d.y)));
    });

    // Stop simulation after a short time
    setTimeout(() => simulation.stop(), 1000);
  }

  /**
   * Render mini treemap
   */
  renderTreemap(svg, data, width, height) {
    const d3 = window.d3;
    const colors = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE', '#EFF6FF'];

    // Validate dimensions
    if (!width || !height || isNaN(width) || isNaN(height)) {
      return;
    }

    try {
      const root = d3.hierarchy(data)
        .sum(d => d.value || 0)
        .sort((a, b) => (b.value || 0) - (a.value || 0));

      d3.treemap()
        .size([width, height])
        .padding(1)(root);

      svg.selectAll('rect')
        .data(root.leaves())
        .join('rect')
        .attr('x', d => isNaN(d.x0) ? 0 : d.x0)
        .attr('y', d => isNaN(d.y0) ? 0 : d.y0)
        .attr('width', d => isNaN(d.x1 - d.x0) ? 0 : Math.max(0, d.x1 - d.x0))
        .attr('height', d => isNaN(d.y1 - d.y0) ? 0 : Math.max(0, d.y1 - d.y0))
        .attr('fill', (d, i) => colors[i % colors.length])
        .attr('rx', 2);
    } catch (e) {
      // Silent fail for treemap rendering
    }
  }

  /**
   * Render mini sankey (simplified as flow diagram)
   */
  renderSankeyMini(svg, data, width, height) {
    const d3 = window.d3;
    const nodeWidth = 8;
    const nodePadding = 4;

    // Validate dimensions and data
    if (!width || !height || isNaN(width) || isNaN(height)) {
      return;
    }
    
    if (!data || !data.nodes || data.nodes.length === 0) {
      return;
    }

    try {
      // Simple positioning
      const nodeCount = data.nodes.length;
      const nodeHeight = Math.max(4, (height - (nodeCount - 1) * nodePadding) / nodeCount);

      // Draw nodes
      svg.selectAll('rect')
        .data(data.nodes)
        .join('rect')
        .attr('x', (d, i) => {
          const x = i < 2 ? 0 : (i < 4 ? width / 2 - nodeWidth / 2 : width - nodeWidth);
          return isNaN(x) ? 0 : x;
        })
        .attr('y', (d, i) => {
          const y = (i % 2) * (nodeHeight + nodePadding) + height / 4;
          return isNaN(y) ? 0 : y;
        })
        .attr('width', nodeWidth)
        .attr('height', isNaN(nodeHeight) ? 4 : nodeHeight)
        .attr('fill', '#3B82F6')
        .attr('rx', 2);

      // Draw simplified links
      const linkData = [
        { x1: nodeWidth, y1: height / 4 + nodeHeight / 2, x2: width / 2 - nodeWidth / 2, y2: height / 4 + nodeHeight / 2 },
        { x1: width / 2 + nodeWidth / 2, y1: height / 4 + nodeHeight / 2, x2: width - nodeWidth, y2: height / 4 + nodeHeight / 2 }
      ];

      svg.selectAll('path')
        .data(linkData)
        .join('path')
        .attr('d', d => {
          // Validate all values before creating path
          if ([d.x1, d.y1, d.x2, d.y2].some(v => isNaN(v))) {
            return '';
          }
          return `M${d.x1},${d.y1} C${(d.x1 + d.x2) / 2},${d.y1} ${(d.x1 + d.x2) / 2},${d.y2} ${d.x2},${d.y2}`;
        })
        .attr('fill', 'none')
        .attr('stroke', 'rgba(59, 130, 246, 0.3)')
        .attr('stroke-width', 8);
    } catch (e) {
      // Silent fail for sankey rendering
    }
  }

  /**
   * Render SVG fallback when Chart.js/D3 not available
   */
  renderSVGFallback(container, dataset) {
    const width = container.clientWidth || 100;
    const height = container.clientHeight || 48;

    let svg = '';

    switch (dataset.type) {
      case 'bar':
        svg = this.generateBarSVG(dataset.data, width, height);
        break;
      case 'line':
      case 'area':
        svg = this.generateLineSVG(dataset.data, width, height);
        break;
      case 'pie':
      case 'doughnut':
        svg = this.generatePieSVG(dataset.data, width, height, dataset.type === 'doughnut');
        break;
      default:
        svg = this.generateBarSVG(dataset.data, width, height);
    }

    container.innerHTML = svg;
  }

  /**
   * Generate bar chart SVG
   */
  generateBarSVG(data, width, height) {
    const values = data.datasets[0].data;
    const max = Math.max(...values);
    const barWidth = (width - 10) / values.length - 2;
    const colors = data.datasets[0].backgroundColor;

    let bars = '';
    values.forEach((value, i) => {
      const barHeight = (value / max) * (height - 8);
      const x = 5 + i * (barWidth + 2);
      const y = height - barHeight - 4;
      const color = Array.isArray(colors) ? colors[i % colors.length] : colors;
      bars += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" rx="2"/>`;
    });

    return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="100%">${bars}</svg>`;
  }

  /**
   * Generate line chart SVG
   */
  generateLineSVG(data, width, height) {
    const values = data.datasets[0].data;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const step = (width - 10) / (values.length - 1);

    const points = values.map((value, i) => {
      const x = 5 + i * step;
      const y = height - 4 - ((value - min) / range) * (height - 8);
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = `5,${height - 4} ${points} ${width - 5},${height - 4}`;
    const color = data.datasets[0].borderColor || '#3B82F6';

    return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="100%">
      <polygon points="${areaPoints}" fill="${color}" fill-opacity="0.1"/>
      <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  }

  /**
   * Generate pie chart SVG
   */
  generatePieSVG(data, width, height, isDoughnut = false) {
    const values = data.datasets[0].data;
    const colors = data.datasets[0].backgroundColor;
    const total = values.reduce((a, b) => a + b, 0);
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) / 2 - 4;
    const innerR = isDoughnut ? r * 0.5 : 0;

    let paths = '';
    let startAngle = -Math.PI / 2;

    values.forEach((value, i) => {
      const angle = (value / total) * Math.PI * 2;
      const endAngle = startAngle + angle;
      const largeArc = angle > Math.PI ? 1 : 0;

      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);

      let d;
      if (isDoughnut) {
        const ix1 = cx + innerR * Math.cos(startAngle);
        const iy1 = cy + innerR * Math.sin(startAngle);
        const ix2 = cx + innerR * Math.cos(endAngle);
        const iy2 = cy + innerR * Math.sin(endAngle);
        d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
      } else {
        d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      }

      paths += `<path d="${d}" fill="${colors[i % colors.length]}"/>`;
      startAngle = endAngle;
    });

    return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="100%">${paths}</svg>`;
  }

  /**
   * Destroy all chart instances
   */
  destroy() {
    this.chartInstances.forEach(chart => chart.destroy());
    this.chartInstances.clear();
    if (this.observer) {
      this.observer.disconnect();
    }
    this.isInitialized = false;
  }

  /**
   * Get dataset by example ID
   */
  static getDataset(exampleId) {
    return DEMO_DATASETS[exampleId];
  }

  /**
   * Get prompt for example
   */
  static getPrompt(exampleId) {
    return DEMO_DATASETS[exampleId]?.prompt || '';
  }
}

// Auto-initialize when DOM is ready
let miniChartPreviewInstance = null;

export function initMiniChartPreviews() {
  if (miniChartPreviewInstance) {
    return miniChartPreviewInstance;
  }

  miniChartPreviewInstance = new MiniChartPreview();
  miniChartPreviewInstance.init();
  return miniChartPreviewInstance;
}

// Export singleton getter
export function getMiniChartPreview() {
  return miniChartPreviewInstance;
}

export default MiniChartPreview;
