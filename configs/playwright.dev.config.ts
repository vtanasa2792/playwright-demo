import { defineConfig, devices } from "@playwright/test";
import baseConfig from "./playwright.base.config";

export default defineConfig({
  ...baseConfig,
  projects: [
    {
      name: "api",
      testDir: "../tests/api",
      use: {
        baseURL: "https://api.practicesoftwaretesting.com",
      },
    },
    {
      name: "e2e",
      testDir: "../tests/e2e",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://practicesoftwaretesting.com",
      },
    },
  ],
});
