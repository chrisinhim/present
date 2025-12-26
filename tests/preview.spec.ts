
import { test, expect, Page } from '@playwright/test';

test.describe('Live Preview', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('file:///c:/Workspaces/Present/index.html');
  });

  test('FR-20: should update the preview as settings are changed', async ({ page }) => {
    // Text update
    await page.locator('#presentationText').fill('Preview Text');
    await expect(page.locator('#preview-content')).toHaveText('Preview Text');

    // Style update
    await page.locator('.tab-button', { hasText: 'Style' }).click();
    await page.locator('#fontSize').fill('6');
    await expect(page.locator('#preview-content')).toHaveCSS('font-size', '96px'); // Assuming 6vw and 1600px width
    await page.locator('#textColor').fill('#0000ff');
    await page.locator('#applySolidColor').click();
    await expect(page.locator('#preview-content')).toHaveCSS('color', 'rgb(0, 0, 255)');

    // Background update
    await page.locator('.tab-button', { hasText: 'Background' }).click();
    await page.locator('#presentationBgColor').fill('#cccccc');
    await expect(page.locator('#preview-section')).toHaveCSS('background-color', 'rgb(204, 204, 204)');
  
    // Position update
    await page.locator('.tab-button', { hasText: 'Position' }).click();
    await page.locator('button[data-align-group="h"][data-align="left"]').click();
    await expect(page.locator('#preview-section')).toHaveCSS('justify-content', 'flex-start');
  });
});
