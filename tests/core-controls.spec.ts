
import { test, expect, Page } from '@playwright/test';

test.describe('Core Presentation Controls', () => {
  let presentationWindow: Page;

  test.beforeEach(async ({ page }) => {
    await page.goto('file:///c:/Workspaces/Present/index.html');
  });

  test('FR-02: should present text to the presentation window', async ({ page }) => {
    await page.locator('#presentationText').fill('Hello World');

    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('#playPauseButton').click(),
    ]);

    presentationWindow = popup;
    await presentationWindow.waitForLoadState();

    const content = await presentationWindow.locator('#content').textContent();
    expect(content).toBe('Hello World');
  });

  test('FR-02.2: should show an alert if presentation text is empty', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Please enter some text to present.');
      await dialog.dismiss();
    });

    await page.locator('#presentationText').fill('');
    await page.locator('#playPauseButton').click();
  });

  test('FR-02.3: should present text on Enter key press', async ({ page }) => {
    await page.locator('#presentationText').fill('Hello from Enter');

    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('#presentationText').press('Enter'),
    ]);

    presentationWindow = popup;
    await presentationWindow.waitForLoadState();

    const content = await presentationWindow.locator('#content').textContent();
    expect(content).toBe('Hello from Enter');
  });

  test('FR-03: should hide the text in the presentation window', async ({ page }) => {
    await page.locator('#presentationText').fill('Hide Me');

    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('#playPauseButton').click(),
    ]);

    presentationWindow = popup;
    await presentationWindow.waitForLoadState();

    await page.locator('#hideButton').click();

    const content = await presentationWindow.locator('#content');
    await expect(content).toHaveText('');
    await expect(content).toBeHidden();
  });

  test('FR-04, FR-05, FR-06: should handle duration, hold, and seek bar', async ({ page }) => {
    await page.locator('#presentationDuration').fill('3');
    await page.locator('#presentationText').fill('Auto-hide test');

    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('#playPauseButton').click(),
    ]);
    presentationWindow = popup;
    await presentationWindow.waitForLoadState();

    // FR-06: Check seek bar starts
    await expect(page.locator('#seek-bar')).toHaveCSS('width', /%$/);

    // Wait for the seek bar to be around 50%
    await page.waitForFunction(async () => {
        const el = document.querySelector('#seek-bar');
        if (!el) return false;
        const width = parseFloat(el.style.width);
        return width > 40 && width < 60;
    }, null, { timeout: 2000 });
    
    const seekBar1 = await page.locator('#seek-bar').evaluate(el => el.style.width);

    // FR-05: Test Hold button
    await page.locator('#playPauseButton').click(); // PAUSE
    const seekBarWidthOnPause = await page.locator('#seek-bar').evaluate(el => el.style.width);

    const seekBarWidthAfterPause = await page.locator('#seek-bar').evaluate(el => el.style.width);
    expect(seekBarWidthAfterPause).toBe(seekBarWidthOnPause);
    await expect(presentationWindow.locator('#content')).toBeVisible();

    await page.locator('#playPauseButton').click(); // RESUME

    // FR-04: Auto-hide
    await expect(presentationWindow.locator('#content')).toBeHidden({ timeout: 2000 });
  });
});
