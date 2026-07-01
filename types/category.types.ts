// ----------- Request Interfaces -----------------------------------------------------------------

export interface CategoryRequest {
  name: string;
  slug?: string;
  parent_id?: string;
}

export interface PartialCategoryRequest extends Partial<CategoryRequest> {}

// ----------- Common Interfaces -----------------------------------------------------------------

export interface SecondLevelSubCategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string;
  sub_categories: string[];
}

export interface FirstLevelSubCategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  sub_categories: SecondLevelSubCategory[];
}

export interface CategoryFlat {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
}

// ----------- Response Interfaces -----------------------------------------------------------------

export interface PostCategoryResponse {
  name: string;
  slug: string;
  parent_id: string;
  id: string;
}

export interface MutationCategoryResponse {
  success: boolean;
}

export interface CategorywithSubCategoriesByIdResponse {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  sub_categories: FirstLevelSubCategory[];
}

// Array types
export type CategoryWithSubCategoriesResponse = FirstLevelSubCategory[];
export type CategoryWithoutSubCategoriesResponse = CategoryFlat[];
export type CategoryWithSubCategoryByNameResponse = FirstLevelSubCategory[];


