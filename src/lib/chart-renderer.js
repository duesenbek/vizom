/**
 * Chart Renderer Module
 * Handles Chart.js rendering and configuration
 */

export class ChartRenderer {
  constructor(container) {
    this.container = container;
    this.charts = new Map(); // Track chart instances for cleanup
  }

  /**
   * Render a single chart
   */
  render(config, canvasId = null) {
    try {
      // Clear previous content
      this.clear();

      // Create canvas element
      const canvas = document.createElement('canvas');
      if (canvasId) canvas.id = canvasId;
      
      this.container.appendChild(canvas);

      // Create Chart.js instance
      const chart = new Chart(canvas.getContext('2d'), config);
      this.charts.set(canvasId || 'default', chart);

      return chart;
    } catch (error) {
      console.error('Chart render error:', error);
      this.showError('Failed to render chart');
      throw error;
    }
  }

  /**
   * Render dashboard with multiple charts
   */
  renderDashboard(layout, charts) {
    try {
      // Clear previous content
      this.clear();

      // Inject layout HTML
      this.container.innerHTML = sanitize(layout);

      // Render each chart
      charts.forEach(({ canvasId, config }) => {
        const canvas = this.container.querySelector(`#${canvasId}`);
        if (canvas) {
          const chart = new Chart(canvas.getContext('2d'), config);
          this.charts.set(canvasId, chart);
        } else {
          console.warn(`Canvas #${canvasId} not found in layout`);
        }
      });
    } catch (error) {
      console.error('Dashboard render error:', error);
      this.showError('Failed to render dashboard');
      throw error;
    }
  }

  /**
   * Render HTML table
   */
  renderTable(html) {
    try {
      this.clear();
      this.container.innerHTML = sanitize(html);
    } catch (error) {
      console.error('Table render error:', error);
      this.showError('Failed to render table');
      throw error;
    }
  }

  /**
   * Clear all charts and content
   */
  clear() {
    // Destroy all Chart.js instances
    this.charts.forEach(chart => chart.destroy());
    this.charts.clear();

    // Clear container
    this.container.innerHTML = '';
  }

  /**
   * Show error message
   */
  showError(message) {
    this.container.innerHTML = sanitize(`
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 300px;
        padding: 2rem;
        text-align: center;
      ">
        <div style="
          max-width: 400px;
          padding: 1.5rem;
          border-radius: 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #991b1b;
        ">
          <svg style="width: 48px; height: 48px; margin: 0 auto 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p style="font-weight: 600; margin-bottom: 0.5rem;">Rendering Error</p>
          <p style="font-size: 0.875rem;">${message}</p>
        </div>
      </div>
    `);
  }

  /**
   * Show loading state
   */
  showLoading() {
    this.container.innerHTML = sanitize(`
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 300px;
        padding: 2rem;
      ">
        <div style="text-align: center;">
          <div style="
            width: 48px;
            height: 48px;
            margin: 0 auto 1rem;
            border: 3px solid rgba(37, 99, 235, 0.2);
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          "></div>
          <p style="color: #64748b; font-size: 0.875rem;">Generating visualization...</p>
        </div>
      </div>
    `);
  }

  /**
   * Export chart as image
   */
  async exportAsImage(format = 'png') {
    try {
      const canvas = this.container.querySelector('canvas');
      if (!canvas) throw new Error('No canvas found');

      return canvas.toDataURL(`image/${format}`);
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }

  /**
   * Get chart data for CSV export
   */
  getChartData() {
    const data = [];
    this.charts.forEach((chart, id) => {
      if (chart.data) {
        data.push({
          id,
          labels: chart.data.labels,
          datasets: chart.data.datasets,
        });
      }
    });
    return data;
  }
}
