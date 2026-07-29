import { test as base } from "@playwright/test";
import Authentication from "../../utilities/clients/auth.client";

type BrandsFixtures = {
  createdBrandsCleanup: (id: string) => void;
};

export const test = base.extend<BrandsFixtures>({
  /**
   * Tracks brand IDs created during a test and deletes them once the test
   * finishes, regardless of pass/fail. Call the fixture with the ID of any
   * brand created via the API to have it cleaned up automatically.
   */
  createdBrandsCleanup: async ({ request }, use) => {
    const ids: string[] = [];

    await use((id: string) => ids.push(id));

    if (ids.length === 0) return;

    const token = await new Authentication(request).loginAs("admin");
    for (const id of ids) {
      await request.delete(`/brands/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  },
});
