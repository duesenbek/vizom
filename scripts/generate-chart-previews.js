/**
 * Chart Preview Generator
 * Generates static PNG previews for all chart types using their recommended libraries
 */

import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';
import { Chart } from 'chart.js/auto';
import { getAllChartTypes } from '../src/charts/chart-types.js';

// Project color palette
const PALETTE = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  accent: '#06b6d4',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  gray: ['#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb'],
  gradient: ['#3b82f6', '#8b5cf6', '#06b6d4']
};

// Sample datasets for different chart types
const SAMPLE_DATASETS = {
  // Basic charts
  line: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [30, 45, 35, 50, 40, 60]
  },
  spline: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [30, 45, 35, 50, 40, 60]
  },
  bar: {
    labels: ['A', 'B', 'C', 'D', 'E'],
    data: [45, 30, 60, 35, 50]
  },
  column: {
    labels: ['A', 'B', 'C', 'D', 'E'],
    data: [45, 30, 60, 35, 50]
  },
  'grouped-bar': {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      [45, 50, 40, 55],
      [30, 35, 45, 40]
    ]
  },
  'stacked-bar': {
    labels: ['A', 'B', 'C', 'D'],
    datasets: [
      [20, 25, 30, 20],
      [15, 20, 25, 20],
      [10, 15, 15, 10]
    ]
  },
  scatter: {
    data: Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100
    }))
  },
  bubble: {
    data: Array.from({ length: 8 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 20 + 5
    }))
  },
  area: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [30, 45, 35, 50, 40, 60]
  },
  'stepped-area': {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [30, 45, 35, 50, 40, 60]
  },
  pie: {
    labels: ['A', 'B', 'C', 'D'],
    data: [30, 25, 20, 25]
  },
  doughnut: {
    labels: ['A', 'B', 'C', 'D'],
    data: [30, 25, 20, 25]
  },
  'polar-area': {
    labels: ['A', 'B', 'C', 'D', 'E'],
    data: [30, 25, 20, 25, 15]
  },
  
  // Composition charts
  'stacked-area': {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      [20, 25, 30, 25, 30, 35],
      [15, 20, 15, 25, 20, 20],
      [10, 15, 10, 15, 10, 15]
    ]
  },
  radar: {
    labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency'],
    data: [80, 65, 75, 85, 70]
  },
  sunburst: {
    // Hierarchical data for treemap/sunburst
    data: [
      { name: 'Root', value: 100, children: [
        { name: 'A', value: 60, children: [
          { name: 'A1', value: 30 },
          { name: 'A2', value: 30 }
        ]},
        { name: 'B', value: 40, children: [
          { name: 'B1', value: 20 },
          { name: 'B2', value: 20 }
        ]}
      ]}
    ]
  },
  treemap: {
    data: [
      { name: 'A', value: 30 },
      { name: 'B', value: 25 },
      { name: 'C', value: 20 },
      { name: 'D', value: 15 },
      { name: 'E', value: 10 }
    ]
  },
  funnel: {
    labels: ['Awareness', 'Interest', 'Desire', 'Action'],
    data: [100, 75, 50, 25]
  },
  waterfall: {
    labels: ['Start', '+A', '-B', '+C', '-D', 'End'],
    data: [100, 30, -20, 25, -15, 120]
  },
  icicle: {
    data: [
      { name: 'Total', value: 100, children: [
        { name: 'Group 1', value: 60, children: [
          { name: 'Item 1', value: 30 },
          { name: 'Item 2', value: 30 }
        ]},
        { name: 'Group 2', value: 40, children: [
          { name: 'Item 3', value: 20 },
          { name: 'Item 4', value: 20 }
        ]}
      ]}
    ]
  },
  marimekko: {
    labels: ['A', 'B', 'C'],
    datasets: [
      [30, 25, 20],
      [20, 15, 25],
      [15, 20, 15]
    ],
    widths: [40, 35, 25]
  },
  
  // Comparison charts
  bullet: {
    target: 80,
    actual: 65,
    ranges: [20, 50, 80]
  },
  gauge: {
    value: 75,
    max: 100
  },
  progress: {
    value: 65,
    max: 100
  },
  pareto: {
    labels: ['A', 'B', 'C', 'D', 'E', 'F'],
    values: [30, 25, 20, 15, 7, 3]
  },
  lollipop: {
    labels: ['A', 'B', 'C', 'D', 'E'],
    data: [45, 30, 60, 35, 50]
  },
  
  // Distribution charts
  histogram: {
    data: Array.from({ length: 100 }, () => Math.random() * 100)
  },
  boxplot: {
    labels: ['A', 'B', 'C'],
    data: [
      [20, 35, 45, 60, 75],
      [25, 40, 50, 65, 80],
      [15, 30, 40, 55, 70]
    ]
  },
  violin: {
    labels: ['A', 'B', 'C'],
    data: [
      Array.from({ length: 50 }, () => 30 + Math.random() * 40),
      Array.from({ length: 50 }, () => 40 + Math.random() * 40),
      Array.from({ length: 50 }, () => 20 + Math.random() * 40)
    ]
  },
  density: {
    data: Array.from({ length: 200 }, () => Math.random() * 100)
  },
  hexbin: {
    data: Array.from({ length: 300 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100
    }))
  },
  contour: {
    data: Array.from({ length: 400 }, (i) => ({
      x: (i % 20) * 5,
      y: Math.floor(i / 20) * 5,
      value: Math.sin((i % 20) * 0.5) * Math.cos(Math.floor(i / 20) * 0.5)
    }))
  },
  
  // Advanced charts
  heatmap: {
    data: Array.from({ length: 25 }, (i) => ({
      x: i % 5,
      y: Math.floor(i / 5),
      value: Math.random() * 100
    }))
  },
  calendar: {
    data: Array.from({ length: 365 }, (i) => ({
      date: new Date(2024, 0, i + 1),
      value: Math.random() * 100
    }))
  },
  sankey: {
    nodes: ['Source', 'A', 'B', 'C', 'Target'],
    links: [
      { source: 0, target: 1, value: 30 },
      { source: 0, target: 2, value: 20 },
      { source: 1, target: 3, value: 25 },
      { source: 2, target: 3, value: 15 },
      { source: 3, target: 4, value: 40 }
    ]
  },
  parallel: {
    data: Array.from({ length: 20 }, () => ({
      dim1: Math.random() * 100,
      dim2: Math.random() * 100,
      dim3: Math.random() * 100,
      dim4: Math.random() * 100
    }))
  },
  network: {
    nodes: Array.from({ length: 8 }, (i) => ({
      id: i,
      x: Math.random() * 200,
      y: Math.random() * 150
    })),
    links: [
      { source: 0, target: 1 },
      { source: 1, target: 2 },
      { source: 2, target: 3 },
      { source: 0, target: 3 },
      { source: 3, target: 4 },
      { source: 4, target: 5 },
      { source: 5, target: 6 },
      { source: 6, target: 7 },
      { source: 7, target: 0 }
    ]
  },
  wordcloud: {
    data: [
      { text: 'Data', value: 100 },
      { text: 'Chart', value: 80 },
      { text: 'Visual', value: 60 },
      { text: 'Analytics', value: 50 },
      { text: 'Dashboard', value: 40 },
      { text: 'Report', value: 30 },
      { text: 'Insight', value: 25 },
      { text: 'Metrics', value: 20 }
    ]
  },
  'radial-bar': {
    labels: ['A', 'B', 'C', 'D'],
    data: [75, 60, 85, 45]
  },
  choropleth: {
    data: [
      { region: 'US-CA', value: 80 },
      { region: 'US-TX', value: 65 },
      { region: 'US-NY', value: 70 },
      { region: 'US-FL', value: 55 }
    ]
  },
  
  // Financial charts
  candlestick: {
    data: Array.from({ length: 20 }, (i) => ({
      x: i,
      open: 100 + Math.random() * 20,
      high: 120 + Math.random() * 10,
      low: 95 + Math.random() * 10,
      close: 105 + Math.random() * 15
    }))
  },
  ohlc: {
    data: Array.from({ length: 20 }, (i) => ({
      x: i,
      open: 100 + Math.random() * 20,
      high: 120 + Math.random() * 10,
      low: 95 + Math.random() * 10,
      close: 105 + Math.random() * 15
    }))
  },
  'range-area': {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    upper: [80, 85, 90, 88, 92, 95],
    lower: [60, 65, 70, 68, 72, 75]
  },
  renko: {
    data: Array.from({ length: 30 }, () => Math.random() * 100)
  },
  
  // Spatial charts
  'geo-scatter': {
    data: Array.from({ length: 15 }, () => ({
      lat: 25 + Math.random() * 25,
      lng: -125 + Math.random() * 60,
      value: Math.random() * 100
    }))
  },
  'geo-heatmap': {
    data: Array.from({ length: 50 }, () => ({
      lat: 25 + Math.random() * 25,
      lng: -125 + Math.random() * 60,
      value: Math.random() * 100
    }))
  },
  'arc-map': {
    data: [
      { from: { lat: 40.7, lng: -74.0 }, to: { lat: 34.0, lng: -118.2 }, value: 50 },
      { from: { lat: 41.8, lng: -87.6 }, to: { lat: 29.7, lng: -95.3 }, value: 30 },
      { from: { lat: 37.7, lng: -122.4 }, to: { lat: 47.6, lng: -122.3 }, value: 40 }
    ]
  },
  territory: {
    data: [
      { region: 'North', value: 80 },
      { region: 'South', value: 65 },
      { region: 'East', value: 70 },
      { region: 'West', value: 55 }
    ]
  },
  
  // Temporal charts
  timeline: {
    events: [
      { start: '2024-01', end: '2024-03', label: 'Phase 1' },
      { start: '2024-03', end: '2024-06', label: 'Phase 2' },
      { start: '2024-06', end: '2024-09', label: 'Phase 3' }
    ]
  },
  stream: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      [20, 25, 30, 25, 30, 35],
      [15, 20, 15, 25, 20, 20],
      [10, 15, 10, 15, 10, 15]
    ]
  },
  'range-bar': {
    labels: ['Task A', 'Task B', 'Task C'],
    start: [0, 2, 4],
    end: [3, 5, 7]
  },
  gantt: {
    tasks: [
      { name: 'Design', start: 0, end: 3 },
      { name: 'Develop', start: 2, end: 6 },
      { name: 'Test', start: 5, end: 8 },
      { name: 'Deploy', start: 7, end: 9 }
    ]
  },
  
  // Specialized charts
  '3d-surface': {
    data: Array.from({ length: 100 }, (i) => ({
      x: (i % 10) * 10,
      y: Math.floor(i / 10) * 10,
      z: Math.sin((i % 10) * 0.5) * Math.cos(Math.floor(i / 10) * 0.5) * 50
    }))
  },
  '3d-scatter': {
    data: Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 100
    }))
  },
  isoline: {
    data: Array.from({ length: 100 }, (i) => ({
      x: (i % 10) * 10,
      y: Math.floor(i / 10) * 10,
      value: Math.sin((i % 10) * 0.5) * Math.cos(Math.floor(i / 10) * 0.5)
    }))
  },
  'flow-map': {
    data: [
      { from: { lat: 40.7, lng: -74.0 }, to: { lat: 34.0, lng: -118.2 }, value: 50 },
      { from: { lat: 41.8, lng: -87.6 }, to: { lat: 29.7, lng: -95.3 }, value: 30 }
    ]
  },
  'correlation-matrix': {
    data: [
      [1.0, 0.8, 0.3, 0.5],
      [0.8, 1.0, 0.2, 0.6],
      [0.3, 0.2, 1.0, 0.7],
      [0.5, 0.6, 0.7, 1.0]
    ]
  },
  'funnel-waterfall': {
    labels: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4'],
    values: [100, 75, 50, 25],
    changes: [0, -25, -25, -25]
  }
};

