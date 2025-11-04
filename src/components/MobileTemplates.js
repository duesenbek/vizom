// Mobile Templates Component
// Mobile-specific adaptations for the templates gallery

class MobileTemplates {
  constructor() {
    this.isMobile = this.checkIsMobile();
    this.currentView = 'grid';
    this.touchHandlers = new Map();
    this.init();
  }

  init() {
    if (this.isMobile) {
      this.applyMobileLayout();
      this.setupTouchInteractions();
      this.setupMobileFilters();
      this.optimizeForMobile();
    }
    
    this.setupResponsiveHandling();
  }

  checkIsMobile() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  applyMobileLayout() {
    // Convert to single column grid
    this.convertToSingleColumn();
    
    // Optimize template cards for mobile
    this.optimizeTemplateCards();
    
    // Create mobile-friendly filters
    this.createMobileFilters();
    
    // Add mobile search enhancements
    this.enhanceMobileSearch();
    
    // Create mobile preview modal
    this.createMobilePreviewModal();
  }

  convertToSingleColumn() {
    const templatesGrid = document.getElementById('templates-grid');
    if (!templatesGrid) return;

    // Add mobile class
    templatesGrid.classList.add('mobile-single-column');
    
    // Store original grid settings
    this.originalGridSettings = {
      gridTemplateColumns: templatesGrid.style.gridTemplateColumns,
      gap: templatesGrid.style.gap
    };

    // Apply single column
    templatesGrid.style.gridTemplateColumns = '1fr';
    templatesGrid.style.gap = '16px';
  }

