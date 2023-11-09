import { type Page } from '@playwright/test';
import { locators } from './checkoutPageLocators';

export class CheckoutPage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }

  async fillAddressForm (addressData: Record<string, string>) {
    await this.page.locator(locators.firstName).fill(addressData.firstName);
    await this.page.locator(locators.lastName).fill(addressData.lastName);
    await this.page.locator(locators.postalCode).fill(addressData.postalCode);
  }

  async goToCheckoutOverview() {
    await this.page.locator(locators.continueButton).click();
  }

  async submitOrder() {
    await this.page.locator(locators.finishButton).click();
  }

  async returnToHomePage() {
    await this.page.locator(locators.backHomeButton).click();
  }
}