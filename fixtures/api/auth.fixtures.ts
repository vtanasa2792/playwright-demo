import { test as base } from "@playwright/test";
import Authentication from "../../utilities/clients/auth.client";

type AuthFixtures = {
  adminToken: string;
  customerToken: string;
};

export const test = base.extend<AuthFixtures>({
  adminToken: async ({ request }, use) => {
    const token = await new Authentication(request).loginAs("admin");
    await use(token);
  },
  customerToken: async ({ request }, use) => {
    const token = await new Authentication(request).loginAs("customer1");
    await use(token);
  },
});
