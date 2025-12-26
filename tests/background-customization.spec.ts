
import { test, expect, Page } from '@playwright/test';

test.describe('Background Customization', () => {
  let presentationWindow: Page;

  test.beforeEach(async ({ page }) => {
    await page.goto('file:///c:/Workspaces/Present/index.html');
    
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('#toggleWindowButton').click(),
    ]);
    presentationWindow = popup;
    await presentationWindow.waitForLoadState();

    await page.locator('#presentationText').fill('Background Test');
    await page.locator('#playPauseButton').click();
    await page.locator('.tab-button', { hasText: 'Background' }).click();
  });

  test('FR-14, FR-15: should apply presentation and text backgrounds', async ({ page }) => {
    // FR-14: Presentation Background Color
    await page.locator('#presentationBgColor').fill('#ff0000');
    await page.locator('#presentationBgColor').dispatchEvent('change');
    await expect(presentationWindow.locator('body')).toHaveCSS('background-color', 'rgb(255, 0, 0)');

    // FR-15: Text Background
    await page.locator('#textBackgroundToggle').check();
    await page.locator('#textBackgroundColor').fill('#00ff00');
    await page.locator('#textBackgroundColor').dispatchEvent('change');
    await expect(presentationWindow.locator('#content')).toHaveCSS('background-color', 'rgb(0, 255, 0)');
    
    // Disable text background
    await page.locator('#textBackgroundToggle').uncheck();
    await expect(presentationWindow.locator('#content')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  });
});
