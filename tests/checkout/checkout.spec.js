import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { InventoryPage } from '../../pages/InventoryPage.js';
import { CartPage } from '../../pages/CartPage.js';
import { CheckoutPage } from '../../pages/CheckoutPage';
import users from '../../test-data/users.json';

test.describe('Checkout Functionality Tests', () => {
    let loginPage;
    let inventoryPage;
    let cartPage;
    let checkoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        await loginPage.navigate();
        await loginPage.login(users.standardUser.username, users.standardUser.password);
        await inventoryPage.addProductToCartByName('Test.allTheThings() T-Shirt (Red)');
        await inventoryPage.addProductToCartByName('Sauce Labs Onesie');
        await inventoryPage.openCart();
    });

    test('Verify checkout button navigation', async ({ page }) => {
        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(/checkout-step-one\.html/);
        await expect(checkoutPage.checkoutTitle).toBeVisible();
    });

    test('Verify checkout information form fields', async ({ page }) => {
        await cartPage.proceedToCheckout();
        await expect(checkoutPage.firstName).toBeVisible();
        await expect(checkoutPage.lastName).toBeVisible();
        await expect(checkoutPage.postalCode).toBeVisible();
        await expect(checkoutPage.continueButton).toBeVisible();
        await expect(checkoutPage.cancelButton).toBeVisible();
    });

    test('Verify mandatory checkout field validation', async ({ page }) => {
        await cartPage.proceedToCheckout();
        await checkoutPage.continueCheckout();
        await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');
        await expect(page).toHaveURL(/checkout-step-one\.html/);
    });

    test('Verify validation when Last Name is missing', async ({ page }) => {
        await cartPage.proceedToCheckout();
        await checkoutPage.firstName.fill('akshay');
        await checkoutPage.postalCode.fill('502319');
        await checkoutPage.continueCheckout();
        await expect(checkoutPage.errorMessage).toHaveText('Error: Last Name is required');
        await expect(page).toHaveURL(/checkout-step-one\.html/);
    });

    test('Verify validation when Postal Code is missing', async ({ page }) => {
        await cartPage.proceedToCheckout();
        await checkoutPage.firstName.fill('akshay');
        await checkoutPage.lastName.fill('kumar');
        await checkoutPage.continueCheckout();
        await expect(checkoutPage.errorMessage).toHaveText('Error: Postal Code is required');
        await expect(page).toHaveURL(/checkout-step-one\.html/);
    });

    test('Verify successful checkout information submission', async ({ page }) => {
        await cartPage.proceedToCheckout();
        await checkoutPage.enterCheckoutInformation('akshay', 'kumar', '502319');
        await checkoutPage.continueCheckout();
        await expect(page).toHaveURL(/checkout-step-two\.html/);
        await expect(page.getByText('Checkout: Overview', { exact: true })).toBeVisible();
    });

    test('Verify checkout overview product details', async ({ page }) => {
        await cartPage.proceedToCheckout();
        await checkoutPage.enterCheckoutInformation('Akshay', 'Kumar', '500001');
        await checkoutPage.continueCheckout();
        const productNames = await checkoutPage.getOverviewProductNames();
        expect(productNames).toEqual(['Test.allTheThings() T-Shirt (Red)', 'Sauce Labs Onesie']);
        await expect(checkoutPage.paymentInformation).toBeVisible();
        await expect(checkoutPage.shippingInformation).toBeVisible();
        await expect(checkoutPage.subtotal).toBeVisible();
        await expect(checkoutPage.tax).toBeVisible();
        await expect(checkoutPage.total).toBeVisible();
        await expect(checkoutPage.finishButton).toBeVisible();
    });

    test('Verify checkout subtotal, tax and grand total calculations', async ({ page }) => {
        await cartPage.proceedToCheckout();
        await checkoutPage.enterCheckoutInformation('Akshay', 'Kumar', '500001');
        await checkoutPage.continueCheckout();
        const actualSubtotal = await checkoutPage.getSubtotalAmount();
        const actualTax = await checkoutPage.getTaxAmount();
        const actualTotal = await checkoutPage.getTotalAmount();
        const expectedTotal = Number((actualSubtotal + actualTax).toFixed(2));
        expect(actualSubtotal).toBe(23.98);
        expect(actualTax).toBe(1.92);
        expect(actualTotal).toBe(expectedTotal);
    });

    test('Verify successful order completion', async ({ page }) => {
        await cartPage.proceedToCheckout();
        await checkoutPage.enterCheckoutInformation('Akshay','Kumar','500001');
        await checkoutPage.continueCheckout();
        await expect(checkoutPage.overviewTitle).toBeVisible();
        await checkoutPage.finishOrder();
        await expect(page).toHaveURL(/checkout-complete\.html/);
        await expect(page.getByText('Thank you for your order!', { exact: true })).toBeVisible();
    });

    test('Verify order confirmation page and Back Home navigation', async ({ page }) => {
        await cartPage.proceedToCheckout();
        await checkoutPage.enterCheckoutInformation('Akshay','Kumar','500001');
        await checkoutPage.continueCheckout();
        await checkoutPage.finishOrder();
        await expect(page).toHaveURL(/checkout-complete.html/);
        await expect(checkoutPage.confirmationTitle).toBeVisible();
        await expect(checkoutPage.confirmationMessage).toBeVisible();
        await expect(checkoutPage.backHomeButton).toBeVisible();
        await checkoutPage.backToHome();
        await expect(page).toHaveURL(/inventory.html/);
        await expect(page.getByText('Products')).toBeVisible();
    });
});
