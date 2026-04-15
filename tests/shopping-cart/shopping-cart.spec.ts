import { expect, test } from "@playwright/test";
import ProductsPage from "../../pages/productsPage";
import LoginPage from "../../pages/loginPage";
import NavigationComponent from "../../pages/navigation";
import ProductDetailsPage from "../../pages/productDetailsPage";
import ShoppingCartPage from "../../pages/shoppingCartPage";
import dummyAddresses from "../../fixtures/mock-addresses.json";

test.describe("Shopping Cart Scenarios", () => {
  let Login: LoginPage;
  let Navigation: NavigationComponent;
  let Products: ProductsPage;
  let ProductDetails: ProductDetailsPage;
  let ShoppingCart: ShoppingCartPage;

  const listOfItems = ["Phillips Screwdriver", "Measuring Tape"];

  test.beforeEach(async ({ page }) => {
    Login = new LoginPage(page);
    Navigation = new NavigationComponent(page);
    Products = new ProductsPage(page);
    ProductDetails = new ProductDetailsPage(page);
    ShoppingCart = new ShoppingCartPage(page);

    await page.goto("");

    for (let itemToAddToCart of listOfItems) {
      await Products.isProductsPageLoaded();
      await Products.searchByName(itemToAddToCart);
      await Products.openProductByName(itemToAddToCart);
      await ProductDetails.isProductDetailsPageLoaded();
      await ProductDetails.clickAddToCart();
      await Navigation.navigateTo("Home");
    }
  });

  test("Number of Items in Cart are displayed on the Cart Icon", async () => {
    await Navigation.expectCartCount(listOfItems.length);
  });

  test("Added items are present in the Cart with correct Name", async () => {
    await Navigation.navigateToShoppingCart();
    for (let itemInCart of listOfItems) {
      await ShoppingCart.expectItemInCart(itemInCart);
    }
  });

  test("Added items are present in the Cart with the correct Quantity", async () => {
    await Navigation.navigateToShoppingCart();
    for (let itemInCart of listOfItems) {
      await ShoppingCart.expectItemQuantity(itemInCart, 1);
    }
  });

  test("Total Price is correctly calculated based on Item Quantity", async () => {
    await Navigation.navigateToShoppingCart();
    for (let itemInCart of listOfItems) {
      await ShoppingCart.changeQuantityTo(itemInCart, 10);
      await ShoppingCart.expectItemPriceTotal(itemInCart);
    }
  });

  test("User can complete the Checkout & Payment flow", async ({ page }) => {
    const purchaseCompleteResponse = page.waitForResponse(
      (response) =>
        response.url().includes("/payment/check") &&
        response.request().method() === "POST",
    );

    await Navigation.navigateToShoppingCart();
    // Cart > Sign In
    await ShoppingCart.clickProceedToCheckout();
    // Sign In > Billing Address
    await Login.loginAs("customer1");
    await ShoppingCart.clickProceedToCheckout();
    await ShoppingCart.fillBillingAddress(dummyAddresses.addresses[0]);
    // Billing Address > Payment Method
    await ShoppingCart.clickProceedToCheckout();
    await ShoppingCart.selectPaymentMethod("Cash on Delivery");
    await ShoppingCart.clickConfirmPaymentMethod();

    expect((await purchaseCompleteResponse).status()).toBe(200);
  });
});
