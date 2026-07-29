import z from "zod";

export const BrandSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

export const ValidationErrorSchema = z.record(z.string(), z.array(z.string()));

export const DefaultErrorSchema = z.object({ message: z.string() });

export type Brand = z.infer<typeof BrandSchema>;

export const BrandListSchema = z.array(BrandSchema);

export const CreateBrandSchema = BrandSchema.omit({ id: true });

export type CreateBrand = z.infer<typeof CreateBrandSchema>;
