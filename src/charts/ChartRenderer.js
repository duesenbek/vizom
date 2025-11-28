/**
 * ChartRenderer - Universal chart rendering across multiple libraries
 * Supports: Chart.js, ApexCharts, ECharts, Plotly
 */

import { CHART_TYPES, getChartType } from './ChartRegistry.js';

// Color palette
const COLORS = {
  primary: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#F97316', '#6366F1', '#14B8A6'],
  gradient: ['rgba(59,130,246,0.8)', 'rgba(139,92,246,0.8)', 'rgba(236,72,153,0.8)'],
  heatmap: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
};

export class ChartRenderer {
  constructor() {
    this.currentChart = null;
    this.currentLibrary = null;
    this.container = null;
  }

  /**
   * Render chart to container
   * @param {string} chartType - Chart type ID from registry
   * @param {object} data - Parsed data { labels, data, ... }
   * @param {HTMLElement|string} container - Container element or ID
   * @param {object} options - Additional options
   */
  async render(chartType, data, container, options = {}) {
    // Get container element
    if (typeof container === 'string') {
      container = document.getElementById(container) || document.querySelector(container);
    }
    if (!container) throw new Error('Container not found');
    
    this.container = container;
    
    // Get chart config from registry
    const chartConfig = getChartType(chartType);
    if (!chartConfig) {
      console.warn(`[ChartRenderer] Unknown chart type: ${chartType}, falling back to bar`);
      return this._renderChartJS('bar', data, container, options);
    }

    // Destroy previous chart
    this.destroy();

    // Route to correct library
    const library = chartConfig.library;
    console.log(`[ChartRenderer] Rendering ${chartType} with ${library}`);

    switch (library) {
      case 'chartjs':
        return this._renderChartJS(chartType, data, container, options);
      case 'apexcharts':
        return this._renderApexCharts(chartType, data, container, options);
      case 'echarts':
        return this._renderECharts(chartType, data, container, options);
      case 'plotly':
        return this._renderPlotly(chartType, data, container, options);
      default:
        return this._renderChartJS(chartType, data, container, options);
    }
  }

  /**
   * Destroy current chart
   */
  destroy() {
    if (this.currentChart) {
      try {
        if (this.currentLibrary === 'chartjs' && this.currentChart.destroy) {
          this.currentChart.destroy();
        } else if (this.currentLibrary === 'apexcharts' && this.currentChart.destroy) {
          this.currentChart.destroy();
        } else if (this.currentLibrary === 'echarts' && this.currentChart.dispose) {
          this.currentChart.dispose();
        } else if (this.currentLibrary === 'plotly' && this.container) {
          window.Plotly?.purge(this.container);
        }
      } catch (e) {
        console.warn('[ChartRenderer] Error destroying chart:', e);
      }
      this.currentChart = null;
    }
  }

  // ==================== CHART.JS ====================
  async _renderChartJS(chartType, data, container, options) {
    await this._waitForLibrary('Chart');
    
    container.innerHTML = '<canvas style="width:100%;height:100%"></canvas>';
    const canvas = container.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    const { labels, data: values, title } = data;
    const isCircular = ['pie', 'doughnut', 'polarArea'].includes(chartType);
    const isLine = chartType === 'line';

    const config = {
      type: chartType === 'area' ? 'line' : chartType,
      data: {
        labels,
        datasets: [{
          label: title || 'Data',
          data: values,
          backgroundColor: isLine ? 'rgba(59,130,246,0.2)' : isCircular ? COLORS.primary.slice(0, values.length) : COLORS.primary[0],
          borderColor: isCircular ? '#fff' : COLORS.primary[0],
          borderWidth: isCircular ? 2 : 3,
          borderRadius: chartType === 'bar' ? 6 : 0,
          tension: 0.4,
          fill: isLine || chartType === 'area',
          pointRadius: isLine ? 4 : 0,
          pointBackgroundColor: '#fff',
          pointBorderColor: COLORS.primary[0],
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 750, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: isCircular, position: 'right' },
          title: { display: true, text: title || 'Chart', font: { size: 16, weight: '600' } },
          tooltip: { backgroundColor: 'rgba(15,23,42,0.9)', cornerRadius: 8, padding: 12 }
        },
        scales: isCircular ? {} : {
          x: { grid: { display: false }, ticks: { color: '#64748B' } },
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#64748B' } }
        }
      }
    };

    if (chartType === 'doughnut') config.options.cutout = '60%';

    this.currentChart = new window.Chart(ctx, config);
    this.currentLibrary = 'chartjs';
    return this.currentChart;
  }

