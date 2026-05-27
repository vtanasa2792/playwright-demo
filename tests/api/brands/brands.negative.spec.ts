import { test, expect } from "@playwright/test";
import {
  CreateBrand,
  DefaultErrorSchema,
  ValidationErrorSchema,
} from "./brands.schema";
import Authentication from "../../../utilities/clients/auth.client";

test.describe("Brands API - negative", () => {
  const idsOfCreatedBrands: string[] = [];
  const nonExistentBrandId = "00000000000000000000000000";

  test.afterAll("Cleanup", async ({ request }) => {
    const adminBearerToken = await new Authentication(request).loginAs("admin");
    for (let brandToDelete of idsOfCreatedBrands) {
      await request.delete(`/brands/${brandToDelete}`, {
        headers: { Authorization: `Bearer ${adminBearerToken}` },
      });
    }
  });

  test.describe("/brands (collection)", () => {
    for (const verb of ["PUT", "PATCH", "DELETE"]) {
      test(`${verb} -> 405 method not allowed`, async ({ request }) => {
        const fetchResponse = await request.fetch("/brands", { method: verb });
        const fetchResponseBody = await fetchResponse.json();

        expect(fetchResponse.status()).toBe(405);
        expect(() => DefaultErrorSchema.parse(fetchResponseBody)).not.toThrow();
      });
    }

    test("POST with duplicate slug -> 409 conflict", async ({ request }) => {
      const uniqueSuffix = Date.now();
      const initialPayload: CreateBrand = {
        name: "Original Brand",
        slug: `original-brand-${uniqueSuffix}`,
      };

      //Create a new Brand
      const createBrandResponse = await request.post("/brands", {
        data: initialPayload,
      });
      const createdBrandBody = await createBrandResponse.json();
      idsOfCreatedBrands.push(createdBrandBody.id);

      //Create duplicate
      const createDuplicateBrandResponse = await request.post("/brands", {
        data: initialPayload,
      });
      const createDuplicateBrandBody =
        await createDuplicateBrandResponse.json();

      //Assert 409 & Error schema
      expect(createDuplicateBrandResponse.status()).toBe(409);
      expect(() =>
        ValidationErrorSchema.parse(createDuplicateBrandBody),
      ).not.toThrow();
    });
  });

  test.describe("/brands/{brandId} (item)", () => {
    test("POST -> 405 method not allowed", async ({ request }) => {
      //Create a new Brand
      const postResponse = await request.post(`/brands/${nonExistentBrandId}`);
      const postResponseBody = await postResponse.json();

      //Assert 405 & Error schema
      expect(postResponse.status()).toBe(405);
      expect(() => DefaultErrorSchema.parse(postResponseBody)).not.toThrow();
    });

    test("GET with unknown id -> 404 not found", async ({ request }) => {
      //Create a new Brand
      const getResponse = await request.get(`/brands/${nonExistentBrandId}`);
      const getResponseBody = await getResponse.json();

      //Assert 404 & Error schema
      expect(getResponse.status()).toBe(404);
      expect(() => DefaultErrorSchema.parse(getResponseBody)).not.toThrow();
    });

    test("DELETE without auth -> 401 unauthorized", async ({ request }) => {
      //Delete without Auth header
      const deleteResponse = await request.delete(
        `/brands/${nonExistentBrandId}`,
      );
      const deleteResponseBody = await deleteResponse.json();

      //Assert 401 & error schema
      expect(deleteResponse.status()).toBe(401);
      expect(() => DefaultErrorSchema.parse(deleteResponseBody)).not.toThrow();
    });
  });
});
