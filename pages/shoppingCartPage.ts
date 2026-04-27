import { expect, Page } from "@playwright/test";
type PaymentMethods =
  | "Bank Transfer"
  | "Cash on Delivery"
  | "Credit Card"
  | "Buy Now Pay Later"
  | "Gift Card";

type Address = {
  country: string;
  postal_code: string;
  house_number: string;
};

class ShoppingCartPage {
  constructor(private page: Page) {}

  private CART_PRODUCT_TITLE = this.page.getByTestId("product-title");
  private CART_PROCEED_BTN = this.page.locator('[data-test^="proceed-"]');
  private CART_SELECT_PAYMENT_METHOD = this.page.getByTestId("payment-method");
  private CART_CONFIRM_PAYMENT_METHOD = this.page.getByTestId("finish");

  private CART_BILLING_ADDR_HOUSE_NO = this.page.getByTestId("house_number");
  private CART_BILLING_ADDR_COUNTRY = this.page.getByTestId("country");
  private CART_BILLING_ADDR_POSTAL_CODE = this.page.getByTestId("postal_code");

  private CART_GUEST_LOGIN_TAB = this.page.getByRole("tab", {
    name: "Continue as Guest",
  });
  private CART_GUEST_EMAIL_INPUT = this.page.getByTestId("guest-email");
  private CART_GUEST_FIRST_NAME_INPUT =
    this.page.getByTestId("guest-first-name");
  private CART_GUEST_LAST_NAME_INPUT = this.page.getByTestId("guest-last-name");
  private CARG_GUEST_SUBMIT_BTN = this.page.getByTestId("guest-submit");

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
   * Switch to the Continue as Guest tab on the Sign In step
   */
  async clickContinueAsGuestTab() {
    await this.CART_GUEST_LOGIN_TAB.click();
  }

  /**
   * Fill in the Guest checkout form and submit it
   * @param email
   * @param firstName
   * @param lastName
   */
  async signUpAsGuest(email: string, firstName: string, lastName: string) {
    await this.CART_GUEST_EMAIL_INPUT.fill(email);
    await this.CART_GUEST_FIRST_NAME_INPUT.fill(firstName);
    await this.CART_GUEST_LAST_NAME_INPUT.fill(lastName);
    await this.CARG_GUEST_SUBMIT_BTN.click();
  }

  /**
   * Fill in the Billing Address details. Country + house number + postal code
   * are the user-entered fields; the postcode lookup auto-fills the rest.
   */
  async fillBillingDetails(address: Address) {
    await this.CART_BILLING_ADDR_COUNTRY.click();
    await this.CART_BILLING_ADDR_COUNTRY.selectOption({
      label: address.country,
    });

    await this.CART_BILLING_ADDR_HOUSE_NO.fill(address.house_number);
    await expect(this.CART_BILLING_ADDR_HOUSE_NO).toHaveValue(
      address.house_number,
    );

    const postalCodeLookup = this.page.waitForResponse((response) =>
      response.url().includes("postcode-lookup"),
    );
    await this.CART_BILLING_ADDR_POSTAL_CODE.fill(address.postal_code);
    await postalCodeLookup;
    await expect(this.CART_BILLING_ADDR_POSTAL_CODE).toHaveValue(
      address.postal_code,
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
