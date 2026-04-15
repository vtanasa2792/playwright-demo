import { expect, Page } from "@playwright/test";
type NavDestinations = "Home" | "Contact" | "Sign In";
type NavCategories =
  | "Hand Tools"
  | "Power Tools"
  | "Other"
  | "Special Tools"
  | "Rentals";

class NavigationComponent {
  constructor(private page: Page) {}

  private NAVIGATION_CONTAINER = this.page.locator("#navbarSupportedContent");
  private NAVIGATION_SHOPPING_CART = this.page.getByTestId("nav-cart");
  private NAVIGATION_SHOPPING_CART_COUNT =
    this.page.getByTestId("cart-quantity");

  /**
   * Navigate to the desired Page
   * @param destinationPage
   * @returns
   */
  async navigateTo(destinationPage: NavDestinations) {
    await this.NAVIGATION_CONTAINER.getByRole("link", {
      name: destinationPage,
    }).click();
  }

  /**
   * Open the Category Dropdown and navigate to the desired Category Page
   * @param destinationCategory
   * @returns
   */
  async navigateToCategory(destinationCategory: NavCategories) {
    await this.NAVIGATION_CONTAINER.getByRole("button", {
      name: "Categories",
    }).click();
    await this.NAVIGATION_CONTAINER.getByRole("link", {
      name: destinationCategory,
    }).click();
  }

  /**
   * Navigate to the Shopping Cart
   */
  async navigateToShoppingCart() {
    await this.NAVIGATION_SHOPPING_CART.click();
  }

  /**
   * Validate that the Number of Items is correctly displayed on the Cart Icon
   * @param count
   */
  async expectCartCount(count: number) {
    await expect(this.NAVIGATION_SHOPPING_CART_COUNT).toHaveText(
      count.toString(),
    );
  }
}

export default NavigationComponent;
