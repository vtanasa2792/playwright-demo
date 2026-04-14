import { expect, Page } from "@playwright/test";

type SortCriteria =
  | "Name (A - Z)"
  | "Name (Z - A)"
  | "Price (High - Low)"
  | "Price (Low - High)"
  | "CO₂ Rating (A - E)"
  | "CO₂ Rating (E - A)";

type ProductCategory =
  | "Hand Tools"
  | "Hammer"
  | "Hand Saw"
  | "Wrench"
  | "Screwdriver"
  | "Pliers"
  | "Chisels"
  | "Measures"
  | "Power Tools"
  | "Grinder"
  | "Sander"
  | "Saw"
  | "Drill"
  | "Other"
  | "Tool Belts"
  | "Storage Solutions"
  | "Workbench"
  | "Safety Gear"
  | "Fasteners";

class ProductsPage {
  constructor(private page: Page) {}

  // Filters sidebar
  private FILTERS_CONTAINER = this.page.locator("div[data-test='filters']");
  private FILTERS_SORT = this.page.getByTestId("sort");
  private FILTERS_SEARCH_INPUT = this.page.getByTestId("search-query");
  private FILTERS_SEARCH_SUBMIT_BTN = this.page.getByTestId("search-submit");
  private FILTERS_RESET_BTN = this.page.getByTestId("search-reset");

  // Produts catalog
  private PRODUCT_NO_RESULTS = this.page.getByTestId("no-results");
  private PRODUCT_CARD = this.page.locator('[data-test^="product-"]');
  private PRODUCT_CARD_NAME = this.page.getByTestId("product-name");
  private PRODUCT_CARD_CO2 = this.page.getByTestId("co2-rating-badge");
  private PRODUCT_CARD_PRICE = this.page.getByTestId("product-price");

  async isProductsPageLoaded() {
    await expect(this.FILTERS_CONTAINER).toBeVisible();
  }

  /**
   * Sort items by desired criteria
   * @param sortCriteria
   */
  async sortBy(sortCriteria: SortCriteria) {
    const sortResponse = this.page.waitForResponse(/sort=/);
    await this.FILTERS_SORT.click();
    await this.FILTERS_SORT.selectOption(sortCriteria);
    await sortResponse;
  }

  /**
   * Search items by name
   * @param searchTerm
   */
  async searchByName(searchTerm: string) {
    const searchResponse = this.page.waitForResponse(/search/);
    await this.FILTERS_SEARCH_INPUT.fill(searchTerm);
    await this.FILTERS_SEARCH_SUBMIT_BTN.click();
    await searchResponse;
  }

  /**
   * Filter items by desired categories
   * @param filters
   */
  async filterByCategory(...filters: ProductCategory[]) {
    const filterResponse = this.page.waitForResponse(/by_category/);
    for (let eachFilter of filters) {
      await this.FILTERS_CONTAINER.getByRole("checkbox", {
        name: eachFilter,
      }).check();
      await filterResponse;
    }
  }

  /**
   * Reset all applied fliters
   */
  async resetFilters() {
    await this.FILTERS_RESET_BTN.click();
  }

  /**
   * Returns an array of all the prices visible on the page
   * @returns
   */
  async getDisplayedPrices() {
    await this.PRODUCT_CARD_PRICE.first().waitFor();

    const displayedPrices: string[] =
      await this.PRODUCT_CARD_PRICE.allTextContents();

    return displayedPrices.map((price) => parseFloat(price.replace("$", "")));
  }

  /**
   * Returns an array of all the prices visible on the page
   * @returns
   */
  async getDisplayedNames() {
    await this.PRODUCT_CARD_NAME.first().waitFor();

    const displayedNames: string[] =
      await this.PRODUCT_CARD_NAME.allTextContents();

    return displayedNames.map((name) => name.trim());
  }

  /**
   * Validate that No Search Results is displayed
   */
  async isNoSearchResultsDisplayed() {
    expect(this.PRODUCT_NO_RESULTS).toBeVisible();
    expect(this.PRODUCT_NO_RESULTS).toHaveText("There are no products found.");
  }
}
export default ProductsPage;
