import { test } from '@playwright/test';
import { BASE_URL } from '../config';

test.describe('[heavy]', () => {
  test('[example] example', async ({ page }) => {
    await page.goto(BASE_URL);
  });
});
