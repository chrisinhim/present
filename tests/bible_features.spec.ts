import { test, expect } from '@playwright/test';

test.describe('Bible Department Features', () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.click('.department-btn[data-dept="bible"]');
    });

    test('Autocomplete suggestions for Bible books', async ({ page }) => {
        const input = page.locator('#bible-text');
        await input.fill('Gen');
        
        const suggestions = page.locator('.autocomplete-suggestion');
        await expect(suggestions).toBeVisible();
        await expect(suggestions).toContainText(['Genesis']);
    });

    test('Selecting autocomplete suggestion with mouse', async ({ page }) => {
        const input = page.locator('#bible-text');
        await input.fill('Exo');
        
        await page.click('.autocomplete-suggestion:has-text("Exodus")');
        await expect(input).toHaveValue('Exodus ');
    });

    test('Selecting autocomplete suggestion with Tab key', async ({ page }) => {
        const input = page.locator('#bible-text');
        await input.fill('Lev');
        
        await page.keyboard.press('Tab');
        await expect(input).toHaveValue('Leviticus ');
    });

    test('Navigating suggestions with Arrow keys and selecting with Space', async ({ page }) => {
        const input = page.locator('#bible-text');
        await input.fill('Mat'); // Should match Matthew
        
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press(' ');
        await expect(input).toHaveValue('Matthew ');
    });

    test('Validation for empty presentation', async ({ page }) => {
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Please enter some text to show on the screen');
            await dialog.dismiss();
        });
        
        await page.click('#btn-present-bible');
    });
});
