// Trust & Engagement Manager - Professional UX with Personality
class TrustEngagementManager {
  constructor() {
    this.microInteractions = new Map();
    this.testimonials = new Map();
    this.trustIndicators = new Map();
    this.brandVoice = null;
    this.engagementMetrics = new Map();
    this.surpriseFeatures = new Map();
    this.animationQueue = [];
    this.isAnimating = false;
    
    this.init();
  }

  init() {
    this.setupTrustIndicators();
    this.setupSocialProof();
    this.setupProfessionalErrorHandling();
    this.setupMicroInteractions();
    this.setupSurpriseFeatures();
    this.setupBrandVoice();
    this.setupSmoothAnimations();
    this.setupEngagementTracking();
    this.setupPersonalityElements();
    this.setupProfessionalAppearance();
  }

  // Setup Trust Indicators
  setupTrustIndicators() {
    this.createTrustBadge();
    this.setupPrivacyPolicy();
    this.setupSecurityIndicators();
    this.setupProfessionalCertifications();
    this.setupDataProtection();
  }

  // Create trust badge
  createTrustBadge() {
    let trustBadge = document.querySelector('.trust-badge');
    
    if (!trustBadge) {
      trustBadge = document.createElement('div');
      trustBadge.className = 'trust-badge';
      trustBadge.innerHTML = `
        <div class="trust-badge-content">
          <div class="trust-icons">
            <div class="trust-icon" data-tooltip="SSL Encrypted">
              <i class="fas fa-lock"></i>
            </div>
            <div class="trust-icon" data-tooltip="GDPR Compliant">
              <i class="fas fa-shield-alt"></i>
            </div>
            <div class="trust-icon" data-tooltip="SOC 2 Certified">
              <i class="fas fa-certificate"></i>
            </div>
            <div class="trust-icon" data-tooltip="99.9% Uptime">
              <i class="fas fa-server"></i>
            </div>
          </div>
          <div class="trust-text">
            <span class="trust-label">Trusted by</span>
            <span class="trust-count">50,000+</span>
            <span class="trust-label">professionals</span>
          </div>
        </div>
      `;
      
      const header = document.querySelector('.header') || document.querySelector('header');
      if (header) {
        header.appendChild(trustBadge);
      }
    }
    
    this.setupTrustBadgeInteractions(trustBadge);
  }

  // Setup trust badge interactions
  setupTrustBadgeInteractions(badge) {
    const icons = badge.querySelectorAll('.trust-icon');
    
    icons.forEach(icon => {
      icon.addEventListener('mouseenter', () => {
        this.showTooltip(icon, icon.dataset.tooltip);
      });
      
      icon.addEventListener('mouseleave', () => {
        this.hideTooltip(icon);
      });
      
      // Add subtle pulse animation on load
      setTimeout(() => {
        icon.classList.add('trust-pulse');
        setTimeout(() => {
          icon.classList.remove('trust-pulse');
        }, 2000);
      }, Math.random() * 2000);
    });
  }

  // Setup privacy policy
  setupPrivacyPolicy() {
    let privacyWidget = document.querySelector('.privacy-widget');
    
    if (!privacyWidget) {
      privacyWidget = document.createElement('div');
      privacyWidget.className = 'privacy-widget';
      privacyWidget.innerHTML = `
        <div class="privacy-content">
          <div class="privacy-icon">
            <i class="fas fa-user-shield"></i>
          </div>
          <div class="privacy-text">
            <h4>Your Privacy Matters</h4>
            <p>We never sell your data. Charts are private by default.</p>
            <div class="privacy-links">
              <a href="/privacy" class="privacy-link">Privacy Policy</a>
              <a href="/terms" class="privacy-link">Terms of Service</a>
              <a href="/security" class="privacy-link">Security</a>
            </div>
          </div>
          <button class="privacy-close" aria-label="Close privacy notice">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `;
      
      document.body.appendChild(privacyWidget);
    }
    
    this.setupPrivacyWidget(privacyWidget);
  }

