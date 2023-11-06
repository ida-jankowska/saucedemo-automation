import { test, expect, type Page} from '@playwright/test';
import { SAUCE_DEMO_ADDRESS } from '../config/environmentParameters';
import { LoginPage } from '../pages/loginPage';
import { HomePage } from '../pages/homePage';

test.describe('Sauce Demo smoke tests', () => {
  const invalidCredentialsErrorMsg : string = 'Epic sadface: Username and password do not match any user in this service';

  const userData = {
    username: 'standard_user',
    password: 'secret_sauce'
}

  test('User can successfully login', async ({ page }) => {
    const sauceDemoLoginPage = new LoginPage(page);
    await sauceDemoLoginPage.goto();
    await sauceDemoLoginPage.userLogin(userData.username, userData.password);
    await sauceDemoLoginPage.confirmValidLogin();

    const sauceDemoHomePage = new HomePage(page);
    const isSecondaryHeaderVisible = await sauceDemoHomePage.checkIfSecondaryHeaderIsVisible();
    expect(isSecondaryHeaderVisible).toBe(true);
  });

  test('User can logout', async ({ page }) => {
    const sauceDemoLoginPage = new LoginPage(page);
    await sauceDemoLoginPage.goto();
    await sauceDemoLoginPage.userLogin(userData.username, userData.password);

    const sauceDemoHomePage = new HomePage(page);
    await sauceDemoHomePage.userLogout();
    await sauceDemoLoginPage.checkIfLoginFormIsVisible();
  });

  test('Access denied due to invalid credentials', async ({ page }) => {
    const sauceDemoLoginPage = new LoginPage(page);
    await sauceDemoLoginPage.goto();
    await sauceDemoLoginPage.userLogin(userData.username, 'invalid_pass');

    const errorMessageVisible = await sauceDemoLoginPage.isErrorMessageVisible();
    expect(errorMessageVisible).toBe(true);

    const errorMessageText = await sauceDemoLoginPage.getErrorMessageText();
    expect(errorMessageText).toBe(invalidCredentialsErrorMsg);
  });

// todo

  // test('User can add products to their shopping cart', async ({ page }) => {


  // });

  // todo
  // test('User can place an order', async ({ page }) => {

  // });

});