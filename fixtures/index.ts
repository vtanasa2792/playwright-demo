import { mergeTests } from "@playwright/test";
import { test as authTest } from "./api/auth.fixtures";
import { test as brandsTest } from "./api/brands.fixtures";
import { test as pageTest } from "./e2e/pages.fixtures";

export const test = mergeTests(authTest, brandsTest, pageTest);
export { expect } from "@playwright/test";