  // Setup privacy widget
  setupPrivacyWidget(widget) {
    const closeBtn = widget.querySelector('.privacy-close');
    const links = widget.querySelectorAll('.privacy-link');
    
    closeBtn.addEventListener('click', () => {
      this.dismissPrivacyWidget(widget);
    });
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.showPrivacyModal(link.href);
      });
    });
    
    // Auto-show after 5 seconds, hide after 30 seconds
    setTimeout(() => {
      widget.classList.add('visible');
    }, 5000);
    
    setTimeout(() => {
      if (widget.classList.contains('visible')) {
        widget.classList.remove('visible');
      }
    }, 35000);
  }

  // Dismiss privacy widget
  dismissPrivacyWidget(widget) {
    widget.classList.remove('visible');
    localStorage.setItem('privacy_widget_dismissed', 'true');
    
    // Show subtle confirmation
    this.showMicroFeedback('Privacy preferences saved', 'success');
  }

  // Show privacy modal
  showPrivacyModal(href) {
    const modal = this.createPrivacyModal(href);
    document.body.appendChild(modal);
    
    setTimeout(() => {
      modal.style.display = 'flex';
    }, 100);
  }

  // Create privacy modal
  createPrivacyModal(href) {
    const modal = document.createElement('div');
    modal.className = 'privacy-modal';
    modal.innerHTML = `
      <div class="privacy-modal-content">
        <div class="privacy-modal-header">
          <h3>Privacy & Security</h3>
          <button class="privacy-modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="privacy-modal-body">
          <div class="privacy-sections">
            <div class="privacy-section">
              <h4><i class="fas fa-lock"></i> Data Encryption</h4>
              <p>All your data is encrypted using industry-standard AES-256 encryption both in transit and at rest.</p>
            </div>
            <div class="privacy-section">
              <h4><i class="fas fa-eye-slash"></i> Private by Default</h4>
              <p>Your charts and data are private by default. We never share your information without explicit consent.</p>
            </div>
            <div class="privacy-section">
              <h4><i class="fas fa-user-check"></i> Data Ownership</h4>
              <p>You retain full ownership of your data. We never claim ownership of your charts or information.</p>
            </div>
            <div class="privacy-section">
              <h4><i class="fas fa-gavel"></i> Compliance</h4>
              <p>We are fully compliant with GDPR, CCPA, and other major privacy regulations worldwide.</p>
            </div>
          </div>
        </div>
        <div class="privacy-modal-footer">
          <button class="privacy-modal-btn primary" id="privacyAcceptBtn">
            I Understand
          </button>
          <a href="${href}" class="privacy-modal-btn secondary" target="_blank">
            Read Full Policy
          </a>
        </div>
      </div>
    `;
    
    // Setup events
    const closeBtn = modal.querySelector('.privacy-modal-close');
    const acceptBtn = modal.querySelector('#privacyAcceptBtn');
    
    closeBtn.addEventListener('click', () => {
      modal.remove();
    });
    
    acceptBtn.addEventListener('click', () => {
      modal.remove();
      this.showMicroFeedback('Privacy preferences confirmed', 'success');
    });
    
    return modal;
  }

  // Setup Social Proof
  setupSocialProof() {
    this.createTestimonialCarousel();
    this.setupUserCounters();
    this.setupRecentActivity();
    this.setupTrustLogos();
  }

  // Create testimonial carousel
  createTestimonialCarousel() {
    let testimonialSection = document.querySelector('.testimonial-section');
    
    if (!testimonialSection) {
      testimonialSection = document.createElement('section');
      testimonialSection.className = 'testimonial-section';
      testimonialSection.innerHTML = `
        <div class="testimonial-container">
          <div class="testimonial-header">
            <h2>Trusted by Professionals Worldwide</h2>
            <p>See what our users are saying about VIZOM</p>
          </div>
          
          <div class="testimonial-carousel" id="testimonialCarousel">
            <div class="testimonial-track" id="testimonialTrack">
              <!-- Testimonials will be added dynamically -->
            </div>
            <div class="testimonial-controls">
              <button class="testimonial-nav prev" id="testimonialPrev">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button class="testimonial-nav next" id="testimonialNext">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
            <div class="testimonial-indicators" id="testimonialIndicators">
              <!-- Indicators will be added dynamically -->
            </div>
          </div>
        </div>
      `;
      
      const mainContent = document.querySelector('.main-content') || document.body;
      mainContent.appendChild(testimonialSection);
    }
    
    this.populateTestimonials(testimonialSection);
    this.setupTestimonialCarousel(testimonialSection);
  }

  // Populate testimonials
  populateTestimonials(section) {
    const testimonials = [
      {
        name: 'Sarah Chen',
        role: 'Marketing Director',
        company: 'TechCorp Inc.',
        avatar: 'fas fa-user-tie',
        rating: 5,
        text: 'VIZOM transformed how we create presentations. What used to take hours now takes minutes, and the results are stunning.',
        metrics: { timeSaved: '75%', chartsCreated: '200+', teamSize: '15' }
      },
      {
        name: 'Michael Rodriguez',
        role: 'Data Analyst',
        company: 'FinanceHub',
        avatar: 'fas fa-chart-line',
        rating: 5,
        text: 'The AI-powered suggestions are incredible. VIZOM helps me create complex visualizations that impress executives every time.',
        metrics: { accuracy: '98%', presentations: '50+', clients: '25' }
      },
      {
        name: 'Emily Watson',
        role: 'Product Manager',
        company: 'StartupXYZ',
        avatar: 'fas fa-rocket',
        rating: 5,
        text: 'As a startup, we need to move fast. VIZOM lets us create professional charts without hiring a design team.',
        metrics: { growth: '300%', funding: '$2M', charts: '100+' }
      },
      {
        name: 'David Kim',
        role: 'Research Scientist',
        company: 'BioTech Labs',
        avatar: 'fas fa-microscope',
        rating: 5,
        text: 'The scientific charting capabilities are unmatched. VIZOM handles complex data visualization better than any tool I\'ve used.',
        metrics: { publications: '12', accuracy: '99%', timeSaved: '60%' }
      },
      {
        name: 'Lisa Anderson',
        role: 'CEO',
        company: 'Creative Agency',
        avatar: 'fas fa-palette',
        rating: 5,
        text: 'Our clients love the charts we create with VIZOM. The professional quality and customization options are fantastic.',
        metrics: { clients: '500+', revenue: '+40%', satisfaction: '95%' }
      }
    ];
    
    const track = section.querySelector('#testimonialTrack');
    const indicators = section.querySelector('#testimonialIndicators');
    
    // Add testimonials
    testimonials.forEach((testimonial, index) => {
      const testimonialCard = this.createTestimonialCard(testimonial, index);
      track.appendChild(testimonialCard);
      
      // Add indicator
      const indicator = document.createElement('button');
      indicator.className = `testimonial-indicator ${index === 0 ? 'active' : ''}`;
      indicator.setAttribute('data-index', index);
      indicators.appendChild(indicator);
    });
    
    this.testimonials = new Map(testimonials.map((t, i) => [i, t]));
  }

  // Create testimonial card
  createTestimonialCard(testimonial, index) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.setAttribute('data-index', index);
    card.innerHTML = `
      <div class="testimonial-content">
        <div class="testimonial-header">
          <div class="testimonial-avatar">
            <i class="${testimonial.avatar}"></i>
          </div>
          <div class="testimonial-info">
            <div class="testimonial-name">${testimonial.name}</div>
            <div class="testimonial-role">${testimonial.role}</div>
            <div class="testimonial-company">${testimonial.company}</div>
          </div>
          <div class="testimonial-rating">
            ${Array(testimonial.rating).fill('<i class="fas fa-star"></i>').join('')}
          </div>
        </div>
        
        <div class="testimonial-text">
          <blockquote>"${testimonial.text}"</blockquote>
        </div>
        
        <div class="testimonial-metrics">
          ${Object.entries(testimonial.metrics).map(([key, value]) => `
            <div class="metric-item">
              <span class="metric-value">${value}</span>
              <span class="metric-label">${this.formatMetricLabel(key)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    return card;
  }

  // Format metric label
  formatMetricLabel(key) {
    const labels = {
      timeSaved: 'Time Saved',
      chartsCreated: 'Charts Created',
      teamSize: 'Team Size',
      accuracy: 'Accuracy',
      presentations: 'Presentations',
      clients: 'Clients',
      growth: 'Growth',
      funding: 'Funding',
      publications: 'Publications',
      revenue: 'Revenue Increase',
      satisfaction: 'Client Satisfaction'
    };
    
    return labels[key] || key;
  }

  // Setup testimonial carousel
  setupTestimonialCarousel(section) {
    const track = section.querySelector('#testimonialTrack');
    const prevBtn = section.querySelector('#testimonialPrev');
    const nextBtn = section.querySelector('#testimonialNext');
    const indicators = section.querySelector('#testimonialIndicators');
    
    let currentIndex = 0;
    const totalTestimonials = this.testimonials.size;
    
    const goToTestimonial = (index) => {
      currentIndex = (index + totalTestimonials) % totalTestimonials;
      const offset = -currentIndex * 100;
      
      track.style.transform = `translateX(${offset}%)`;
      
      // Update indicators
      indicators.querySelectorAll('.testimonial-indicator').forEach((indicator, i) => {
        indicator.classList.toggle('active', i === currentIndex);
      });
      
      // Add entrance animation
      const activeCard = track.querySelector(`[data-index="${currentIndex}"]`);
      activeCard.classList.add('testimonial-entrance');
      setTimeout(() => {
        activeCard.classList.remove('testimonial-entrance');
      }, 600);
    };
    
    prevBtn.addEventListener('click', () => {
      goToTestimonial(currentIndex - 1);
    });
    
    nextBtn.addEventListener('click', () => {
      goToTestimonial(currentIndex + 1);
    });
    
    indicators.addEventListener('click', (e) => {
      if (e.target.classList.contains('testimonial-indicator')) {
        const index = parseInt(e.target.getAttribute('data-index'));
        goToTestimonial(index);
      }
    });
    
    // Auto-rotate every 8 seconds
    setInterval(() => {
      goToTestimonial(currentIndex + 1);
    }, 8000);
  }

  // Setup user counters
  setupUserCounters() {
    let counterSection = document.querySelector('.user-counter-section');
    
    if (!counterSection) {
      counterSection = document.createElement('section');
      counterSection.className = 'user-counter-section';
      counterSection.innerHTML = `
        <div class="counter-container">
          <div class="counter-item">
            <div class="counter-number" data-target="50000">0</div>
            <div class="counter-label">Active Users</div>
            <div class="counter-icon">
              <i class="fas fa-users"></i>
            </div>
          </div>
          
          <div class="counter-item">
            <div class="counter-number" data-target="1000000">0</div>
            <div class="counter-label">Charts Created</div>
            <div class="counter-icon">
              <i class="fas fa-chart-bar"></i>
            </div>
          </div>
          
          <div class="counter-item">
            <div class="counter-number" data-target="99">0</div>
            <div class="counter-label">% Satisfaction</div>
            <div class="counter-icon">
              <i class="fas fa-heart"></i>
            </div>
          </div>
          
          <div class="counter-item">
            <div class="counter-number" data-target="150">0</div>
            <div class="counter-label">Countries</div>
            <div class="counter-icon">
              <i class="fas fa-globe"></i>
            </div>
          </div>
        </div>
      `;
      
      const mainContent = document.querySelector('.main-content') || document.body;
      mainContent.appendChild(counterSection);
    }
    
    this.animateCounters(counterSection);
  }

  // Animate counters
  animateCounters(section) {
    const counters = section.querySelectorAll('.counter-number');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });
    
    counters.forEach(counter => {
      observer.observe(counter);
    });
  }

  // Animate individual counter
  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      // Format number with commas
      element.textContent = Math.floor(current).toLocaleString();
    }, 16);
  }

  // Setup Professional Error Handling
  setupProfessionalErrorHandling() {
    this.setupGlobalErrorHandler();
    this.setupFormErrorHandler();
    this.setupNetworkErrorHandler();
    this.setupValidationErrorHandler();
  }

  // Setup global error handler
  setupGlobalErrorHandler() {
    window.addEventListener('error', (e) => {
      this.handleProfessionalError(e, 'global');
    });
    
    window.addEventListener('unhandledrejection', (e) => {
      this.handleProfessionalError(e, 'promise');
    });
  }

  // Handle professional error
  handleProfessionalError(error, type) {
    const errorModal = this.createProfessionalErrorModal(error, type);
    document.body.appendChild(errorModal);
    
    setTimeout(() => {
      errorModal.style.display = 'flex';
    }, 100);
    
    // Log error for debugging
    console.error('Professional error handled:', error);
  }

  // Create professional error modal
  createProfessionalErrorModal(error, type) {
    const modal = document.createElement('div');
    modal.className = 'professional-error-modal';
    modal.innerHTML = `
      <div class="error-modal-content">
        <div class="error-modal-header">
          <div class="error-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <h2>Oops! Something went wrong</h2>
          <p>Don't worry - we're on it. Your work is safe.</p>
        </div>
        
        <div class="error-modal-body">
          <div class="error-solutions">
            <h3>Here's what you can do:</h3>
            <div class="solution-list">
              <div class="solution-item">
                <div class="solution-icon">
                  <i class="fas fa-redo"></i>
                </div>
                <div class="solution-content">
                  <h4>Try Again</h4>
                  <p>Refresh the page and retry your action</p>
                </div>
                <button class="solution-btn" onclick="location.reload()">
                  Refresh Page
                </button>
              </div>
              
              <div class="solution-item">
                <div class="solution-icon">
                  <i class="fas fa-save"></i>
                </div>
                <div class="solution-content">
                  <h4>Check Your Work</h4>
                  <p>Your data may have been auto-saved</p>
                </div>
                <button class="solution-btn" onclick="window.location.href='/dashboard'">
                  Go to Dashboard
                </button>
              </div>
              
              <div class="solution-item">
                <div class="solution-icon">
                  <i class="fas fa-headset"></i>
                </div>
                <div class="solution-content">
                  <h4>Get Help</h4>
                  <p>Our support team is available 24/7</p>
                </div>
                <button class="solution-btn" onclick="window.open('/support')">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
          
          <div class="error-details">
            <details>
              <summary>Technical Details (for support)</summary>
              <div class="error-info">
                <div class="error-type">Error Type: ${type}</div>
                <div class="error-time">Time: ${new Date().toLocaleString()}</div>
                <div class="error-ref">Reference: ${this.generateErrorRef()}</div>
              </div>
            </details>
          </div>
        </div>
        
        <div class="error-modal-footer">
          <button class="error-modal-btn primary" onclick="this.closest('.professional-error-modal').remove()">
            Continue Working
          </button>
          <button class="error-modal-btn secondary" onclick="window.location.href='/help'">
            Get Help
          </button>
        </div>
      </div>
    `;
    
    return modal;
  }

  // Generate error reference
  generateErrorRef() {
    return 'ERR-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  // Setup Micro-interactions
  setupMicroInteractions() {
    this.setupButtonMicroInteractions();
    this.setupFormMicroInteractions();
    this.setupCardMicroInteractions();
    this.setupNavigationMicroInteractions();
    this.setupChartMicroInteractions();
  }

  // Setup button micro-interactions
  setupButtonMicroInteractions() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('button, .btn, [role="button"]');
      if (button) {
        this.addButtonMicroInteraction(button);
      }
    });
  }

  // Add button micro-interaction
  addButtonMicroInteraction(button) {
    // Ripple effect
    this.createRippleEffect(button, e);
    
    // Particle burst for primary actions
    if (button.classList.contains('primary') || button.classList.contains('btn-primary')) {
      this.createParticleBurst(button);
    }
    
    // Success feedback
    if (button.classList.contains('success') || button.textContent.includes('Save')) {
      this.showSuccessFeedback(button);
    }
    
    // Loading state animation
    if (button.dataset.loading !== undefined) {
      this.showLoadingState(button);
    }
  }

  // Create ripple effect
  createRippleEffect(button, event) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Create particle burst
  createParticleBurst(element) {
    const rect = element.getBoundingClientRect();
    const particleCount = 12;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 100 + Math.random() * 100;
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
      particle.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');
      particle.style.backgroundColor = this.getRandomBrandColor();
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 1000);
    }
  }

  // Get random brand color
  getRandomBrandColor() {
    const colors = ['#0ea5e9', '#22c55e', '#f59e0b', '#8b5cf6'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Show success feedback
  showSuccessFeedback(element) {
    const feedback = document.createElement('div');
    feedback.className = 'success-feedback';
    feedback.innerHTML = `
      <div class="success-icon">
        <i class="fas fa-check"></i>
      </div>
      <div class="success-text">Success!</div>
    `;
    
    const rect = element.getBoundingClientRect();
    feedback.style.left = rect.right + 10 + 'px';
    feedback.style.top = rect.top + (rect.height / 2) - 20 + 'px';
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.classList.add('success-feedback-show');
    }, 100);
    
    setTimeout(() => {
      feedback.remove();
    }, 2000);
  }

  // Setup Surprise Features
  setupSurpriseFeatures() {
    this.setupEasterEggs();
    this.setupHiddenFeatures();
    this.setupDelightfulAnimations();
    this.setupSmartShortcuts();
  }

  // Setup Easter eggs
  setupEasterEggs() {
    let konamiCode = [];
    const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
      konamiCode.push(e.key);
      konamiCode = konamiCode.slice(-konamiPattern.length);
      
      if (konamiCode.join(',') === konamiPattern.join(',')) {
        this.activateKonamiEasterEgg();
      }
    });
    
    // Double-click logo for surprise
    const logo = document.querySelector('.logo');
    if (logo) {
      let clickCount = 0;
      logo.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 5) {
          this.activateLogoEasterEgg();
          clickCount = 0;
        }
        
        setTimeout(() => {
          clickCount = 0;
        }, 2000);
      });
    }
  }

  // Activate Konami easter egg
  activateKonamiEasterEgg() {
    const celebration = document.createElement('div');
    celebration.className = 'konami-celebration';
    celebration.innerHTML = `
      <div class="konami-content">
        <div class="konami-message">
          <h2>🎉 You found the secret! 🎉</h2>
          <p>You've unlocked VIZOM's hidden theme!</p>
        </div>
        <div class="konami-effects">
          ${this.createFireworks()}
        </div>
      </div>
    `;
    
    document.body.appendChild(celebration);
    
    // Apply special theme
    document.body.classList.add('secret-theme');
    
    setTimeout(() => {
      celebration.remove();
    }, 5000);
    
    this.trackEngagement('easter_egg_activated', { type: 'konami' });
  }

  // Create fireworks effect
  createFireworks() {
    let fireworks = '';
    for (let i = 0; i < 5; i++) {
      fireworks += `<div class="firework" style="--delay: ${i * 0.2}s; --color: ${this.getRandomBrandColor()}"></div>`;
    }
    return fireworks;
  }

  // Activate logo easter egg
  activateLogoEasterEgg() {
    const logo = document.querySelector('.logo');
    if (logo) {
      logo.classList.add('logo-dance');
      
      setTimeout(() => {
        logo.classList.remove('logo-dance');
      }, 3000);
    }
    
    this.showMicroFeedback('🎵 VIZOM beats!', 'delight');
    this.trackEngagement('easter_egg_activated', { type: 'logo' });
  }

  // Setup Brand Voice
  setupBrandVoice() {
    this.brandVoice = {
      personality: 'helpful',
      tone: 'professional',
      humor: 'subtle',
      encouragement: 'frequent'
    };
    
    this.applyBrandVoice();
  }

  // Apply brand voice
  applyBrandVoice() {
    this.updateCopyWithPersonality();
    this.addEncouragingMessages();
    this.injectSubtleHumor();
    this.personalizeInteractions();
  }

  // Update copy with personality
  updateCopyWithPersonality() {
    const personalityMap = {
      'Create Chart': 'Create Something Beautiful',
      'Generate': 'Bring Your Data to Life',
      'Export': 'Share Your Masterpiece',
      'Save': 'Keep Your Creation Safe',
      'Error': 'Oops! Let\'s Fix This',
      'Loading': 'Working Our Magic...',
      'Success': 'Fantastic Work!'
    };
    
    // Update button text and labels
    Object.entries(personalityMap).forEach(([original, replacement]) => {
      document.querySelectorAll(`button:contains("${original}"), .btn:contains("${original}")`).forEach(element => {
        if (element.textContent.includes(original)) {
          element.textContent = element.textContent.replace(original, replacement);
        }
      });
    });
  }

  // Add encouraging messages
  addEncouragingMessages() {
    const encouragements = [
      'You\'re doing great!',
      'Looking good so far!',
      'Almost there!',
      'Excellent choice!',
      'That\'s perfect!',
      'You\'re a natural!',
      'Great work!',
      'Keep it up!'
    ];
    
    // Show encouragement after successful actions
    document.addEventListener('chartGenerated', () => {
      const message = encouragements[Math.floor(Math.random() * encouragements.length)];
      this.showEncouragement(message);
    });
  }

  // Show encouragement message
  showEncouragement(message) {
    const encouragement = document.createElement('div');
    encouragement.className = 'encouragement-message';
    encouragement.innerHTML = `
      <div class="encouragement-content">
        <div class="encouragement-icon">
          <i class="fas fa-sparkles"></i>
        </div>
        <div class="encouragement-text">${message}</div>
      </div>
    `;
    
    document.body.appendChild(encouragement);
    
    setTimeout(() => {
      encouragement.classList.add('encouragement-show');
    }, 100);
    
    setTimeout(() => {
      encouragement.remove();
    }, 3000);
  }

  // Setup Smooth Animations
  setupSmoothAnimations() {
    this.setupPageTransitions();
    this.setupScrollAnimations();
    this.setupHoverAnimations();
    this.setupLoadingAnimations();
  }

  // Setup page transitions
  setupPageTransitions() {
    // Fade in content on load
    document.addEventListener('DOMContentLoaded', () => {
      document.body.classList.add('page-loaded');
    });
    
    // Smooth transitions between sections
    this.observeSectionTransitions();
  }

  // Observe section transitions
  observeSectionTransitions() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
  }

  // Setup scroll animations
  setupScrollAnimations() {
    let ticking = false;
    
    const updateScrollAnimations = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Parallax effects
      document.querySelectorAll('.parallax').forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
      
      // Progress indicators
      document.querySelectorAll('.scroll-progress').forEach(element => {
        const rect = element.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
        element.style.setProperty('--scroll-progress', progress);
      });
      
      ticking = false;
    };
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollAnimations);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', requestTick);
  }

  // Setup hover animations
  setupHoverAnimations() {
    document.addEventListener('mouseover', (e) => {
      const element = e.target.closest('[data-hover-animation]');
      if (element) {
        this.addHoverAnimation(element);
      }
    });
  }

  // Add hover animation
  addHoverAnimation(element) {
    const animation = element.dataset.hoverAnimation;
    
    switch (animation) {
      case 'lift':
        element.style.transform = 'translateY(-4px)';
        element.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        break;
      case 'scale':
        element.style.transform = 'scale(1.02)';
        break;
      case 'glow':
        element.style.boxShadow = '0 0 20px rgba(14, 165, 233, 0.3)';
        break;
    }
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = '';
      element.style.boxShadow = '';
    }, { once: true });
  }

  // Setup Engagement Tracking
  setupEngagementTracking() {
    this.trackMicroInteractions();
    this.trackSurpriseFeatures();
    this.trackTimeOnPage();
    this.trackUserDelight();
  }

  // Track micro-interactions
  trackMicroInteractions() {
    document.addEventListener('click', (e) => {
      const element = e.target.closest('[data-track]');
      if (element) {
        this.trackEngagement('micro_interaction', {
          element: element.tagName,
          action: element.dataset.track
        });
      }
    });
  }

  // Track engagement
  trackEngagement(event, data = {}) {
    if (window.analytics) {
      window.analytics.trackCustomEvent(event, {
        timestamp: Date.now(),
        ...data
      });
    }
    
    // Store engagement metrics
    const metrics = this.engagementMetrics.get(event) || [];
    metrics.push({
      timestamp: Date.now(),
      ...data
    });
    this.engagementMetrics.set(event, metrics);
  }

  // Show micro feedback
  showMicroFeedback(message, type = 'info') {
    const feedback = document.createElement('div');
    feedback.className = `micro-feedback micro-feedback-${type}`;
    feedback.innerHTML = `
      <div class="feedback-content">
        <i class="fas fa-${type === 'success' ? 'check' : type === 'delight' ? 'sparkles' : 'info'}"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.classList.add('micro-feedback-show');
    }, 100);
    
    setTimeout(() => {
      feedback.remove();
    }, 2000);
  }

  // Show tooltip
  showTooltip(element, text) {
    let tooltip = element.querySelector('.tooltip');
    
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      element.appendChild(tooltip);
    }
    
    tooltip.textContent = text;
    tooltip.classList.add('tooltip-visible');
  }

  // Hide tooltip
  hideTooltip(element) {
    const tooltip = element.querySelector('.tooltip');
    if (tooltip) {
      tooltip.classList.remove('tooltip-visible');
    }
  }

  // Public methods
  getEngagementMetrics() {
    return Object.fromEntries(this.engagementMetrics);
  }

  triggerCelebration(type, data) {
    switch (type) {
      case 'success':
        this.showSuccessFeedback(data.element);
        break;
      case 'delight':
        this.showMicroFeedback(data.message, 'delight');
        break;
      default:
        console.log('Unknown celebration type:', type);
    }
  }

  updateBrandVoice(personality) {
    this.brandVoice = { ...this.brandVoice, ...personality };
    this.applyBrandVoice();
  }
}

// Initialize trust & engagement manager
document.addEventListener('DOMContentLoaded', () => {
  window.trustEngagementManager = new TrustEngagementManager();
});

export { TrustEngagementManager };
