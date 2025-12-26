
import { test, expect, Page } from '@playwright/test';

test.describe('Input Assistance & History', () => {
  let presentationWindow: Page;

  test.beforeEach(async ({ page }) => {
    await page.goto('file:///c:/Workspaces/Present/index.html');
  });

  test.describe('History (FR-19)', () => {
    test.beforeEach(async ({ page }) => {
        const [popup] = await Promise.all([
            page.waitForEvent('popup'),
            page.locator('#toggleWindowButton').click(),
        ]);
        presentationWindow = popup;
        await presentationWindow.waitForLoadState();
    });

    test('should add items to history, re-present, delete, and clear history', async ({ page }) => {
      // Add items to history
      await page.locator('#presentationText').fill('History item 1');
      await page.locator('#playPauseButton').click();
      await page.locator('#presentationText').fill('History item 2');
      await page.locator('#playPauseButton').click();

      const historyItems = page.locator('.history-item');
      await expect(historyItems).toHaveCount(2);

      // Re-present from history
      await historyItems.nth(1).locator('button', { hasText: 'Present' }).click();
      await expect(presentationWindow.locator('#content')).toHaveText('History item 1');

      // Delete an item
      await historyItems.nth(0).locator('button', { hasText: '❌' }).click();
      await expect(historyItems).toHaveCount(1);
      await expect(page.locator('.history-text')).toHaveText('History item 1');
      
      // Clear all history
      page.on('dialog', async (dialog) => {
        await dialog.accept();
      });
      await page.locator('#clearHistoryButton').click();
      await expect(page.locator('#historyContainer')).toContainText('No history yet.');
    });
  });
  
  test.describe('Autocomplete (FR-18)', () => {
    test('should show autocomplete suggestions and allow selection', async ({ page }) => {
        await page.locator('#presentationText').type('Jo');
        const suggestions = page.locator('#autocomplete-suggestions');
        await expect(suggestions).toBeVisible();
        await expect(suggestions.locator('.suggestion-item')).toContainText(['John']);
    
        await page.locator('#presentationText').press('ArrowDown');
        await page.locator('#presentationText').press('Enter');
    
        await expect(page.locator('#presentationText')).toHaveValue('John ');
      });
  });
});
