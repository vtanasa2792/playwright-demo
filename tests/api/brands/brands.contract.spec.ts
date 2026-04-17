import { expect, request, test } from "@playwright/test";
import { BrandListSchema, BrandSchema, CreateBrand } from "./brands.schema";
import Authentication from "../../../utilities/clients/auth.client";

test.describe("API Contract - Brands", () => {
  let adminBearerToken: string;
  const idsOfCreatedBrands: string[] = [];

  test.beforeAll(async ({ request }) => {
    adminBearerToken = await new Authentication(request).loginAs("admin");
  });

  test.afterAll(async ({ request }) => {
    for (let brandToDelete of idsOfCreatedBrands) {
      const deleteBrandResp = await request.delete(`/brands/${brandToDelete}`, {
        headers: { Authorization: `Bearer ${adminBearerToken}` },
      });
      expect(deleteBrandResp.status()).toBe(204);
    }
  });

  test("GET /brands returns a list of brands matching the contract", async ({
    request,
  }) => {
    const getAllBrandsResp = await request.get("/brands");
    const getAllBrandsBody = await getAllBrandsResp.json();

    expect(getAllBrandsResp.status()).toBe(200);
    expect(() => BrandListSchema.parse(getAllBrandsBody)).not.toThrow();
  });

  test("POST /brands store a new brand", async ({ request }) => {
    const newBrandPayload: CreateBrand = {
      name: "My Brand",
      slug: `my-brand-${Date.now()}`,
    };
    const createNewBrandsResp = await request.post("/brands", {
      headers: { Authorization: `Bearer ${adminBearerToken}` },
      data: newBrandPayload,
    });
    const createNewBrandsBody = await createNewBrandsResp.json();

    expect(createNewBrandsResp.status()).toBe(201);
    expect(() => BrandSchema.parse(createNewBrandsBody)).not.toThrow();

    idsOfCreatedBrands.push(createNewBrandsBody.id);
  });

  test("GET /brands/:id returns the details of a specific brand", async ({
    request,
  }) => {
    const getAllBrandsResp = await request.get("/brands");
    const getAllBrandsBody = await getAllBrandsResp.json();

    const getBrandByIdResp = await request.get(
      `/brands/${getAllBrandsBody[0].id}`,
    );
    const getBrandByIdBody = await getBrandByIdResp.json();

    expect(getBrandByIdResp.status()).toBe(200);
    expect(() => BrandSchema.parse(getBrandByIdBody)).not.toThrow();
  });
});
