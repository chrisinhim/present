
import { test, expect, Page } from '@playwright/test';

test.describe('Presentation Window Management', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('file:///c:/Workspaces/Present/index.html');
  });

  test('FR-07, FR-08: should toggle the presentation window and update status', async ({ page }) => {
    // Initial state
    await expect(page.locator('#windowStatus')).toHaveText('Closed');
    await expect(page.locator('#toggleWindowButton')).toHaveText('Open Presentation Window');

    // Open window
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('#toggleWindowButton').click(),
    ]);
    await popup.waitForLoadState();

    await expect(page.locator('#windowStatus')).toHaveText('Open');
    await expect(page.locator('#toggleWindowButton')).toHaveText('Close Presentation Window');
    expect(popup.isClosed()).toBe(false);

    // Close window
    await page.locator('#toggleWindowButton').click();
    await popup.waitForEvent('close');

    await expect(page.locator('#windowStatus')).toHaveText('Closed');
    await expect(page.locator('#toggleWindowButton')).toHaveText('Open Presentation Window');
    expect(popup.isClosed()).toBe(true);
  });
});
