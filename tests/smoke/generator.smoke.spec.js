/**
 * Generator Page Smoke Tests
 * Verifies core functionality: modals, chart generation, export, save/load
 * 
 * Run: npx playwright test tests/smoke/generator.smoke.spec.js
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Generator Page Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/generator.html`);
    await page.waitForLoadState('networkidle');
  });

  test.describe('Modal Functionality', () => {
    test('Auth modal opens and closes correctly', async ({ page }) => {
      // Open auth modal
      await page.click('#auth-signin');
      await expect(page.locator('#auth-modal')).toBeVisible();
      
      // Close via close button
      await page.click('#close-auth-modal');
      await expect(page.locator('#auth-modal')).toBeHidden();
      
      // Open again and close via ESC
      await page.click('#auth-signin');
      await expect(page.locator('#auth-modal')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('#auth-modal')).toBeHidden();
      
      // Open again and close via backdrop
      await page.click('#auth-signin');
      await expect(page.locator('#auth-modal')).toBeVisible();
      await page.locator('#auth-modal').click({ position: { x: 5, y: 5 } });
      await expect(page.locator('#auth-modal')).toBeHidden();
    });

    test('Save Project modal opens and closes correctly', async ({ page }) => {
      // Fill prompt and generate to enable save
      await page.fill('#prompt-input', 'Test chart for save');
      await page.click('#generate-chart');
      await page.waitForTimeout(2000);
      
      // Open save modal
      await page.click('#save-project');
      
      // Modal should be visible (or toast warning if no chart)
      const modalVisible = await page.locator('#save-project-modal').isVisible();
      
      if (modalVisible) {
        // Close via close button
        await page.click('#close-save-modal');
        await expect(page.locator('#save-project-modal')).toBeHidden();
        
        // Open again and close via ESC
        await page.click('#save-project');
        await expect(page.locator('#save-project-modal')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.locator('#save-project-modal')).toBeHidden();
      }
    });

    test('Load Projects modal opens and closes correctly', async ({ page }) => {
      // Open projects modal
      await page.click('#load-projects');
      await expect(page.locator('#projects-modal')).toBeVisible();
      
      // Close via close button
      await page.click('#close-projects-modal');
      await expect(page.locator('#projects-modal')).toBeHidden();
      
      // Open again and close via ESC
      await page.click('#load-projects');
      await expect(page.locator('#projects-modal')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('#projects-modal')).toBeHidden();
    });
  });

  test.describe('Chart Generation', () => {
    test('Generate button creates chart preview', async ({ page }) => {
      // Fill prompt
      await page.fill('#prompt-input', 'Create a bar chart showing quarterly sales: Q1=100, Q2=150, Q3=200, Q4=250');
      
      // Click generate
      await page.click('#generate-chart');
      
      // Wait for generation (loading state or chart appears)
      await page.waitForTimeout(3000);
      
      // Check for chart container content change or canvas element
      const chartContainer = page.locator('#chart-container');
      const hasCanvas = await chartContainer.locator('canvas').count() > 0;
      const hasContent = await chartContainer.evaluate(el => el.innerHTML.length > 100);
      
      expect(hasCanvas || hasContent).toBeTruthy();
    });

    test('Chart type selection updates UI', async ({ page }) => {
      // Select line chart
      await page.click('.chart-option[data-type="line"]');
      
      // Verify selection
      const lineOption = page.locator('.chart-option[data-type="line"]');
      await expect(lineOption).toHaveAttribute('aria-pressed', 'true');
      
      // Select pie chart
      await page.click('.chart-option[data-type="pie"]');
      
      // Verify pie is selected and line is deselected
      const pieOption = page.locator('.chart-option[data-type="pie"]');
      await expect(pieOption).toHaveAttribute('aria-pressed', 'true');
      await expect(lineOption).toHaveAttribute('aria-pressed', 'false');
    });

    test('Quick prompts fill input and select chart type', async ({ page }) => {
      const quickPrompt = page.locator('#quick-prompts [data-prompt]').first();
      
      if (await quickPrompt.isVisible()) {
        await quickPrompt.click();
        await page.waitForTimeout(500);
        
        // Check if chart type was selected
        const hasSelection = await page.locator('.chart-option.selected, .chart-option[aria-pressed="true"]').count() > 0;
        expect(hasSelection).toBeTruthy();
      }
    });
  });

  test.describe('Export Functionality', () => {
    test('Export menu opens and shows options', async ({ page }) => {
      // Open export menu
      await page.click('#export-menu-button');
      
      // Check menu is visible
      const exportMenu = page.locator('#export-menu');
      await expect(exportMenu).toBeVisible();
      
      // Check export options exist
      await expect(page.locator('.export-menu-option[data-format="png"]')).toBeVisible();
      await expect(page.locator('.export-menu-option[data-format="svg"]')).toBeVisible();
      await expect(page.locator('.export-menu-option[data-format="pdf"]')).toBeVisible();
    });

    test('Export options are clickable', async ({ page }) => {
      // Generate a chart first
      await page.fill('#prompt-input', 'Simple bar chart');
      await page.click('#generate-chart');
      await page.waitForTimeout(2000);
      
      // Open export menu
      await page.click('#export-menu-button');
      await page.waitForTimeout(300);
      
      // Click PNG export (should trigger download or show feedback)
      const pngOption = page.locator('.export-menu-option[data-format="png"]');
      if (await pngOption.isVisible()) {
        await pngOption.click();
        // Export should trigger some action (download, toast, etc.)
        await page.waitForTimeout(500);
      }
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('Mobile menu toggle works', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Toggle should be visible
      const toggle = page.locator('#mobile-menu-toggle');
      await expect(toggle).toBeVisible();
      
      // Click toggle
      await toggle.click();
      await page.waitForTimeout(300);
      
      // Menu should be visible
      const mobileMenu = page.locator('#mobile-menu');
      const isExpanded = await toggle.getAttribute('aria-expanded');
      expect(isExpanded === 'true' || await mobileMenu.isVisible()).toBeTruthy();
    });

    test('Mobile auth button opens modal', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Open mobile menu
      await page.click('#mobile-menu-toggle');
      await page.waitForTimeout(300);
      
      // Click mobile sign in
      const mobileSignIn = page.locator('#auth-signin-mobile');
      if (await mobileSignIn.isVisible()) {
        await mobileSignIn.click();
        await expect(page.locator('#auth-modal')).toBeVisible();
      }
    });
  });
});
