import { APIRequestContext } from "@playwright/test";
import {
  AddORUpdateSpecToAProductRequest,
  GetProductSpecificationsResponse,
  GetProductSpecificationByIdResponse,
  GetProductSpecificationNamesResponse,
  AddProductSpecResponse,
  ProductSpecMutation,
} from "@models/product-spec.types";

export class ProductSpecService {
  private request: APIRequestContext;
  private token?: string;

  constructor(request: APIRequestContext, token?: string) {
    this.request = request;
    this.token = token;
  }

  async GetSpecForAProduct(
    productId: string,
  ): Promise<GetProductSpecificationsResponse> {
    const response = await this.request.get(
      `${process.env.API_BASE_URL}/products/${productId}/specs`,
      {
        headers: this.getHeaders(false),
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Get specs of the perticular products failed with status: ${response.status()}`,
      );
    }
    return response.json() as Promise<GetProductSpecificationsResponse>;
  }

  async GetASpecificSpecForAProduct(
    productId: string,
    specId: string,
  ): Promise<GetProductSpecificationByIdResponse> {
    const response = await this.request.get(
      `${process.env.API_BASE_URL}/products/${productId}/specs/${specId}`,
      {
        headers: this.getHeaders(false),
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Get specific spec of the perticular product failed with status: ${response.status()}`,
      );
    }
    return response.json() as Promise<GetProductSpecificationByIdResponse>;
  }

  async GetDistinctSpecNames(): Promise<GetProductSpecificationNamesResponse> {
    const response = await this.request.get(
      `${process.env.API_BASE_URL}/product-specs/names`,
      {
        headers: this.getHeaders(false),
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Get distinct spec names failed with status: ${response.status()}`,
      );
    }
    return response.json() as Promise<GetProductSpecificationNamesResponse>;
  }

  async AddASpecToAProduct(
    productId: string,
    payload: AddORUpdateSpecToAProductRequest,
  ): Promise<AddProductSpecResponse> {
    if (!this.token) {
      throw new Error(`Admin token is required to add a spec to a product`);
    }
    const response = await this.request.post(
      `${process.env.API_BASE_URL}/products/${productId}/specs`,
      {
        headers: this.getHeaders(true),
        data: payload,
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Add a spec to a product failed with status: ${response.status()}`,
      );
    }
    return response.json() as Promise<AddProductSpecResponse>;
  }

  async UpdateASpecToAProduct(
    productId: string,
    specId: string,
    payload: AddORUpdateSpecToAProductRequest,
  ): Promise<ProductSpecMutation> {
    if (!this.token) {
      throw new Error(`Admin token is required to add a spec to a product`);
    }
    const response = await this.request.put(
      `${process.env.API_BASE_URL}/products/${productId}/specs/${specId}`,
      {
        headers: this.getHeaders(true),
        data: payload,
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Update a spec to a product failed with status: ${response.status()}`,
      );
    }
    return response.json() as Promise<ProductSpecMutation>;
  }

  async DeleteASpecToAProduct(
    productId: string,
    specId: string,
  ): Promise<void> {
    if (!this.token) {
      throw new Error(`Admin token is required to add a spec to a product`);
    }
    const response = await this.request.delete(
      `${process.env.API_BASE_URL}/products/${productId}/specs/${specId}`,
      {
        headers: this.getHeaders(true),
      },
    );
    if (response.status() !== 204) {
      throw new Error(
        `Delete a spec of a product failed with status: ${response.status()}`,
      );
    }
  }

  private getHeaders(includeAuth: boolean = false) {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(includeAuth && { Authorization: `Bearer ${this.token}` }),
    };
  }
}
