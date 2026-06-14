import { test, expect } from '@playwright/test';

test.describe('Checkout Flow UI', () => {
  test('should load the games catalog', async ({ page }) => {
    await page.goto('/games');
    const heading = page.locator('h1:has-text("Katalog Game")');
    await expect(heading).toBeVisible();
  });

  test('should load the checkout page empty state', async ({ page }) => {
    await page.goto('/checkout');
    // Without selecting a game, it should show Data Kosong
    const emptyState = page.locator('text=Data Kosong');
    await expect(emptyState).toBeVisible();
  });
});
