import { test, expect } from "../../../fixtures";

test.describe("Login Scenarios", () => {
  test.beforeEach(async ({ page, navigation, loginPage }) => {
    await page.goto("");
    await navigation.navigateTo("Sign In");
    await loginPage.isLoginPageLoaded();
  });

  test.describe("Happy Path Scenarios", () => {
    test("Login Success - Valid credentials", async ({ page, loginPage }) => {
      // Set up an intercept to validate login request
      const loginRequest = page.waitForResponse("**/users/login");

      await loginPage.loginAs("admin");
      expect((await loginRequest).status()).toBe(200);
    });
  });

  test.describe("Validation Scenarios", () => {
    test("Login Errors - No email no password", async ({ loginPage }) => {
      await loginPage.clickLoginButton();
      await loginPage.validateEmailError("Email is required");
      await loginPage.validatePasswordError("Password is required");
      await loginPage.isLoginPageLoaded();
    });

    test("Login Errors - Invalid email format", async ({ loginPage }) => {
      await loginPage.inputEmail("invalidFormat");
      await loginPage.clickLoginButton();
      await loginPage.validateEmailError("Email format is invalid");
    });

    test("Login Errors - Invalid password length", async ({ loginPage }) => {
      await loginPage.inputPassword("1");
      await loginPage.clickLoginButton();
      await loginPage.validatePasswordError("Password length is invalid");
    });

    test("Login Errors - Incorrect credentials", async ({ loginPage }) => {
      await loginPage.inputEmail("dummy@email.com");
      await loginPage.inputPassword("Password123");
      await loginPage.clickLoginButton();
      await loginPage.validateLoginProcessError("Invalid email or password");
    });
  });
});
