import { BrandRequest } from "@models/brand.types";

export const getBrandPayload = () => {
  const timestamp = Date.now();
  const randomNumber = Math.floor(Math.random() * 1000);
  const suffix = `${timestamp}${randomNumber}`;

  return {
    name: `Brand ${suffix}`,
    slug: `slug-${suffix}`,
  } as BrandRequest;
};

export const getPartialBrandPayload = (
  override: Partial<BrandRequest> = {},
): Partial<BrandRequest> => {
  return { ...override };
};
