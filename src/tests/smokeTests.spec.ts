import { test, expect, type Page} from '@playwright/test';
import { SAUCE_DEMO_ADDRESS } from '../config/environmentParameters';
import { LoginPage } from '../pages/loginPage';
import { HomePage } from '../pages/homePage';

test.afterEach(async ({ page }, testInfo) => {
  console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);

  if (testInfo.status !== testInfo.expectedStatus)
    console.log(`Did not run as expected, ended up at ${page.url()}`);
});

test.describe('Sauce Demo smoke tests', () => {
  const invalidCredentialsErrorMsg : string = 'Epic sadface: Username and password do not match any user in this service';
  const storeInventoryItems : number = 6;

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

  test('User can add products to their shopping cart and remove them', async ({ page }) => {
    const sauceDemoLoginPage = new LoginPage(page);
    await sauceDemoLoginPage.goto();
    await sauceDemoLoginPage.userLogin(userData.username, userData.password);

    const sauceDemoHomePage = new HomePage(page);
    const actualInventoryItems : number = await sauceDemoHomePage.countInventoryItems();
    expect (actualInventoryItems).toBe(storeInventoryItems);

    await sauceDemoHomePage.checkIfShoppingCartIsEmpty();

    const itemsToPurchase : string[] = ['Sauce Labs Backpack', 'Sauce Labs Fleece Jacket', 'Sauce Labs Onesie'];
    for (const item of itemsToPurchase) {
      await sauceDemoHomePage.addItemToCart(item);
  }

  let itemsInShoppingCart = await sauceDemoHomePage.getNumberOfItemsAddedToCart();
  expect (Number(itemsInShoppingCart)).toBe(itemsToPurchase.length);

  await sauceDemoHomePage.removeItemFromCart(itemsToPurchase[0]);
  itemsInShoppingCart = await sauceDemoHomePage.getNumberOfItemsAddedToCart();
  expect (Number(itemsInShoppingCart)).toBe(itemsToPurchase.length-1);
});

  // todo
  // test('User can place an order', async ({ page }) => {

  // });

});