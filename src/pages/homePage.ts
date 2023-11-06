import { type Page, expect } from '@playwright/test';
import { SAUCE_DEMO_ADDRESS } from '../config/environmentParameters';
import { locators } from './homePageLocators';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async checkIfSecondaryHeaderIsVisible() {
    const secondaryHeader = this.page.locator(locators.secondaryHeader);
    return await secondaryHeader.isVisible();
  }

  async userLogout() {
    await this.page.locator(locators.openMenuButton).click();
    await this.page.locator(locators.logoutButton).click();
  }
}