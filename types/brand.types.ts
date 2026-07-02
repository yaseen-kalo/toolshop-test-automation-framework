// ----------- Request Interfaces -----------------------------------------------------------------
export interface BrandRequest {
  name: string;
  slug: string;
}

export interface PartialBrandRequest extends Partial<BrandRequest> {}

// ----------- Response Interfaces -----------------------------------------------------------------

export interface BrandResponse {
  id: string;
  name: string;
  slug: string;
}

export type GetBrandsResponse = BrandResponse[];
export type GetBrandByIdResponse = BrandResponse;
export type GetBrandByNameResponse = BrandResponse[];

export type PostBrandResponse = BrandResponse;

export interface MutationBrandResponse {
  success: boolean;
}
