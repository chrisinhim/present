
import { test, expect, Page } from '@playwright/test';

test.describe('Content Styling & Formatting', () => {
  let presentationWindow: Page;

  test.beforeEach(async ({ page }) => {
    await page.goto('file:///c:/Workspaces/Present/index.html');
    
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('#toggleWindowButton').click(),
    ]);
    presentationWindow = popup;
    await presentationWindow.waitForLoadState();

    await page.locator('#presentationText').fill('Styling Test');
    await page.locator('#playPauseButton').click();
    await page.locator('.tab-button', { hasText: 'Style' }).click();
  });

  test('FR-10.1, FR-10.2, FR-10.3, FR-11: should apply font family, size, color and styles', async ({ page }) => {
    // FR-10.1: Font Family
    await page.locator('#fontFamily').selectOption('Georgia, serif');
    await expect(presentationWindow.locator('#content')).toHaveCSS('font-family', 'Georgia, serif');

    // FR-10.2: Font Size
    await page.locator('#fontSize').fill('5');
    await expect(presentationWindow.locator('#content')).toHaveCSS('font-size', '80px'); // 5vw of 1600px width is 80px. Playwright uses a 1280x720 viewport by default, so it might be different. Let's find out.

    // FR-10.3: Font Color
    await page.locator('#textColor').fill('#ff0000');
    await page.locator('#applySolidColor').click();
    await expect(presentationWindow.locator('#content')).toHaveCSS('color', 'rgb(255, 0, 0)');

    // FR-11: Font Style
    await page.locator('button[data-style="fontWeight"]').click(); // Bold
    await expect(presentationWindow.locator('#content')).toHaveCSS('font-weight', '700');

    await page.locator('button[data-style="fontStyle"]').click(); // Italic
    await expect(presentationWindow.locator('#content')).toHaveCSS('font-style', 'italic');

    await page.locator('button[data-style="textDecoration"]').click(); // Underline
    await expect(presentationWindow.locator('#content')).toHaveCSS('text-decoration-line', 'underline');
  
    await page.locator('button[data-style="textTransform"][data-on="uppercase"]').click(); // Uppercase
    await expect(presentationWindow.locator('#content')).toHaveCSS('text-transform', 'uppercase');
  });

  test('FR-10.4: should apply gradient to the text', async ({ page }) => {
    await page.locator('#gradientColor1').fill('#ff0000');
    await page.locator('#gradientColor2').fill('#0000ff');
    await page.locator('#gradientDirection').selectOption('to right');
    await page.locator('#applyGradient').click();

    await expect(presentationWindow.locator('#content')).toHaveCSS('background-image', 'linear-gradient(to right, rgb(255, 0, 0), rgb(0, 0, 255))');
  });
});