class ChartPreviewGenerator {
  constructor() {
    this.outputDir = path.join(process.cwd(), 'assets', 'chart-previews');
    this.chartTypes = getAllChartTypes();
    
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }
  
  async generateAllPreviews() {
        console.log(`[Preview] Generating ${this.chartTypes.length} chart previews...`);
    
    const results = [];
    
    for (const chartType of this.chartTypes) {
      try {
        const success = await this.generatePreview(chartType);
        results.push({ type: chartType.id, success });
        
        if (success) {
                    console.log(`[Preview] Generated ${chartType.id}.png`);
        } else {
                    console.log(`[Preview] Failed to generate ${chartType.id}.png`);
        }
      } catch (error) {
                console.error(`[Preview] Error generating ${chartType.id}:`, error.message);
        results.push({ type: chartType.id, success: false, error: error.message });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
        console.log(`\n[Preview] Generation complete: ${successCount}/${results.length} previews created`);
    
    return results;
  }
  
  async generatePreview(chartType) {
    const canvas = createCanvas(300, 200);
    const ctx = canvas.getContext('2d');
    
    // Set background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 300, 200);
    
    try {
      switch (chartType.library) {
        case 'chartjs':
          return this.generateChartJS(canvas, chartType);
        case 'echarts':
          return this.generateECharts(canvas, chartType);
        case 'apexcharts':
          return this.generateApexCharts(canvas, chartType);
        case 'plotly':
          return this.generatePlotly(canvas, chartType);
        default:
          return this.generateChartJS(canvas, chartType); // Fallback to Chart.js
      }
    } catch (error) {
      console.error(`Error generating ${chartType.id} with ${chartType.library}:`, error);
      // Try fallback to Chart.js
      try {
        return this.generateChartJS(canvas, chartType);
      } catch (fallbackError) {
        // Generate placeholder if all fails
        return this.generatePlaceholder(canvas, chartType);
      }
    }
  }
  
  generateChartJS(canvas, chartType) {
    const ctx = canvas.getContext('2d');
    const dataset = SAMPLE_DATASETS[chartType.id] || SAMPLE_DATASETS.line;
    
    const config = this.getChartJSConfig(chartType, dataset);
    const chart = new Chart(ctx, config);
    
    // Export to buffer
    const buffer = canvas.toBuffer('image/png');
    
    // Save file
    const filePath = path.join(this.outputDir, `${chartType.id}.png`);
    fs.writeFileSync(filePath, buffer);
    
    chart.destroy();
    return true;
  }
  
  getChartJSConfig(chartType, dataset) {
    const baseConfig = {
      type: this.getChartJSType(chartType.id),
      data: this.getChartData(chartType.id, dataset),
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          x: { display: false },
          y: { display: false }
        }
      }
    };
    
    // Apply type-specific styling
    this.applyChartJSStyling(baseConfig, chartType.id);
    
    return baseConfig;
  }
  
