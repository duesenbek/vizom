/**
 * Upgrade Modal Component
 * Shows Pro features and pricing when Free users try to access Pro features
 */

import { PRICING, PRO_FEATURES } from '../config/subscription.js';

class UpgradeModal {
  constructor() {
    this.modal = null;
    this.isYearly = false;
    this.blockedFeature = null;
    this.init();
  }

  init() {
    this.createModal();
    this.bindEvents();
  }

  createModal() {
    // Check if modal already exists
    if (document.getElementById('upgrade-modal')) {
      this.modal = document.getElementById('upgrade-modal');
      return;
    }

    const modalHTML = `
      <div id="upgrade-modal" class="fixed inset-0 z-50 hidden overflow-y-auto">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" id="upgrade-modal-backdrop"></div>
        
        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative w-full max-w-lg transform rounded-2xl bg-white shadow-2xl transition-all">
            <!-- Close button -->
            <button id="upgrade-modal-close" class="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors">
              <i class="fas fa-times text-xl"></i>
            </button>
            
            <!-- Header -->
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 rounded-t-2xl text-center">
              <div class="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1 text-white text-sm font-medium mb-4">
                <i class="fas fa-crown"></i>
                <span>VIZOM Pro</span>
              </div>
              <h2 class="text-2xl font-bold text-white mb-2">Unlock All Features</h2>
              <p id="upgrade-modal-reason" class="text-blue-100 text-sm">Get unlimited access to all chart types, templates, and exports</p>
            </div>
            
            <!-- Pricing Toggle -->
            <div class="px-6 py-4 border-b border-slate-100">
              <div class="flex items-center justify-center gap-4">
                <span class="text-sm font-medium" id="monthly-label">Monthly</span>
                <button id="billing-toggle" class="relative w-14 h-7 bg-slate-200 rounded-full transition-colors" role="switch" aria-checked="false">
                  <span class="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform" id="toggle-knob"></span>
                </button>
                <span class="text-sm font-medium" id="yearly-label">
                  Yearly
                  <span class="ml-1 text-xs text-green-600 font-semibold">Save 20%</span>
                </span>
              </div>
            </div>
            
            <!-- Price Display -->
            <div class="px-6 py-6 text-center">
              <div class="flex items-baseline justify-center gap-1">
                <span class="text-4xl font-bold text-slate-900" id="price-amount">$${PRICING.PRO_MONTHLY}</span>
                <span class="text-slate-500">/month</span>
              </div>
              <p class="text-sm text-slate-500 mt-1" id="price-note">Billed monthly</p>
            </div>
            
            <!-- Features List -->
            <div class="px-6 pb-6">
              <ul class="space-y-3">
                ${PRO_FEATURES.slice(0, 6).map(feature => `
                  <li class="flex items-center gap-3 text-sm">
                    <span class="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <i class="fas fa-check text-xs"></i>
                    </span>
                    <span class="text-slate-700">${feature.title}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
            
            <!-- CTA Button -->
            <div class="px-6 pb-6">
              <button id="upgrade-cta-btn" class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25">
                <i class="fas fa-rocket mr-2"></i>
                Upgrade to Pro
              </button>
              <p class="text-center text-xs text-slate-400 mt-3">
                <i class="fas fa-lock mr-1"></i>
                Secure payment via Stripe • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('upgrade-modal');
  }

