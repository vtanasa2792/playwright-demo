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

  // Products catalog
  private PRODUCT_NO_RESULTS = this.page.getByTestId("no-results");
  private PRODUCT_CARD = this.page.locator('[data-test^="product-"]');
  private PRODUCT_CARD_NAME = this.page.getByTestId("product-name");
  private PRODUCT_CARD_PRICE = this.page.getByTestId("product-price");

  /**
   * Validate that the main elements of the page are visible
   */
  async isProductsPageLoaded() {
    await expect(this.FILTERS_CONTAINER).toBeVisible();
  }

  /**
   * Open a Product by clicking on the Product Card containing its Name
   * @param productName
   */
  async openProductByName(productName: string) {
    await this.PRODUCT_CARD.filter({
      has: this.PRODUCT_CARD_NAME.filter({ hasText: productName }),
    }).click();
  }

  /**
   * Sort Products by desired criteria
   * @param sortCriteria
   */
  async sortBy(sortCriteria: SortCriteria) {
    const sortResponse = this.page.waitForResponse(/sort=/);
    await this.FILTERS_SORT.click();
    await this.FILTERS_SORT.selectOption(sortCriteria);
    await sortResponse;
  }

  /**
   * Search Products by name
   * @param searchTerm
   */
  async searchByName(searchTerm: string) {
    const searchResponse = this.page.waitForResponse(/search/);
    await this.FILTERS_SEARCH_INPUT.fill(searchTerm);
    await this.FILTERS_SEARCH_SUBMIT_BTN.click();
    await searchResponse;
  }

  /**
   * Filter Products by desired categories
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
   * Reset all applied filters
   */
  async resetFilters() {
    await this.FILTERS_RESET_BTN.click();
  }

  /**
   * Returns an array of all the Product Prices visible on the page
   * @returns
   */
  async getDisplayedPrices() {
    await this.PRODUCT_CARD_PRICE.first().waitFor();

    const displayedPrices: string[] =
      await this.PRODUCT_CARD_PRICE.allTextContents();

    return displayedPrices.map((price) => parseFloat(price.replace("$", "")));
  }

  /**
   * Returns an array of all the Product Names visible on the page
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
    await expect(this.PRODUCT_NO_RESULTS).toBeVisible();
    await expect(this.PRODUCT_NO_RESULTS).toHaveText(
      "There are no products found.",
    );
  }
}
export default ProductsPage;
