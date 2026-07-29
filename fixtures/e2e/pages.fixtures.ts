import { test as base } from "@playwright/test";
import ProductsPage from "../../pages/productsPage";
import LoginPage from "../../pages/loginPage";
import ProductDetailsPage from "../../pages/productDetailsPage";
import ShoppingCartPage from "../../pages/shoppingCartPage";
import NavigationComponent from "../../pages/navigation";

type PageFixtures = {
  productsPage: ProductsPage;
  loginPage: LoginPage;
  productDetailsPage: ProductDetailsPage;
  shoppingCartPage: ShoppingCartPage;
  navigation: NavigationComponent;
};

export const test = base.extend<PageFixtures>({
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  shoppingCartPage: async ({ page }, use) => {
    await use(new ShoppingCartPage(page));
  },
  navigation: async ({ page }, use) => {
    await use(new NavigationComponent(page));
  },
});
