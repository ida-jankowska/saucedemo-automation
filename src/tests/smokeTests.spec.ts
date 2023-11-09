import { test, expect, type Page} from '@playwright/test';
import { LoginPage } from '../pages/loginPage/loginPage';
import { HomePage } from '../pages/homePage/homePage';
import { CartPage } from '../pages/cartPage/cartPage';
import { CheckoutPage } from '../pages/checkoutPage/checkoutPage';

test.afterEach(async ({ page }, testInfo) => {
  console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);

  if (testInfo.status !== testInfo.expectedStatus)
    console.log(`Did not run as expected, ended up at ${page.url()}`);
});

test.describe('Sauce Demo smoke tests', () => {
  const invalidCredentialsErrorMsg : string = 'Epic sadface: Username and password do not match any user in this service';
  const storeInventoryItems : number = 6;
  const itemsToPurchase : string[] = ['Sauce Labs Backpack', 'Sauce Labs Fleece Jacket', 'Sauce Labs Onesie'];

  const userData: { username: string, password: string} = {
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
    await page.close();
  });

  test('User can logout', async ({ page }) => {
    const sauceDemoLoginPage = new LoginPage(page);
    await sauceDemoLoginPage.goto();
    await sauceDemoLoginPage.userLogin(userData.username, userData.password);

    const sauceDemoHomePage = new HomePage(page);
    await sauceDemoHomePage.userLogout();
    await sauceDemoLoginPage.checkIfLoginFormIsVisible();
    await page.close();
  });

  test('Access denied due to invalid credentials', async ({ page }) => {
    const sauceDemoLoginPage = new LoginPage(page);
    await sauceDemoLoginPage.goto();
    await sauceDemoLoginPage.userLogin(userData.username, 'invalid_pass');

    const errorMessageVisible = await sauceDemoLoginPage.isErrorMessageVisible();
    expect(errorMessageVisible).toBe(true);

    const errorMessageText = await sauceDemoLoginPage.getErrorMessageText();
    expect(errorMessageText).toBe(invalidCredentialsErrorMsg);
    await page.close();
  });

  test('User can add products to their shopping cart and remove them', async ({ page }) => {
    const sauceDemoLoginPage = new LoginPage(page);
    await sauceDemoLoginPage.goto();
    await sauceDemoLoginPage.userLogin(userData.username, userData.password);

    const sauceDemoHomePage = new HomePage(page);
    const actualInventoryItems : number = await sauceDemoHomePage.countInventoryItems();
    expect (actualInventoryItems).toBe(storeInventoryItems);
    await sauceDemoHomePage.checkIfShoppingCartIsEmpty();

    for (const item of itemsToPurchase) {
      await sauceDemoHomePage.addItemToCart(item);
    }

    let itemsInShoppingCart = await sauceDemoHomePage.getNumberOfItemsAddedToCart();
    expect (Number(itemsInShoppingCart)).toBe(itemsToPurchase.length);

    await sauceDemoHomePage.removeItemFromCart(itemsToPurchase[0]);
    itemsInShoppingCart = await sauceDemoHomePage.getNumberOfItemsAddedToCart();
    expect (Number(itemsInShoppingCart)).toBe(itemsToPurchase.length-1);
    await page.close();
});

  test('User can place an order', async ({ page }) => {
    const sauceDemoLoginPage = new LoginPage(page);
    await sauceDemoLoginPage.goto();
    await sauceDemoLoginPage.userLogin(userData.username, userData.password);

    const itemPurchased: { name: string, price: number, quantity: number } = {
      name: itemsToPurchase[0],
      price: 29.99,
      quantity: 1,
    };

    const sauceDemoHomePage = new HomePage(page);
    await sauceDemoHomePage.addItemToCart(itemPurchased.name);
    await sauceDemoHomePage.goToShoppingCart();

    const sauceDemoCartPage = new CartPage(page);

    const itemExistsInShoppingCart = await sauceDemoCartPage.checkIfItemIsInCart(itemPurchased);
    expect (itemExistsInShoppingCart).toBe(true);
    await sauceDemoCartPage.proceedToCheckout();

    const addressData : { [key: string]: string } = {
      firstName: 'Walter',
      lastName: 'White',
      postalCode: '87101'
    }

    const sauceDemoCheckoutPage = new CheckoutPage(page);
    await sauceDemoCheckoutPage.fillAddressForm(addressData);
    await sauceDemoCheckoutPage.goToCheckoutOverview();
    await sauceDemoCheckoutPage.submitOrder();
    await sauceDemoCheckoutPage.returnToHomePage();
    
    await page.close();
  });
});