import { expect, Page } from "@playwright/test";
type PaymentMethods =
  | "Bank Transfer"
  | "Cash on Delivery"
  | "Credit Card"
  | "Buy Now Pay Later"
  | "Gift Card";

class ShoppingCartPage {
  constructor(private page: Page) {}

  private CART_PRODUCT_TITLE = this.page.getByTestId("product-title");
  private CART_PROCEED_BTN = this.page.locator('[data-test^="proceed-"]');
  private CART_SELECT_PAYMENT_METHOD = this.page.getByTestId("payment-method");
  private CART_CONFIRM_PAYMENT_METHOD = this.page.getByTestId("finish");

  /**
   * Set the quantity of an item in the Shopping Cart
   * @param itemName
   * @param amount
   */
  async changeQuantityTo(itemName: string, amount: number) {
    const updateQuantityResponse = this.page.waitForResponse((response) =>
      response.url().includes("/product/quantity"),
    );
    const cartTableRow = this.getCartRowByItem(itemName);
    await cartTableRow.getByTestId("product-quantity").fill(amount.toString());
    await cartTableRow.getByTestId("product-quantity").press("Tab");
    await updateQuantityResponse;
  }

  /**
   * Validate that an item is present in the Shopping Cart
   * @param itemName
   */
  async expectItemInCart(itemName: string) {
    const cartTableRow = this.getCartRowByItem(itemName);
    await expect(cartTableRow.getByTestId("product-title")).toHaveText(
      itemName,
    );
  }

  /**
   * Validate that an item's Quantity is the correct value
   * @param itemName
   * @param quantity
   */
  async expectItemQuantity(itemName: string, quantity: number) {
    const cartTableRow = this.getCartRowByItem(itemName);
    await expect(cartTableRow.getByTestId("product-quantity")).toHaveValue(
      quantity.toString(),
    );
  }

  /**
   * Validate that an item's Total Price is the correct value
   * @param itemName
   */
  async expectItemPriceTotal(itemName: string) {
    const cartTableRow = this.getCartRowByItem(itemName);
    const itemQuantity = await cartTableRow
      .getByTestId("product-quantity")
      .inputValue();
    const itemUnitPrice = await cartTableRow
      .getByTestId("product-price")
      .textContent();
    const itemTotalPrice = await cartTableRow
      .getByTestId("line-price")
      .textContent();

    expect(parseFloat(itemTotalPrice!.replace("$", ""))).toBe(
      parseInt(itemQuantity) * parseFloat(itemUnitPrice!.replace("$", "")),
    );
  }

  /**
   * Click the Proceed to Checkout button
   */
  async clickProceedToCheckout() {
    await this.CART_PROCEED_BTN.filter({ visible: true }).click();
  }

  /**
   * Open the Payment Method dropdown and selects the desired option
   * @param paymentMethod
   */
  async selectPaymentMethod(paymentMethod: PaymentMethods) {
    await this.CART_SELECT_PAYMENT_METHOD.click();
    await this.CART_SELECT_PAYMENT_METHOD.selectOption(paymentMethod);
  }

  /**
   * Click the Confirm Payment Method button to complete the purhcase
   */
  async clickConfirmPaymentMethod() {
    await this.CART_CONFIRM_PAYMENT_METHOD.click();
  }

  /**
   * Utility function. Fetch the table row of an item in the Shopping Cart
   */
  private getCartRowByItem(itemName: string) {
    return this.page
      .locator("tr")
      .filter({ has: this.CART_PRODUCT_TITLE })
      .filter({ hasText: itemName });
  }
}
export default ShoppingCartPage;
