import { expect, test } from "../../../fixtures/index";
import { validateSchema } from "../../../utilities/validators";
import {
  BrandListSchema,
  BrandSchema,
  CreateBrand,
} from "../../../schemas/brands.schema";

test.describe("API Contract - Brands", () => {
  test("GET /brands returns a list of brands matching the contract", async ({
    request,
  }) => {
    const response = await request.get("/brands");
    const body = await response.json();

    // Validate Response
    expect(response.status()).toBe(200);

    // Validate non 0 length
    expect(body.length).toBeGreaterThan(0);

    // Validate Response Schema
    validateSchema(BrandListSchema, body);
  });

  test("POST /brands store a new brand", async ({
    request,
    adminToken,
    createdBrandsCleanup,
  }) => {
    const newBrandPayload: CreateBrand = {
      name: "My Brand",
      slug: `my-brand-${Date.now()}`,
    };
    const response = await request.post("/brands", {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: newBrandPayload,
    });
    const body = await response.json();

    // Validate Response
    expect(response.status()).toBe(201);

    // Validate Response Schema
    validateSchema(BrandSchema, body);

    // Gather ID for cleanup
    createdBrandsCleanup(body.id);
  });

  test("GET /brands/:id returns the details of a specific brand", async ({
    request,
  }) => {
    const listResponse = await request.get("/brands");
    const listBody = await listResponse.json();

    const itemResponse = await request.get(`/brands/${listBody[0].id}`);
    const itemBody = await itemResponse.json();

    // Validate Response Status
    expect(itemResponse.status()).toBe(200);

    // Validate Response Schema
    validateSchema(BrandSchema, itemBody);
  });
});
