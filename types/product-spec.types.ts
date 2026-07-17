// ------- Product Spec Request ----------------------------------------------------------------------------
export interface AddORUpdateSpecToAProductRequest {
  spec_name: string;
  spec_value: string;
  spec_unit: string | null;
}

// ------- Product Spec Common ----------------------------------------------------------------------------
export interface ProductSpecification {
  id: string;
  product_id: string;
  spec_name: string;
  spec_value: string;
  spec_unit: string | null;
}

export interface ProductSpecificationName {
  name: string;
  values: string[];
  unit: string | null;
}

// ------- Product Spec Response ----------------------------------------------------------------------------

export type GetProductSpecificationsResponse = ProductSpecification[];

export type GetProductSpecificationByIdResponse = ProductSpecification;

export type GetProductSpecificationNamesResponse = ProductSpecificationName[];

export interface AddProductSpecResponse {
  id: string;
  product_id: string;
  spec_name: string;
  spec_value: string;
  spec_unit: string | null;
}

export interface ProductSpecMutation {
  success: boolean;
}
