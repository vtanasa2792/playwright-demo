import { expect, Page } from "@playwright/test";
import UserConfig from "../config/UserConfig";
class LoginPage {
  constructor(private page: Page) {}

  private LOGIN_FORM = this.page.getByTestId("login-form");
  private LOGIN_EMAIL = this.page.getByTestId("email");
  private LOGIN_PASSWORD = this.page.getByTestId("password");
  private LOGIN_SUBMIT_BTN = this.page.getByTestId("login-submit");
  private LOGIN_EMAIL_ERROR = this.page.getByTestId("email-error");
  private LOGIN_PASSWORD_ERROR = this.page.getByTestId("password-error");
  private LOGIN_PROCESS_ERROR = this.page.getByTestId("login-error");

  /**
   * Validate that the main elements of the page are visible
   */
  async isLoginPageLoaded() {
    await expect(this.LOGIN_FORM).toBeVisible();
  }

  /**
   * Input email in Login Form
   * @param loginEmail
   */
  async inputEmail(loginEmail: string) {
    await this.LOGIN_EMAIL.fill(loginEmail);
  }

  /**
   * Input password in Login form
   * @param loginPassword
   */
  async inputPassword(loginPassword: string) {
    await this.LOGIN_PASSWORD.fill(loginPassword);
  }

  /**
   * Click the Login Form submit button
   */
  async clickLoginButton() {
    await this.LOGIN_SUBMIT_BTN.click();
  }

  /**
   * Validate Email input field errors
   * @param errorMessage
   */
  async validateEmailError(errorMessage: string) {
    await expect(this.LOGIN_EMAIL_ERROR).toHaveText(errorMessage);
  }

  /**
   * Validate Password input field errors
   * @param errorMessage
   */
  async validatePasswordError(errorMessage: string) {
    await expect(this.LOGIN_PASSWORD_ERROR).toHaveText(errorMessage);
  }

  /**
   * Validate Login Form errors
   * @param errorMessage
   */
  async validateLoginProcessError(errorMessage: string) {
    await expect(this.LOGIN_PROCESS_ERROR).toHaveText(errorMessage);
  }

  /**
   * Login as X Role by parsing .env credentials
   * @param role
   */
  async loginAs(role: "admin" | "customer1") {
    const loginRequest = this.page.waitForResponse("**/users/login");
    const { email, password } = new UserConfig().getCredentials(role);
    await this.inputEmail(email);
    await this.inputPassword(password);
    await this.clickLoginButton();
    await loginRequest;
  }
}
export default LoginPage;