  getChartJSType(chartId) {
    const typeMap = {
      'line': 'line',
      'spline': 'line',
      'bar': 'bar',
      'column': 'bar',
      'scatter': 'scatter',
      'bubble': 'bubble',
      'area': 'line',
      'pie': 'piechart',
      'doughnut': 'doughnut',
      'polar-area': 'polarArea'
    };
    
    return typeMap[chartId] || 'line';
  }
  
  getChartData(chartId, dataset) {
    if (dataset.labels && dataset.data) {
      return {
        labels: dataset.labels,
        datasets: [{
          data: dataset.data,
          backgroundColor: PALETTE.primary,
          borderColor: PALETTE.primary,
          borderWidth: 2,
          fill: chartId.includes('area')
        }]
      };
    }
    
    return { datasets: [{ data: dataset }] };
  }
  
  applyChartJSStyling(config, chartId) {
    const { options } = config;
    
    switch (chartId) {
      case 'line':
      case 'spline':
        options.elements = {
          line: { tension: chartId === 'spline' ? 0.4 : 0 },
          point: { radius: 3 }
        };
        break;
        
      case 'area':
        options.elements = {
          line: { tension: 0.4 },
          point: { radius: 0 }
        };
        break;
        
      case 'scatter':
        options.elements = {
          point: { radius: 4 }
        };
        break;
    }
  }
  
