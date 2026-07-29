import { expect } from "@playwright/test";
import z from "zod";

/**
 * Validate a data input against a desired Zod schema
 * @returns the prased data result
 */
export function validateSchema<T extends z.ZodType>(schema: T, data: unknown) {
  const parseResult = schema.safeParse(data);
  expect(
    parseResult.success,
    parseResult.error && z.prettifyError(parseResult.error),
  ).toBe(true);
  return parseResult.data as z.infer<T>;
}
