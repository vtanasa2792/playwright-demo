import { Page } from "@playwright/test";
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
}

export default NavigationComponent;
