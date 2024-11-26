import { test, expect } from '@playwright/test';
import { BASE_URL } from '../config';

test.describe('[navigation]', () => {
  test('[drawer] drawer can be opened and closed', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.getByTestId('menu-open-button').click();
    await page.getByTestId('menu-close-button').click();
    await page.getByTestId('menu-open-button').click();
  });

  test('[drawer] can navigate to /card-catalogue', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.getByTestId('menu-open-button').click();
    await page.getByTestId('nav-card-catalogue-button').click();
    await expect(page).toHaveURL(`${BASE_URL}/card-catalogue`);
  });

  test('[drawer] can navigate to /card-editor', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.getByTestId('menu-open-button').click();
    await page.getByTestId('nav-card-editor-button').click();
    await expect(page).toHaveURL(`${BASE_URL}/card-editor/new`);
  });

  test('[drawer] can navigate to /card-expansions', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.getByTestId('menu-open-button').click();
    await page.getByTestId('releasing-accordion').click();
    await page.getByTestId('nav-card-expansions-button').click();
    await expect(page).toHaveURL(`${BASE_URL}/card-expansions`);
  });

  test('[drawer] can navigate to /process-management', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.getByTestId('menu-open-button').click();
    await page.getByTestId('releasing-accordion').click();
    await page.getByTestId('nav-process-management-button').click();
    await expect(page).toHaveURL(`${BASE_URL}/process-management`);
  });

  test('[drawer] can navigate to /user-management', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.getByTestId('menu-open-button').click();
    await page.getByTestId('nav-user-management-button').click();
    await expect(page).toHaveURL(`${BASE_URL}/user-management`);
  });
});
