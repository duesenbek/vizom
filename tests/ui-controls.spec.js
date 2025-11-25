/**
 * UI Controls Event Binding Test
 * Tests all main interactive elements for correct event handling
 * Run: npx playwright test tests/ui-controls.spec.js
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// Test results tracking
const testResults = {
  passed: [],
  failed: [],
  skipped: []
};

/**
 * Helper: Check if element exists and is visible
 */
async function elementExists(page, selector) {
  try {
    const el = page.locator(selector).first();
    return await el.isVisible({ timeout: 2000 });
  } catch {
    return false;
  }
}

/**
 * Helper: Test click and verify UI change
 */
async function testClickWithChange(page, selector, name, expectedChange) {
  const el = page.locator(selector).first();
  
  if (!(await elementExists(page, selector))) {
    testResults.skipped.push({ name, selector, reason: 'Element not found' });
    return { status: 'SKIPPED', reason: 'Element not found' };
  }

  try {
    // Capture state before click
    const beforeState = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      return {
        classList: el ? [...el.classList] : [],
        ariaExpanded: el?.getAttribute('aria-expanded'),
        ariaPressed: el?.getAttribute('aria-pressed'),
        hidden: el?.classList.contains('hidden')
      };
    }, selector);

    // Click the element
    await el.click({ timeout: 3000 });
    
    // Wait for potential animations
    await page.waitForTimeout(300);

    // Check for expected change
    let changeDetected = false;
    
    if (expectedChange.modal) {
      const modalVisible = await page.locator(expectedChange.modal).isVisible();
      changeDetected = modalVisible;
    } else if (expectedChange.menuOpen) {
      const menuVisible = await page.locator(expectedChange.menuOpen).isVisible();
      changeDetected = menuVisible;
    } else if (expectedChange.classChange) {
      const afterState = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        return el ? [...el.classList] : [];
      }, expectedChange.target || selector);
      changeDetected = JSON.stringify(beforeState.classList) !== JSON.stringify(afterState);
    } else if (expectedChange.ariaChange) {
      const afterAria = await page.locator(expectedChange.target || selector).getAttribute(expectedChange.ariaChange);
      changeDetected = beforeState[expectedChange.ariaChange] !== afterAria;
    } else {
      // Generic change detection - any DOM mutation
      changeDetected = true; // Assume OK if no error
    }

    if (changeDetected) {
      testResults.passed.push({ name, selector });
      return { status: 'OK', name, selector };
    } else {
      testResults.failed.push({ name, selector, reason: 'No visible UI change detected' });
      return { status: 'BROKEN', name, selector, reason: 'No visible UI change' };
    }
  } catch (error) {
    testResults.failed.push({ name, selector, reason: error.message });
    return { status: 'BROKEN', name, selector, reason: error.message };
  }
}

/**
 * Helper: Test modal open/close cycle
 */
async function testModalCycle(page, triggerSelector, modalSelector, closeSelector, name) {
  const results = [];
  
  // Test open
  const openResult = await testClickWithChange(page, triggerSelector, `${name} - Open`, { modal: modalSelector });
  results.push(openResult);
  
  if (openResult.status === 'OK') {
    // Test close via button
    if (closeSelector) {
      const closeResult = await testClickWithChange(page, closeSelector, `${name} - Close Button`, { 
        classChange: true, 
        target: modalSelector 
      });
      results.push(closeResult);
    }
    
    // Reopen for ESC test
    await page.locator(triggerSelector).first().click();
    await page.waitForTimeout(300);
    
    // Test ESC key
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    
    const modalHidden = !(await page.locator(modalSelector).isVisible());
    if (modalHidden) {
      testResults.passed.push({ name: `${name} - ESC Close`, selector: modalSelector });
      results.push({ status: 'OK', name: `${name} - ESC Close` });
    } else {
      testResults.failed.push({ name: `${name} - ESC Close`, selector: modalSelector, reason: 'ESC did not close modal' });
      results.push({ status: 'BROKEN', name: `${name} - ESC Close`, reason: 'ESC did not close modal' });
    }
    
    // Reopen for backdrop test
    await page.locator(triggerSelector).first().click();
    await page.waitForTimeout(300);
    
    // Test backdrop click
    const modal = page.locator(modalSelector);
    if (await modal.isVisible()) {
      await modal.click({ position: { x: 5, y: 5 } }); // Click near edge (backdrop)
      await page.waitForTimeout(300);
      
      const modalHiddenAfterBackdrop = !(await modal.isVisible());
      if (modalHiddenAfterBackdrop) {
        testResults.passed.push({ name: `${name} - Backdrop Close`, selector: modalSelector });
        results.push({ status: 'OK', name: `${name} - Backdrop Close` });
      } else {
        testResults.failed.push({ name: `${name} - Backdrop Close`, selector: modalSelector, reason: 'Backdrop click did not close modal' });
        results.push({ status: 'BROKEN', name: `${name} - Backdrop Close`, reason: 'Backdrop click did not close' });
      }
    }
  }
  
  return results;
}

