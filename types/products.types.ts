// ----------- Request Interfaces -----------------------------------------------------------------

// Since Post and Put Request payload are identical, so use it for both
export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  category_id: string;
  brand_id: string;
  product_image_id: string;
  is_location_offer: number;
  is_rental: number;
  co2_rating: string;
}

export interface PatchProductRequest extends Partial<ProductRequest> {}

// ----------- Response Interfaces -----------------------------------------------------------------

// ─── Shared Interfaces Start ────────────────────────────────

export interface ProductImage {
  id: string;
  by_name: string;
  by_url: string;
  source_name: string;
  source_url: string;
  file_name: string;
  title: string;
}

export interface Brand {
  id: string;
  name: string;
  slug?: string;
}

export interface Category {
  id: string;
  parent_id?: string;
  name: string;
  slug: string;
  sub_categories?: string[];
}

// ─── Shared Interfaces End ────────────────────────────────

// ---- Get Products Start ------------------------------
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  is_location_offer: boolean;
  is_rental: boolean;
  co2_rating: string;
  in_stock: boolean;
  is_eco_friendly: boolean;
  product_image: ProductImage;
  category: Category;
  brand: Brand;
}

export interface GetProductsResponse {
  current_page: number;
  data: Product[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

// ---- Get Products End ------------------------------

// ---- Get Single Product By ID Start ------------------------------

export interface Spec {
  id: string;
  product_id: string;
  spec_name: string;
  spec_value: string;
  spec_unit?: string;
}

export interface GetProductByIdResponse extends Product {
  specs: Spec[];
}

// ---- Get Single Product By ID End ------------------------------

// ---- Post Product Start ------------------------------

export interface PostProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  is_location_offer: number;
  is_rental: number;
  in_stock: number;
  co2_rating: string;
  is_eco_friendly: boolean;
  brand: Brand;
  category: Category;
  product_image: ProductImage;
}

// ---- Post Product End ------------------------------

// ---- Put OR Patch Product Start ------------------------------

export interface MutationProductResponse {
  success: boolean;
}

// ---- Put or Patch Product End ------------------------------
