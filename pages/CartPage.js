export class CartPage {
    constructor(page) {
        this.page = page;
        this.cartProducts = page.locator('.cart_item');
        this.cartItemNames = page.locator('.inventory_item_name');
        this.removeButtons = this.cartProducts.locator('button:has-text("Remove")');
    }

    async getCartProductsCount() {
        return await this.cartProducts.count();
    }

    async getCartItemNames() {
        return await this.cartItemNames.allTextContents();
    }

    async removeProductfromCartByName(productName) {
        const productLocator = this.cartProducts.filter({ hasText: productName });
        await productLocator.getByRole('button', { name: 'Remove' }).click();
    }
    
    async removeAllProductsFromCart() {
        const removeButtonsCount = await this.removeButtons.count();
        for (let i = 0; i < removeButtonsCount; i++) {
            await this.removeButtons.nth(0).click();
        }   
    }

}