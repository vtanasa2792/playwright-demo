import { test, expect } from "@playwright/test";
import NavigationComponent from "../../pages/navigation";
import LoginPage from "../../pages/loginPage";

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

      await Login.loginAs("admin");
      expect((await loginRequest).status()).toBe(200);
    });
  });

  test.describe("Validation Scenarios", () => {
    test("Login Errors - No email no password", async () => {
      await Login.clickLoginButton();
      await Login.validateEmailError("Email is required");
      await Login.validatePasswordError("Password is required");
      await Login.isLoginPageLoaded();
    });

    test("Login Errors - Invalid email format", async () => {
      await Login.inputEmail("invalidFormat");
      await Login.clickLoginButton();
      await Login.validateEmailError("Email format is invalid");
    });

    test("Login Errors - Invalid password length", async () => {
      await Login.inputPassword("1");
      await Login.clickLoginButton();
      await Login.validatePasswordError("Password length is invalid");
    });

    test("Login Errors - Incorrect credentials", async () => {
      await Login.inputEmail("dummy@email.com");
      await Login.inputPassword("Password123");
      await Login.clickLoginButton();
      await Login.validateLoginProcessError("Invalid email or password");
    });
  });
});
