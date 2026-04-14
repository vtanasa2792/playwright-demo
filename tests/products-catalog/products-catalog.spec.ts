import { expect, test } from "@playwright/test";
import ProductsPage from "../../pages/productsPage";
import GeneralUtilities from "../../utilities/utilities";

test.describe("Products Catalog Scenarios", () => {
  let Products: ProductsPage;
  let Utilities: GeneralUtilities;

  test.beforeEach(async ({ page }) => {
    Products = new ProductsPage(page);
    Utilities = new GeneralUtilities();

    await page.goto("");
    await Products.isProductsPageLoaded();
  });

  test("Sort By Price - Ascending", async () => {
    await Products.sortBy("Price (Low - High)");
    const arrayOfDisplayedPrices = await Products.getDisplayedPrices();
    Utilities.checkArraySorting(arrayOfDisplayedPrices, "ascending");
  });

  test("Sort By Name - Descending", async () => {
    await Products.sortBy("Name (Z - A)");
    const arrayOfDisplayedNames = await Products.getDisplayedNames();
    Utilities.checkArraySorting(arrayOfDisplayedNames, "descending");
  });

  test("Search by Name - Valid Name", async () => {
    await Products.searchByName("Goggles");
    const arrayOfDisplayedNames = await Products.getDisplayedNames();
    expect(arrayOfDisplayedNames).toEqual(["Safety Goggles"]);
  });

  test("Search by Name - Invalid Name", async () => {
    await Products.searchByName("jalkwjfalaw");
    await Products.isNoSearchResultsDisplayed();
  });
});
