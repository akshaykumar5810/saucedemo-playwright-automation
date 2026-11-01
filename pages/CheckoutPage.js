export class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.checkoutTitle = page.getByText('Checkout: Your Information', { exact: true });
        this.firstName = page.locator('#first-name');
        this.lastName = page.locator('#last-name');
        this.postalCode = page.locator('#postal-code');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.errorMessage = page.locator('[data-test="error"]');
        this.overviewTitle = page.getByText('Checkout: Overview', { exact: true });
        this.overviewProducts = page.locator('.cart_item');
        this.paymentInformation = page.locator('.summary_value_label').nth(0);
        this.shippingInformation = page.locator('.summary_value_label').nth(1);
        this.subtotal = page.locator('.summary_subtotal_label');
        this.tax = page.locator('.summary_tax_label');
        this.total = page.locator('.summary_total_label');
        this.finishButton = page.getByRole('button', { name: 'Finish' });
        this.confirmationTitle = page.getByText('Checkout: Complete!', { exact: true });
        this.confirmationMessage = page.getByText('Thank you for your order!', { exact: true });
        this.backHomeButton = page.getByRole('button', { name: 'Back Home' });

    }

    async enterCheckoutInformation(firstName, lastName, postalCode) {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.postalCode.fill(postalCode);
    }

    async continueCheckout() {

        await this.continueButton.click();
    }

    async getErrorMessage() {

        return this.errorMessage.textContent();
    }

    async getOverviewProductNames() {
        return await this.overviewProducts.locator('.inventory_item_name').allTextContents();
    }

    async getSubtotalAmount() {
        const subtotalText = await this.subtotal.textContent();
        return Number(subtotalText.replace('Item total: $', ''));
    }

    async getTaxAmount() {
        const taxText = await this.tax.textContent();
        return Number(taxText.replace('Tax: $', ''));
    }

    async getTotalAmount() {
        const totalText = await this.total.textContent();
        return Number(totalText.replace('Total: $', ''));
    }

    async finishOrder() {
        await this.finishButton.click();
    }

    async backToHome() {
        await this.backHomeButton.click();
    }
}