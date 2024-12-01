import { test, expect } from '@playwright/test';
import { USER_MANAGEMENT_URL } from '../config';
import { USER_CREATION_URL } from '../config';
import { BASE_URL } from '../config';
test.describe('[card-editor]', () => {
    test('[card-editor] goes to art tab', async ({ page }) => {
        await page.goto(`${BASE_URL}/card-editor/new`)
        await page.getByTestId("art-tab-button").click();
        await expect(page.locator('text=Background Description')).toBeVisible();
    })
    test('[card-editor] changes subtabs in art tab', async ({ page }) => {
        await page.goto(`${BASE_URL}/card-editor/new`)
        await page.getByTestId("art-tab-button").click();
        await page.getByTestId("character-tab").click();
        await expect(page.getByTestId('impersonate-checkbox')).toBeVisible();
        await page.getByTestId("side-character-tab").click();
        await expect(page.getByTestId('side-character-name')).toBeVisible();
        await page.getByTestId("side-character2-tab").click();
        await expect(page.getByTestId('side-character2-name')).toBeVisible();
        await page.getByTestId("hidden-tab").click();
        await expect(page.getByTestId("hidden-characters-text")).toBeVisible();

    })
    test('[card-editor] art tab', async ({ page }) => {
        await page.goto(`${BASE_URL}/card-editor/new`)
        await page.getByTestId("art-tab-button").click();
        await page.getByTestId("character-tab").click();
        await page.getByTestId("impersonate-checkbox").click();
        await expect(page.getByTestId('user-select')).toBeVisible();
    })
    test('[card-editor] goes to effects tab', async ({ page }) => {
        await page.goto(`${BASE_URL}/card-editor/new`)
        await page.getByTestId("effects-tab-button").click();
        await expect(page.locator('text=Extra effects:')).toBeVisible();
    })
    test('[card-editor] goes to deck tab', async ({ page }) => {
        await page.goto(`${BASE_URL}/card-editor/new`)
        await page.getByTestId("deck-tab-button").click();
        await expect(page.locator('text=This card is included in')).toBeVisible();
    })
    test('[card-editor] change updates to prompt', async ({ page }) => {
        await page.goto(`${BASE_URL}/card-editor/new`)
        await page.getByTestId("art-tab-button").click();
        await page.getByTestId('type-select').click();
        await page.getByRole('option', { name: 'Outdoors' }).click();
    })
});