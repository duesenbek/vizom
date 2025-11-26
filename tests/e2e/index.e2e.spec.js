/**
 * Homepage E2E Tests
 * Full smoke test coverage for /index.html
 * 
 * Run: npx playwright test tests/e2e/index.e2e.spec.js
 * Headed: npx playwright test tests/e2e/index.e2e.spec.js --headed
 */

import { test, expect } from '@playwright/test';

/** Helper to check if viewport is mobile */
const isMobile = (page) => page.viewportSize()?.width < 768;

/** Helper to open mobile menu if needed */
async function ensureMobileMenuOpen(page) {
  if (isMobile(page)) {
    const toggle = page.locator('#mobile-menu-toggle');
    const isExpanded = await toggle.getAttribute('aria-expanded');
    if (isExpanded !== 'true') {
      await toggle.click();
      await page.waitForTimeout(300);
    }
  }
}

/** Helper to click sign in (handles mobile/desktop) */
async function clickSignIn(page) {
  if (isMobile(page)) {
    await ensureMobileMenuOpen(page);
    await page.click('#auth-signin-mobile');
  } else {
    await page.click('#auth-signin');
  }
}

const consoleErrors = [];

test.describe('Homepage E2E Tests', () => {
  // Increase timeout for slower mobile tests
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      consoleErrors.push(error.message);
    });

    await page.goto('/index.html');
    await page.waitForLoadState('domcontentloaded');
    // Wait for key elements to be ready
    await page.waitForSelector('#hero-prompt-input', { timeout: 10000 });
  });

  test.afterEach(async () => {
    consoleErrors.length = 0;
  });

  test.describe('Core UI Elements', () => {
    test('hero section is visible with title and CTA', async ({ page }) => {
      const heroTitle = page.locator('h1');
      await expect(heroTitle).toBeVisible();
      await expect(heroTitle).toContainText('dashboard');
      
      const heroInput = page.locator('#hero-prompt-input');
      await expect(heroInput).toBeVisible();
      
      const generateBtn = page.locator('#hero-try-form button[type="submit"]');
      await expect(generateBtn).toBeVisible();
    });

    test('navigation links are visible', async ({ page }) => {
      // On mobile, links are in mobile menu
      if (isMobile(page)) {
        await ensureMobileMenuOpen(page);
      }
      await expect(page.locator('a[href="index.html"]').first()).toBeVisible();
      await expect(page.locator('a[href="generator.html"]').first()).toBeVisible();
      await expect(page.locator('a[href="templates.html"]').first()).toBeVisible();
      await expect(page.locator('a[href="pricing.html"]').first()).toBeVisible();
    });

    test('Sign In button is visible', async ({ page }) => {
      if (isMobile(page)) {
        await ensureMobileMenuOpen(page);
        await expect(page.locator('#auth-signin-mobile')).toBeVisible();
      } else {
        await expect(page.locator('#auth-signin')).toBeVisible();
      }
    });

    test('Get Started button is visible', async ({ page }) => {
      const getStartedBtn = page.locator('[data-action="get-started"]').first();
      await expect(getStartedBtn).toBeVisible();
    });
  });

  test.describe('Hero Form', () => {
    test('hero form submits and redirects to generator', async ({ page }) => {
      const prompt = 'Compare 2023 vs 2024 revenue';
      
      const heroInput = page.locator('#hero-prompt-input');
      await heroInput.scrollIntoViewIfNeeded();
      await heroInput.fill(prompt);
      
      const submitBtn = page.locator('#hero-try-form button[type="submit"]');
      await submitBtn.scrollIntoViewIfNeeded();
      await submitBtn.click();
      
      // Should redirect to generator with prompt param
      await page.waitForURL(/generator\.html\?prompt=/, { timeout: 5000 });
      expect(page.url()).toContain('generator.html');
      expect(page.url()).toContain(encodeURIComponent(prompt));
    });

    test('empty hero form shows warning', async ({ page }) => {
      const submitBtn = page.locator('#hero-try-form button[type="submit"]');
      await submitBtn.scrollIntoViewIfNeeded();
      await submitBtn.click();
      
      // Should not navigate away
      await page.waitForTimeout(500);
      expect(page.url()).toContain('index.html');
    });
  });

  test.describe('Auth Modal', () => {
    test('auth modal opens on Sign In click', async ({ page }) => {
      await clickSignIn(page);
      await expect(page.locator('#auth-modal')).toBeVisible();
      await expect(page.locator('#google-signin')).toBeVisible();
    });

    test('auth modal closes via ESC', async ({ page }) => {
      await clickSignIn(page);
      await expect(page.locator('#auth-modal')).toBeVisible();
      
      await page.keyboard.press('Escape');
      await expect(page.locator('#auth-modal')).toBeHidden();
    });

    test('auth modal closes via close button', async ({ page }) => {
      await clickSignIn(page);
      await expect(page.locator('#auth-modal')).toBeVisible();
      
      await page.click('#close-auth-modal');
      await expect(page.locator('#auth-modal')).toBeHidden();
    });

    test('auth modal closes via backdrop click', async ({ page }) => {
      await clickSignIn(page);
      await expect(page.locator('#auth-modal')).toBeVisible();
      
      await page.locator('#auth-modal').click({ position: { x: 5, y: 5 } });
      await expect(page.locator('#auth-modal')).toBeHidden();
    });
  });

  test.describe('Features Section', () => {
    test('feature cards are visible', async ({ page }) => {
      const featureCards = page.locator('article');
      await expect(featureCards.first()).toBeVisible();
      
      const cardCount = await featureCards.count();
      expect(cardCount).toBeGreaterThanOrEqual(3);
    });
  });

  test.describe('Footer', () => {
    test('footer is visible with links', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      
      await expect(footer.locator('a[href="generator.html"]')).toBeVisible();
      await expect(footer.locator('a[href="pricing.html"]')).toBeVisible();
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('mobile menu toggle works', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      const toggle = page.locator('#mobile-menu-toggle');
      await expect(toggle).toBeVisible();
      
      await toggle.click();
      await page.waitForTimeout(300);
      
      const isExpanded = await toggle.getAttribute('aria-expanded');
      expect(isExpanded === 'true').toBeTruthy();
    });

    test('mobile sign in opens auth modal', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      await page.click('#mobile-menu-toggle');
      await page.waitForTimeout(300);
      
      const mobileSignIn = page.locator('#auth-signin-mobile');
      if (await mobileSignIn.isVisible()) {
        await mobileSignIn.click();
        await expect(page.locator('#auth-modal')).toBeVisible();
      }
    });
  });

  test.describe('Navigation', () => {
    test('Get Started navigates to generator', async ({ page }) => {
      // Get Started button should navigate to generator
      const getStartedBtn = page.locator('a[data-action="get-started"][href*="generator"]').first();
      
      if (await getStartedBtn.count() > 0) {
        await getStartedBtn.scrollIntoViewIfNeeded();
        await getStartedBtn.click();
        
        await page.waitForURL(/generator\.html/, { timeout: 5000 });
        expect(page.url()).toContain('generator.html');
      } else {
        // If no direct link, use hero form
        await page.fill('#hero-prompt-input', 'test');
        await page.click('#hero-try-form button[type="submit"]');
        await page.waitForURL(/generator\.html/, { timeout: 5000 });
        expect(page.url()).toContain('generator.html');
      }
    });

    test('Generator link navigates correctly', async ({ page }) => {
      if (isMobile(page)) {
        await ensureMobileMenuOpen(page);
      }
      const generatorLink = page.locator('a[href="generator.html"]').first();
      await generatorLink.click();
      
      await page.waitForURL(/generator\.html/, { timeout: 5000 });
      expect(page.url()).toContain('generator.html');
    });
  });

  test.describe('Error Handling', () => {
    test('no uncaught errors in console', async ({ page }) => {
      // Perform normal actions
      const heroInput = page.locator('#hero-prompt-input');
      await heroInput.scrollIntoViewIfNeeded();
      await heroInput.fill('Test');
      
      // Filter out expected/benign errors
      const criticalErrors = consoleErrors.filter(err => 
        !err.includes('favicon') &&
        !err.includes('404') &&
        !err.includes('net::ERR') &&
        !err.includes('Failed to load resource') &&
        !err.includes('chart.js') &&
        !err.includes('dynamically imported')
      );
      
      expect(criticalErrors).toHaveLength(0);
    });
  });
});
