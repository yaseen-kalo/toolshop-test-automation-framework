import { CategoryRequest } from "@models/category.types";

// ----------- Category Payload can be used for PUT/POST requests -----------------------------------------------------------------

/**
 * Builds a full CategoryRequest payload for POST/PUT requests.
 * - Generates a unique suffix (timestamp + random number) to avoid data collisions across parallel/sequential test runs.
 * - `name`: uses override if provided, otherwise a unique default name.
 * - `slug`: if override provided, suffix is appended to keep it unique; otherwise a default unique slug is generated.
 * - `parent_id`: passed through as-is (undefined if not provided), so top-level categories omit it naturally.
 *
 * @param override - Partial fields to override the generated defaults.
 * @returns A complete CategoryRequest object ready to send as a request body.
 */

export const getCategoryPayload = (
  override: Partial<CategoryRequest> = {},
): CategoryRequest => {
  const timestamp = Date.now();
  const randomNumber = Math.floor(Math.random() * 1000);
  const suffix = `${timestamp}${randomNumber}`;

  return {
    name: override.name ?? `Category ${suffix}`,
    slug: override.slug ? `${override.slug}-${suffix}` : `slug-${suffix}`,
    parent_id: override.parent_id,
  };
};

// ----------- Partial Category Payload can be used for PATCH requests -----------------------------------------------------------------

/**
 * Builds a partial CategoryRequest payload for PATCH requests.
 * - No defaults or unique data are generated here — it simply passes through
 *   whatever fields the caller provides (a shallow copy of `override`).
 * - Useful for testing partial updates (e.g. updating only `name` or only `parent_id`)
 *   without needing a full payload.
 *
 * @param override - The specific fields to include in the PATCH body.
 * @returns A shallow copy of `override`, typed as Partial<CategoryRequest>.
 */

export const getPartialCategoryPayload = (
  override: Partial<CategoryRequest> = {},
): Partial<CategoryRequest> => {
  return { ...override };
};
