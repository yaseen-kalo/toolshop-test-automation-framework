import { APIRequestContext } from "@playwright/test";
import {
  CategoryRequest,
  PartialCategoryRequest,
  PostCategoryResponse,
  MutationCategoryResponse,
  CategorywithSubCategoriesByIdResponse,
  CategoryWithSubCategoriesResponse,
  CategoryWithoutSubCategoriesResponse,
  CategoryWithSubCategoryByNameResponse,
} from "@models/category.types";

export class CategoryService {
  private request: APIRequestContext;
  private token?: string;

  constructor(request: APIRequestContext, token?: string) {
    this.request = request;
    this.token = token;
  }

  // GET all Categories with subcategories
  async getCategoriesWithSubCategories(): Promise<CategoryWithSubCategoriesResponse> {
    const response = await this.request.get(
      `${process.env.API_BASE_URL}/categories/tree`,
      {
        headers: this.getHeaders(false),
      },
    );

    if (!response.ok()) {
      throw new Error(
        `Get Categories with sub categories failed with status code: ${response.status()}`,
      );
    }

    return response.json() as Promise<CategoryWithSubCategoriesResponse>;
  }

  // GET all Categories without subcategories
  async getCategoriesWithoutSubCategories(): Promise<CategoryWithoutSubCategoriesResponse> {
    const response = await this.request.get(
      `${process.env.API_BASE_URL}/categories`,
      {
        headers: this.getHeaders(false),
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Categories without sub categories failed with status code: ${response.status()}`,
      );
    }

    return response.json() as Promise<CategoryWithoutSubCategoriesResponse>;
  }

  // GET all Categories with subcategories By Id
  async getCategoriesWithSubCategoriesById(
    categoryId: string,
  ): Promise<CategorywithSubCategoriesByIdResponse> {
    const response = await this.request.get(
      `${process.env.API_BASE_URL}/categories/tree/${categoryId}`,
      {
        headers: this.getHeaders(false),
      },
    );

    if (!response.ok()) {
      throw new Error(
        `Get Categories With subcategories by Id failed with status code: ${response.status()}`,
      );
    }

    return response.json() as Promise<CategorywithSubCategoriesByIdResponse>;
  }

  // GET Single Category with subcategories By Name
  async getSingleCategoryWithSubCategoryByName(
    name: string,
  ): Promise<CategoryWithSubCategoryByNameResponse> {
    const response = await this.request.get(
      `${process.env.API_BASE_URL}/categories/search`,
      {
        headers: this.getHeaders(false),
        params: {
          q: name,
        },
      },
    );

    if (!response.ok()) {
      throw new Error(
        `Get Category with Sub Categories by name falled with status code: ${response.status()}`,
      );
    }
    return response.json() as Promise<CategoryWithSubCategoryByNameResponse>;
  }

  //POST Create new Category
  async createCategory(
    payload: CategoryRequest,
  ): Promise<PostCategoryResponse> {
    const response = await this.request.post(
      `${process.env.API_BASE_URL}/categories`,
      {
        headers: this.getHeaders(false),
        data: payload,
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Create a category failed with status code: ${response.status()}`,
      );
    }
    return response.json() as Promise<PostCategoryResponse>;
  }

  // PUT Update an exsisting Category
  async putCategory(
    categoryId: string,
    payload: CategoryRequest,
  ): Promise<MutationCategoryResponse> {
    const response = await this.request.put(
      `${process.env.API_BASE_URL}/categories/${categoryId}`,
      {
        headers: this.getHeaders(false),
        data: payload,
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Update the exsisting Category failed with status code: ${response.status()}`,
      );
    }

    return response.json() as Promise<MutationCategoryResponse>;
  }

  // PATCH Partially update the exsisting category
  async patchCategory(
    categoryId: string,
    payload: PartialCategoryRequest,
  ): Promise<MutationCategoryResponse> {
    const response = await this.request.patch(
      `${process.env.API_BASE_URL}/categories/${categoryId}`,
      {
        headers: this.getHeaders(false),
        data: payload,
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Partial update category failed with status code: ${response.status()}`,
      );
    }
    return response.json() as Promise<MutationCategoryResponse>;
  }

  //DELETE the exsisting Category
  async deleteCategory(categoryId: string): Promise<void> {
    if (!this.token) {
      throw new Error("Admin token is required");
    }
    const response = await this.request.delete(
      `${process.env.API_BASE_URL}/categories/${categoryId}`,
      {
        headers: this.getHeaders(true),
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Deletion of exsisting category failed with status code: ${response.status()}`,
      );
    }
  }

  // Builds request headers; includes Authorization header only for protected endpoints
  private getHeaders(includeAuth: boolean = false) {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(includeAuth && { Authorization: `Bearer ${this.token}` }),
    };
  }
}
