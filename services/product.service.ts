import { APIRequestContext } from "@playwright/test";
import {
  ProductRequest,
  PatchProductRequest,
  GetProductsResponse,
  GetProductByIdResponse,
  PostProductResponse,
  MutationProductResponse} from "@models/products.types";

  export class ProductService {
    private request: APIRequestContext;
    private token?: string;

    constructor(request: APIRequestContext, token?: string) {
      this.request = request;
      this.token = token;
    }

    // GET /products — returns paginated list of all products (public)
    async getProducts(): Promise<GetProductsResponse> {
      const response = await this.request.get(
        `${process.env.API_BASE_URL}/products`,
        {
          headers: this.getHeaders(false),
        },
      );
      if (!response.ok()) {
        throw new Error(
          `Get Products failed with status: ${response.status()}`,
        );
      }
      return response.json() as Promise<GetProductsResponse>;
    }

    // POST /products — creates a new product (admin token required)
    async createProduct(payload: ProductRequest): Promise<PostProductResponse> {
      if (!this.token) {
        throw new Error(`Admin token is required to create a product`);
      }
      const response = await this.request.post(
        `${process.env.API_BASE_URL}/products`,
        {
          headers: this.getHeaders(true),
          data: payload,
        },
      );
      if (!response.ok()) {
        throw new Error(
          `Create Product failed with status: ${response.status()}`,
        );
      }
      return response.json() as Promise<PostProductResponse>;
    }

    // GET /product By Id — returns a product by id (public)
    async getProductById(id: string): Promise<GetProductByIdResponse> {
      const response = await this.request.get(
        `${process.env.API_BASE_URL}/products/${id}`,
        {
          headers: this.getHeaders(false),
        },
      );
      if (!response.ok()) {
        throw new Error(
          `Get Product By Id failed with status: ${response.status()}`,
        );
      }
      return response.json() as Promise<GetProductByIdResponse>;
    }

    // PATCH /products/:id — partially updates a product (admin token required)
    async patchProduct(
      id: string,
      payload: PatchProductRequest,
    ): Promise<MutationProductResponse> {
      if (!this.token) {
        throw new Error(`Admin token is required to update a product`);
      }
      const response = await this.request.patch(
        `${process.env.API_BASE_URL}/products/${id}`,
        {
          headers: this.getHeaders(true),
          data: payload,
        },
      );
      if (!response.ok()) {
        throw new Error(
          `Update Product through patch failed with status: ${response.status()}`,
        );
      }
      return response.json() as Promise<MutationProductResponse>;
    }

    //DELETE /products/:id - Delete a product (admin token required)
    async deleteProduct(id: string): Promise<MutationProductResponse> {
        const response = await this.request.delete(`${process.env.API_BASE_URL}/products/${id}`,
            {
                headers: this.getHeaders(true)
            },
        );
        if(!response.ok()) {
            throw new Error (`Delete Product through DELETE failed with status: ${response.status()}`);
        }
        return response.json() as Promise<MutationProductResponse>;
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