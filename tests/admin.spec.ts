import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard UI', () => {
  test('should load the dashboard layout properly', async ({ page }) => {
    // Navigate to admin page
    await page.goto('/admin');

    // Check if the glassmorphism header is present and contains "Dashboard Admin"
    const header = page.locator('h1:has-text("Dashboard Admin")');
    await expect(header).toBeVisible();

    // Validate Stats Grid loading or fully rendered state (Quick Actions widget)
    const quickActions = page.locator('text=Aksi Cepat');
    await expect(quickActions).toBeVisible();
    
    // Check if Pending Orders text is visible
    const pendingOrders = page.locator('text=pesanan pending');
    await expect(pendingOrders).toBeVisible();
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
