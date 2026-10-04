import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import users from '../../test-data/users.json';
import { InventoryPage } from '../../pages/InventoryPage.js';

test.describe('Inventor Page Test Phase 2', () => {

    let loginPage;
    let inventoryPage;
    const { username, password } = users.standardUser;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(username, password);
        await expect(page.getByText('Products')).toBeVisible();
        inventoryPage = new InventoryPage(page);

    });

    test('Verify inventory page', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        const productCount = await inventoryPage.getInventoryItemsCount();
        const addToCartButtonCount = await inventoryPage.getInventoryAddtoCartButtonsCount();
        expect(productCount).toBe(6);
        expect(addToCartButtonCount).toBe(6);
    });

    test('Verify products are sorted by name A to Z', async ({ page }) => {
        await inventoryPage.selectProductSortOption('az');
        await inventoryPage.getProductNamesAtoZ();
        expect(inventoryPage.actualProductNames).toEqual(inventoryPage.expectedProductNames);
    });

    test('Verify products are sorted by name Z to A', async ({ page }) => {
        await inventoryPage.selectProductSortOption('za');
        await inventoryPage.getProductNamesZtoA();
        expect(inventoryPage.actualProductNames).toEqual(inventoryPage.expectedProductNames);
    });

    test('Verify products are sorted by price low to high', async ({ page }) => {
        await inventoryPage.selectProductSortOption('lohi');
        await inventoryPage.getProductPricesLowToHigh();
        expect(inventoryPage.actualProductPrices).toEqual(inventoryPage.expectedProductPrices);
    });

    test('Verify products are sorted by price high to low', async ({ page }) => {
        await inventoryPage.selectProductSortOption('hilo');
        await inventoryPage.getProductPricesHighToLow();
        expect(inventoryPage.actualProductPrices).toEqual(inventoryPage.expectedProductPrices);
    });
});
