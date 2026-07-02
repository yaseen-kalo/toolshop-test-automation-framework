import { APIRequestContext } from "@playwright/test";
import {
  BrandRequest,
  PartialBrandRequest,
  BrandResponse,
  GetBrandsResponse,
  GetBrandByIdResponse,
  GetBrandByNameResponse,
  PostBrandResponse,
  MutationBrandResponse,
} from "@models/brand.types";

export class BrandService {
  private request: APIRequestContext;
  private token?: string;

  constructor(request: APIRequestContext, token?: string) {
    this.request = request;
    this.token = token;
  }

  // GET /brands — returns paginated list of all brands (public)
  async getBrands(): Promise<GetBrandsResponse> {
    const response = await this.request.get(
      `${process.env.API_BASE_URL}/brands`,
      {
        headers: this.getHeaders(false),
      },
    );
    if (!response.ok()) {
      throw new Error(`Get Brands failed with status: ${response.status()}`);
    }

    return response.json() as Promise<GetBrandsResponse>;
  }

  // Get /brands/:id — returns a brand by id (public)
  async getBrandById(id: string): Promise<GetBrandByIdResponse> {
    const response = await this.request.get(
      `${process.env.API_BASE_URL}/brands/${id}`,
      {
        headers: this.getHeaders(false),
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Get Brand by Id failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<GetBrandByIdResponse>;
  }

  // Get /brands/search/:name — returns a brand by name (public)
  async getBrandByName(name: string): Promise<GetBrandByNameResponse> {
    const response = await this.request.get(
      `${process.env.API_BASE_URL}/brands/search`,
      {
        headers: this.getHeaders(false),
        params: { q: name },
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Get Brand by Name failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<GetBrandByNameResponse>;
  }

  // POST /brands — creates a new brand (admin token required)
  async createBrand(payload: BrandRequest): Promise<PostBrandResponse> {
    if (!this.token) {
      throw new Error(`Admin token is required to create a brand`);
    }
    const response = await this.request.post(
      `${process.env.API_BASE_URL}/brands`,
      {
        headers: this.getHeaders(true),
        data: payload,
      },
    );

    if (!response.ok()) {
      throw new Error(`Create Brand failed with status: ${response.status()}`);
    }

    return response.json() as Promise<PostBrandResponse>;
  }

  //PUT /brands/:id — updates a brand by id (admin token required)
  async putBrand(
    id: string,
    payload: BrandRequest,
  ): Promise<MutationBrandResponse> {
    if (!this.token) {
      throw new Error(`Admin token is required to fully update a brand`);
    }
    const response = await this.request.put(
      `${process.env.API_BASE_URL}/brands/${id}`,
      {
        headers: this.getHeaders(true),
        data: payload,
      },
    );

    if (!response.ok()) {
      throw new Error(`Update Brand failed with status: ${response.status()}`);
    }

    return response.json() as Promise<MutationBrandResponse>;
  }

  //PATCH /brands/:id — partially updates a brand by id (admin token required)
  async patchBrand(
    id: string,
    payload: PartialBrandRequest,
  ): Promise<MutationBrandResponse> {
    if (!this.token) {
      throw new Error(`Admin token is required to partially update a brand`);
    }

    const response = await this.request.patch(
      `${process.env.API_BASE_URL}/brands/${id}`,
      {
        headers: this.getHeaders(true),
        data: payload,
      },
    );

    if (!response.ok()) {
      throw new Error(
        `Partial update Brand failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<MutationBrandResponse>;
  }

  //DELETE /brands/:id — deletes a brand by id (admin token required)
  async deleteBrand(id: string): Promise<void> {
    if (!this.token) {
      throw new Error(`Admin token is required to delete a brand`);
    }
    const response = await this.request.delete(
      `${process.env.API_BASE_URL}/brands/${id}`,
      {
        headers: this.getHeaders(true),
      },
    );

    if (response.status() !== 204) {
      throw new Error(`Delete Brand failed with status: ${response.status()}`);
    }
    console.log(`Brand with provided id deleted successfully`);
  }

  private getHeaders(includeAuth: boolean = false) {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(includeAuth && { Authorization: `Bearer ${this.token}` }),
    };
  }
}
