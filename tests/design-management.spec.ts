
import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Design Management', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('file:///c:/Workspaces/Present/index.html');
  });

  test('FR-21, FR-22: should save and load design settings', async ({ page }) => {
    // Change some settings
    await page.locator('.tab-button', { hasText: 'Style' }).click();
    await page.locator('#textColor').fill('#ff00ff');
    await page.locator('#textColor').dispatchEvent('change');
    await page.locator('#applySolidColor').click();
    await page.locator('#fontSize').fill('7');
    
    // Save the design
    await page.locator('.tab-button', { hasText: 'File' }).click();
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#saveDesignButton').click(),
    ]);

    const downloadsPath = path.join(__dirname, '..', 'test-results', 'downloads');
    if (!fs.existsSync(downloadsPath)) {
        fs.mkdirSync(downloadsPath, { recursive: true });
    }
    const filePath = path.join(downloadsPath, download.suggestedFilename());
    await download.saveAs(filePath);

    // Reset settings
    await page.reload();

    // Load the design
    await page.locator('.tab-button', { hasText: 'File' }).click();
    await page.locator('#loadDesignInput').setInputFiles(filePath);

    // Check if settings are restored
    await page.locator('.tab-button', { hasText: 'Style' }).click();
    await expect(page.locator('#textColor')).toHaveValue('#ff00ff');
    await expect(page.locator('#fontSize')).toHaveValue('7');
  });
});
