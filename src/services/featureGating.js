/**
 * Feature Gating Service
 * Controls access to Pro features based on subscription status
 */

import { SUBSCRIPTION_TIERS, FEATURE_LIMITS, CHART_TYPES, EXPORT_FORMATS } from '../config/subscription.js';

class FeatureGatingService {
  constructor() {
    this.currentTier = SUBSCRIPTION_TIERS.FREE;
    this.usageToday = {
      aiGenerations: 0,
      savedCharts: 0,
      lastReset: new Date().toDateString()
    };
    this.loadUsageFromStorage();
    this.loadTierFromStorage();
    
    console.log('[FeatureGating] Initialized with tier:', this.currentTier);
  }

  /**
   * Load usage data from localStorage
   */
  loadUsageFromStorage() {
    try {
      const stored = localStorage.getItem('vizom_usage');
      if (stored) {
        const data = JSON.parse(stored);
        // Reset if new day
        if (data.lastReset !== new Date().toDateString()) {
          this.resetDailyUsage();
        } else {
          this.usageToday = data;
        }
      }
    } catch (e) {
      console.warn('[FeatureGating] Failed to load usage:', e);
    }
  }

  /**
   * Load subscription tier from localStorage/user data
   */
  loadTierFromStorage() {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        this.currentTier = userData.subscription || SUBSCRIPTION_TIERS.FREE;
      }
      