  bindEvents() {
    // Close button
    document.getElementById('upgrade-modal-close')?.addEventListener('click', () => this.hide());
    
    // Backdrop click
    document.getElementById('upgrade-modal-backdrop')?.addEventListener('click', () => this.hide());
    
    // Billing toggle
    document.getElementById('billing-toggle')?.addEventListener('click', () => this.toggleBilling());
    
    // Upgrade button
    document.getElementById('upgrade-cta-btn')?.addEventListener('click', () => this.handleUpgrade());
    
    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modal?.classList.contains('hidden')) {
        this.hide();
      }
    });
  }

  toggleBilling() {
    this.isYearly = !this.isYearly;
    
    const toggle = document.getElementById('billing-toggle');
    const knob = document.getElementById('toggle-knob');
    const priceAmount = document.getElementById('price-amount');
    const priceNote = document.getElementById('price-note');
    const monthlyLabel = document.getElementById('monthly-label');
    const yearlyLabel = document.getElementById('yearly-label');
    
    if (this.isYearly) {
      toggle.classList.add('bg-blue-600');
      toggle.classList.remove('bg-slate-200');
      knob.style.transform = 'translateX(28px)';
      priceAmount.textContent = `$${PRICING.PRO_YEARLY_MONTHLY}`;
      priceNote.textContent = `$${PRICING.PRO_YEARLY_TOTAL}/year billed annually`;
      monthlyLabel.classList.remove('text-slate-900');
      monthlyLabel.classList.add('text-slate-400');
      yearlyLabel.classList.add('text-slate-900');
      yearlyLabel.classList.remove('text-slate-400');
    } else {
      toggle.classList.remove('bg-blue-600');
      toggle.classList.add('bg-slate-200');
      knob.style.transform = 'translateX(0)';
      priceAmount.textContent = `$${PRICING.PRO_MONTHLY}`;
      priceNote.textContent = 'Billed monthly';
      monthlyLabel.classList.add('text-slate-900');
      monthlyLabel.classList.remove('text-slate-400');
      yearlyLabel.classList.remove('text-slate-900');
      yearlyLabel.classList.add('text-slate-400');
    }
    
    console.log('[UpgradeModal] Billing toggled to:', this.isYearly ? 'yearly' : 'monthly');
  }

  show(reason = null) {
    this.blockedFeature = reason;
    
    // Update reason text if provided
    if (reason) {
      const reasonEl = document.getElementById('upgrade-modal-reason');
      if (reasonEl) {
        const reasons = {
          'template': 'This premium template is available with Pro',
          'export': 'SVG, PDF & JSON export available with Pro',
          'ai-limit': 'You\'ve reached your daily AI generation limit (5/day)',
          'save-limit': 'You\'ve reached your chart save limit (3 charts)',
          'default': 'Get 30+ premium templates, unlimited AI & advanced exports'
        };
        reasonEl.textContent = reasons[reason] || reasons.default;
      }
    }
    
    this.modal?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    console.log('[UpgradeModal] Shown for reason:', reason);
  }

  hide() {
    this.modal?.classList.add('hidden');
    document.body.style.overflow = '';
    console.log('[UpgradeModal] Hidden');
  }

  async handleUpgrade() {
    console.log('[UpgradeModal] Upgrade clicked, billing:', this.isYearly ? 'yearly' : 'monthly');
    
    const btn = document.getElementById('upgrade-cta-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
    btn.disabled = true;
    
    try {
      // Call Stripe checkout
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: this.isYearly ? 'price_yearly' : 'price_monthly',
          billingPeriod: this.isYearly ? 'yearly' : 'monthly'
        })
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('[UpgradeModal] Checkout error:', error);
      btn.innerHTML = originalText;
      btn.disabled = false;
      
      // Show error toast
      if (window.uiFeedback?.showToast) {
        window.uiFeedback.showToast('Failed to start checkout. Please try again.', 'error');
      }
    }
  }
}

// Create singleton instance
let upgradeModalInstance = null;

export function getUpgradeModal() {
  if (!upgradeModalInstance) {
    upgradeModalInstance = new UpgradeModal();
  }
  return upgradeModalInstance;
}

export function showUpgradeModal(reason = null) {
  getUpgradeModal().show(reason);
}

export function hideUpgradeModal() {
  getUpgradeModal().hide();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => getUpgradeModal());
} else {
  getUpgradeModal();
}

export default UpgradeModal;
