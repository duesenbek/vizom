/**
 * Enhanced Hero Section Component
 * Modern, engaging hero with clear value proposition and interactive demo
 */

export class HeroSection {
  constructor(container) {
    this.container = container;
    this.currentDemoChart = null;
    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
    this.startDemoAnimation();
  }

  render() {
    this.container.innerHTML = `
      <section class="hero-section relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-5">
          <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
        </div>

        <!-- Floating Elements -->
        <div class="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div class="absolute top-40 right-20 w-32 h-32 bg-indigo-200 rounded-full blur-xl opacity-20 animate-pulse delay-75"></div>
        <div class="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-200 rounded-full blur-xl opacity-20 animate-pulse delay-150"></div>

        <div class="relative container mx-auto px-4 pt-20 pb-16">
          <div class="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
            
            <!-- Left Content -->
            <div class="hero-content space-y-8">
              <!-- Badge -->
              <div class="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium animate-fade-in">
                <span class="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                Powered by AI • No credit card required
              </div>

              <!-- Main Headline -->
              <div class="space-y-4">
                <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Create Beautiful
                  <span class="block text-blue-600">Data Visualizations</span>
                  <span class="block text-indigo-600">in Seconds</span>
                </h1>
                
                <p class="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                  Describe your data in plain English and watch AI create stunning, 
                  interactive charts. No design skills, no complex tools—just results.
                </p>
              </div>

              <!-- Key Benefits -->
              <div class="grid sm:grid-cols-3 gap-4 max-w-2xl">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <span class="text-gray-700 font-medium">Lightning Fast</span>
                </div>
                
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                    </svg>
                  </div>
                  <span class="text-gray-700 font-medium">Beautiful Design</span>
                </div>
                
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span class="text-gray-700 font-medium">100% Accurate</span>
                </div>
              </div>

              <!-- CTA Buttons -->
              <div class="flex flex-col sm:flex-row gap-4 max-w-md">
                <button id="hero-cta-primary" class="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <span class="flex items-center justify-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    Try It Now - Free
                  </span>
                </button>
                
                <button id="hero-cta-secondary" class="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200">
                  <span class="flex items-center justify-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Watch Demo
                  </span>
                </button>
              </div>

              <!-- Social Proof -->
              <div class="flex items-center space-x-8 text-gray-600">
                <div class="flex items-center space-x-2">
                  <div class="flex -space-x-2">
                    <img src="https://picsum.photos/seed/user1/32/32.jpg" alt="User" class="w-8 h-8 rounded-full border-2 border-white">
                    <img src="https://picsum.photos/seed/user2/32/32.jpg" alt="User" class="w-8 h-8 rounded-full border-2 border-white">
                    <img src="https://picsum.photos/seed/user3/32/32.jpg" alt="User" class="w-8 h-8 rounded-full border-2 border-white">
                    <div class="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium">+2k</div>
                  </div>
                  <span class="text-sm">Join 2,000+ users</span>
                </div>
                
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span class="text-sm">4.9/5 rating</span>
                </div>
              </div>
            </div>

            <!-- Right Demo Preview -->
            <div class="hero-demo relative">
              <div class="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                <!-- Demo Header -->
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <span class="text-sm text-gray-500 font-medium">Live Preview</span>
                </div>

                <!-- Demo Chart Container -->
                <div class="demo-chart-container bg-gray-50 rounded-lg p-4 h-80 flex items-center justify-center relative overflow-hidden">
                  <canvas id="hero-demo-chart" class="max-w-full max-h-full"></canvas>
                  
                  <!-- Demo Overlay -->
                  <div id="demo-overlay" class="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300">
                    <div class="text-center space-y-4">
                      <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <svg class="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                      </div>
                      <p class="text-gray-600 font-medium">AI is creating your chart...</p>
                    </div>
                  </div>
                </div>

                <!-- Demo Controls -->
                <div class="mt-4 space-y-3">
                  <div class="flex space-x-2">
                    <button class="demo-prompt flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors" data-prompt="Monthly sales data for Q1 2024">
                      <i class="fa-solid fa-chart-column mr-2"></i>
                      Sales Dashboard
                    </button>
                    <button class="demo-prompt flex-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors" data-prompt="User growth over 6 months">
                      <i class="fa-solid fa-chart-line mr-2"></i>
                      Growth Chart
                    </button>
                    <button class="demo-prompt flex-1 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors" data-prompt="Market share distribution">
                      <i class="fa-solid fa-chart-pie mr-2"></i>
                      Market Share
                    </button>
                  </div>
                  
                  <div class="text-center">
                    <p class="text-xs text-gray-500">Click any example to see AI in action</p>
                  </div>
                </div>
              </div>

              <!-- Floating Stats -->
              <div class="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100 animate-bounce">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Generated in</p>
                    <p class="text-sm font-bold text-gray-900">2.3s</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>
    `;
  }

  setupEventListeners() {
    // Primary CTA
    document.getElementById('hero-cta-primary').addEventListener('click', () => {
      this.handleTryNow();
    });

    // Secondary CTA
    document.getElementById('hero-cta-secondary').addEventListener('click', () => {
      this.handleWatchDemo();
    });

    // Demo prompt buttons
    document.querySelectorAll('.demo-prompt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.runDemo(e.target.dataset.prompt);
      });
    });
  }

  async runDemo(prompt) {
    const overlay = document.getElementById('demo-overlay');
    const canvas = document.getElementById('hero-demo-chart');
    
    // Show loading
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create demo chart
    this.createDemoChart(prompt);

    // Hide loading
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
  }

  createDemoChart(prompt) {
    const canvas = document.getElementById('hero-demo-chart');
    const ctx = canvas.getContext('2d');

    // Destroy existing chart
    if (this.currentDemoChart) {
      this.currentDemoChart.destroy();
    }

    // Sample data based on prompt
    const data = this.generateDemoData(prompt);
    
    this.currentDemoChart = new Chart(ctx, {
      type: data.type,
      data: data.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    });
  }

  generateDemoData(prompt) {
    if (prompt.includes('sales')) {
      return {
        type: 'bar',
        chartData: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
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
        chartData: {
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
    } else {
      return {
        type: 'doughnut',
        chartData: {
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
    }
  }

  startDemoAnimation() {
    // Auto-run first demo after delay
    setTimeout(() => {
      this.runDemo('Monthly sales data for Q1 2024');
    }, 1500);
  }

  handleTryNow() {
    // Scroll to live demo section or open generator
    document.getElementById('live-demo')?.scrollIntoView({ behavior: 'smooth' });
    // Or redirect to generator
    // window.location.href = '/generator.html';
  }

  handleWatchDemo() {
    // Play video or run interactive demo
    this.runDemo('Monthly sales data for Q1 2024');
  }
}

// CSS Animations
const heroStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.8s ease-out;
  }
  
  .delay-75 {
    animation-delay: 75ms;
  }
  
  .delay-150 {
    animation-delay: 150ms;
  }
`;

// Inject styles
if (!document.getElementById('hero-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'hero-styles';
  styleSheet.textContent = heroStyles;
  document.head.appendChild(styleSheet);
}
