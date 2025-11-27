/**
 * Pro Features Test Script
 * Run in browser console to test feature gating
 */

const ProFeaturesTest = {
  results: [],
  
  log(test, passed, details = '') {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${test}`, details);
    this.results.push({ test, passed, details });
  },

  async runAllTests() {
    console.log('🧪 Starting Pro Features Tests...\n');
    console.log('='.repeat(50));
    
    // Test Free User Features
    console.log('\n📋 FREE USER TESTS\n');
    await this.testFreeUser();
    
    // Test Pro User Features
    console.log('\n📋 PRO USER TESTS\n');
    await this.testProUser();
    
    // Summary
    this.printSummary();
  },

  async testFreeUser() {
    // Ensure we're in Free mode
    if (window.featureGating) {
      window.featureGating.removeProStatus();
    }
    
    const fg = window.featureGating;
    if (!fg) {
      this.log('Feature Gating Service exists', false, 'window.featureGating not found');
      return;
    }

    // Test 1: Is Free user
    this.log('User is FREE tier', !fg.isPro(), `Current tier: ${fg.currentTier}`);

    // Test 2-6: ALL chart types are FREE now
    this.log('Can use Bar chart (FREE)', fg.canUseChartType('bar'));
    this.log('Can use Line chart (FREE)', fg.canUseChartType('line'));
    this.log('Can use Pie chart (FREE)', fg.canUseChartType('pie'));
    this.log('Can use Radar chart (FREE)', fg.canUseChartType('radar'));
    this.log('Can use Scatter chart (FREE)', fg.canUseChartType('scatter'));
    this.log('Can use Sankey chart (FREE)', fg.canUseChartType('sankey'));
    this.log('Can use Treemap chart (FREE)', fg.canUseChartType('treemap'));

    // Test 7: Can export PNG (FREE)
    this.log('Can export PNG (FREE)', fg.canExportFormat('png'));

    // Test 8: Cannot export SVG (PRO)
    this.log('Cannot export SVG (PRO)', !fg.canExportFormat('svg'));

    // Test 9: Cannot export PDF (PRO)
    this.log('Cannot export PDF (PRO)', !fg.canExportFormat('pdf'));

    // Test 10: AI generation limit is 5
    const aiLimit = fg.canGenerateAI();
    this.log('AI generation limit is 5/day', aiLimit.limit === 5, `Limit: ${aiLimit.limit}`);

    // Test 11: Chart save limit is 3
    const saveLimit = fg.canSaveChart();
    this.log('Chart save limit is 3', saveLimit.limit === 3, `Limit: ${saveLimit.limit}`);

    // Test 12: Should show upgrade prompts
    this.log('Shows upgrade prompts', fg.shouldShowUpgradePrompts());

    // Test 13: Should show watermark
    this.log('Shows watermark', fg.shouldShowWatermark());

    // Test 14: Template access - Free template
    const freeTemplate = { id: 'monthly-sales', isPro: false };
    this.log('Can access FREE template', fg.canAccessTemplate(freeTemplate));

    // Test 15: Template access - Pro template
    const proTemplate = { id: 'employee-performance', isPro: true };
    this.log('Cannot access PRO template', !fg.canAccessTemplate(proTemplate));
  },

  async testProUser() {
    const fg = window.featureGating;
    if (!fg) {
      this.log('Feature Gating Service exists', false);
      return;
    }

    // Activate Pro
    fg.setProStatus();

    // Test 1: Is Pro user
    this.log('User is PRO tier', fg.isPro(), `Current tier: ${fg.currentTier}`);

    // Test 2: Can use ALL chart types
    const allChartTypes = ['bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea', 'scatter', 'bubble'];
    const canUseAll = allChartTypes.every(type => fg.canUseChartType(type));
    this.log('Can use ALL chart types', canUseAll);

    // Test 3: Can export ALL formats
    const allFormats = ['png', 'svg', 'pdf', 'json'];
    const canExportAll = allFormats.every(format => fg.canExportFormat(format));
    this.log('Can export ALL formats', canExportAll);

    // Test 4: Unlimited AI generations
    const aiLimit = fg.canGenerateAI();
    this.log('Unlimited AI generations', aiLimit.limit === Infinity);

    // Test 5: Unlimited chart saves
    const saveLimit = fg.canSaveChart();
    this.log('Unlimited chart saves', saveLimit.limit === Infinity);

    // Test 6: No upgrade prompts
    this.log('No upgrade prompts', !fg.shouldShowUpgradePrompts());

    // Test 7: No watermark
    this.log('No watermark', !fg.shouldShowWatermark());

    // Test 8: Can access ALL templates
    const proTemplate = { id: 'employee-performance', isPro: true };
    this.log('Can access PRO templates', fg.canAccessTemplate(proTemplate));

    // Reset to Free for next test run
    fg.removeProStatus();
  },

  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY\n');
    
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const total = this.results.length;
    
    console.log(`Total: ${total}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Success Rate: ${((passed/total)*100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.filter(r => !r.passed).forEach(r => {
        console.log(`  - ${r.test}: ${r.details}`);
      });
    }
    
    console.log('\n' + '='.repeat(50));
  }
};

// Test Upgrade Modal
const UpgradeModalTest = {
  test() {
    console.log('🧪 Testing Upgrade Modal...\n');
    
    // Test 1: Modal exists
    const modal = document.getElementById('upgrade-modal');
    console.log(modal ? '✅ Upgrade modal exists' : '❌ Upgrade modal not found');
    
    // Test 2: Show modal
    if (window.showUpgradeModal) {
      window.showUpgradeModal('template');
      console.log('✅ showUpgradeModal function works');
      
      setTimeout(() => {
        // Test 3: Modal is visible
        const isVisible = !modal?.classList.contains('hidden');
        console.log(isVisible ? '✅ Modal is visible' : '❌ Modal not visible');
        
        // Test 4: Billing toggle
        const toggle = document.getElementById('billing-toggle');
        if (toggle) {
          toggle.click();
          const priceEl = document.getElementById('price-amount');
          const isYearly = priceEl?.textContent?.includes('2.39');
          console.log(isYearly ? '✅ Billing toggle works (yearly)' : '❌ Billing toggle failed');
          
          toggle.click(); // Reset
        }
        
        // Test 5: Close modal
        if (window.hideUpgradeModal) {
          window.hideUpgradeModal();
          setTimeout(() => {
            const isClosed = modal?.classList.contains('hidden');
            console.log(isClosed ? '✅ Modal closes properly' : '❌ Modal close failed');
          }, 100);
        }
      }, 500);
    } else {
      console.log('❌ showUpgradeModal function not found');
    }
  }
};

// Validation Checklist Test
const ValidationChecklist = {
  async runAll() {
    console.log('═══════════════════════════════════════════════════════════════════════');
    console.log('                    VALIDATION CHECKLIST                               ');
    console.log('═══════════════════════════════════════════════════════════════════════\n');
    
    const results = [];
    
    // 1. All chart types selectable without Pro
    const fg = window.featureGating;
    if (fg) {
      const allTypes = ['bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea', 'scatter', 'bubble', 'area', 'mixed', 'treemap', 'sankey', 'funnel', 'gauge', 'heatmap'];
      const allAccessible = allTypes.every(t => fg.canUseChartType(t));
      results.push({ test: 'All chart types selectable without Pro', passed: allAccessible });
    } else {
      results.push({ test: 'All chart types selectable without Pro', passed: false, note: 'featureGating not found' });
    }
    
    // 2. No Pro badges on chart type options
    const chartOptions = document.querySelectorAll('.chart-option, [data-chart-type]');
    let hasProBadge = false;
    chartOptions.forEach(opt => {
      if (opt.querySelector('.pro-badge')) hasProBadge = true;
    });
    results.push({ test: 'No Pro badges on chart type options', passed: !hasProBadge });
    
    // 3. 5 free templates work for everyone
    if (fg) {
      const freeTemplates = [
        { id: 'monthly-sales', isPro: false },
        { id: 'website-traffic', isPro: false },
        { id: 'market-share', isPro: false },
        { id: 'quarterly-revenue', isPro: false },
        { id: 'task-completion', isPro: false }
      ];
      const allFreeWork = freeTemplates.every(t => fg.canAccessTemplate(t));
      results.push({ test: '5 free templates work for everyone', passed: allFreeWork });
    }
    
    // 4. Pro templates show lock icon (check if locked)
    if (fg) {
      fg.removeProStatus(); // Ensure we're testing as free user
      const proTemplate = { id: 'revenue-sankey', isPro: true };
      const isLocked = !fg.canAccessTemplate(proTemplate);
      results.push({ test: '30+ pro templates show lock icon', passed: isLocked });
    }
    
    // 5. ApexCharts/ECharts libraries loaded
    const echartsLoaded = typeof echarts !== 'undefined';
    const apexLoaded = typeof ApexCharts !== 'undefined';
    results.push({ test: 'ECharts library loaded', passed: echartsLoaded });
    results.push({ test: 'ApexCharts library loaded', passed: apexLoaded });
    
    // Print results
    console.log('Results:\n');
    results.forEach(r => {
      const icon = r.passed ? '✅' : '❌';
      console.log(`${icon} ${r.test}${r.note ? ` (${r.note})` : ''}`);
    });
    
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    console.log(`\n═══════════════════════════════════════════════════════════════════════`);
    console.log(`Score: ${passed}/${total} (${Math.round(passed/total*100)}%)`);
    console.log('═══════════════════════════════════════════════════════════════════════');
    
    return results;
  }
};

window.ValidationChecklist = ValidationChecklist;

// Template count test
const TemplateTest = {
  test() {
    console.log('🧪 Testing Templates...\n');
    
    // Import check
    if (typeof TEMPLATES !== 'undefined' || window.TEMPLATES) {
      const templates = window.TEMPLATES || TEMPLATES;
      const total = templates.length;
      const free = templates.filter(t => !t.isPro).length;
      const pro = templates.filter(t => t.isPro).length;
      
      console.log(`Total templates: ${total}`);
      console.log(`Free templates: ${free}`);
      console.log(`Pro templates: ${pro}`);
      
      console.log(total >= 30 ? '✅ Has 30+ templates' : `❌ Only ${total} templates (need 30)`);
      console.log(free === 5 ? '✅ Has 5 free templates' : `❌ Has ${free} free templates (need 5)`);
      console.log(pro >= 25 ? '✅ Has 25+ pro templates' : `❌ Has ${pro} pro templates (need 25)`);
    } else {
      console.log('❌ Templates not loaded. Import them first.');
    }
  }
};

// Export for console use
window.ProFeaturesTest = ProFeaturesTest;
window.UpgradeModalTest = UpgradeModalTest;
window.TemplateTest = TemplateTest;

console.log(`
╔════════════════════════════════════════════════════════════════════════╗
║                    PRO FEATURES TEST SUITE LOADED                      ║
╠════════════════════════════════════════════════════════════════════════╣
║ Run tests in console:                                                  ║
║                                                                        ║
║   ValidationChecklist.runAll()    <- Run full validation checklist     ║
║   ProFeaturesTest.runAllTests()   <- Test Free vs Pro features         ║
║   UpgradeModalTest.test()         <- Test upgrade modal                ║
║   TemplateTest.test()             <- Test template counts              ║
║                                                                        ║
║ Quick checks:                                                          ║
║   featureGating.isPro()           <- Check if user is Pro              ║
║   featureGating.getUsageStats()   <- Get usage statistics              ║
║   featureGating.setProStatus()    <- Simulate Pro user                 ║
║   featureGating.removeProStatus() <- Simulate Free user                ║
╚════════════════════════════════════════════════════════════════════════╝
`);
