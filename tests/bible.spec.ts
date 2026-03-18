import { test, expect } from '@playwright/test';

test.describe('Bible Department', () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Ensure Bible tab is active
        await page.click('.department-btn[data-dept="bible"]');
    });

    test('Fast scripture lookup via book abbreviations', async ({ page }) => {
        // Look at the selection grid
        const booksGrid = page.locator('#bible-books-grid');
        await expect(booksGrid).toBeVisible();
        
        // Assert we have standard abbreviations
        await expect(booksGrid.locator('button.book-btn:has-text("GEN")')).toBeVisible();
        await expect(booksGrid.locator('button.book-btn:has-text("EXO")')).toBeVisible();
        await expect(booksGrid.locator('button.book-btn:has-text("LEV")')).toBeVisible();
    });

    test('Selecting a specific verse grid', async ({ page }) => {
        await page.click('button.book-btn:has-text("GEN")');
        // Select chapter 3
        await page.click('#bible-chapters-grid button:has-text("3")');
        
        // Assert we see verses for Genesis 3
        const versesGrid = page.locator('#bible-verses-grid');
        await expect(versesGrid).toBeVisible();
        await expect(versesGrid.locator('button.verse-btn:has-text("3")')).toBeVisible();
    });

    test('Presenting a single verse (Reference vs Verse Text)', async ({ page }) => {
        // Wait for popup context
        const pagePromise = page.context().waitForEvent('page');
        await page.click('#btn-open-display');
        const popup = await pagePromise;
        await popup.waitForLoadState();

        // Select GEN 3:3
        await page.click('button.book-btn:has-text("GEN")');
        await page.click('#bible-chapters-grid button:has-text("3")');
        await page.click('#bible-verses-grid button.verse-btn:has-text("3")');

        // Note: The UI for "Present Reference Only" vs "Present Verse Text" 
        // implies a separate button, but we currently just use "Present"
        await page.click('#btn-present-bible');

        // Check window
        const content = popup.locator('#display');
        await expect(content).toContainText('Genesis 3:3');
    });

    test('Range selection and presentation', async ({ page }) => {
        // Wait for popup context
        const pagePromise = page.context().waitForEvent('page');
        await page.click('#btn-open-display');
        const popup = await pagePromise;
        await popup.waitForLoadState();

        await page.click('button.book-btn:has-text("GEN")');
        await page.click('#bible-chapters-grid button:has-text("3")');
        
        // Range select (click 3, shift click 8)
        await page.click('#bible-verses-grid button.verse-btn:has-text("3")');
        await page.click('#bible-verses-grid button.verse-btn:has-text("8")', { modifiers: ['Shift'] });
        
        await page.click('#btn-present-bible');

        // Check window
        const content = popup.locator('#display');
        await expect(content).toContainText('Genesis 3:3-8');
    });

    test('Show scripture using manual input box', async ({ page }) => {
        const pagePromise = page.context().waitForEvent('page');
        await page.click('#btn-open-display');
        const popup = await pagePromise;
        await popup.waitForLoadState();

        const input = page.locator('#bible-text');
        await input.fill('Joshua 5:118');
        await input.press('Enter');

        const content = popup.locator('#display');
        await expect(content).toContainText('Joshua 5:118');
    });

    test('Clearing the presentation', async ({ page }) => {
        const pagePromise = page.context().waitForEvent('page');
        await page.click('#btn-open-display');
        const popup = await pagePromise;
        await popup.waitForLoadState();

        // Present something
        await page.locator('#bible-text').fill('To clear');
        await page.locator('#bible-text').press('Enter');

        const content = popup.locator('#display');
        await expect(content).toBeVisible();

        // Clear presentation
        await page.click('#btn-remove-bible');

        // After removal animation completes, it should be empty
        await page.waitForTimeout(600);
        await expect(content).toBeHidden();
    });
});