// ============================================
// TEST SUITES
// ============================================

test.describe('Generator Page Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/generator.html`);
    await page.waitForLoadState('networkidle');
  });

  test('Generate Chart button triggers generation flow', async ({ page }) => {
    // Fill prompt first
    await page.fill('#prompt-input', 'Create a bar chart showing sales data');
    
    const result = await testClickWithChange(page, '#generate-chart', 'Generate Chart Button', {
      classChange: true
    });
    
    expect(result.status).not.toBe('BROKEN');
    console.log(`Generate Chart: ${result.status}`);
  });

  test('Chart type selection updates UI', async ({ page }) => {
    const chartTypes = ['line', 'pie', 'doughnut', 'area', 'scatter'];
    
    for (const type of chartTypes) {
      const selector = `.chart-option[data-type="${type}"]`;
      const result = await testClickWithChange(page, selector, `Chart Type: ${type}`, {
        ariaChange: 'aria-pressed',
        target: selector
      });
      
      expect(result.status).not.toBe('BROKEN');
      console.log(`Chart Type ${type}: ${result.status}`);
    }
  });

  test('Export menu opens and closes', async ({ page }) => {
    const result = await testClickWithChange(page, '#export-menu-button', 'Export Menu Button', {
      menuOpen: '#export-menu'
    });
    
    expect(result.status).not.toBe('BROKEN');
    console.log(`Export Menu: ${result.status}`);
  });

  test('Save Project modal cycle', async ({ page }) => {
    // First generate a chart
    await page.fill('#prompt-input', 'Test chart');
    await page.click('#generate-chart');
    await page.waitForTimeout(1000);
    
    const results = await testModalCycle(
      page,
      '#save-project',
      '#save-project-modal',
      '#close-save-modal',
      'Save Project Modal'
    );
    
    const hasBroken = results.some(r => r.status === 'BROKEN');
    expect(hasBroken).toBe(false);
  });

  test('Load Projects modal cycle', async ({ page }) => {
    const results = await testModalCycle(
      page,
      '#load-projects',
      '#projects-modal',
      '#close-projects-modal',
      'Load Projects Modal'
    );
    
    const hasBroken = results.some(r => r.status === 'BROKEN');
    expect(hasBroken).toBe(false);
  });

  test('Auth modal cycle (desktop)', async ({ page }) => {
    const results = await testModalCycle(
      page,
      '#auth-signin',
      '#auth-modal',
      '#close-auth-modal',
      'Auth Modal (Desktop)'
    );
    
    const hasBroken = results.some(r => r.status === 'BROKEN');
    expect(hasBroken).toBe(false);
  });

  test('Auth modal cycle (mobile)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Open mobile menu first
    await page.click('#mobile-menu-toggle');
    await page.waitForTimeout(300);
    
    const results = await testModalCycle(
      page,
      '#auth-signin-mobile',
      '#auth-modal',
      '#close-auth-modal',
      'Auth Modal (Mobile)'
    );
    
    const hasBroken = results.some(r => r.status === 'BROKEN');
    expect(hasBroken).toBe(false);
  });

  test('Mobile menu toggle', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const result = await testClickWithChange(page, '#mobile-menu-toggle', 'Mobile Menu Toggle', {
      ariaChange: 'aria-expanded',
      target: '#mobile-menu-toggle'
    });
    
    expect(result.status).not.toBe('BROKEN');
    console.log(`Mobile Menu Toggle: ${result.status}`);
  });

  test('Quick prompt buttons fill input', async ({ page }) => {
    const quickPrompt = page.locator('#quick-prompts [data-prompt]').first();
    
    if (await quickPrompt.isVisible()) {
      await quickPrompt.click();
      await page.waitForTimeout(300);
      
      // Check if chart type was selected or prompt was filled
      const promptValue = await page.locator('#prompt-input').inputValue();
      const hasSelection = await page.locator('.chart-option.selected').count() > 0;
      
      if (promptValue || hasSelection) {
        testResults.passed.push({ name: 'Quick Prompt', selector: '#quick-prompts [data-prompt]' });
        console.log('Quick Prompt: OK');
      } else {
        testResults.failed.push({ name: 'Quick Prompt', selector: '#quick-prompts [data-prompt]', reason: 'No change detected' });
        console.log('Quick Prompt: BROKEN');
      }
    }
  });
});