  // ==================== APEXCHARTS ====================
  async _renderApexCharts(chartType, data, container, options) {
    await this._waitForLibrary('ApexCharts');
    
    container.innerHTML = '';
    const { labels, data: values, title } = data;

    let apexOptions = {
      chart: {
        type: this._mapApexType(chartType),
        height: '100%',
        animations: { enabled: true, easing: 'easeinout', speed: 800 },
        toolbar: { show: true, tools: { download: true, zoom: false } },
        fontFamily: 'Inter, sans-serif'
      },
      colors: COLORS.primary,
      title: { text: title || 'Chart', style: { fontSize: '16px', fontWeight: 600 } },
      tooltip: { theme: 'dark' },
      legend: { position: 'bottom' }
    };

    // Configure based on chart type
    switch (chartType) {
      case 'apexLine':
        apexOptions.series = [{ name: title || 'Series', data: values }];
        apexOptions.xaxis = { categories: labels };
        apexOptions.stroke = { curve: 'smooth', width: 3 };
        apexOptions.fill = { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 } };
        break;

      case 'heatmap':
        apexOptions.chart.type = 'heatmap';
        apexOptions.series = this._generateHeatmapData(labels, values);
        apexOptions.plotOptions = { heatmap: { colorScale: { ranges: this._getHeatmapRanges() } } };
        break;

      case 'candlestick':
        apexOptions.chart.type = 'candlestick';
        apexOptions.series = [{ data: this._generateCandlestickData(values) }];
        break;

      case 'radialBar':
        apexOptions.chart.type = 'radialBar';
        apexOptions.series = values.slice(0, 4);
        apexOptions.labels = labels.slice(0, 4);
        apexOptions.plotOptions = {
          radialBar: {
            hollow: { size: '40%' },
            dataLabels: { name: { fontSize: '14px' }, value: { fontSize: '20px' } }
          }
        };
        break;

      case 'treemapApex':
        apexOptions.chart.type = 'treemap';
        apexOptions.series = [{ data: labels.map((l, i) => ({ x: l, y: values[i] })) }];
        break;

      case 'timeline':
        apexOptions.chart.type = 'rangeBar';
        apexOptions.series = [{ data: this._generateTimelineData(labels, values) }];
        apexOptions.plotOptions = { bar: { horizontal: true, rangeBarGroupRows: true } };
        break;

      case 'rangeArea':
        apexOptions.chart.type = 'rangeArea';
        apexOptions.series = this._generateRangeData(labels, values);
        break;

      default:
        apexOptions.series = [{ name: title || 'Series', data: values }];
        apexOptions.xaxis = { categories: labels };
    }

