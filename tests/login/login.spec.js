import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import users from '../../test-data/users.json';

test.describe('Login Functionality Tests', () => {
    const { username, password } = users.standardUser;

    let loginPage;
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    test('Enter valid credentials and verify successful navigation to the inventory page.',
        async ({ page }) => {
            await loginPage.login(username, password);
            await expect(page).toHaveURL(/inventory.html/);
            await expect(page.getByText('Products')).toBeVisible();
        });
    test('Verify that an error message appears and the user stays on the login page.',
        async ({ page }) => {
            await loginPage.login(username, 'invalidPassword');
            await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible();
            await expect(page).toHaveURL('https://www.saucedemo.com/');
        });
    test('Verify the expected locked-user error. This follows up on the test failure we encountered earlier.',
        async ({ page }) => {
            await loginPage.login(users.lockedUser.username, users.lockedUser.password);
            await expect(page.getByText('Epic sadface: Sorry, this user has been locked out.')).toBeVisible();
            await expect(page).toHaveURL('https://www.saucedemo.com/');
        });
    test('Verify the appropriate validation message when credentials are missing.',
        async ({page}) => {
            await loginPage.login('','');
            await expect(page.getByText('Epic sadface: Username is required')).toBeVisible();
            await expect(page).toHaveURL('https://www.saucedemo.com/');
        });
    
});