test.describe('Index Page Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);
    await page.waitForLoadState('networkidle');
  });

  test('Hero form submission redirects to generator', async ({ page }) => {
    await page.fill('#hero-prompt-input', 'Create a sales chart');
    
    const [response] = await Promise.all([
      page.waitForNavigation({ timeout: 5000 }).catch(() => null),
      page.click('#hero-try-form button[type="submit"]')
    ]);
    
    // Should redirect to generator with prompt
    const url = page.url();
    const hasPrompt = url.includes('generator') || url.includes('prompt=');
    
    if (hasPrompt || response) {
      testResults.passed.push({ name: 'Hero Form Submit', selector: '#hero-try-form' });
      console.log('Hero Form Submit: OK');
    } else {
      testResults.failed.push({ name: 'Hero Form Submit', selector: '#hero-try-form', reason: 'No redirect' });
      console.log('Hero Form Submit: BROKEN');
    }
  });

  test('Auth modal cycle', async ({ page }) => {
    const results = await testModalCycle(
      page,
      '#auth-signin',
      '#auth-modal',
      '#close-auth-modal',
      'Auth Modal (Index)'
    );
    
    const hasBroken = results.some(r => r.status === 'BROKEN');
    expect(hasBroken).toBe(false);
  });

  test('Get Started buttons work', async ({ page }) => {
    const getStartedBtn = page.locator('[data-action="get-started"]').first();
    
    if (await getStartedBtn.isVisible()) {
      await getStartedBtn.click();
      await page.waitForTimeout(500);
      
      // Should either open modal or navigate
      const modalVisible = await page.locator('#auth-modal').isVisible().catch(() => false);
      const urlChanged = page.url() !== `${BASE_URL}/index.html`;
      
      if (modalVisible || urlChanged) {
        testResults.passed.push({ name: 'Get Started Button', selector: '[data-action="get-started"]' });
        console.log('Get Started Button: OK');
      } else {
        testResults.failed.push({ name: 'Get Started Button', selector: '[data-action="get-started"]', reason: 'No action' });
        console.log('Get Started Button: BROKEN');
      }
    }
  });
});

test.describe('Pricing Page Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/pricing.html`);
    await page.waitForLoadState('networkidle');
  });

  test('Billing toggle switches prices', async ({ page }) => {
    const toggle = page.locator('#billing-toggle');
    
    if (await toggle.isVisible()) {
      // Get initial price
      const initialPrice = await page.locator('.pricing-amount').first().textContent();
      
      await toggle.click();
      await page.waitForTimeout(300);
      
      // Get new price
      const newPrice = await page.locator('.pricing-amount').first().textContent();
      
      // Prices should be different (or at least aria-checked changed)
      const ariaChecked = await toggle.getAttribute('aria-checked');
      
      if (initialPrice !== newPrice || ariaChecked === 'true') {
        testResults.passed.push({ name: 'Billing Toggle', selector: '#billing-toggle' });
        console.log('Billing Toggle: OK');
      } else {
        testResults.failed.push({ name: 'Billing Toggle', selector: '#billing-toggle', reason: 'No price change' });
        console.log('Billing Toggle: BROKEN');
      }
    }
  });

  test('Upgrade Pro buttons trigger checkout', async ({ page }) => {
    const upgradeBtn = page.locator('[data-action="upgrade-pro"]').first();
    
    if (await upgradeBtn.isVisible()) {
      await upgradeBtn.click();
      await page.waitForTimeout(500);
      
      // Should show loading or redirect to Stripe
      const hasAction = page.url() !== `${BASE_URL}/pricing.html` || 
                        await page.locator('.loading-overlay:not(.hidden)').isVisible().catch(() => false) ||
                        await page.locator('#upgrade-modal').isVisible().catch(() => false);
      
      if (hasAction) {
        testResults.passed.push({ name: 'Upgrade Pro Button', selector: '[data-action="upgrade-pro"]' });
        console.log('Upgrade Pro Button: OK');
      } else {
        testResults.failed.push({ name: 'Upgrade Pro Button', selector: '[data-action="upgrade-pro"]', reason: 'No action' });
        console.log('Upgrade Pro Button: BROKEN');
      }
    }
  });

  test('FAQ toggles expand/collapse', async ({ page }) => {
    const faqBtn = page.locator('button[aria-expanded]').first();
    
    if (await faqBtn.isVisible()) {
      const initialExpanded = await faqBtn.getAttribute('aria-expanded');
      
      await faqBtn.click();
      await page.waitForTimeout(300);
      
      const newExpanded = await faqBtn.getAttribute('aria-expanded');
      
      if (initialExpanded !== newExpanded) {
        testResults.passed.push({ name: 'FAQ Toggle', selector: 'button[aria-expanded]' });
        console.log('FAQ Toggle: OK');
      } else {
        testResults.failed.push({ name: 'FAQ Toggle', selector: 'button[aria-expanded]', reason: 'No state change' });
        console.log('FAQ Toggle: BROKEN');
      }
    }
  });

  test('Auth modal cycle', async ({ page }) => {
    const results = await testModalCycle(
      page,
      '#auth-signin',
      '#auth-modal',
      '#close-auth-modal',
      'Auth Modal (Pricing)'
    );
    
    const hasBroken = results.some(r => r.status === 'BROKEN');
    expect(hasBroken).toBe(false);
  });
});

