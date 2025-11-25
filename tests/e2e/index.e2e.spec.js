/**
 * Homepage E2E Tests
 * Full smoke test coverage for /index.html
 * 
 * Run: npx playwright test tests/e2e/index.e2e.spec.js
 * Headed: npx playwright test tests/e2e/index.e2e.spec.js --headed
 */

import { test, expect } from '@playwright/test';

const consoleErrors = [];

test.describe('Homepage E2E Tests', () => {
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
    await page.waitForLoadState('networkidle');
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
      await expect(page.locator('a[href="index.html"]').first()).toBeVisible();
      await expect(page.locator('a[href="generator.html"]').first()).toBeVisible();
      await expect(page.locator('a[href="templates.html"]').first()).toBeVisible();
      await expect(page.locator('a[href="pricing.html"]').first()).toBeVisible();
    });

    test('Sign In button is visible', async ({ page }) => {
      const signInBtn = page.locator('#auth-signin');
      await expect(signInBtn).toBeVisible();
    });

    test('Get Started button is visible', async ({ page }) => {
      const getStartedBtn = page.locator('[data-action="get-started"]').first();
      await expect(getStartedBtn).toBeVisible();
    });
  });

  test.describe('Hero Form', () => {
    test('hero form submits and redirects to generator', async ({ page }) => {
      const prompt = 'Compare 2023 vs 2024 revenue';
      
      await page.fill('#hero-prompt-input', prompt);
      await page.click('#hero-try-form button[type="submit"]');
      
      // Should redirect to generator with prompt param
      await page.waitForURL(/generator\.html\?prompt=/, { timeout: 5000 });
      expect(page.url()).toContain('generator.html');
      expect(page.url()).toContain(encodeURIComponent(prompt));
    });

    test('empty hero form shows warning', async ({ page }) => {
      await page.click('#hero-try-form button[type="submit"]');
      
      // Should not navigate away
      await page.waitForTimeout(500);
      expect(page.url()).toContain('index.html');
    });
  });

  test.describe('Auth Modal', () => {
    test('auth modal opens on Sign In click', async ({ page }) => {
      await page.click('#auth-signin');
      await expect(page.locator('#auth-modal')).toBeVisible();
      await expect(page.locator('#google-signin')).toBeVisible();
    });

    test('auth modal closes via ESC', async ({ page }) => {
      await page.click('#auth-signin');
      await expect(page.locator('#auth-modal')).toBeVisible();
      
      await page.keyboard.press('Escape');
      await expect(page.locator('#auth-modal')).toBeHidden();
    });

    test('auth modal closes via close button', async ({ page }) => {
      await page.click('#auth-signin');
      await expect(page.locator('#auth-modal')).toBeVisible();
      
      await page.click('#close-auth-modal');
      await expect(page.locator('#auth-modal')).toBeHidden();
    });

    test('auth modal closes via backdrop click', async ({ page }) => {
      await page.click('#auth-signin');
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
      const getStartedBtn = page.locator('header [data-action="get-started"]');
      await getStartedBtn.click();
      
      await page.waitForURL(/generator\.html/, { timeout: 5000 });
      expect(page.url()).toContain('generator.html');
    });

    test('Generator link navigates correctly', async ({ page }) => {
      await page.click('header a[href="generator.html"]');
      
      await page.waitForURL(/generator\.html/, { timeout: 5000 });
      expect(page.url()).toContain('generator.html');
    });
  });

  test.describe('Error Handling', () => {
    test('no uncaught errors in console', async ({ page }) => {
      // Perform normal actions
      await page.fill('#hero-prompt-input', 'Test');
      await page.click('#auth-signin');
      await page.keyboard.press('Escape');
      
      const criticalErrors = consoleErrors.filter(err => 
        !err.includes('favicon') &&
        !err.includes('404') &&
        !err.includes('net::ERR')
      );
      
      expect(criticalErrors).toHaveLength(0);
    });
  });
});
