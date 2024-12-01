import { test, expect } from '@playwright/test';
import { BASE_URL } from '../config';
test.describe('[user-management]', () => {
    test('[user-management] can navigate to /user-creation', async ({ page }) => {
        await page.goto(`${BASE_URL}/user-management`)

        await page.getByTestId('create-new-user-button').click();
        await expect(page).toHaveURL(`${BASE_URL}/user-creation`)
    })
    test('[user-management] can navigate to /user-roles', async ({ page }) => {
        await page.goto(`${BASE_URL}/user-management`)

        await page.getByTestId('create-new-role-button').click();
        await expect(page).toHaveURL(`${BASE_URL}/user-roles`)
    })
});
test.describe('[user-creation]', () => {
    test('[user-creation] admin level rights button is disabled', async ({ page }) => {
        await page.goto(`${BASE_URL}/user-creation`)
        const checkbox = page.getByTestId('all-admin-rights-checkbox')
        await expect(checkbox).toBeDisabled();
        await checkbox.click({ force: true });
        await expect(checkbox).not.toBeChecked();
    })
    test('[user-creation] correctly quits from confirmationdialog cancel button', async ({ page }) => {
        await page.goto(`${BASE_URL}/user-creation`)
        await page.getByTestId('cancel-button').click();
        await page.getByTestId('i-understand-checkbox').click();
        await page.getByTestId('confirm-button').click();
        await expect(page).toHaveURL(`${BASE_URL}/user-management`)
    })
    test('[user-creation] chooses all common access rights', async ({ page }) => {
        await page.goto(`${BASE_URL}/user-creation`);
        await page.getByTestId('all-common-rights-checkbox').click();
        const commonCheckboxes = page.locator('[data-testid="common-right-checkbox"]')
        const count = await commonCheckboxes.count();
        for (let i = 0; i < count; i++) {
            await expect(commonCheckboxes.nth(i)).toBeChecked();
        }
    })
    test('[user-creation] toggles individual rights', async ({ page }) => {
        await page.goto(`${BASE_URL}/user-creation`);

        await page.getByLabel("canCreateContent").check();
        await expect(page.getByLabel("canCreateContent")).toBeChecked();
        await page.getByLabel("autoRefillTokens").check();
        await expect(page.getByLabel("autoRefillTokens")).toBeChecked();
    })
})
test.describe('[user-roles]', () => {
    test('[user-roles] chooses all common access rights', async ({ page }) => {
        await page.goto(`${BASE_URL}/user-roles`)
        await page.getByTestId('all-common-rights-checkbox').click();
        const commonCheckboxes = page.locator('[data-testid="common-right-checkbox"]')
        const count = await commonCheckboxes.count();
        for (let i = 0; i < count; i++) {
            await expect(commonCheckboxes.nth(i)).toBeChecked();
        }
    })
    test('[user-roles] returns from cancel button (no changes)', async ({ page }) => {
        await page.goto(`${BASE_URL}/user-roles`)
        await page.getByTestId('cancel-button').click();
        await expect(page).toHaveURL(`${BASE_URL}/user-management`);
    })
    test('[user-roles] toggles individual rights', async ({ page }) => {
        await page.goto(`${BASE_URL}/user-roles`);

        await page.getByLabel("canCreateContent").check();
        await expect(page.getByLabel("canCreateContent")).toBeChecked();
        await page.getByLabel("autoRefillTokens").check();
        await expect(page.getByLabel("autoRefillTokens")).toBeChecked();
    })
    test('[user-roles] returns from cancel button (after changes)', async ({ page }) => {
        await page.goto(`${BASE_URL}/user-roles`);

        await page.getByLabel("canCreateContent").check();
        await expect(page.getByLabel("canCreateContent")).toBeChecked();
        await page.getByTestId('cancel-button').click();
        await page.getByTestId('i-understand-checkbox').click();
        await page.getByTestId('confirm-button').click();
        await expect(page).toHaveURL(`${BASE_URL}/user-management`)
    })
})
