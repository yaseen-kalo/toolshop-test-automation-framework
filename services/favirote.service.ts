import {
  FavoriteRequest,
  GetFavoritesResponse,
  GetFavoriteByIdResponse,
  CreateFavoriteResponse,
} from "@models/favirote.types";
import { APIRequestContext } from "@playwright/test";

export class FavoriteService {
  private request: APIRequestContext;
  private token?: string;

  constructor(request: APIRequestContext, token?: string) {
    this.request = request;
    this.token = token;
  }

  //get Favorite List
  async getFavorites(): Promise<GetFavoritesResponse> {
    if (!this.token) {
      throw new Error(`Customer token is required to get the list of Favorite`);
    }

    const response = await this.request.get(
      `${process.env.API_BASE_URL}/favorites`,
      {
        headers: this.getHeaders(true),
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Get favorite list failed with status: ${response.status()}}`,
      );
    }

    return response.json() as Promise<GetFavoritesResponse>;
  }

  // create Favorite
  async createFavorite(
    payload: FavoriteRequest,
  ): Promise<CreateFavoriteResponse> {
    if (!this.token) {
      throw new Error(
        `Customer token is required to add a item in to Favorite List`,
      );
    }

    const response = await this.request.post(
      `${process.env.API_BASE_URL}/favorites`,
      {
        headers: this.getHeaders(true),
        data: payload,
      },
    );

    if (response.status() != 201) {
      throw new Error(
        `Create Favorite list with product failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<CreateFavoriteResponse>;
  }

  //get Favorite by Id
  async getFavoriteById(favoriteId: string): Promise<GetFavoriteByIdResponse> {
    if (!this.token) {
      throw new Error(`Customer token is required to get the favorite by id`);
    }

    const response = await this.request.get(
      `${process.env.API_BASE_URL}/favorites/${favoriteId}`,
      {
        headers: this.getHeaders(true),
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Get favorite by Id failed with status: ${response.status()}}`,
      );
    }

    return response.json() as Promise<GetFavoriteByIdResponse>;
  }

  //delete
  async deleteFavorite(favoriteId: string): Promise<void> {
    if (!this.token) {
      throw new Error(`Customer token is required to delete the favorite`);
    }

    const resposne = await this.request.delete(
      `${process.env.API_BASE_URL}/favorites/${favoriteId}`,
      {
        headers: this.getHeaders(true),
      },
    );

    if (resposne.status() != 204) {
      throw new Error(
        `Delete favorite failed with status: ${resposne.status()}`,
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
