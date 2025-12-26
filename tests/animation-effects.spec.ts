
import { test, expect, Page } from '@playwright/test';

test.describe('Animation Effects', () => {
  let presentationWindow: Page;

  test.beforeEach(async ({ page }) => {
    await page.goto('file:///c:/Workspaces/Present/index.html');
    
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('#toggleWindowButton').click(),
    ]);
    presentationWindow = popup;
    await presentationWindow.waitForLoadState();
    
    await page.locator('.tab-button', { hasText: 'Style' }).click();
  });

  test('FR-12, FR-13: should apply entry and exit animations', async ({ page }) => {
    // FR-12: Entry Animation
    await page.locator('#entryAnimation').selectOption('fade-in');
    await page.locator('#presentationText').fill('Animation Test');
    await page.locator('#playPauseButton').click();

    await expect(presentationWindow.locator('#content')).toHaveClass(/animate-fade-in/);

    // FR-13: Exit Animation
    await page.locator('#exitAnimation').selectOption('fade-out');
    await page.locator('#hideButton').click();

    await expect(presentationWindow.locator('#content')).toHaveClass(/animate-fade-out/);
  });
});
