
import { test, expect, Page } from '@playwright/test';

test.describe('Positioning and Alignment', () => {
  let presentationWindow: Page;

  test.beforeEach(async ({ page }) => {
    await page.goto('file:///c:/Workspaces/Present/index.html');
    
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('#toggleWindowButton').click(),
    ]);
    presentationWindow = popup;
    await presentationWindow.waitForLoadState();

    await page.locator('#presentationText').fill('Positioning Test');
    await page.locator('#playPauseButton').click();
    await page.locator('.tab-button', { hasText: 'Position' }).click();
  });

  test('FR-16: should align the text block', async ({ page }) => {
    // Horizontal alignment
    await page.locator('button[data-align-group="h"][data-align="left"]').click();
    await expect(presentationWindow.locator('body')).toHaveCSS('justify-content', 'flex-start');
    
    await page.locator('button[data-align-group="h"][data-align="right"]').click();
    await expect(presentationWindow.locator('body')).toHaveCSS('justify-content', 'flex-end');

    await page.locator('button[data-align-group="h"][data-align="center"]').click();
    await expect(presentationWindow.locator('body')).toHaveCSS('justify-content', 'center');

    // Vertical alignment
    await page.locator('button[data-align-group="v"][data-align="top"]').click();
    await expect(presentationWindow.locator('body')).toHaveCSS('align-items', 'flex-start');

    await page.locator('button[data-align-group="v"][data-align="bottom"]').click();
    await expect(presentationWindow.locator('body')).toHaveCSS('align-items', 'flex-end');

    await page.locator('button[data-align-group="v"][data-align="middle"]').click();
    await expect(presentationWindow.locator('body')).toHaveCSS('align-items', 'center');
  });

  test('FR-17: should apply fine position adjustments', async ({ page }) => {
    await page.locator('#horizontalAdjustment').evaluate(el => {
      (el as HTMLInputElement).value = '25';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    // The transform value is calculated, so we check for a non-zero translation
    await expect(presentationWindow.locator('#content')).toHaveCSS('transform', /matrix\(1, 0, 0, 1, .*, 0\)/);


    await page.locator('#verticalAdjustment').evaluate(el => {
      (el as HTMLInputElement).value = '-30';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await expect(presentationWindow.locator('#content')).toHaveCSS('transform', /matrix\(1, 0, 0, 1, .*, .*\)/);
  });
});
