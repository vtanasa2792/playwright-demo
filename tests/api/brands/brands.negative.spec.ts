import { expect, test } from "../../../fixtures/index";
import {
  CreateBrand,
  DefaultErrorSchema,
  ValidationErrorSchema,
} from "../../../schemas/brands.schema";
import { validateSchema } from "../../../utilities/validators";

test.describe("Brands API - negative", () => {
  const nonExistentBrandId = "00000000000000000000000000";

  test.describe("/brands (collection)", () => {
    for (const verb of ["PUT", "PATCH", "DELETE"]) {
      test(`${verb} -> 405 method not allowed`, async ({ request }) => {
        const response = await request.fetch("/brands", { method: verb });
        const body = await response.json();

        // Validate Reponse Status
        expect(response.status()).toBe(405);

        // Validate Response Error Schema
        validateSchema(DefaultErrorSchema, body);
      });
    }

    test("POST with duplicate slug -> 409 conflict", async ({
      request,
      createdBrandsCleanup,
    }) => {
      const uniqueSuffix = Date.now();
      const initialPayload: CreateBrand = {
        name: "Original Brand",
        slug: `original-brand-${uniqueSuffix}`,
      };

      //Create a new Brand
      const originalResponse = await request.post("/brands", {
        data: initialPayload,
      });
      const originalBody = await originalResponse.json();
      createdBrandsCleanup(originalBody.id);

      //Create duplicate
      const duplicateResponse = await request.post("/brands", {
        data: initialPayload,
      });
      const duplicateBody = await duplicateResponse.json();

      // Validate Reponse Status
      expect(duplicateResponse.status()).toBe(409);

      // Validate Response Error Schema
      validateSchema(ValidationErrorSchema, duplicateBody);
    });
  });

  test.describe("/brands/{brandId} (item)", () => {
    test("POST -> 405 method not allowed", async ({ request }) => {
      //Create a new Brand
      const response = await request.post(`/brands/${nonExistentBrandId}`);
      const body = await response.json();

      // Validate Reponse Status
      expect(response.status()).toBe(405);

      // Validate Response Error Schema
      validateSchema(DefaultErrorSchema, body);
    });

    test("GET with unknown id -> 404 not found", async ({ request }) => {
      //Create a new Brand
      const response = await request.get(`/brands/${nonExistentBrandId}`);
      const body = await response.json();

      // Validate Reponse Status
      expect(response.status()).toBe(404);

      // Validate Response Error Schema
      validateSchema(DefaultErrorSchema, body);
    });

    test("DELETE without auth -> 401 unauthorized", async ({ request }) => {
      //Delete without Auth header
      const response = await request.delete(`/brands/${nonExistentBrandId}`);
      const body = await response.json();

      // Validate Reponse Status
      expect(response.status()).toBe(401);

      // Validate Response Error Schema
      validateSchema(DefaultErrorSchema, body);
    });
  });
});
