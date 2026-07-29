import { test } from "../../../fixtures";
import GeneralUtilities from "../../../utilities/utilities";

const Utilities = new GeneralUtilities();

test.describe("Products Catalog Scenarios", () => {
  test.beforeEach(async ({ page, productsPage }) => {
    await page.goto("");
    await productsPage.isProductsPageLoaded();
  });

  test("Sort By Price - Ascending", async ({ productsPage }) => {
    await productsPage.sortBy("Price (Low - High)");
    const arrayOfDisplayedPrices = await productsPage.getDisplayedPrices();
    Utilities.checkArraySorting(arrayOfDisplayedPrices, "ascending");
  });

  test("Sort By Name - Descending", async ({ productsPage }) => {
    await productsPage.sortBy("Name (Z - A)");
    const arrayOfDisplayedNames = await productsPage.getDisplayedNames();
    Utilities.checkArraySorting(arrayOfDisplayedNames, "descending");
  });

  test("Search by Name - Valid Name", async ({ productsPage }) => {
    await productsPage.searchByName("Goggles");
    await productsPage.expectDisplayedNames(["Safety Goggles"]);
  });

  test("Search by Name - Invalid Name", async ({ productsPage }) => {
    await productsPage.searchByName("jalkwjfalaw");
    await productsPage.isNoSearchResultsDisplayed();
  });
});
