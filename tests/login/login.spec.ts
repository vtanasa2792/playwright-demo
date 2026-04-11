import { test } from "@playwright/test";
import { expect } from "@playwright/test";
import NavigationComponent from "../../pages/navigation";
import LoginPage from "../../pages/loginPage";
import UserConfig from "../../config/UserConfig";

test.describe("Login Scenarios", () => {
  let Login: LoginPage;
  let Navigation: NavigationComponent;

  test.beforeEach(async ({ page }) => {
    Navigation = new NavigationComponent(page);
    Login = new LoginPage(page);

    await page.goto("");
    await Navigation.navigateTo("Sign In");
    await Login.isLoginPageLoaded();
  });

  test.describe("Happy Path Scenarios", () => {
    test("Login Success - Valid credentials", async ({ page }) => {
      // Set up an intercept to validate login request
      const loginRequest = page.waitForResponse("**/users/login");

      // Parse the credentials for the Admin user
      const { email, password } = new UserConfig().getCredentials("admin");

      // Login using parsed credentials
      await Login.inputEmail(email);
      await Login.inputPassword(password);
      await Login.clickLoginButton();

      // Validate login request is successful
      expect((await loginRequest).status()).toBe(200);
    });
  });

  test.describe("Validation Scenarios", () => {
    test("Login Errors - No email no password", async () => {
      // Click Login Button to trigger errors
      await Login.clickLoginButton();

      //Validate errors
      await Login.validateEmailError("Email is required");
      await Login.validatePasswordError("Password is required");

      // Assert user is still on Login Page
      await Login.isLoginPageLoaded();
    });

    test("Login Errors - Invalid email format", async () => {
      // Insert an invalid email format
      await Login.inputEmail("invalidFormat");

      // Click Login Button to trigger error
      await Login.clickLoginButton();

      //Validate errors
      await Login.validateEmailError("Email format is invalid");
    });

    test("Login Errors - Invalid password length", async () => {
      // Insert an invalid password length
      await Login.inputPassword("1");

      // Click Login Button to trigger error
      await Login.clickLoginButton();

      //Validate errors
      await Login.validatePasswordError("Password length is invalid");
    });

    test("Login Errors - Incorrect credentials", async () => {
      // Insert valid but incorrect credentials
      await Login.inputEmail("dummy@email.com");
      await Login.inputPassword("Password123");

      // Click Login Button to trigger error
      await Login.clickLoginButton();

      // Validate error
      await Login.validateLoginProcessError("Invalid email or password");
    });
  });
});
