import { type Page, expect } from '@playwright/test';
import { SAUCE_DEMO_ADDRESS } from '../config/environmentParameters';
import { locators } from './homePageLocators';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  buttonsText = {
    addToCartBtn: 'Add To Cart',
    removeBtn: 'Remove'
}

  async checkIfSecondaryHeaderIsVisible() {
    const secondaryHeader = this.page.locator(locators.secondaryHeader);
    return await secondaryHeader.isVisible();
  }

  async userLogout() {
    await this.page.locator(locators.openMenuButton).click();
    await this.page.locator(locators.logoutButton).click();
  }

  async countInventoryItems() {
    const inventoryItems = await this.page.$$(locators.inventoryItem);
    expect(inventoryItems).not.toBeNull();
    return inventoryItems.length;
  }

  async checkIfShoppingCartIsEmpty() {
    const itemsInCartCounter = this.page.locator(locators.shoppingCartBadge);
    await expect(itemsInCartCounter).toHaveCount(0);
  }

  async addItemToCart(itemName : string) {
    const itemToPurchase = this.page.locator(locators.inventoryItem, { hasText: itemName});
    const addToCartButton = itemToPurchase.locator(locators.addToCartButton, { hasText: this.buttonsText.addToCartBtn});
    await addToCartButton.click()
  }

  async removeItemFromCart(itemName : string) {
    const itemToRemove = this.page.locator(locators.inventoryItem, { hasText: itemName});
    const removeFromCartButton = itemToRemove.locator(locators.removeFromCartButton, { hasText: this.buttonsText.removeBtn});
    await removeFromCartButton.click()
  }

  async getNumberOfItemsAddedToCart() {
    const itemsInCartCounter = this.page.locator(locators.shoppingCartBadge);
    return await itemsInCartCounter?.textContent();
  }
}