/**
 * Pro Features Integration
 * Integrates feature gating into the UI
 */

import featureGating from '../services/featureGating.js';
import { showUpgradeModal } from '../components/UpgradeModal.js';
import { CHART_TYPES, EXPORT_FORMATS } from '../config/subscription.js';
import { TEMPLATES, getTemplateCount } from '../data/templates.js';

class ProFeaturesIntegration {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    console.log('[ProFeatures] Initializing...');
    
    this.updateChartTypeUI();
    this.updateExportUI();
    this.updateTemplateUI();
    this.updateUsageDisplay();
    this.bindProFeatureClicks();
    this.checkPaymentSuccess();
    
    // Listen for subscription changes
    document.addEventListener('subscription:changed', () => {
      console.log('[ProFeatures] Subscription changed, updating UI');
      this.updateAllUI();
    });
    
    this.initialized = true;
    console.log('[ProFeatures] Initialized');
  }

  /**
   * Update all UI elements
   */
  updateAllUI() {
    this.updateChartTypeUI();
    this.updateExportUI();
    this.updateTemplateUI();
    this.updateUsageDisplay();
    this.updateProBadge();
  }

  /**
   * Update chart type UI - ALL chart types are FREE now
   * No Pro badges on chart types
   */
  updateChartTypeUI() {
    const chartOptions = document.querySelectorAll('.chart-option, [data-chart-type]');
    
    chartOptions.forEach(option => {
      // Remove any existing Pro badges from chart types (all are free now)
      option.querySelector('.pro-badge')?.remove();
      option.classList.remove('pro-locked');
    });
    
    console.log('[ProFeatures] Chart types updated - all FREE');
  }

  /**
   * Add Pro badges to export buttons
   */
  updateExportUI() {
    const exportButtons = document.querySelectorAll('[data-export-format], .export-btn');
    
    exportButtons.forEach(btn => {
      const format = btn.dataset.exportFormat || btn.dataset.format;
      if (!format) return;
      
      const formatConfig = EXPORT_FORMATS[format];
      if (!formatConfig) return;
      
      const isAccessible = featureGating.canExportFormat(format);
      
      // Remove existing badges
      btn.querySelector('.pro-badge')?.remove();
      
      if (formatConfig.isPro && !isAccessible) {
        const badge = document.createElement('span');
        badge.className = 'pro-badge ml-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full';
        badge.innerHTML = 'PRO';
        btn.appendChild(badge);
        btn.classList.add('pro-locked');
      } else {
        btn.classList.remove('pro-locked');
      }
    });
  }

  /**
   * Update template gallery with Pro badges
   */
  updateTemplateUI() {
    const templateCards = document.querySelectorAll('.template-card, [data-template-id]');
    const isPro = featureGating.isPro();
    const counts = getTemplateCount();
    
    console.log(`[ProFeatures] Templates: ${counts.free} free, ${counts.pro} pro, user isPro: ${isPro}`);
    
    templateCards.forEach(card => {
      const templateId = card.dataset.templateId || card.dataset.id;
      const template = TEMPLATES.find(t => t.id === templateId);
      
      if (!template) return;
      
      // Remove existing badges
      card.querySelector('.pro-badge')?.remove();
      card.querySelector('.pro-overlay')?.remove();
      
      if (template.isPro && !isPro) {
        // Add Pro overlay
        const overlay = document.createElement('div');
        overlay.className = 'pro-overlay absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center rounded-lg';
        overlay.innerHTML = `
          <div class="text-center">
            <span class="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
              <i class="fas fa-crown"></i>
              PRO
            </span>
          </div>
        `;
        card.style.position = 'relative';
        card.appendChild(overlay);
        card.classList.add('pro-locked');
      } else {
        card.classList.remove('pro-locked');
      }
    });
  }

  /**
   * Update usage display (AI generations, saved charts)
   */
  updateUsageDisplay() {
    const stats = featureGating.getUsageStats();
    
    // Update AI generation counter
    const aiCounter = document.getElementById('ai-generation-counter');
    if (aiCounter) {
      if (stats.aiGenerations.limit === Infinity) {
        aiCounter.textContent = 'Unlimited';
        aiCounter.classList.add('text-green-600');
      } else {
        aiCounter.textContent = `${stats.aiGenerations.remaining}/${stats.aiGenerations.limit}`;
        if (stats.aiGenerations.remaining <= 1) {
          aiCounter.classList.add('text-red-600');
        }
      }
    }
    
    // Update saved charts counter
    const saveCounter = document.getElementById('saved-charts-counter');
    if (saveCounter) {
      if (stats.savedCharts.limit === Infinity) {
        saveCounter.textContent = 'Unlimited';
        saveCounter.classList.add('text-green-600');
      } else {
        saveCounter.textContent = `${stats.savedCharts.remaining}/${stats.savedCharts.limit}`;
        if (stats.savedCharts.remaining <= 0) {
          saveCounter.classList.add('text-red-600');
        }
      }
    }
  }

  /**
   * Update Pro badge in header
   */
  updateProBadge() {
    const isPro = featureGating.isPro();
    
    // Add/remove Pro badge from user dropdown
    const userDropdown = document.getElementById('user-dropdown');
    if (userDropdown) {
      let proBadge = userDropdown.querySelector('.user-pro-badge');
      
      if (isPro && !proBadge) {
        proBadge = document.createElement('span');
        proBadge.className = 'user-pro-badge absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full';
        proBadge.textContent = 'PRO';
        const avatarBtn = userDropdown.querySelector('#user-avatar-btn');
        if (avatarBtn) {
          avatarBtn.style.position = 'relative';
          avatarBtn.appendChild(proBadge);
        }
      } else if (!isPro && proBadge) {
        proBadge.remove();
      }
    }
  }

  /**
   * Bind click handlers for Pro features
   * Note: Chart types are ALL FREE - no blocking
   */
  bindProFeatureClicks() {
    document.addEventListener('click', (e) => {
      // Chart types - ALL FREE, no blocking needed
      // (removed chart type blocking)
      
      // Export button clicks - still gated
      const exportBtn = e.target.closest('[data-export-format], .export-btn');
      if (exportBtn) {
        const format = exportBtn.dataset.exportFormat || exportBtn.dataset.format;
        if (format && !featureGating.canExportFormat(format)) {
          e.preventDefault();
          e.stopPropagation();
          console.log('[ProFeatures] Blocked export format:', format);
          showUpgradeModal('export');
          return false;
        }
      }
      
      // Template clicks - Pro templates are gated
      const templateCard = e.target.closest('.template-card, [data-template-id]');
      if (templateCard) {
        const templateId = templateCard.dataset.templateId || templateCard.dataset.id;
        const template = TEMPLATES.find(t => t.id === templateId);
        if (template && !featureGating.canAccessTemplate(template)) {
          e.preventDefault();
          e.stopPropagation();
          console.log('[ProFeatures] Blocked template:', templateId);
          showUpgradeModal('template');
          return false;
        }
      }
    }, true);
  }

  /**
   * Check for payment success in URL
   */
  checkPaymentSuccess() {
    const params = new URLSearchParams(window.location.search);
    
    if (params.get('payment') === 'success') {
      console.log('[ProFeatures] Payment success detected');
      
      // Activate Pro status
      featureGating.setProStatus();
      
      // Show success message
      setTimeout(() => {
        if (window.uiFeedback?.showToast) {
          window.uiFeedback.showToast('🎉 Welcome to Vizom Pro! All features unlocked.', 'success');
        }
        
        // Update UI
        this.updateAllUI();
        
        // Clean URL
        const url = new URL(window.location.href);
        url.searchParams.delete('payment');
        url.searchParams.delete('session_id');
        window.history.replaceState({}, '', url.toString());
      }, 500);
    }
  }

  /**
   * Check AI generation limit before generating
   */
  checkAILimit() {
    const result = featureGating.canGenerateAI();
    if (!result.allowed) {
      showUpgradeModal('ai-limit');
      return false;
    }
    return true;
  }

  /**
   * Record AI generation after successful generation
   */
  recordAIGeneration() {
    featureGating.recordAIGeneration();
    this.updateUsageDisplay();
  }

  /**
   * Check save limit before saving
   */
  checkSaveLimit() {
    const result = featureGating.canSaveChart();
    if (!result.allowed) {
      showUpgradeModal('save-limit');
      return false;
    }
    return true;
  }

  /**
   * Record chart save
   */
  recordChartSave() {
    featureGating.recordChartSave();
    this.updateUsageDisplay();
  }
}

// Create singleton
const proFeatures = new ProFeaturesIntegration();

// Auto-init when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => proFeatures.init());
} else {
  proFeatures.init();
}

// Expose globally
window.proFeatures = proFeatures;

export default proFeatures;
export { ProFeaturesIntegration };