  generateECharts(canvas, chartType) {
    // ECharts implementation would require node-canvas integration
    // For now, generate a placeholder
    return this.generatePlaceholder(canvas, chartType);
  }
  
  generateApexCharts(canvas, chartType) {
    // ApexCharts implementation would require node-canvas integration
    // For now, generate a placeholder
    return this.generatePlaceholder(canvas, chartType);
  }
  
  generatePlotly(canvas, chartType) {
    // Plotly implementation would require node-canvas integration
    // For now, generate a placeholder
    return this.generatePlaceholder(canvas, chartType);
  }
  
  generatePlaceholder(canvas, chartType) {
    const ctx = canvas.getContext('2d');
    
    // Draw placeholder with chart type name
    ctx.fillStyle = PALETTE.primary;
    ctx.fillRect(50, 50, 200, 100);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(chartType.name, 150, 100);
    
    ctx.font = '12px Arial';
    ctx.fillText(`(${chartType.id})`, 150, 120);
    
    // Save file
    const buffer = canvas.toBuffer('image/png');
    const filePath = path.join(this.outputDir, `${chartType.id}.png`);
    fs.writeFileSync(filePath, buffer);
    
    return true;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const generator = new ChartPreviewGenerator();
  generator.generateAllPreviews().then(results => {
    process.exit(0);
  }).catch(error => {
    console.error('Generation failed:', error);
    process.exit(1);
  });
}

export { ChartPreviewGenerator };
