import { type Page, expect } from '@playwright/test';
import { locators } from './cartPageLocators';

export class CartPage {
	readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async proceedToCheckout() {
  	await this.page.locator(locators.checkoutBtn).click();
  }

  async checkIfItemIsInCart(item: Record<string, any>) : Promise<boolean> {
    const cartItems = await this.page.$$(locators.cartItem);
    expect(cartItems).not.toBeNull();

    for (const cartItem of cartItems) {
      const itemTitle = await cartItem.$(locators.inventoryItemName);

      if (itemTitle) {
        const itemTitleText = await itemTitle.textContent();

        if (itemTitleText === item.name)
          return true;
      }
    }
    return false;
  }
}