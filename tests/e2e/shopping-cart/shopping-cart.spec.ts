import { expect, test } from "../../../fixtures";
import dummyAddresses from "../../../fixtures/mock-addresses.json";

test.describe("Shopping Cart Scenarios", () => {
  const listOfItems: string[] = ["Phillips Screwdriver", "Measuring Tape"];

  test.beforeEach(
    async ({ page, navigation, productsPage, productDetailsPage }) => {
      await page.goto("");

      for (let itemToAddToCart of listOfItems) {
        await productsPage.isProductsPageLoaded();
        await productsPage.searchByName(itemToAddToCart);
        await productsPage.openProductByName(itemToAddToCart);
        await productDetailsPage.isProductDetailsPageLoaded();
        await productDetailsPage.clickAddToCart();
        await navigation.navigateTo("Home");
      }
    },
  );

  test("Number of Items in Cart are displayed on the Cart Icon", async ({
    navigation,
  }) => {
    await navigation.expectCartCount(listOfItems.length);
  });

  test("Added items are present in the Cart with correct Name", async ({
    navigation,
    shoppingCartPage,
  }) => {
    await navigation.navigateToShoppingCart();
    for (let itemInCart of listOfItems) {
      await shoppingCartPage.expectItemInCart(itemInCart);
    }
  });

  test("Added items are present in the Cart with the correct Quantity", async ({
    navigation,
    shoppingCartPage,
  }) => {
    await navigation.navigateToShoppingCart();
    for (let itemInCart of listOfItems) {
      await shoppingCartPage.expectItemQuantity(itemInCart, 1);
    }
  });

  test("Total Price is correctly calculated based on Item Quantity", async ({
    navigation,
    shoppingCartPage,
  }) => {
    await navigation.navigateToShoppingCart();
    for (let itemInCart of listOfItems) {
      await shoppingCartPage.changeQuantityTo(itemInCart, 10);
      await shoppingCartPage.expectItemPriceTotal(itemInCart);
    }
  });

  test("User can complete the Checkout & Payment flow", async ({
    page,
    navigation,
    shoppingCartPage,
  }) => {
    await navigation.navigateToShoppingCart();
    // Cart > Sign In
    await shoppingCartPage.clickProceedToCheckout();
    // Sign In > Billing Address
    await shoppingCartPage.clickContinueAsGuestTab();
    await shoppingCartPage.signUpAsGuest("email@email.com", "First", "Last");
    await shoppingCartPage.clickProceedToCheckout();
    await shoppingCartPage.fillBillingDetails(dummyAddresses.addresses[0]);
    // Billing Address > Payment Method
    await shoppingCartPage.clickProceedToCheckout();
    await shoppingCartPage.selectPaymentMethod("Cash on Delivery");

    const purchaseCompleteResponse = page.waitForResponse(
      (response) =>
        response.url().includes("/payment/check") &&
        response.request().method() === "POST",
    );
    await shoppingCartPage.clickConfirmPaymentMethod();

    expect((await purchaseCompleteResponse).status()).toBe(200);
  });
});