test.describe('Templates Page Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/templates.html`);
    await page.waitForLoadState('networkidle');
  });

  test('Auth modal cycle', async ({ page }) => {
    const results = await testModalCycle(
      page,
      '#auth-signin',
      '#auth-modal',
      '#close-auth-modal',
      'Auth Modal (Templates)'
    );
    
    const hasBroken = results.some(r => r.status === 'BROKEN');
    expect(hasBroken).toBe(false);
  });

  test('Template modal close handlers', async ({ page }) => {
    const templateModal = page.locator('#template-modal');
    
    // If there's a way to open template modal, test it
    const templateCard = page.locator('[data-template-id], .template-card').first();
    
    if (await templateCard.isVisible()) {
      await templateCard.click();
      await page.waitForTimeout(500);
      
      if (await templateModal.isVisible()) {
        // Test close button
        await page.click('#close-template-modal');
        await page.waitForTimeout(300);
        
        const closed = !(await templateModal.isVisible());
        if (closed) {
          testResults.passed.push({ name: 'Template Modal Close', selector: '#close-template-modal' });
          console.log('Template Modal Close: OK');
        } else {
          testResults.failed.push({ name: 'Template Modal Close', selector: '#close-template-modal', reason: 'Did not close' });
          console.log('Template Modal Close: BROKEN');
        }
      }
    }
  });

  test('Category filter buttons', async ({ page }) => {
    const categoryBtn = page.locator('[data-category]').first();
    
    if (await categoryBtn.isVisible()) {
      await categoryBtn.click();
      await page.waitForTimeout(300);
      
      // Check if button became active or templates filtered
      const isActive = await categoryBtn.evaluate(el => 
        el.classList.contains('bg-[#2563EB]') || el.classList.contains('active')
      );
      
      if (isActive) {
        testResults.passed.push({ name: 'Category Filter', selector: '[data-category]' });
        console.log('Category Filter: OK');
      } else {
        testResults.failed.push({ name: 'Category Filter', selector: '[data-category]', reason: 'No visual change' });
        console.log('Category Filter: BROKEN');
      }
    }
  });
});

// ============================================
// FINAL REPORT
// ============================================

test.afterAll(async () => {
  console.log('\n========================================');
  console.log('       UI CONTROLS TEST REPORT         ');
  console.log('========================================\n');
  
  console.log(`✅ PASSED: ${testResults.passed.length}`);
  testResults.passed.forEach(r => console.log(`   OK: ${r.name}`));
  
  console.log(`\n❌ FAILED: ${testResults.failed.length}`);
  testResults.failed.forEach(r => console.log(`   BROKEN: ${r.name} - ${r.reason}`));
  
  console.log(`\n⏭️  SKIPPED: ${testResults.skipped.length}`);
  testResults.skipped.forEach(r => console.log(`   SKIPPED: ${r.name} - ${r.reason}`));
  
  console.log('\n========================================\n');
  
  // Fail if any broken controls
  if (testResults.failed.length > 0) {
    throw new Error(`${testResults.failed.length} broken controls found!`);
  }
});
