// Unified Footer Component
// Manages consistent footer structure across all pages

class UnifiedFooter {
  constructor() {
    this.footerData = this.getFooterData();
    this.init();
  }

  init() {
    this.renderFooter();
    this.setupEventListeners();
    this.setupNewsletterForm();
    this.setupCurrentYear();
  }

  getFooterData() {
    return {
      product: {
        title: 'Product',
        links: [
          { name: 'Features', href: '#features', icon: 'fas fa-star' },
          { name: 'Templates', href: 'templates.html', icon: 'fas fa-layer-group' },
          { name: 'Examples', href: '#examples', icon: 'fas fa-chart-line' },
          { name: 'Pricing', href: 'pricing.html', icon: 'fas fa-tag' }
        ]
      },
      creator: {
        title: 'Creator',
        links: [
          { name: 'About me', href: 'about.html', icon: 'fas fa-user' },
          { name: 'Benchmark gallery', href: 'about.html#benchmarks', icon: 'fas fa-images' },
          { name: 'Contact', href: 'contact.html', icon: 'fas fa-envelope' }
        ]
      },
      legal: {
        title: 'Legal',
        links: [
          { name: 'Privacy Policy', href: '#privacy', icon: 'fas fa-shield-alt' },
          { name: 'Terms of Service', href: '#terms', icon: 'fas fa-file-contract' },
          { name: 'Cookie Policy', href: '#cookies', icon: 'fas fa-cookie' }
        ]
      },
      social: {
        title: 'Connect',
        platforms: [
          { name: 'X', href: 'https://twitter.com/duesenbek', icon: 'fab fa-x-twitter' },
          { name: 'LinkedIn', href: 'https://linkedin.com/in/duesenbek', icon: 'fab fa-linkedin' },
          { name: 'GitHub', href: 'https://github.com/duesenbek', icon: 'fab fa-github' }
        ]
      },
      apps: {
        title: 'Get the App',
        platforms: [
          { name: 'App Store', href: '#appstore', icon: 'fab fa-apple' },
          { name: 'Google Play', href: '#playstore', icon: 'fab fa-google-play' }
        ]
      }
    };
  }

  renderFooter() {
    const footerContainer = document.getElementById('unified-footer');
    if (!footerContainer) return;

    footerContainer.innerHTML = this.generateFooterHTML();
  }

  generateFooterHTML() {
    const { product, creator, legal, social, apps } = this.footerData;

    return `
      <!-- Main Footer Content -->
      <div class="footer-main">
        <div class="footer-container">
          <!-- Company Info & Newsletter -->
          <div class="footer-brand">
            <div class="brand-info">
              <div class="brand-logo">
                <i class="fas fa-chart-simple"></i>
                <span>VIZOM</span>
              </div>
              <p class="brand-description">
                Transform your data into stunning visualizations with AI-powered charts and dashboards. 
                Professional templates, real-time collaboration, and seamless export options.
              </p>
              <div class="app-downloads">
                ${apps.platforms.map(app => `
                  <a href="${app.href}" class="app-link" title="${app.name}">
                    <i class="${app.icon}"></i>
                    <span>${app.name}</span>
                  </a>
                `).join('')}
              </div>
            </div>
            
            <div class="newsletter-section">
              <h4 class="newsletter-title">
                <i class="fas fa-envelope"></i>
                Stay Updated
              </h4>
              <p class="newsletter-description">
                Get the latest features, templates, and data visualization tips delivered to your inbox.
              </p>
              <form class="newsletter-form" id="newsletter-form">
                <div class="input-group">
                  <input 
                    type="email" 
                    id="newsletter-email"
                    placeholder="Enter your email"
                    required
                    class="newsletter-input"
                  >
                  <button type="submit" class="newsletter-button">
                    <i class="fas fa-paper-plane"></i>
                    <span>Subscribe</span>
                  </button>
                </div>
                <div class="newsletter-message" id="newsletter-message"></div>
              </form>
            </div>
          </div>

          <!-- Links Sections -->
          <div class="footer-links">
            <!-- Product Section -->
            <div class="link-section">
              <h3 class="section-title">
                <i class="fas fa-box"></i>
                ${product.title}
              </h3>
              <ul class="link-list">
                ${product.links.map(link => `
                  <li>
                    ${this.renderFooterLink(link)}
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Creator Section -->
            <div class="link-section">
              <h3 class="section-title">
                <i class="fas fa-user"></i>
                ${creator.title}
              </h3>
              <ul class="link-list">
                ${creator.links.map(link => `
                  <li>
                    ${this.renderFooterLink(link)}
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Legal Section -->
            <div class="link-section">
              <h3 class="section-title">
                <i class="fas fa-gavel"></i>
                ${legal.title}
              </h3>
              <ul class="link-list">
                ${legal.links.map(link => `
                  <li>
                    ${this.renderFooterLink(link)}
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Social & Bottom Bar -->
      <div class="footer-bottom">
        <div class="footer-container">
          <div class="bottom-content">
            <!-- Social Links -->
            <div class="social-section">
              <h4 class="social-title">
                <i class="fas fa-share-alt"></i>
                ${social.title}
              </h4>
              <div class="social-links">
                ${social.platforms.map(platform => `
                  <a href="${platform.href}" class="social-link" title="${platform.name}" target="_blank" rel="noopener noreferrer">
                    <i class="${platform.icon}"></i>
                  </a>
                `).join('')}
              </div>
            </div>

            <!-- Copyright & Legal -->
            <div class="copyright-section">
              <div class="copyright-text">
                <p>&copy; <span id="current-year">${new Date().getFullYear()}</span> VIZOM. All rights reserved.</p>
                <p class="made-with">Made with <i class="fas fa-heart text-red-500"></i> for data enthusiasts</p>
              </div>
              <div class="legal-links">
                <a href="#privacy" class="legal-link">Privacy</a>
                <span class="separator">•</span>
                <a href="#terms" class="legal-link">Terms</a>
                <span class="separator">•</span>
                <a href="#cookies" class="legal-link">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderFooterLink(link) {
    // Render a footer link with optional icon and external indicator
    const isExternal = link.href && (link.href.startsWith('http') || link.external);
    const externalAttrs = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
    const externalIcon = isExternal ? '<i class="fas fa-external-link-alt external-icon"></i>' : '';
    
    return `
      <a href="${link.href || '#'}" class="footer-link" ${externalAttrs}>
        ${link.icon ? `<i class="${link.icon}"></i>` : ''}
        <span>${link.name || link.label || link.text || ''}</span>
        ${externalIcon}
      </a>
    `;
  }

  setupEventListeners() {
    // Footer link clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.footer-link')) {
        e.preventDefault();
        const href = e.target.closest('.footer-link').getAttribute('href');
        this.handleFooterLinkClick(href);
      }

      if (e.target.closest('.social-link')) {
        this.handleSocialClick(e.target.closest('.social-link'));
      }

      if (e.target.closest('.app-link')) {
        this.handleAppClick(e.target.closest('.app-link'));
      }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  setupNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('newsletter-email');
    const messageDiv = document.getElementById('newsletter-message');

    if (!form || !emailInput || !messageDiv) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = emailInput.value.trim();
      if (!email) return;

      // Show loading state
      this.showNewsletterMessage('Subscribing...', 'loading');
      this.setNewsletterFormState(true);

      try {
        // Simulate API call
        await this.subscribeToNewsletter(email);
        
        // Show success message
        this.showNewsletterMessage('Successfully subscribed! Check your email for confirmation.', 'success');
        emailInput.value = '';
        
        // Track subscription
        this.trackNewsletterSubscription(email);
        
      } catch (error) {
        // Show error message
        this.showNewsletterMessage('Subscription failed. Please try again.', 'error');
      } finally {
        this.setNewsletterFormState(false);
      }
    });

    // Email validation feedback
    emailInput.addEventListener('input', () => {
      const email = emailInput.value.trim();
      if (email && !this.isValidEmail(email)) {
        emailInput.classList.add('invalid');
      } else {
        emailInput.classList.remove('invalid');
      }
    });
  }

  setupCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  async subscribeToNewsletter(email) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate validation
    if (email === 'test@example.com') {
      throw new Error('Email already subscribed');
    }
    
    // Store in localStorage for demo
    const subscribers = JSON.parse(localStorage.getItem('vizom-newsletter') || '[]');
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem('vizom-newsletter', JSON.stringify(subscribers));
    }
    
    return true;
  }

  showNewsletterMessage(message, type) {
    const messageDiv = document.getElementById('newsletter-message');
    if (!messageDiv) return;

    messageDiv.textContent = message;
    messageDiv.className = `newsletter-message ${type}`;
    
    // Auto-hide success messages
    if (type === 'success') {
      setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'newsletter-message';
      }, 5000);
    }
  }

  setNewsletterFormState(loading) {
    const form = document.getElementById('newsletter-form');
    const button = form?.querySelector('.newsletter-button');
    const input = form?.querySelector('.newsletter-input');

    if (button) {
      if (loading) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Subscribing...</span>';
      } else {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Subscribe</span>';
      }
    }

    if (input) {
      input.disabled = loading;
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  handleFooterLinkClick(href) {
    // Handle navigation based on link type
    if (href.startsWith('#')) {
      // Smooth scroll to section
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (href.includes('.html')) {
      // Navigate to page
      window.location.href = href;
    } else {
      // Handle other links (could open modals, etc.)
      console.log('Footer link clicked:', href);
    }
  }

  handleSocialClick(socialLink) {
    const platform = socialLink.getAttribute('title');
    const href = socialLink.getAttribute('href');
    
    // Track social click
    this.trackSocialClick(platform);
    
    // Open in new window
    window.open(href, '_blank', 'noopener,noreferrer');
  }

  handleAppClick(appLink) {
    const platform = appLink.getAttribute('title');
    const href = appLink.getAttribute('href');
    
    // Track app download click
    this.trackAppDownload(platform);
    
    // Navigate to app store
    window.location.href = href;
  }

  trackNewsletterSubscription(email) {
    // Analytics tracking for newsletter subscription
    if (typeof gtag !== 'undefined') {
      gtag('event', 'newsletter_subscription', {
        event_category: 'engagement',
        event_label: 'footer'
      });
    }
  }

  trackSocialClick(platform) {
    // Analytics tracking for social clicks
    if (typeof gtag !== 'undefined') {
      gtag('event', 'social_click', {
        event_category: 'social',
        event_label: platform
      });
    }
  }

  trackAppDownload(platform) {
    // Analytics tracking for app downloads
    if (typeof gtag !== 'undefined') {
      gtag('event', 'app_download_click', {
        event_category: 'app',
        event_label: platform
      });
    }
  }

  // Public API methods
  updateFooterData(newData) {
    this.footerData = { ...this.footerData, ...newData };
    this.renderFooter();
    this.setupEventListeners();
    this.setupNewsletterForm();
    this.setupCurrentYear();
  }

  showNewsletterSuccess(message) {
    this.showNewsletterMessage(message, 'success');
  }

  showNewsletterError(message) {
    this.showNewsletterMessage(message, 'error');
  }

  getCurrentYear() {
    return new Date().getFullYear();
  }
}

// Export for use in other modules
// NOTE: Auto-initialization removed. Use main.js feature flag to enable.
export { UnifiedFooter };
