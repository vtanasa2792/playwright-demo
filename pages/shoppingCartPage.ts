import { expect, Page } from "@playwright/test";
type PaymentMethods =
  | "Bank Transfer"
  | "Cash on Delivery"
  | "Credit Card"
  | "Buy Now Pay Later"
  | "Gift Card";

type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
};

class ShoppingCartPage {
  constructor(private page: Page) {}

  private CART_PRODUCT_TITLE = this.page.getByTestId("product-title");
  private CART_PROCEED_BTN = this.page.locator('[data-test^="proceed-"]');
  private CART_SELECT_PAYMENT_METHOD = this.page.getByTestId("payment-method");
  private CART_CONFIRM_PAYMENT_METHOD = this.page.getByTestId("finish");

  private CART_BILLING_ADDR_STREET = this.page.getByTestId("street");
  private CART_BILLING_ADDR_CITY = this.page.getByTestId("city");
  private CART_BILLING_ADDR_STATE = this.page.getByTestId("state");
  private CART_BILLING_ADDR_COUNTRY = this.page.getByTestId("country");
  private CART_BILLING_ADDR_POSTAL_CODE = this.page.getByTestId("postal_code");

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
    const quantityLocator = cartTableRow.getByTestId("product-quantity");
    const itemQuantity = await quantityLocator.inputValue();
    await expect(quantityLocator).toHaveValue(itemQuantity);
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
    const proceedToCheckoutBtn = this.CART_PROCEED_BTN.filter({
      visible: true,
    });
    await expect(proceedToCheckoutBtn).toBeEnabled();
    await proceedToCheckoutBtn.click();
  }

  /**
   * Fill in the Billing Address form
   * @param address
   */
  async fillBillingAddress(address: Address) {
    // Slowed down sequantial typing is needed due to Form Validation flakyness
    await this.CART_BILLING_ADDR_STREET.pressSequentially(address.street, {
      delay: 100,
    });
    await this.CART_BILLING_ADDR_CITY.pressSequentially(address.city, {
      delay: 100,
    });
    await this.CART_BILLING_ADDR_STATE.pressSequentially(address.state, {
      delay: 100,
    });
    await this.CART_BILLING_ADDR_COUNTRY.pressSequentially(address.country, {
      delay: 100,
    });
    await this.CART_BILLING_ADDR_POSTAL_CODE.pressSequentially(
      address.postal_code,
      { delay: 100 },
    );
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
