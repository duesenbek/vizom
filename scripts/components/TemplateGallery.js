// Template Gallery Component
// Manages the professional template gallery functionality

class TemplateGallery {
  constructor() {
    this.templates = this.getTemplateData();
    this.currentCategory = 'all';
    this.currentView = 'grid';
    this.searchQuery = '';
    this.savedTemplates = this.loadSavedTemplates();
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderTemplates();
    this.updateCategoryCounts();
    this.setupSearchFunctionality();
    this.setupModalFunctionality();
    this.setupFilterOptions();
  }

  getTemplateData() {
    return [
      {
        id: 'sales-dashboard',
        title: 'Sales Intelligence Dashboard',
        category: 'business',
        description: 'Track MRR growth, churn rates, and sales team performance. Includes weekly summary prompts and investor presentation templates.',
        badge: 'free',
        chartType: 'Dashboard',
        uses: 1200,
        rating: 4.8,
        setupTime: '15 min setup',
        preview: {
          gradient: 'from-blue-500 to-indigo-600',
          label: 'Sales',
          code: 'Dash 03'
        },
        useCases: [
          'Monthly business reviews',
          'Investor presentations',
          'Team performance tracking'
        ],
        features: {
          setupTime: '15 minutes',
          exportFormats: 'PNG, PDF, SVG, CSV',
          customization: 'Full',
          dataSources: 'CSV, API, Manual'
        }
      },
      {
        id: 'marketing-campaign',
        title: 'Marketing Campaign Overview',
        category: 'marketing',
        description: 'Campaign performance metrics: CAC, CPL, ROI analysis. Complete with monthly report prompts and client presentation templates.',
        badge: 'free',
        chartType: 'Analytics',
        uses: 856,
        rating: 4.7,
        setupTime: '10 min setup',
        preview: {
          gradient: 'from-purple-500 to-pink-600',
          label: 'Marketing',
          code: 'Campaign 04'
        },
        useCases: [
          'Campaign performance tracking',
          'Client presentations',
          'Marketing ROI analysis'
        ],
        features: {
          setupTime: '10 minutes',
          exportFormats: 'PNG, PDF, SVG, CSV',
          customization: 'Full',
          dataSources: 'CSV, API, Manual'
        }
      },
      {
        id: 'financial-monitor',
        title: 'Financial Health Monitor',
        category: 'finance',
        description: 'Expense tracking, profit analysis, and cash flow monitoring. Perfect for CFOs and founders with quarterly report prompts included.',
        badge: 'premium',
        chartType: 'Finance',
        uses: 643,
        rating: 4.9,
        setupTime: '20 min setup',
        preview: {
          gradient: 'from-emerald-500 to-teal-600',
          label: 'Finance',
          code: 'Fin 02'
        },
        useCases: [
          'Quarterly financial reports',
          'Cash flow monitoring',
          'Expense analysis'
        ],
        features: {
          setupTime: '20 minutes',
          exportFormats: 'PNG, PDF, SVG, CSV',
          customization: 'Full',
          dataSources: 'CSV, API, Manual'
        }
      },
      {
        id: 'academic-research',
        title: 'Academic Research Dashboard',
        category: 'academic',
        description: 'Research data visualization with statistical analysis, publication-ready charts, and comprehensive data exploration tools.',
        badge: 'free',
        chartType: 'Research',
        uses: 423,
        rating: 4.6,
        setupTime: '25 min setup',
        preview: {
          gradient: 'from-amber-500 to-orange-600',
          label: 'Academic',
          code: 'Research 01'
        },
        useCases: [
          'Research publications',
          'Statistical analysis',
          'Academic presentations'
        ],
        features: {
          setupTime: '25 minutes',
          exportFormats: 'PNG, PDF, SVG, CSV',
          customization: 'Full',
          dataSources: 'CSV, API, Manual'
        }
      },
      {
        id: 'business-kpi',
        title: 'Business KPI Tracker',
        category: 'business',
        description: 'Track key business metrics, goals vs actual performance, and team productivity with automated reporting and alerts.',
        badge: 'free',
        chartType: 'KPI',
        uses: 912,
        rating: 4.8,
        setupTime: '12 min setup',
        preview: {
          gradient: 'from-blue-600 to-cyan-600',
          label: 'Business',
          code: 'KPI 05'
        },
        useCases: [
          'KPI monitoring',
          'Goal tracking',
          'Performance dashboards'
        ],
        features: {
          setupTime: '12 minutes',
          exportFormats: 'PNG, PDF, SVG, CSV',
          customization: 'Full',
          dataSources: 'CSV, API, Manual'
        }
      },
      {
        id: 'social-media',
        title: 'Social Media Analytics',
        category: 'marketing',
        description: 'Comprehensive social media performance tracking across platforms with engagement metrics and growth analytics.',
        badge: 'premium',
        chartType: 'Social',
        uses: 567,
        rating: 4.7,
        setupTime: '18 min setup',
        preview: {
          gradient: 'from-pink-500 to-rose-600',
          label: 'Marketing',
          code: 'Social 02'
        },
        useCases: [
          'Social media reporting',
          'Engagement analysis',
          'Growth tracking'
        ],
        features: {
          setupTime: '18 minutes',
          exportFormats: 'PNG, PDF, SVG, CSV',
          customization: 'Full',
          dataSources: 'CSV, API, Manual'
        }
      }
    ];
  }

