import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard UI', () => {
  test('should load the dashboard layout properly', async ({ page }) => {
    // Navigate to admin page
    await page.goto('/admin');

    // Check if the glassmorphism header is present and contains "Dashboard"
    const header = page.locator('h1:has-text("Dashboard")');
    await expect(header).toBeVisible();

    // Check if the "Live" badge is rendered
    const liveBadge = page.locator('text=Live');
    await expect(liveBadge).toBeVisible();

    // Validate Stats Grid loading or fully rendered state
    const statsGrid = page.locator('.grid-cols-1');
    await expect(statsGrid).toBeVisible();
    
    // Check if at least one metric card like "Revenue Hari Ini" is visible
    const revenueLabel = page.locator('text=Revenue Hari Ini');
    await expect(revenueLabel).toBeVisible();
  });

  test('should not have Hydration or Console errors on load', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/admin');
    
    // Wait for network idle to ensure all dynamic imports and canvases are mounted
    await page.waitForLoadState('networkidle');

    // No severe Next.js hydration errors should be present
    const hydrationErrors = consoleErrors.filter(err => err.includes('Hydration') || err.includes('window is not defined'));
    expect(hydrationErrors.length).toBe(0);
  });
});