  optimizeTemplateCards() {
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
      card.classList.add('mobile-template-card');
      
      // Make cards more touch-friendly
      this.makeCardTouchFriendly(card);
      
      // Add swipe actions
      this.addCardSwipeActions(card);
      
      // Optimize card content
      this.optimizeCardContent(card);
    });
  }

  makeCardTouchFriendly(card) {
    // Ensure minimum touch target size
    card.style.minHeight = '120px';
    
    // Add ripple effect
    card.addEventListener('touchstart', (e) => {
      this.createRippleEffect(card, e.touches[0]);
    });

    // Add haptic feedback (if supported)
    card.addEventListener('touchstart', () => {
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    });
  }

  createRippleEffect(element, touch) {
    const ripple = document.createElement('div');
    ripple.className = 'mobile-ripple';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = touch.clientX - rect.left - size / 2;
    const y = touch.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => ripple.remove(), 600);
  }

  addCardSwipeActions(card) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    card.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      card.style.transition = 'none';
    });

    card.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      currentX = e.touches[0].clientX;
      const deltaX = currentX - startX;
      
      // Provide visual feedback
      if (Math.abs(deltaX) > 10) {
        card.style.transform = `translateX(${deltaX}px)`;
        
        // Show action hints
        if (deltaX < -50) {
          this.showSwipeHint(card, 'preview');
        } else if (deltaX > 50) {
          this.showSwipeHint(card, 'save');
        }
      }
    });

    card.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      
      const deltaX = currentX - startX;
      card.style.transform = '';
      card.style.transition = '';
      isDragging = false;
      
      // Handle swipe actions
      if (deltaX < -100) {
        this.handleSwipeLeft(card);
      } else if (deltaX > 100) {
        this.handleSwipeRight(card);
      }
      
      this.hideSwipeHints(card);
    });
  }

  showSwipeHint(card, action) {
    // Remove existing hints
    this.hideSwipeHints(card);
    
    const hint = document.createElement('div');
    hint.className = `swipe-hint swipe-${action}`;
    
    if (action === 'preview') {
      hint.innerHTML = '<i class="fas fa-eye"></i> Preview';
    } else if (action === 'save') {
      hint.innerHTML = '<i class="fas fa-bookmark"></i> Save';
    }
    
    card.appendChild(hint);
  }

  hideSwipeHints(card) {
    const hints = card.querySelectorAll('.swipe-hint');
    hints.forEach(hint => hint.remove());
  }

  handleSwipeLeft(card) {
    // Swipe left - open preview
    const templateId = card.dataset.templateId;
    if (templateId && window.modalSystem) {
      window.modalSystem.openTemplatePreview({ id: templateId });
    }
  }

  handleSwipeRight(card) {
    // Swipe right - save template
    const templateId = card.dataset.templateId;
    const saveBtn = card.querySelector('.save-template-btn');
    if (saveBtn) {
      saveBtn.click();
    }
  }

  optimizeCardContent(card) {
    // Simplify content for mobile
    const description = card.querySelector('.template-description');
    if (description) {
      // Truncate long descriptions
      const text = description.textContent;
      if (text.length > 100) {
        description.textContent = text.substring(0, 100) + '...';
        description.title = text; // Show full text on hover
      }
    }

    // Optimize stats display
    const stats = card.querySelector('.template-stats');
    if (stats) {
      stats.classList.add('mobile-stats');
    }

    // Make action buttons more accessible
    const actions = card.querySelector('.template-actions');
    if (actions) {
      actions.classList.add('mobile-actions');
    }
  }

  createMobileFilters() {
    // Create mobile-friendly filter panel
    const filterPanel = document.createElement('div');
    filterPanel.className = 'mobile-filter-panel';
    filterPanel.innerHTML = `
      <div class="filter-panel-header">
        <h3>Filter Templates</h3>
        <button class="filter-panel-close" aria-label="Close filters">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="filter-panel-content">
        <!-- Category Filters -->
        <div class="filter-section">
          <h4>Category</h4>
          <div class="mobile-category-filters">
            <button class="mobile-filter-btn active" data-category="all">
              All Templates
            </button>
            <button class="mobile-filter-btn" data-category="business">
              Business
            </button>
            <button class="mobile-filter-btn" data-category="marketing">
              Marketing
            </button>
            <button class="mobile-filter-btn" data-category="academic">
              Academic
            </button>
            <button class="mobile-filter-btn" data-category="finance">
              Finance
            </button>
          </div>
        </div>

        <!-- Type Filters -->
        <div class="filter-section">
          <h4>Type</h4>
          <div class="mobile-type-filters">
            <label class="mobile-checkbox-label">
              <input type="checkbox" name="type" value="free" checked>
              <span class="mobile-checkbox"></span>
              Free Templates
            </label>
            <label class="mobile-checkbox-label">
              <input type="checkbox" name="type" value="premium" checked>
              <span class="mobile-checkbox"></span>
              Premium Templates
            </label>
          </div>
        </div>

        <!-- Sort Options -->
        <div class="filter-section">
          <h4>Sort By</h4>
          <select class="mobile-sort-select">
            <option value="popular">Most Popular</option>
            <option value="newest">Newest First</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        <!-- Apply Filters Button -->
        <button class="apply-filters-btn primary">
          Apply Filters
        </button>
      </div>
    `;

    document.body.appendChild(filterPanel);

    // Create filter trigger button
    const filterTrigger = document.createElement('button');
    filterTrigger.className = 'mobile-filter-trigger';
    filterTrigger.setAttribute('aria-label', 'Filter templates');
    filterTrigger.innerHTML = `
      <i class="fas fa-filter"></i>
      <span class="filter-count">0</span>
    `;

    // Add to page
    const searchSection = document.querySelector('.hero-section');
    if (searchSection) {
      searchSection.appendChild(filterTrigger);
    }

    // Setup interactions
    this.setupMobileFilters(filterPanel, filterTrigger);
  }

  setupMobileFilters(panel, trigger) {
    const closeBtn = panel.querySelector('.filter-panel-close');
    const applyBtn = panel.querySelector('.apply-filters-btn');
    const filterBtns = panel.querySelectorAll('.mobile-filter-btn');
    const checkboxes = panel.querySelectorAll('input[type="checkbox"]');
    const sortSelect = panel.querySelector('.mobile-sort-select');

    // Open/close panel
    trigger.addEventListener('click', () => {
      panel.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', () => {
      panel.classList.remove('open');
      document.body.style.overflow = '';
    });

    // Category filters
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Apply filters
    applyBtn.addEventListener('click', () => {
      this.applyMobileFilters(panel);
      panel.classList.remove('open');
      document.body.style.overflow = '';
    });

    // Update filter count
    const updateFilterCount = () => {
      const activeFilters = panel.querySelectorAll('.mobile-filter-btn.active').length +
                           panel.querySelectorAll('input[type="checkbox"]:checked').length;
      trigger.querySelector('.filter-count').textContent = activeFilters;
    };

    filterBtns.forEach(btn => btn.addEventListener('click', updateFilterCount));
    checkboxes.forEach(cb => cb.addEventListener('change', updateFilterCount));
  }

  applyMobileFilters(panel) {
    // Get filter values
    const activeCategory = panel.querySelector('.mobile-filter-btn.active').dataset.category;
    const checkedTypes = Array.from(panel.querySelectorAll('input[type="checkbox"]:checked'))
                               .map(cb => cb.value);
    const sortBy = panel.querySelector('.mobile-sort-select').value;

    // Apply filters (integration with existing template gallery)
    if (window.templateGallery) {
      window.templateGallery.switchCategory(activeCategory);
      
      // Apply type filters
      const showFree = checkedTypes.includes('free');
      const showPremium = checkedTypes.includes('premium');
      
      const freeCheckbox = document.getElementById('show-free');
      const premiumCheckbox = document.getElementById('show-premium');
      
      if (freeCheckbox) freeCheckbox.checked = showFree;
      if (premiumCheckbox) premiumCheckbox.checked = showPremium;
      
      window.templateGallery.renderTemplates();
      window.templateGallery.sortTemplates(sortBy);
    }

    this.showToast('Filters applied');
  }

  enhanceMobileSearch() {
    const searchInput = document.getElementById('template-search');
    if (!searchInput) return;

    // Add mobile search enhancements
    searchInput.classList.add('mobile-search-input');
    
    // Add voice search button
    this.addVoiceSearchButton(searchInput);
    
    // Add recent searches
    this.addRecentSearches(searchInput);
    
    // Add search suggestions
    this.addSearchSuggestions(searchInput);
  }

  addVoiceSearchButton(searchInput) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }

    const voiceButton = document.createElement('button');
    voiceButton.className = 'mobile-voice-search-btn';
    voiceButton.setAttribute('aria-label', 'Voice search');
    voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';

    // Add to search container
    const searchContainer = searchInput.parentElement;
    searchContainer.appendChild(voiceButton);

    // Setup voice recognition
    this.setupVoiceSearch(voiceButton, searchInput);
  }

  setupVoiceSearch(button, input) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    button.addEventListener('click', () => {
      if (button.classList.contains('recording')) {
        recognition.stop();
        return;
      }

      recognition.start();
      button.classList.add('recording');
      button.innerHTML = '<i class="fas fa-stop"></i>';
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      input.value = transcript;
      input.dispatchEvent(new Event('input'));
    };

    recognition.onerror = () => {
      button.classList.remove('recording');
      button.innerHTML = '<i class="fas fa-microphone"></i>';
      this.showToast('Voice search failed. Please try again.');
    };

    recognition.onend = () => {
      button.classList.remove('recording');
      button.innerHTML = '<i class="fas fa-microphone"></i>';
    };
  }

  addRecentSearches(searchInput) {
    const recentSearches = this.getRecentSearches();
    if (recentSearches.length === 0) return;

    const recentContainer = document.createElement('div');
    recentContainer.className = 'mobile-recent-searches';
    recentContainer.innerHTML = `
      <div class="recent-searches-header">
        <span>Recent Searches</span>
        <button class="clear-recent-btn" aria-label="Clear recent searches">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="recent-searches-list">
        ${recentSearches.map(search => `
          <button class="recent-search-item" data-search="${search}">
            <i class="fas fa-history"></i>
            <span>${search}</span>
          </button>
        `).join('')}
      </div>
    `;

    searchInput.parentElement.appendChild(recentContainer);

    // Setup interactions
    recentContainer.querySelector('.clear-recent-btn').addEventListener('click', () => {
      this.clearRecentSearches();
      recentContainer.remove();
    });

    recentContainer.querySelectorAll('.recent-search-item').forEach(item => {
      item.addEventListener('click', () => {
        const search = item.dataset.search;
        searchInput.value = search;
        searchInput.dispatchEvent(new Event('input'));
        recentContainer.classList.add('hidden');
      });
    });
  }

  getRecentSearches() {
    try {
      return JSON.parse(localStorage.getItem('vizom-recent-searches') || '[]').slice(0, 5);
    } catch {
      return [];
    }
  }

  addSearchToHistory(search) {
    const searches = this.getRecentSearches();
    const filtered = searches.filter(s => s !== search);
    filtered.unshift(search);
    const limited = filtered.slice(0, 10);
    localStorage.setItem('vizom-recent-searches', JSON.stringify(limited));
  }

  clearRecentSearches() {
    localStorage.removeItem('vizom-recent-searches');
  }

  addSearchSuggestions(searchInput) {
    const suggestions = [
      'sales dashboard',
      'marketing analytics',
      'financial report',
      'customer data',
      'trend analysis',
      'performance metrics',
      'revenue chart',
      'user statistics'
    ];

    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'mobile-search-suggestions';
    suggestionsContainer.innerHTML = `
      <div class="suggestions-list">
        ${suggestions.map(suggestion => `
          <button class="suggestion-item" data-suggestion="${suggestion}">
            <i class="fas fa-search"></i>
            <span>${suggestion}</span>
          </button>
        `).join('')}
      </div>
    `;

    searchInput.parentElement.appendChild(suggestionsContainer);

    // Show/hide suggestions
    searchInput.addEventListener('focus', () => {
      if (searchInput.value.length === 0) {
        suggestionsContainer.classList.add('visible');
      }
    });

    searchInput.addEventListener('blur', () => {
      setTimeout(() => {
        suggestionsContainer.classList.remove('visible');
      }, 200);
    });

    // Handle suggestion clicks
    suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        const suggestion = item.dataset.suggestion;
        searchInput.value = suggestion;
        searchInput.dispatchEvent(new Event('input'));
        suggestionsContainer.classList.remove('visible');
      });
    });
  }

  createMobilePreviewModal() {
    // Override modal system for mobile template previews
    if (window.modalSystem) {
      const originalShowModal = window.modalSystem.showModal.bind(window.modalSystem);
      
      window.modalSystem.showModal = (type, data) => {
        if (type === 'template-preview' && this.isMobile) {
          this.showMobileTemplatePreview(data);
        } else {
          originalShowModal(type, data);
        }
      };
    }
  }

  showMobileTemplatePreview(templateData) {
    // Create mobile-specific preview modal
    const previewModal = document.createElement('div');
    previewModal.className = 'mobile-template-preview-modal';
    previewModal.innerHTML = `
      <div class="mobile-preview-header">
        <button class="preview-back-btn" aria-label="Back">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h3>${templateData.title || 'Template Preview'}</h3>
        <button class="preview-close-btn" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="mobile-preview-content">
        <div class="mobile-preview-image">
          <div class="preview-placeholder">
            <i class="fas fa-chart-simple"></i>
            <p>Loading preview...</p>
          </div>
        </div>
        
        <div class="mobile-preview-info">
          <div class="preview-meta">
            <span class="preview-category">${templateData.category || 'Dashboard'}</span>
            <span class="preview-badge ${templateData.badge || 'free'}">${templateData.badge || 'Free'}</span>
          </div>
          
          <p class="preview-description">${templateData.description || 'Template description'}</p>
          
          <div class="preview-stats">
            <div class="stat-item">
              <i class="fas fa-users"></i>
              <span>${templateData.uses || '0'} uses</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-star"></i>
              <span>${templateData.rating || '0.0'}</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-clock"></i>
              <span>${templateData.setupTime || '5 min setup'}</span>
            </div>
          </div>
          
          <div class="preview-actions">
            <button class="mobile-use-template-btn primary">
              <i class="fas fa-bolt"></i>
              Use Template
            </button>
            <button class="mobile-save-template-btn secondary">
              <i class="far fa-bookmark"></i>
              Save
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(previewModal);

    // Animate in
    requestAnimationFrame(() => {
      previewModal.classList.add('open');
    });

    // Setup interactions
    this.setupMobilePreviewModal(previewModal, templateData);
  }

  setupMobilePreviewModal(modal, templateData) {
    const backBtn = modal.querySelector('.preview-back-btn');
    const closeBtn = modal.querySelector('.preview-close-btn');
    const useBtn = modal.querySelector('.mobile-use-template-btn');
    const saveBtn = modal.querySelector('.mobile-save-template-btn');

    const closeModal = () => {
      modal.classList.remove('open');
      setTimeout(() => modal.remove(), 300);
    };

    backBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    useBtn.addEventListener('click', () => {
      this.handleMobileUseTemplate(templateData);
      closeModal();
    });

    saveBtn.addEventListener('click', () => {
      this.handleMobileSaveTemplate(templateData);
      saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved';
      saveBtn.classList.add('saved');
    });

    // Swipe to close
    this.setupSwipeToClose(modal);
  }

  setupSwipeToClose(modal) {
    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    modal.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      isDragging = true;
      modal.style.transition = 'none';
    });

    modal.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      if (deltaY > 0) {
        modal.style.transform = `translateY(${deltaY}px)`;
        modal.style.opacity = 1 - (deltaY / 300);
      }
    });

    modal.addEventListener('touchend', () => {
      if (!isDragging) return;
      
      const deltaY = currentY - startY;
      modal.style.transform = '';
      modal.style.opacity = '';
      modal.style.transition = '';
      isDragging = false;

      if (deltaY > 150) {
        modal.classList.remove('open');
        setTimeout(() => modal.remove(), 300);
      }
    });
  }

  handleMobileUseTemplate(templateData) {
    // Navigate to generator with template
    if (templateData.id) {
      window.location.href = `generator.html?template=${templateData.id}`;
    }
  }

  handleMobileSaveTemplate(templateData) {
    // Save template to favorites
    const savedTemplates = JSON.parse(localStorage.getItem('vizom-saved-templates') || '[]');
    if (!savedTemplates.includes(templateData.id)) {
      savedTemplates.push(templateData.id);
      localStorage.setItem('vizom-saved-templates', JSON.stringify(savedTemplates));
      this.showToast('Template saved to favorites');
    }
  }

  setupTouchInteractions() {
    // Setup pull-to-refresh
    this.setupPullToRefresh();
    
    // Setup infinite scroll
    this.setupInfiniteScroll();
    
    // Setup pinch-to-zoom for previews
    this.setupPinchToZoom();
  }

  setupPullToRefresh() {
    const templatesGrid = document.getElementById('templates-grid');
    if (!templatesGrid) return;

    let startY = 0;
    let isPulling = false;

    templatesGrid.addEventListener('touchstart', (e) => {
      if (templatesGrid.scrollTop === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    });

    templatesGrid.addEventListener('touchmove', (e) => {
      if (!isPulling) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      if (deltaY > 0) {
        e.preventDefault();
        const pullDistance = Math.min(deltaY * 0.5, 100);
        templatesGrid.style.transform = `translateY(${pullDistance}px)`;
        
        if (pullDistance > 80) {
          this.showRefreshIndicator();
        }
      }
    });

    templatesGrid.addEventListener('touchend', () => {
      if (!isPulling) return;
      
      templatesGrid.style.transform = '';
      isPulling = false;

      const currentY = e.changedTouches[0].clientY;
      const deltaY = currentY - startY;

      if (deltaY > 100) {
        this.performRefresh();
      }
    });
  }

  setupInfiniteScroll() {
    const templatesGrid = document.getElementById('templates-grid');
    if (!templatesGrid) return;

    const loadMore = () => {
      const threshold = 200; // 200px from bottom
      const scrollPosition = templatesGrid.scrollTop + templatesGrid.clientHeight;
      const scrollHeight = templatesGrid.scrollHeight;

      if (scrollPosition >= scrollHeight - threshold) {
        this.loadMoreTemplates();
      }
    };

    templatesGrid.addEventListener('scroll', this.debounce(loadMore, 100));
  }

  setupPinchToZoom() {
    // Setup pinch-to-zoom for template previews
    const previewImages = document.querySelectorAll('.preview-image');
    
    previewImages.forEach(image => {
      let scale = 1;
      let initialDistance = 0;

      image.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
          initialDistance = this.getDistance(e.touches[0], e.touches[1]);
        }
      });

      image.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
          e.preventDefault();
          const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
          const delta = currentDistance - initialDistance;
          
          scale = Math.max(0.5, Math.min(3, scale + (delta * 0.01)));
          image.style.transform = `scale(${scale})`;
        }
      });

      image.addEventListener('touchend', () => {
        if (scale !== 1) {
          // Reset scale after a delay
          setTimeout(() => {
            image.style.transform = 'scale(1)';
            scale = 1;
          }, 1000);
        }
      });
    });
  }

  getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  optimizeForMobile() {
    // Optimize images
    this.optimizeImages();
    
    // Reduce animations
    this.reduceAnimations();
    
    // Optimize performance
    this.optimizePerformance();
  }

  optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    });
  }

  reduceAnimations() {
    if (this.isLowEndDevice()) {
      document.body.classList.add('reduce-animations');
    }
  }

  optimizePerformance() {
    // Use virtual scrolling for large lists
    if (document.querySelectorAll('.template-card').length > 50) {
      this.enableVirtualScrolling();
    }
  }

  enableVirtualScrolling() {
    // Implement virtual scrolling for better performance
    // This would require significant refactoring of the template grid
    console.log('Virtual scrolling would be implemented here');
  }

  setupResponsiveHandling() {
    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.isMobile = this.checkIsMobile();
      
      if (wasMobile !== this.isMobile) {
        this.handleMobileChange();
      }
    });
  }

  handleMobileChange() {
    if (this.isMobile) {
      this.applyMobileLayout();
    } else {
      this.removeMobileLayout();
    }
  }

  removeMobileLayout() {
    // Restore original grid layout
    const templatesGrid = document.getElementById('templates-grid');
    if (templatesGrid && this.originalGridSettings) {
      templatesGrid.classList.remove('mobile-single-column');
      templatesGrid.style.gridTemplateColumns = this.originalGridSettings.gridTemplateColumns;
      templatesGrid.style.gap = this.originalGridSettings.gap;
    }

    // Remove mobile-specific elements
    const mobileElements = document.querySelectorAll('.mobile-filter-panel, .mobile-template-preview-modal');
    mobileElements.forEach(el => el.remove());
  }

  // Utility methods
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  isLowEndDevice() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 2;
    
    return isSlowConnection || isLowMemory;
  }

  showRefreshIndicator() {
    // Implementation similar to MobileGenerator
  }

  performRefresh() {
    // Refresh templates
    if (window.templateGallery) {
      window.templateGallery.renderTemplates();
    }
    this.showToast('Templates refreshed');
  }

  loadMoreTemplates() {
    // Load more templates
    const loadMoreBtn = document.getElementById('load-more-templates');
    if (loadMoreBtn && !loadMoreBtn.disabled) {
      loadMoreBtn.click();
    }
  }

  showToast(message, duration = 3000) {
    // Implementation similar to MobileGenerator
    const toast = document.createElement('div');
    toast.className = 'mobile-toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // Public API
  updateMobileLayout() {
    if (this.isMobile) {
      this.applyMobileLayout();
    } else {
      this.removeMobileLayout();
    }
  }

  addMobileFeature(feature) {
    // Add custom mobile features
    switch (feature) {
      case 'voice-search':
        this.enableVoiceSearch();
        break;
      case 'gesture-controls':
        this.enableGestureControls();
        break;
      case 'offline-mode':
        this.enableOfflineMode();
        break;
    }
  }

  enableVoiceSearch() {
    // Enable voice search for all search inputs
    const searchInputs = document.querySelectorAll('input[type="search"]');
    searchInputs.forEach(input => {
      this.addVoiceSearchButton(input);
    });
  }

  enableGestureControls() {
    // Enable advanced gesture controls
    this.setupAdvancedGestures();
  }

  enableOfflineMode() {
    // Enable offline functionality
    this.setupOfflineSupport();
  }

  setupAdvancedGestures() {
    // Setup advanced touch gestures
    // Implementation depends on specific requirements
  }

  setupOfflineSupport() {
    // Setup service worker and offline caching
    // Implementation depends on specific requirements
  }
}

// Initialize mobile templates
document.addEventListener('DOMContentLoaded', () => {
  window.mobileTemplates = new MobileTemplates();
});

// Export for use in other modules
export { MobileTemplates };
