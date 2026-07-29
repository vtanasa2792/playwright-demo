import { expect, test } from "../../../fixtures/index";
import { validateSchema } from "../../../utilities/validators";
import { BrandSchema, CreateBrand } from "../../../schemas/brands.schema";

test.describe("API Functional - Brands", () => {
  const uniqueSuffix = Date.now();

  const initialPayload: CreateBrand = {
    name: "Original Brand",
    slug: `original-brand-${uniqueSuffix}`,
  };

  const updatedPayload: CreateBrand = {
    name: "Updated Brand",
    slug: `updated-brand-${uniqueSuffix}`,
  };

  test("Brand CRUD lifecycle", async ({ request, adminToken }) => {
    const authHeader = { Authorization: `Bearer ${adminToken}` };

    let createdBrandId: string;

    await test.step("Create a new brand", async () => {
      const response = await request.post("/brands", {
        headers: authHeader,
        data: initialPayload,
      });
      const body = await response.json();
      const brand = validateSchema(BrandSchema, body);

      expect(response.status()).toBe(201);
      expect(brand.name).toBe(initialPayload.name);
      expect(brand.slug).toBe(initialPayload.slug);

      createdBrandId = brand.id;
    });

    await test.step("Read the created brand by id", async () => {
      const response = await request.get(`/brands/${createdBrandId}`);
      const body = await response.json();

      expect(response.status()).toBe(200);
      expect(body.id).toBe(createdBrandId);
      expect(body.name).toBe(initialPayload.name);
      expect(body.slug).toBe(initialPayload.slug);
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
      const body = await response.json();

      expect(response.status()).toBe(200);
      expect(body.name).toBe(updatedPayload.name);
      expect(body.slug).toBe(updatedPayload.slug);
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