    this.currentChart = new window.ApexCharts(container, apexOptions);
    await this.currentChart.render();
    this.currentLibrary = 'apexcharts';
    return this.currentChart;
  }

  // ==================== ECHARTS ====================
  async _renderECharts(chartType, data, container, options) {
    await this._waitForLibrary('echarts');
    
    container.innerHTML = '';
    const { labels, data: values, title, nodes, links } = data;

    this.currentChart = window.echarts.init(container);
    this.currentLibrary = 'echarts';

    let echartsOptions = {
      title: { text: title || 'Chart', left: 'center', textStyle: { fontSize: 16, fontWeight: 600 } },
      tooltip: { trigger: 'item', backgroundColor: 'rgba(15,23,42,0.9)', textStyle: { color: '#fff' } },
      color: COLORS.primary,
      animationDuration: 800,
      animationEasing: 'cubicOut'
    };

    switch (chartType) {
      case 'treemap':
        echartsOptions.series = [{
          type: 'treemap',
          data: labels.map((l, i) => ({ name: l, value: values[i] })),
          label: { show: true, formatter: '{b}' },
          itemStyle: { borderColor: '#fff', borderWidth: 2, gapWidth: 2 }
        }];
        break;

      case 'sunburst':
        echartsOptions.series = [{
          type: 'sunburst',
          data: this._generateSunburstData(labels, values),
          radius: ['15%', '90%'],
          label: { rotate: 'radial' }
        }];
        break;

      case 'graph':
        const graphData = nodes && links ? { nodes, links } : this._generateGraphData(labels, values);
        echartsOptions.series = [{
          type: 'graph',
          layout: 'force',
          data: graphData.nodes,
          links: graphData.links,
          roam: true,
          label: { show: true, position: 'right' },
          force: { repulsion: 100, edgeLength: 100 },
          lineStyle: { curveness: 0.3 }
        }];
        break;

      case 'funnel':
        echartsOptions.series = [{
          type: 'funnel',
          data: labels.map((l, i) => ({ name: l, value: values[i] })).sort((a, b) => b.value - a.value),
          label: { show: true, position: 'inside' },
          gap: 2,
          itemStyle: { borderColor: '#fff', borderWidth: 1 }
        }];
        break;

      case 'gauge':
        echartsOptions.series = [{
          type: 'gauge',
          data: [{ value: values[0] || 75, name: labels[0] || 'Progress' }],
          detail: { formatter: '{value}%', fontSize: 24 },
          axisLine: { lineStyle: { width: 20, color: [[0.3, '#EF4444'], [0.7, '#F59E0B'], [1, '#10B981']] } }
        }];
        break;

      case 'sankey':
        const sankeyData = nodes && links ? { nodes, links } : this._generateSankeyData(labels, values);
        echartsOptions.series = [{
          type: 'sankey',
          data: sankeyData.nodes,
          links: sankeyData.links,
          emphasis: { focus: 'adjacency' },
          lineStyle: { color: 'gradient', curveness: 0.5 }
        }];
        break;

      case 'parallel':
        echartsOptions.parallelAxis = labels.map((l, i) => ({ dim: i, name: l }));
        echartsOptions.series = [{
          type: 'parallel',
          data: [values]
        }];
        break;
    }

    this.currentChart.setOption(echartsOptions);
    
    // Handle resize
    window.addEventListener('resize', () => this.currentChart?.resize());
    
    return this.currentChart;
  }

  // ==================== PLOTLY ====================
  async _renderPlotly(chartType, data, container, options) {
    await this._waitForLibrary('Plotly');
    
    container.innerHTML = '';
    const { labels, data: values, title } = data;

    let traces = [];
    let layout = {
      title: { text: title || 'Chart', font: { size: 16 } },
      font: { family: 'Inter, sans-serif' },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      margin: { t: 50, r: 30, b: 50, l: 50 }
    };

    switch (chartType) {
      case 'boxPlot':
        traces = labels.map((l, i) => ({
          type: 'box',
          name: l,
          y: this._generateDistributionData(values[i] || values[0]),
          marker: { color: COLORS.primary[i % COLORS.primary.length] }
        }));
        break;

      case 'violin':
        traces = labels.map((l, i) => ({
          type: 'violin',
          name: l,
          y: this._generateDistributionData(values[i] || values[0]),
          box: { visible: true },
          meanline: { visible: true },
          marker: { color: COLORS.primary[i % COLORS.primary.length] }
        }));
        break;

      case 'waterfall':
        traces = [{
          type: 'waterfall',
          x: labels,
          y: values,
          connector: { line: { color: '#64748B' } },
          increasing: { marker: { color: '#10B981' } },
          decreasing: { marker: { color: '#EF4444' } },
          totals: { marker: { color: '#3B82F6' } }
        }];
        break;

      case 'scatter3d':
        traces = [{
          type: 'scatter3d',
          mode: 'markers',
          x: values.map((_, i) => i),
          y: values,
          z: values.map(v => v * Math.random()),
          marker: { size: 8, color: values, colorscale: 'Viridis' }
        }];
        layout.scene = { xaxis: { title: 'X' }, yaxis: { title: 'Y' }, zaxis: { title: 'Z' } };
        break;

      case 'surface3d':
        traces = [{
          type: 'surface',
          z: this._generateSurfaceData(values),
          colorscale: 'Viridis'
        }];
        break;

      case 'contour':
        traces = [{
          type: 'contour',
          z: this._generateSurfaceData(values),
          colorscale: 'Viridis',
          contours: { coloring: 'heatmap' }
        }];
        break;
    }

    const config = { responsive: true, displayModeBar: true };
    this.currentChart = await window.Plotly.newPlot(container, traces, layout, config);
    this.currentLibrary = 'plotly';
    return this.currentChart;
  }

  // ==================== HELPERS ====================
  
  async _waitForLibrary(name, maxWait = 10000) {
    const start = Date.now();
    while (!window[name] && Date.now() - start < maxWait) {
      await new Promise(r => setTimeout(r, 100));
    }
    if (!window[name]) throw new Error(`${name} library not loaded`);
  }

  _mapApexType(type) {
    const map = { apexLine: 'area', heatmap: 'heatmap', candlestick: 'candlestick', radialBar: 'radialBar', treemapApex: 'treemap', timeline: 'rangeBar', rangeArea: 'rangeArea' };
    return map[type] || 'line';
  }

  _generateHeatmapData(labels, values) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => ({
      name: day,
      data: labels.slice(0, 12).map((l, j) => ({ x: l, y: values[(i * 12 + j) % values.length] || Math.floor(Math.random() * 100) }))
    }));
  }

  _getHeatmapRanges() {
    return [
      { from: 0, to: 25, color: '#E2E8F0', name: 'Low' },
      { from: 26, to: 50, color: '#93C5FD', name: 'Medium' },
      { from: 51, to: 75, color: '#3B82F6', name: 'High' },
      { from: 76, to: 100, color: '#1E40AF', name: 'Very High' }
    ];
  }

  _generateCandlestickData(values) {
    return values.map((v, i) => ({
      x: new Date(2024, 0, i + 1),
      y: [v * 0.95, v * 1.05, v * 0.9, v * 1.1] // [open, high, low, close]
    }));
  }

  _generateTimelineData(labels, values) {
    const start = new Date(2024, 0, 1);
    return labels.map((l, i) => ({
      x: l,
      y: [start.getTime() + i * 86400000 * 7, start.getTime() + (i + 1) * 86400000 * 7 + values[i] * 86400000]
    }));
  }

  _generateRangeData(labels, values) {
    return [{
      name: 'Range',
      data: labels.map((l, i) => ({ x: l, y: [values[i] * 0.8, values[i] * 1.2] }))
    }];
  }

  _generateSunburstData(labels, values) {
    const total = values.reduce((a, b) => a + b, 0);
    return labels.map((l, i) => ({
      name: l,
      value: values[i],
      children: [{ name: `${l} Detail`, value: values[i] * 0.6 }, { name: `${l} Other`, value: values[i] * 0.4 }]
    }));
  }

  _generateGraphData(labels, values) {
    const nodes = labels.map((l, i) => ({ name: l, symbolSize: Math.max(20, values[i] / 2), category: i % 3 }));
    const links = [];
    for (let i = 0; i < labels.length - 1; i++) {
      links.push({ source: labels[i], target: labels[i + 1], value: values[i] });
      if (i > 0) links.push({ source: labels[i], target: labels[0], value: values[i] / 2 });
    }
    return { nodes, links };
  }

  _generateSankeyData(labels, values) {
    const nodes = labels.map(l => ({ name: l }));
    const links = [];
    for (let i = 0; i < labels.length - 1; i++) {
      links.push({ source: labels[i], target: labels[i + 1], value: values[i] });
    }
    return { nodes, links };
  }

  _generateDistributionData(baseValue) {
    const data = [];
    for (let i = 0; i < 50; i++) {
      data.push(baseValue + (Math.random() - 0.5) * baseValue * 0.5);
    }
    return data;
  }

  _generateSurfaceData(values) {
    const size = Math.ceil(Math.sqrt(values.length)) || 5;
    const data = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(values[(i * size + j) % values.length] || Math.sin(i) * Math.cos(j) * 10);
      }
      data.push(row);
    }
    return data;
  }
}

// Singleton export
export const chartRenderer = new ChartRenderer();
export default ChartRenderer;
