import { expect, Page } from "@playwright/test";

class ProductDetailsPage {
  constructor(private page: Page) {}

  private PRODUCT_NAME = this.page.getByTestId("product-name");
  private PRODUCT_PRICE = this.page.getByTestId("unit-price");
  private PRODUCT_DESC = this.page.getByTestId("product-description");
  private PRODUCT_QUANTITY_DEC = this.page.getByTestId("decrease-quantity");
  private PRODUCT_QUANTITY_INC = this.page.getByTestId("increase-quantity");
  private PRODUCT_QUANTITY = this.page.getByTestId("quantity");
  private PRODUCT_ADD_TO_CART_BTN = this.page.getByTestId("add-to-cart");

  /**
   * Validate that the main elements of the page are visible
   */
  async isProductDetailsPageLoaded() {
    await expect(this.PRODUCT_NAME).toBeVisible();
    await expect(this.PRODUCT_PRICE).toBeVisible();
    await expect(this.PRODUCT_DESC).toBeVisible();
    await expect(this.PRODUCT_QUANTITY).toBeVisible();
    await expect(this.PRODUCT_ADD_TO_CART_BTN).toBeVisible();
  }

  /**
   * Decrease or Increase the Item's Quantity by X amount
   * @param operationType
   * @param amount
   */
  async changeQuantityBy(
    operationType: "decrease" | "increase",
    amount: number,
  ) {
    const initialValue = parseInt(await this.PRODUCT_QUANTITY.inputValue());

    if (operationType === "decrease") {
      for (let i = 0; i < amount; i++) {
        await this.PRODUCT_QUANTITY_DEC.click();
      }
    } else if (operationType === "increase") {
      for (let i = 0; i < amount; i++) {
        await this.PRODUCT_QUANTITY_INC.click();
      }
    }
    await expect(this.PRODUCT_QUANTITY).toHaveValue(
      (initialValue + amount).toString(),
    );
  }

  /**
   * Click the Add To Cart button
   */
  async clickAddToCart() {
    const addToCartResponse = this.page.waitForResponse(
      (response) =>
        response.url().includes("/carts/") &&
        response.request().method() === "POST",
    );
    await this.PRODUCT_ADD_TO_CART_BTN.click();
    await addToCartResponse;
  }
}
export default ProductDetailsPage;
