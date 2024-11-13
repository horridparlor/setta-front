import { test, expect } from '@playwright/test';
import { BASE_URL } from '../config';

test.describe('[translation]', () => {
  test('[drawer] language select is visible', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.getByTestId('menu-open-button').click();
    page.getByTestId('language-select');
  });

  test('[drawer] can change language to finnish', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.getByTestId('menu-open-button').click();

    await expect(page.getByTestId('nav-card-catalogue-button')).toHaveText(
      'Card Catalogue'
    );

    await page.getByTestId('language-select').click();
    await page.getByTestId('language-option-fi').click();

    await expect(page.getByTestId('nav-card-catalogue-button')).toHaveText(
      'Korttikatalogi'
    );
  });
});
