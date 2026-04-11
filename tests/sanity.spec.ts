import { test } from "@playwright/test";
import { expect } from "@playwright/test";
import Navigation from "../pages/navigation";
import LoginPage from "../pages/loginPage";

test.beforeEach(async ({ page }) => {});

test("Title", async ({ page }) => {
  const Nav = new Navigation(page);
  const Login = new LoginPage(page);
  await page.goto("");
  await Nav.navigateTo("Sign In");
  await Login.isLoginPageLoaded();
  await Login.inputEmail("admin@practicesoftwaretesting.com");
  await Login.inputPassword("welcome01");
  await Login.clickLoginButton();
  await page.waitForURL("**/admin/dashboard");
  expect(page.url()).toContain("/admin/dashboard");
});
