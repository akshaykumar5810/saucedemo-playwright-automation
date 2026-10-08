import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { InventoryPage } from '../../pages/InventoryPage.js';
import { CartPage } from '../../pages/CartPage.js';
import users from '../../test-data/users.json';


test.describe('Add to Cart Functionality Tests Phase 2', () => {
    let loginPage;
    let inventoryPage;
    let cartPage;
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        await loginPage.navigate();
        await loginPage.login(users.standardUser.username, users.standardUser.password);
        await expect(page.getByText('Products')).toBeVisible();
    });
    test('Verify cart badge after adding one product', async ({ page }) => {
        await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
        await expect(inventoryPage.shoppingCartBadge).toHaveText('1');
    });
    test('Verify cart badge after adding multiple products', async ({ page }) => {
        await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
        await inventoryPage.addProductToCartByName('Sauce Labs Bike Light');
        await expect(inventoryPage.shoppingCartBadge).toHaveText('2');
    });
    test('Verify selected products in cart', async ({ page }) => {
        await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
        await inventoryPage.addProductToCartByName('Sauce Labs Bike Light');
        await inventoryPage.openCart();
        await expect(page).toHaveURL(/cart.html/);
        await expect(inventoryPage.cartItems).toHaveCount(2);
        await expect(inventoryPage.cartItems.filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
        await expect(inventoryPage.cartItems.filter({ hasText: 'Sauce Labs Bike Light' })).toBeVisible();
    });
    test('Verify removing one product from Inventory page', async ({ page }) => {
        await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
        await inventoryPage.addProductToCartByName('Sauce Labs Bike Light');
        await inventoryPage.removeProductFromCartByName('Sauce Labs Backpack');
        await expect(inventoryPage.shoppingCartBadge).toHaveText('1');
    });
    test('Verify Removing product from cart page', async ({ page }) => {
        await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
        await inventoryPage.addProductToCartByName('Sauce Labs Bike Light');
        await inventoryPage.openCart();
        await expect(page).toHaveURL(/cart.html/);
        await expect(cartPage.cartProducts).toHaveCount(2);
        await cartPage.removeProductfromCartByName('Sauce Labs Bike Light');
        const remainingProducts = await cartPage.getCartItemNames();
        expect(remainingProducts).toEqual(['Sauce Labs Backpack']);
        await expect(inventoryPage.shoppingCartBadge).toHaveText('1');
    });
    test('Verify Removing all products from cart page', async ({ page }) => {
        await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
        await inventoryPage.addProductToCartByName('Sauce Labs Bike Light');
        await inventoryPage.openCart();
        await expect(page).toHaveURL(/cart.html/);
        await expect(cartPage.cartProducts).toHaveCount(2);
        await cartPage.removeAllProductsFromCart();
        const remainingProducts = await cartPage.getCartItemNames();
        expect(remainingProducts).toEqual([]);
        await expect(inventoryPage.shoppingCartBadge).not.toBeVisible();
    });
    test('Verify Cart state after removing product from cart page', async({page}) => {
        await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    });

    
});