  getChartTypeIconClass(templateId) {
    switch (templateId) {
      case 'sales-dashboard':
        return 'fa-solid fa-chart-column';
      case 'marketing-campaign':
        return 'fa-solid fa-chart-line';
      case 'financial-monitor':
        return 'fa-solid fa-chart-pie';
      case 'academic-research':
        return 'fa-solid fa-chart-bar';
      case 'business-kpi':
        return 'fa-solid fa-bullseye';
      case 'social-media':
        return 'fa-solid fa-chart-line';
      default:
        return 'fa-solid fa-chart-simple';
    }
  }

  setupEventListeners() {
    // Category tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const category = tab.dataset.category;
        this.switchCategory(category);
      });
    });

    // View toggles
    document.querySelectorAll('.view-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        const view = toggle.dataset.view;
        this.switchView(view);
      });
    });

    // Template card interactions
    document.addEventListener('click', (e) => {
      if (e.target.closest('.template-card')) {
        const card = e.target.closest('.template-card');
        const templateId = card.dataset.templateId;
        
        if (e.target.closest('.preview-btn')) {
          e.stopPropagation();
          this.openTemplateModal(templateId);
        } else if (e.target.closest('.use-template-btn')) {
          e.stopPropagation();
          this.useTemplate(templateId);
        } else if (e.target.closest('.save-template-btn')) {
          e.stopPropagation();
          this.toggleSaveTemplate(templateId, e.target.closest('.save-template-btn'));
        } else {
          this.openTemplateModal(templateId);
        }
      }
    });

    // Modal close
    const closeBtn = document.getElementById('close-template-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeTemplateModal());
    }

    // Modal backdrop click
    const modal = document.getElementById('template-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeTemplateModal();
        }
      });
    }

    // Modal use template button
    const modalUseBtn = document.getElementById('modal-use-template');
    if (modalUseBtn) {
      modalUseBtn.addEventListener('click', () => {
        const templateId = modalUseBtn.dataset.templateId;
        if (templateId) {
          this.useTemplate(templateId);
          this.closeTemplateModal();
        }
      });
    }

    // Load more button
    const loadMoreBtn = document.getElementById('load-more-templates');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => this.loadMoreTemplates());
    }

    // Filter checkboxes
    document.getElementById('show-premium')?.addEventListener('change', () => this.renderTemplates());
    document.getElementById('show-free')?.addEventListener('change', () => this.renderTemplates());

    // Sort dropdown
    document.querySelector('select')?.addEventListener('change', (e) => {
      this.sortTemplates(e.target.value);
    });
  }

  setupSearchFunctionality() {
    const searchInput = document.getElementById('template-search');
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.searchQuery = e.target.value.toLowerCase();
          this.renderTemplates();
        }, 300);
      });
    }
  }

  setupModalFunctionality() {
    // Add keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeTemplateModal();
      }
    });
  }

  setupFilterOptions() {
    // Additional filter setup can go here
    this.updateFilterState();
  }

  switchCategory(category) {
    this.currentCategory = category;
    
    // Update tab states
    document.querySelectorAll('.category-tab').forEach(tab => {
      if (tab.dataset.category === category) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    this.renderTemplates();
  }

  switchView(view) {
    this.currentView = view;
    
    // Update view toggle states
    document.querySelectorAll('.view-toggle').forEach(toggle => {
      if (toggle.dataset.view === view) {
        toggle.classList.add('active');
      } else {
        toggle.classList.remove('active');
      }
    });

    this.renderTemplates();
  }

  getFilteredTemplates() {
    let filtered = this.templates;

    // Filter by category
    if (this.currentCategory !== 'all') {
      filtered = filtered.filter(t => t.category === this.currentCategory);
    }

    // Filter by search query
    if (this.searchQuery) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(this.searchQuery) ||
        t.description.toLowerCase().includes(this.searchQuery) ||
        t.category.toLowerCase().includes(this.searchQuery)
      );
    }

    // Filter by badge type
    const showPremium = document.getElementById('show-premium')?.checked;
    const showFree = document.getElementById('show-free')?.checked;
    
    if (showPremium && !showFree) {
      filtered = filtered.filter(t => t.badge === 'premium');
    } else if (!showPremium && showFree) {
      filtered = filtered.filter(t => t.badge === 'free');
    }

    return filtered;
  }

  renderTemplates() {
    const grid = document.getElementById('templates-grid');
    if (!grid) return;

    const filtered = this.getFilteredTemplates();
    
    // Update results count
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
      resultsCount.textContent = filtered.length;
    }

    // Clear grid
    grid.innerHTML = '';

    // Add templates
    filtered.forEach((template, index) => {
      const card = this.createTemplateCard(template);
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('fade-in');
      grid.appendChild(card);
    });

    // Show/hide load more button
    const loadMoreBtn = document.getElementById('load-more-templates');
    if (loadMoreBtn) {
      loadMoreBtn.style.display = filtered.length >= 6 ? 'block' : 'none';
    }
  }

  createTemplateCard(template) {
    const card = document.createElement('article');
    card.className = 'template-card';
    card.dataset.category = template.category;
    card.dataset.templateId = template.id;

    const isSaved = this.savedTemplates.includes(template.id);
    const iconClass = this.getChartTypeIconClass(template.id);

    card.innerHTML = `
      <div class="template-preview">
        <div class="preview-image">
          <div class="bg-gradient-to-br ${template.preview.gradient} rounded-lg p-4 h-48 flex flex-col justify-between">
            <div class="flex items-center justify-between text-white text-xs">
              <span class="bg-white/20 px-2 py-1 rounded">${template.preview.label}</span>
              <span>${template.preview.code}</span>
            </div>
            <div class="flex gap-2">
              <div class="flex-1 h-20 bg-white/30 rounded"></div>
              <div class="flex-1 h-16 bg-white/40 rounded"></div>
              <div class="flex-1 h-24 bg-white/25 rounded"></div>
            </div>
          </div>
        </div>
        <div class="template-overlay">
          <button class="preview-btn">
            <i class="fas fa-eye"></i>
            Preview
          </button>
        </div>
      </div>
      
      <div class="template-content">
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="template-title">${template.title}</h3>
            <div class="flex items-center gap-2 mt-1">
              <span class="chart-type-badge">
                <i class="${iconClass}"></i>
                ${template.chartType}
              </span>
              <span class="template-badge ${template.badge}">${template.badge}</span>
            </div>
          </div>
        </div>
        
        <p class="template-description">${template.description}</p>
        
        <div class="template-stats">
          <div class="stat-item">
            <i class="fas fa-users"></i>
            <span>${this.formatNumber(template.uses)} uses</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-star text-yellow-500"></i>
            <span>${template.rating}</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-clock"></i>
            <span>${template.setupTime}</span>
          </div>
        </div>
        
        <div class="template-actions">
          <button class="use-template-btn ${template.badge}">
            ${template.badge === 'premium' ? '<i class="fas fa-crown"></i>' : '<i class="fas fa-bolt"></i>'}
            Use Template
          </button>
          <button class="save-template-btn ${isSaved ? 'saved' : ''}">
            <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
          </button>
        </div>
      </div>
    `;

    return card;
  }

  openTemplateModal(templateId) {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) return;

    const modal = document.getElementById('template-modal');
    const modalTitle = document.getElementById('modal-template-title');
    const modalCategory = document.getElementById('modal-template-category');
    const modalBadge = document.getElementById('modal-template-badge');
    const modalDescription = document.getElementById('modal-template-description');
    const modalUseBtn = document.getElementById('modal-use-template');

    if (modalTitle) modalTitle.textContent = template.title;
    if (modalCategory) {
      const iconClass = this.getChartTypeIconClass(template.id);
      modalCategory.innerHTML = `<i class="${iconClass}"></i> ${template.chartType}`;
    }
    if (modalBadge) {
      modalBadge.textContent = template.badge;
      modalBadge.className = `template-badge ${template.badge}`;
    }
    if (modalDescription) modalDescription.textContent = template.description;
    if (modalUseBtn) modalUseBtn.dataset.templateId = template.id;

    // Update use cases
    const useCasesList = document.getElementById('modal-use-cases');
    if (useCasesList) {
      useCasesList.innerHTML = template.useCases.map(useCase => `
        <li class="flex items-start gap-2">
          <i class="fas fa-check text-emerald-500 mt-0.5"></i>
          <span>${useCase}</span>
        </li>
      `).join('');
    }

    // Update features
    const featuresContainer = modal.querySelector('.space-y-2');
    if (featuresContainer) {
      featuresContainer.innerHTML = `
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-600">Setup Time</span>
          <span class="font-medium text-slate-900">${template.features.setupTime}</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-600">Export Formats</span>
          <span class="font-medium text-slate-900">${template.features.exportFormats}</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-600">Customization</span>
          <span class="font-medium text-slate-900">${template.features.customization}</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-600">Data Sources</span>
          <span class="font-medium text-slate-900">${template.features.dataSources}</span>
        </div>
      `;
    }

    // Update preview
    const modalPreview = document.getElementById('modal-preview');
    if (modalPreview) {
      modalPreview.innerHTML = `
        <div class="bg-gradient-to-br ${template.preview.gradient} rounded-xl p-8 w-full h-full flex flex-col justify-between">
          <div class="flex items-center justify-between text-white text-sm">
            <span class="bg-white/20 px-3 py-1 rounded">${template.preview.label}</span>
            <span>${template.preview.code}</span>
          </div>
          <div class="space-y-4">
            <div class="h-24 bg-white/30 rounded-lg"></div>
            <div class="grid grid-cols-3 gap-3">
              <div class="h-20 bg-white/40 rounded-lg"></div>
              <div class="h-32 bg-white/25 rounded-lg"></div>
              <div class="h-16 bg-white/35 rounded-lg"></div>
            </div>
          </div>
        </div>
      `;
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  closeTemplateModal() {
    const modal = document.getElementById('template-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  useTemplate(templateId) {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) return;

    // Add success animation
    const button = document.querySelector(`[data-template-id="${templateId}"] .use-template-btn`);
    if (button) {
      button.classList.add('success-animation');
      button.innerHTML = '<i class="fas fa-check"></i> Template Selected';
      
      setTimeout(() => {
        button.classList.remove('success-animation');
        button.innerHTML = template.badge === 'premium' 
          ? '<i class="fas fa-crown"></i> Use Template'
          : '<i class="fas fa-bolt"></i> Use Template';
      }, 2000);
    }

    // Navigate to generator with template data
    setTimeout(() => {
      window.location.href = `generator.html?template=${templateId}`;
    }, 1000);
  }

  toggleSaveTemplate(templateId, button) {
    const index = this.savedTemplates.indexOf(templateId);
    
    if (index > -1) {
      // Remove from saved
      this.savedTemplates.splice(index, 1);
      button.classList.remove('saved');
      button.innerHTML = '<i class="far fa-bookmark"></i>';
    } else {
      // Add to saved
      this.savedTemplates.push(templateId);
      button.classList.add('saved');
      button.innerHTML = '<i class="fas fa-bookmark"></i>';
    }

    this.saveSavedTemplates();
  }

  loadSavedTemplates() {
    try {
      return JSON.parse(localStorage.getItem('vizom-saved-templates') || '[]');
    } catch {
      return [];
    }
  }

  saveSavedTemplates() {
    try {
      localStorage.setItem('vizom-saved-templates', JSON.stringify(this.savedTemplates));
    } catch (e) {
      console.warn('Could not save templates to localStorage:', e);
    }
  }

  updateCategoryCounts() {
    const categories = {
      all: this.templates.length,
      business: this.templates.filter(t => t.category === 'business').length,
      marketing: this.templates.filter(t => t.category === 'marketing').length,
      academic: this.templates.filter(t => t.category === 'academic').length,
      finance: this.templates.filter(t => t.category === 'finance').length
    };

    document.querySelectorAll('.category-tab').forEach(tab => {
      const category = tab.dataset.category;
      const count = tab.querySelector('.category-count');
      if (count && categories[category] !== undefined) {
        count.textContent = categories[category];
      }
    });
  }

  sortTemplates(sortBy) {
    switch (sortBy) {
      case 'Most Popular':
        this.templates.sort((a, b) => b.uses - a.uses);
        break;
      case 'Newest First':
        this.templates.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'Alphabetical':
        this.templates.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Most Used':
        this.templates.sort((a, b) => b.uses - a.uses);
        break;
    }
    this.renderTemplates();
  }

  loadMoreTemplates() {
    // In a real implementation, this would load more templates from an API
    const button = document.getElementById('load-more-templates');
    if (button) {
      button.textContent = 'Loading...';
      button.disabled = true;
      
      setTimeout(() => {
        button.textContent = 'No more templates';
        button.style.opacity = '0.5';
      }, 1000);
    }
  }

  updateFilterState() {
    // Update filter UI state
    const filterOptions = document.querySelector('.filter-options');
    if (filterOptions) {
      // Add any additional filter UI updates here
    }
  }

  formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }

  // Public API methods
  getCurrentCategory() {
    return this.currentCategory;
  }

  getCurrentView() {
    return this.currentView;
  }

  getSavedTemplates() {
    return [...this.savedTemplates];
  }

  clearSavedTemplates() {
    this.savedTemplates = [];
    this.saveSavedTemplates();
    this.renderTemplates();
  }
}

// Initialize the template gallery
document.addEventListener('DOMContentLoaded', () => {
  window.templateGallery = new TemplateGallery();
});

// Export for use in other modules
export { TemplateGallery };
