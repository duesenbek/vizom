/**
 * Live Demo Section Component
 * Interactive chart generation with no login required
 */

export class LiveDemoSection {
  constructor(container) {
    this.container = container;
    this.currentChart = null;
    this.isGenerating = false;
    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
    this.loadExamplePrompts();
  }

  render() {
    this.container.innerHTML = `
      <section id="live-demo" class="py-20 brand-surface">
        <div class="container mx-auto px-4">
          <!-- Section Header -->
          <div class="text-center mb-16 max-w-4xl mx-auto">
            <div class="inline-flex items-center px-4 py-2 brand-badge-success rounded-full text-sm font-medium mb-6">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              Try it yourself - No login required
            </div>
            
            <h2 class="text-4xl md:text-5xl font-bold brand-text-primary mb-6">
              Create Your First Chart
              <span class="brand-link"> Right Now</span>
            </h2>
            
            <p class="text-xl brand-text-secondary leading-relaxed">
              Describe the chart you want in plain English and watch AI create it instantly. 
              First 3 charts are completely free!
            </p>
          </div>

          <!-- Demo Interface -->
          <div class="max-w-6xl mx-auto">
            <div class="grid lg:grid-cols-2 gap-8">
              
              <!-- Input Panel -->
              <div class="demo-input-panel">
                <div class="brand-card rounded-2xl p-6">
                  <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-semibold brand-text-primary">Describe Your Chart</h3>
                    <div class="flex items-center space-x-2 text-sm brand-text-tertiary">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>Be specific for better results</span>
                    </div>
                  </div>

                  <!-- Chart Type Selector -->
                  <div class="mb-6">
                    <label class="block text-sm font-medium brand-text-secondary mb-3">Chart Type</label>
                    <div class="grid grid-cols-4 gap-2">
                      <button class="chart-type-btn active" data-type="bar">
                        <div class="w-8 h-8 mx-auto mb-1 flex items-center justify-center text-lg">
                          <i class="fa-solid fa-chart-column"></i>
                        </div>
                        <span class="text-xs brand-text-secondary">Bar</span>
                      </button>
                      <button class="chart-type-btn" data-type="line">
                        <div class="w-8 h-8 mx-auto mb-1 flex items-center justify-center text-lg">
                          <i class="fa-solid fa-chart-line"></i>
                        </div>
                        <span class="text-xs brand-text-secondary">Line</span>
                      </button>
                      <button class="chart-type-btn" data-type="pie">
                        <div class="w-8 h-8 mx-auto mb-1 flex items-center justify-center text-lg">
                          <i class="fa-solid fa-chart-pie"></i>
                        </div>
                        <span class="text-xs brand-text-secondary">Pie</span>
                      </button>
                      <button class="chart-type-btn" data-type="area">
                        <div class="w-8 h-8 mx-auto mb-1 flex items-center justify-center text-lg">
                          <i class="fa-solid fa-chart-area"></i>
                        </div>
                        <span class="text-xs brand-text-secondary">Area</span>
                      </button>
                    </div>
                  </div>

                  <!-- Prompt Input -->
                  <div class="mb-6">
                    <label class="block text-sm font-medium brand-text-secondary mb-3">Chart Description</label>
                    <textarea 
                      id="demo-prompt-input"
                      class="w-full h-32 px-4 py-3 rounded-lg brand-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 resize-none"
                      placeholder="Example: Create a bar chart showing monthly sales data for Q1 2024 with products A, B, and C. Use blue colors and add a trend line."
                    ></textarea>
                    <div class="mt-2 flex items-center justify-between">
                      <span id="char-count" class="text-xs brand-text-tertiary">0 / 500 characters</span>
                      <div class="flex items-center space-x-2">
                        <button class="text-xs brand-link" id="clear-prompt">Clear</button>
                      </div>
                    </div>
                  </div>

                  <!-- Example Prompts -->
                  <div class="mb-6">
                    <label class="block text-sm font-medium brand-text-secondary mb-3">Quick Examples</label>
                    <div class="grid grid-cols-1 gap-2">
                      <button class="example-prompt-btn" data-prompt="Create a bar chart showing monthly sales data for Q1 2024">
                        <i class="fa-solid fa-chart-column mr-2"></i>
                        Monthly sales comparison
                      </button>
                      <button class="example-prompt-btn" data-prompt="Generate a line chart showing user growth over 6 months">
                        <i class="fa-solid fa-chart-line mr-2"></i>
                        User growth trend
                      </button>
                      <button class="example-prompt-btn" data-prompt="Build a pie chart displaying market share percentages">
                        <i class="fa-solid fa-chart-pie mr-2"></i>
                        Market share distribution
                      </button>
                    </div>
                  </div>

                  <!-- Generate Button -->
                  <button id="demo-generate-btn" class="w-full py-4 brand-button-primary rounded-lg font-semibold transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <span>Generate Chart</span>
                  </button>

                  <!-- Usage Counter -->
                  <div class="mt-4 text-center">
                    <p class="text-sm brand-text-secondary">
                      <span class="font-medium brand-text-primary">2 free charts remaining</span> • 
                      <a href="#" class="brand-link">Upgrade for unlimited</a>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Output Panel -->
              <div class="demo-output-panel">
                <div class="brand-card rounded-2xl p-6">
                  <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-semibold brand-text-primary">Generated Chart</h3>
                    <div class="flex items-center space-x-2">
                      <button id="demo-refresh" class="p-2 brand-icon-button" title="Regenerate">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                      </button>
                      <button id="demo-download" class="p-2 brand-icon-button" title="Download">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Chart Display Area -->
                  <div class="chart-display-area brand-surface rounded-lg p-4 h-80 flex items-center justify-center relative">
                    <!-- Empty State -->
                    <div id="demo-empty-state" class="text-center space-y-4">
                      <div class="w-16 h-16 brand-empty-state rounded-full flex items-center justify-center mx-auto">
                        <svg class="w-8 h-8 brand-icon-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                      </div>
                      <div>
                        <p class="brand-text-secondary font-medium">Your chart will appear here</p>
                        <p class="text-sm brand-text-tertiary mt-1">Describe your chart and click Generate</p>
                      </div>
                    </div>

                    <!-- Loading State -->
                    <div id="demo-loading-state" class="hidden text-center space-y-4">
                      <div class="w-16 h-16 brand-loading-indicator rounded-full flex items-center justify-center mx-auto">
                        <svg class="w-8 h-8 brand-text-primary animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                      </div>
                      <div>
                        <p class="brand-text-secondary font-medium">AI is creating your chart...</p>
                        <p class="text-sm brand-text-tertiary mt-1">This usually takes 2-3 seconds</p>
                      </div>
                      <div class="w-full max-w-xs mx-auto">
                        <div class="flex items-center justify-between text-xs brand-text-tertiary mb-1">
                          <span>Analyzing prompt</span>
                          <span id="demo-progress-percent">0%</span>
                        </div>
                        <div class="w-full brand-progress-track rounded-full h-2">
                          <div id="demo-progress-bar" class="brand-progress-bar h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                        </div>
                      </div>
                    </div>

                    <!-- Chart Container -->
                    <div id="demo-chart-container" class="hidden w-full h-full">
                      <canvas id="demo-chart-canvas"></canvas>
                    </div>

                    <!-- Error State -->
                    <div id="demo-error-state" class="hidden text-center space-y-4">
                      <div class="w-16 h-16 brand-error-indicator rounded-full flex items-center justify-center mx-auto">
                        <svg class="w-8 h-8 brand-text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <p class="brand-text-error font-medium">Oops! Something went wrong</p>
                        <p class="text-sm brand-text-error mt-1">Please try again with a different description</p>
                      </div>
                      <button class="px-4 py-2 brand-button-danger rounded-lg text-sm font-medium transition-colors">
                        Try Again
                      </button>
                    </div>
                  </div>

                  <!-- Export Options -->
                  <div id="demo-export-options" class="hidden mt-6 pt-6 border-t brand-border">
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="text-sm font-medium brand-text-secondary">Export Options</h4>
                      <span class="text-xs brand-text-tertiary">High quality downloads</span>
                    </div>
                    <div class="grid grid-cols-4 gap-2">
                      <button class="export-option-btn" data-format="png">
                        <svg class="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span class="text-xs brand-text-secondary">PNG</span>
                      </button>
                      <button class="export-option-btn" data-format="svg">
                        <svg class="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                        </svg>
                        <span class="text-xs brand-text-secondary">SVG</span>
                      </button>
                      <button class="export-option-btn" data-format="pdf">
                        <svg class="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                        <span class="text-xs brand-text-secondary">PDF</span>
                      </button>
                      <button class="export-option-btn" data-format="html">
                        <svg class="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                        </svg>
                        <span class="text-xs brand-text-secondary">HTML</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Success Message -->
            <div id="demo-success-message" class="hidden mt-8 p-4 brand-success-panel rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 brand-success-indicator rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 brand-text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="brand-text-primary font-medium">Perfect! Your chart is ready</p>
                  <p class="brand-text-secondary text-sm mt-1">You can download it or create another one</p>
                </div>
                <button id="demo-create-another" class="px-4 py-2 brand-button-success rounded-lg text-sm font-medium transition-colors">
                  Create Another
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  setupEventListeners() {
    // Chart type selection
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.chart-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedChartType = btn.dataset.type;
      });
    });

    // Example prompts
    document.querySelectorAll('.example-prompt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const prompt = btn.dataset.prompt;
        document.getElementById('demo-prompt-input').value = prompt;
        this.updateCharCount();
      });
    });

    // Clear prompt
    document.getElementById('clear-prompt').addEventListener('click', () => {
      document.getElementById('demo-prompt-input').value = '';
      this.updateCharCount();
    });

    // Character count
    document.getElementById('demo-prompt-input').addEventListener('input', () => {
      this.updateCharCount();
    });

    // Generate button
    document.getElementById('demo-generate-btn').addEventListener('click', () => {
      this.generateChart();
    });

    // Refresh button
    document.getElementById('demo-refresh').addEventListener('click', () => {
      if (this.lastPrompt) {
        this.generateChart();
      }
    });

    // Download button
    document.getElementById('demo-download').addEventListener('click', () => {
      this.downloadChart('png');
    });

    // Export options
    document.querySelectorAll('.export-option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.downloadChart(btn.dataset.format);
      });
    });

    // Create another button
    document.getElementById('demo-create-another').addEventListener('click', () => {
      this.resetDemo();
    });
  }

  updateCharCount() {
    const input = document.getElementById('demo-prompt-input');
    const count = document.getElementById('char-count');
    const length = input.value.length;
    count.textContent = `${length} / 500 characters`;
    
    if (length > 500) {
      input.value = input.value.substring(0, 500);
      count.textContent = '500 / 500 characters';
    }
  }

  async generateChart() {
    const prompt = document.getElementById('demo-prompt-input').value.trim();
    
    if (!prompt) {
      this.showToast('Please describe the chart you want to create', 'warning');
      return;
    }

    if (this.isGenerating) return;

    this.isGenerating = true;
    this.lastPrompt = prompt;
    this.showLoading();

    try {
      // Simulate API call with progress
      await this.simulateProgress();
      
      // Generate chart
      await this.createChart(prompt);
      
      this.showSuccess();
    } catch (error) {
      console.error('[LiveDemo] Error generating chart:', error);
      this.showToast('Failed to generate chart. Please try again.', 'error');
    } finally {
      this.isGenerating = false;
    }
  }

  async simulateProgress() {
    const progressBar = document.getElementById('demo-progress-bar');
    const progressPercent = document.getElementById('demo-progress-percent');
    
    const steps = [
      { percent: 25, label: 'Analyzing prompt' },
      { percent: 50, label: 'Generating data' },
      { percent: 75, label: 'Creating visualization' },
      { percent: 100, label: 'Finalizing chart' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 500));
      progressBar.style.width = `${step.percent}%`;
      progressPercent.textContent = `${step.percent}%`;
    }
  }

  async createChart(prompt) {
    const container = document.getElementById('demo-chart-container');
    const canvas = document.getElementById('demo-chart-canvas');
    const ctx = canvas.getContext('2d');

    // Destroy existing chart
    if (this.currentChart) {
      this.currentChart.destroy();
    }

    // Generate sample data based on prompt
    const chartData = this.generateChartData(prompt);
    
    this.currentChart = new Chart(ctx, {
      type: chartData.type,
      data: chartData.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          },
          title: {
            display: true,
            text: chartData.title,
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    });
  }

  generateChartData(prompt) {
    const chartType = this.selectedChartType || 'bar';
    
    if (prompt.includes('sales')) {
      return {
        type: 'bar',
        title: 'Monthly Sales Data',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [{
            label: 'Sales ($k)',
            data: [65, 78, 90, 81, 95, 110],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2
          }]
        }
      };
    } else if (prompt.includes('growth')) {
      return {
        type: 'line',
        title: 'User Growth Trend',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Users',
            data: [1000, 1500, 2300, 3200, 4100, 5200],
            borderColor: 'rgba(34, 197, 94, 1)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4,
            fill: true
          }]
        }
      };
    } else if (prompt.includes('market')) {
      return {
        type: 'doughnut',
        title: 'Market Share Distribution',
        data: {
          labels: ['Product A', 'Product B', 'Product C', 'Product D'],
          datasets: [{
            data: [35, 25, 20, 20],
            backgroundColor: [
              'rgba(147, 51, 234, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(34, 197, 94, 0.8)',
              'rgba(251, 146, 60, 0.8)'
            ]
          }]
        }
      };
    } else {
      // Default chart
      return {
        type: chartType,
        title: 'Generated Chart',
        data: {
          labels: ['A', 'B', 'C', 'D', 'E'],
          datasets: [{
            label: 'Dataset',
            data: [12, 19, 3, 5, 2],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2
          }]
        }
      };
    }
  }

  showLoading() {
    document.getElementById('demo-empty-state').classList.add('hidden');
    document.getElementById('demo-error-state').classList.add('hidden');
    document.getElementById('demo-chart-container').classList.add('hidden');
    document.getElementById('demo-export-options').classList.add('hidden');
    document.getElementById('demo-success-message').classList.add('hidden');
    
    document.getElementById('demo-loading-state').classList.remove('hidden');
    document.getElementById('demo-generate-btn').disabled = true;
  }

  showSuccess() {
    document.getElementById('demo-loading-state').classList.add('hidden');
    document.getElementById('demo-empty-state').classList.add('hidden');
    document.getElementById('demo-error-state').classList.add('hidden');
    
    document.getElementById('demo-chart-container').classList.remove('hidden');
    document.getElementById('demo-export-options').classList.remove('hidden');
    document.getElementById('demo-success-message').classList.remove('hidden');
    
    document.getElementById('demo-generate-btn').disabled = false;
  }

  showError(error) {
    document.getElementById('demo-loading-state').classList.add('hidden');
    document.getElementById('demo-empty-state').classList.add('hidden');
    document.getElementById('demo-chart-container').classList.add('hidden');
    document.getElementById('demo-export-options').classList.add('hidden');
    document.getElementById('demo-success-message').classList.add('hidden');
    
    document.getElementById('demo-error-state').classList.remove('hidden');
    document.getElementById('demo-generate-btn').disabled = false;
  }

  resetDemo() {
    document.getElementById('demo-prompt-input').value = '';
    this.updateCharCount();
    
    document.getElementById('demo-loading-state').classList.add('hidden');
    document.getElementById('demo-error-state').classList.add('hidden');
    document.getElementById('demo-chart-container').classList.add('hidden');
    document.getElementById('demo-export-options').classList.add('hidden');
    document.getElementById('demo-success-message').classList.add('hidden');
    
    document.getElementById('demo-empty-state').classList.remove('hidden');
    document.getElementById('demo-generate-btn').disabled = false;
    
    if (this.currentChart) {
      this.currentChart.destroy();
      this.currentChart = null;
    }
  }

  downloadChart(format) {
    if (!this.currentChart) return;

    const link = document.createElement('a');
    
    switch (format) {
      case 'png':
        link.download = 'chart.png';
        link.href = this.currentChart.toBase64Image();
        break;
      case 'svg':
        // SVG export would require additional implementation
        this.showToast('SVG export coming soon!', 'info');
        return;
      case 'pdf':
        // PDF export would require jsPDF library
        this.showToast('PDF export coming soon!', 'info');
        return;
      case 'html':
        const htmlContent = this.generateHTMLCode();
        const blob = new Blob([htmlContent], { type: 'text/html' });
        link.download = 'chart.html';
        link.href = URL.createObjectURL(blob);
        break;
    }
    
    link.click();
  }

  generateHTMLCode() {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Generated Chart</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .chart-container { max-width: 800px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="chart-container">
        <canvas id="chart"></canvas>
    </div>
    <script>
        // Chart configuration would go here
        console.log('Chart created with Vizom AI');
    </script>
</body>
</html>`;
  }

  loadExamplePrompts() {
    // Set default chart type
    this.selectedChartType = 'bar';
  }

  showToast(message, type = 'info') {
    if (window.uiFeedback?.showToast) {
      window.uiFeedback.showToast(message, type);
    } else {
      console[type === 'error' ? 'error' : 'warn']('[toast]', message);
    }
  }
}

// CSS for demo components
const demoStyles = `
  .chart-type-btn {
    @apply flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer;
  }
  
  .chart-type-btn.active {
    @apply border-blue-500 bg-blue-50 text-blue-700;
  }
  
  .example-prompt-btn {
    @apply w-full px-4 py-3 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-sm font-medium text-gray-700;
  }
  
  .export-option-btn {
    @apply flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer;
  }
`;

// Inject styles
if (!document.getElementById('demo-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'demo-styles';
  styleSheet.textContent = demoStyles;
  document.head.appendChild(styleSheet);
}