      // Also check for subscription status
      const subscription = localStorage.getItem('vizom_subscription');
      if (subscription) {
        const subData = JSON.parse(subscription);
        if (subData.status === 'active' && new Date(subData.expiresAt) > new Date()) {
          this.currentTier = SUBSCRIPTION_TIERS.PRO;
        }
      }
    } catch (e) {
      console.warn('[FeatureGating] Failed to load tier:', e);
    }
  }

  /**
   * Save usage to localStorage
   */
  saveUsage() {
    try {
      localStorage.setItem('vizom_usage', JSON.stringify(this.usageToday));
    } catch (e) {
      console.warn('[FeatureGating] Failed to save usage:', e);
    }
  }

  /**
   * Reset daily usage counters
   */
  resetDailyUsage() {
    this.usageToday = {
      aiGenerations: 0,
      savedCharts: parseInt(localStorage.getItem('vizom_saved_charts_count') || '0'),
      lastReset: new Date().toDateString()
    };
    this.saveUsage();
    console.log('[FeatureGating] Daily usage reset');
  }

  /**
   * Get current feature limits
   */
  getLimits() {
    return FEATURE_LIMITS[this.currentTier];
  }

  /**
   * Check if user is Pro
   */
  isPro() {
    const result = this.currentTier === SUBSCRIPTION_TIERS.PRO;
    console.log('[FeatureGating] isPro check:', result);
    return result;
  }

  /**
   * Set user as Pro (after successful payment)
   */
  setProStatus(expiresAt) {
    this.currentTier = SUBSCRIPTION_TIERS.PRO;
    localStorage.setItem('vizom_subscription', JSON.stringify({
      status: 'active',
      tier: SUBSCRIPTION_TIERS.PRO,
      expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
    console.log('[FeatureGating] Pro status activated');
    
    // Dispatch event for UI updates
    document.dispatchEvent(new CustomEvent('subscription:changed', {
      detail: { tier: SUBSCRIPTION_TIERS.PRO }
    }));
  }

  /**
   * Remove Pro status
   */
  removeProStatus() {
    this.currentTier = SUBSCRIPTION_TIERS.FREE;
    localStorage.removeItem('vizom_subscription');
    console.log('[FeatureGating] Pro status removed');
    
    document.dispatchEvent(new CustomEvent('subscription:changed', {
      detail: { tier: SUBSCRIPTION_TIERS.FREE }
    }));
  }

  // ============================================
  // FEATURE ACCESS CHECKS
  // ============================================

  /**
   * Check if chart type is accessible
   */
  canUseChartType(chartType) {
    const limits = this.getLimits();
    const allowed = limits.chartTypes.includes(chartType);
    console.log(`[FeatureGating] Chart type "${chartType}" access:`, allowed);
    return allowed;
  }

  /**
   * Check if template is accessible
   */
  canAccessTemplate(template) {
    if (this.isPro()) return true;
    
    const isPremium = template.isPro || template.tier === 'pro';
    const allowed = !isPremium;
    console.log(`[FeatureGating] Template "${template.title || template.id}" access:`, allowed, isPremium ? '(PRO)' : '(FREE)');
    return allowed;
  }

  /**
   * Check if export format is accessible
   */
  canExportFormat(format) {
    const limits = this.getLimits();
    const allowed = limits.exportFormats.includes(format);
    console.log(`[FeatureGating] Export format "${format}" access:`, allowed);
    return allowed;
  }

  /**
   * Check if user can generate with AI
   */
  canGenerateAI() {
    const limits = this.getLimits();
    if (limits.aiGenerationsPerDay === Infinity) {
      console.log('[FeatureGating] AI generation: unlimited (Pro)');
      return { allowed: true, remaining: Infinity };
    }
    
    const remaining = limits.aiGenerationsPerDay - this.usageToday.aiGenerations;
    const allowed = remaining > 0;
    console.log(`[FeatureGating] AI generation: ${allowed ? 'allowed' : 'blocked'}, remaining: ${remaining}/${limits.aiGenerationsPerDay}`);
    return { allowed, remaining, limit: limits.aiGenerationsPerDay };
  }

  /**
   * Record an AI generation
   */
  recordAIGeneration() {
    this.usageToday.aiGenerations++;
    this.saveUsage();
    console.log('[FeatureGating] AI generation recorded, total today:', this.usageToday.aiGenerations);
  }

  /**
   * Check if user can save more charts
   */
  canSaveChart() {
    const limits = this.getLimits();
    if (limits.maxSavedCharts === Infinity) {
      console.log('[FeatureGating] Chart save: unlimited (Pro)');
      return { allowed: true, remaining: Infinity };
    }
    
    const remaining = limits.maxSavedCharts - this.usageToday.savedCharts;
    const allowed = remaining > 0;
    console.log(`[FeatureGating] Chart save: ${allowed ? 'allowed' : 'blocked'}, remaining: ${remaining}/${limits.maxSavedCharts}`);
    return { allowed, remaining, limit: limits.maxSavedCharts };
  }

  /**
   * Record a saved chart
   */
  recordChartSave() {
    this.usageToday.savedCharts++;
    localStorage.setItem('vizom_saved_charts_count', this.usageToday.savedCharts.toString());
    this.saveUsage();
    console.log('[FeatureGating] Chart save recorded, total:', this.usageToday.savedCharts);
  }

  /**
   * Check if watermark should be shown
   */
  shouldShowWatermark() {
    const show = this.getLimits().watermark;
    console.log('[FeatureGating] Watermark:', show);
    return show;
  }

  /**
   * Check if upgrade prompts should be shown
   */
  shouldShowUpgradePrompts() {
    return this.getLimits().showUpgradePrompts;
  }

  /**
   * Get accessible chart types
   */
  getAccessibleChartTypes() {
    const limits = this.getLimits();
    return Object.entries(CHART_TYPES).map(([id, config]) => ({
      id,
      ...config,
      accessible: limits.chartTypes.includes(id)
    }));
  }

  /**
   * Get accessible export formats
   */
  getAccessibleExportFormats() {
    const limits = this.getLimits();
    return Object.entries(EXPORT_FORMATS).map(([id, config]) => ({
      id,
      ...config,
      accessible: limits.exportFormats.includes(id)
    }));
  }

  /**
   * Get usage stats for display
   */
  getUsageStats() {
    const limits = this.getLimits();
    return {
      tier: this.currentTier,
      isPro: this.isPro(),
      aiGenerations: {
        used: this.usageToday.aiGenerations,
        limit: limits.aiGenerationsPerDay,
        remaining: limits.aiGenerationsPerDay === Infinity ? Infinity : limits.aiGenerationsPerDay - this.usageToday.aiGenerations
      },
      savedCharts: {
        used: this.usageToday.savedCharts,
        limit: limits.maxSavedCharts,
        remaining: limits.maxSavedCharts === Infinity ? Infinity : limits.maxSavedCharts - this.usageToday.savedCharts
      }
    };
  }
}

// Create singleton instance
const featureGating = new FeatureGatingService();

// Expose globally for debugging
window.featureGating = featureGating;

export default featureGating;
export { FeatureGatingService, SUBSCRIPTION_TIERS };
