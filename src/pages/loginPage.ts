import { type Page } from '@playwright/test';
import { SAUCE_DEMO_ADDRESS } from '../config/environmentParameters';
import { locators } from './loginPageLocators';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(SAUCE_DEMO_ADDRESS);
  }

  async userLogin(username : string, password : string) {
    await this.page.locator(locators.userName).fill(username);
    await this.page.locator(locators.password).fill(password);
    await this.page.locator(locators.loginButton).click();
  }

  async checkIfLoginFormIsVisible() {
    await this.page.locator(locators.loginForm).isVisible();;
  }

  async confirmValidLogin() {
    await this.page.waitForLoadState(); 
    await this.page.waitForURL('**/inventory.html');
  }

  async isErrorMessageVisible() {
    const errorMessage = this.page.locator(locators.errorMessage);
    return await errorMessage.isVisible();
  }

  async getErrorMessageText() {
    const errorMessage = this.page.locator(locators.errorMessage);
    return await errorMessage.textContent();
  }
}