import { test, expect } from '@playwright/test';

test('test index page', async ({ page }) => {
  await page.goto('file:///C:/Workspaces/Present/index.html');
  await page.getByRole('heading', { name: 'Presentation Controller' }).click();
  await page.getByRole('heading', { name: 'Presentation Controller' }).click();
  await expect(page.locator('h1')).toContainText('Presentation Controller');
  await expect(page.locator('#preview-content')).toContainText('Preview Text');
  await page.getByText('Presentation Controller Preview Text Main Style Background Position File Enter').click();
  await expect(page.getByRole('textbox', { name: 'Enter Text to Present:' })).toBeEmpty();
  await expect(page.getByRole('textbox', { name: 'Enter Text to Present:' })).toBeEmpty();
  await expect(page.getByRole('button', { name: 'PLAY' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'HIDE' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open Presentation Window' })).toBeVisible();
});