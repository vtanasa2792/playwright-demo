import { expect, test } from "@playwright/test";
import { BrandSchema, CreateBrand } from "./brands.schema";
import Authentication from "../../../utilities/clients/auth.client";

test.describe("API Functional - Brands", () => {
  let adminBearerToken: string;

  test.beforeAll(async ({ request }) => {
    adminBearerToken = await new Authentication(request).loginAs("admin");
  });

  test("Brand CRUD lifecycle", async ({ request }) => {
    const authHeader = { Authorization: `Bearer ${adminBearerToken}` };
    const uniqueSuffix = Date.now();

    const initialPayload: CreateBrand = {
      name: "Original Brand",
      slug: `original-brand-${uniqueSuffix}`,
    };

    const updatedPayload: CreateBrand = {
      name: "Updated Brand",
      slug: `updated-brand-${uniqueSuffix}`,
    };

    let createdBrandId: string;

    await test.step("Create a new brand", async () => {
      const response = await request.post("/brands", {
        headers: authHeader,
        data: initialPayload,
      });
      const brand = BrandSchema.parse(await response.json());

      expect(response.status()).toBe(201);
      expect(brand.name).toBe(initialPayload.name);
      expect(brand.slug).toBe(initialPayload.slug);

      createdBrandId = brand.id;
    });

    await test.step("Read the created brand by id", async () => {
      const response = await request.get(`/brands/${createdBrandId}`);
      const brand = BrandSchema.parse(await response.json());

      expect(response.status()).toBe(200);
      expect(brand.id).toBe(createdBrandId);
      expect(brand.name).toBe(initialPayload.name);
      expect(brand.slug).toBe(initialPayload.slug);
    });

    await test.step("Update the brand", async () => {
      const response = await request.put(`/brands/${createdBrandId}`, {
        headers: authHeader,
        data: updatedPayload,
      });

      expect(response.status()).toBe(200);
    });

    await test.step("Verify the update persisted", async () => {
      const response = await request.get(`/brands/${createdBrandId}`);
      const brand = BrandSchema.parse(await response.json());

      expect(response.status()).toBe(200);
      expect(brand.name).toBe(updatedPayload.name);
      expect(brand.slug).toBe(updatedPayload.slug);
    });

    await test.step("Delete the brand", async () => {
      const response = await request.delete(`/brands/${createdBrandId}`, {
        headers: authHeader,
      });

      expect(response.status()).toBe(204);
    });

    await test.step("Verify the brand no longer exists", async () => {
      const response = await request.get(`/brands/${createdBrandId}`);

      expect(response.status()).toBe(404);
    });
  });
});
