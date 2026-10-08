export class InventoryPage {
    constructor(page) {
        this.page = page;
        this.inventoryContainer = page.locator('.inventory_item');
        this.addtoCartButton = page.getByRole('button', { name: 'Add to cart' });
        this.productSort = page.locator('.product_sort_container');
        this.productName = page.locator('.inventory_item_name');
        this.productPrice = page.locator('.inventory_item_price');
        this.shoppingCartBadge = page.locator('.shopping_cart_badge');
        this.cartItems = page.locator('.cart_item');
    }

    async getInventoryItemsCount() {
        return await this.inventoryContainer.count();
    }

    async getInventoryAddtoCartButtonsCount() {
        return await this.addtoCartButton.count();
    }

    async selectProductSortOption(option) {
        await this.productSort.selectOption(option);
    }

    async getProductNamesAtoZ() {
        const actualProductNames = await this.productName.allTextContents();
        const expectedProductNames = [...actualProductNames].sort((a, b) => a.localeCompare(b));
        return { actualProductNames, expectedProductNames };

    }

    async getProductNamesZtoA() {
        const actualProductNames = await this.productName.allTextContents();
        const expectedProductNames = [...actualProductNames].sort((a, b) => b.localeCompare(a));
        return { actualProductNames, expectedProductNames };
    }

    async getProductPricesLowToHigh() {
        const actualProductPrices = (await this.productPrice.allTextContents())
            .map(price => Number(price.replace('$', '')));
        const expectedProductPrices = [...actualProductPrices].sort((a, b) => a - b);
        return { actualProductPrices, expectedProductPrices };
    }

    async getProductPricesHighToLow() {
        const actualProductPrices = (await this.productPrice.allTextContents())
            .map(price => Number(price.replace('$', '')));
        const expectedProductPrices = [...actualProductPrices].sort((a, b) => b - a);
        return { actualProductPrices, expectedProductPrices };
    }

    async addProductToCartByName(productName) {
        const productLocator = this.inventoryContainer.filter({ hasText: productName });
        await productLocator.getByRole('button', { name: 'Add to cart' }).click();
    }

    async removeProductFromCartByName(productName) {
        const productLocator = this.inventoryContainer.filter({ hasText: productName });
        await productLocator.getByRole('button', { name: 'Remove' }).click();

    }
    async openCart() {
        await this.page.locator('.shopping_cart_link').click();
    }

}