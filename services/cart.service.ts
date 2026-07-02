import { APIRequestContext } from "@playwright/test";
import {
  AddItemToCartByIdRequest,
  CartByIdResponse,
  CreateNewCartResponse,
  AddItemToCartByIdResponse,
  UpdateTheQuantityOfItemInCart,
} from "@models/cart.types";
import { error } from "node:console";
export class CartService {
  private request: APIRequestContext;
  private token?: string;

  constructor(request: APIRequestContext, token?: string) {
    ((this.request = request), (this.token = token));
  }

  // GET /Cart returns specific item from the cart (public)
  async GetItemFromCartById(id: string): Promise<CartByIdResponse> {
    const response = await this.request.get(
      `${process.env.API_BASE_URL}/carts/${id}`,
      {
        headers: this.getHeaders(false),
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Get specific item from the cart failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<CartByIdResponse>;
  }

  // POST -- Create a new cart (public)
  async CreateNewCart(): Promise<CreateNewCartResponse> {
    const response = await this.request.post(
      `${process.env.API_BASE_URL}/carts`,
      {
        headers: this.getHeaders(false),
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Create a new cart failed with status ${response.status()}`,
      );
    }

    return response.json() as Promise<CreateNewCartResponse>;
  }

  //POST -- Add a new item in to cart
  async AddAnItemToCart(
    cartId: string,
    payload: AddItemToCartByIdRequest,
  ): Promise<AddItemToCartByIdResponse> {
    const response = await this.request.post(
      `${process.env.API_BASE_URL}/carts/${cartId}`,
      {
        headers: this.getHeaders(false),
        data: payload,
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Adding a new item to the cart failed with status ${response.status()}`,
      );
    }

    return response.json() as Promise<AddItemToCartByIdResponse>;
  }

  //PUT -- Update the Quantity of the item in the cart
  async UpdatetheQuantityInTheCart(
    cartId: string,
    payload: AddItemToCartByIdRequest,
  ): Promise<UpdateTheQuantityOfItemInCart> {
    const response = await this.request.put(
      `${process.env.API_BASE_URL}/carts/${cartId}/product/quantity`,
      {
        headers: this.getHeaders(false),
        data: payload,
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Update the Quanity of the item in the cart failed with status: ${response.status()}`,
      );
    }
    return response.json() as Promise<UpdateTheQuantityOfItemInCart>;
  }

  //DELETE -- Delete cart
  async DeleteCart(cartId: string): Promise<void> {
    const response = await this.request.delete(
      `${process.env.API_BASE_URL}/carts/${cartId}`,
      {
        headers: this.getHeaders(true),
      },
    );
    if (response.status() != 204) {
      throw new Error(`Delete Cart failed with status: ${response.status()}`);
    }
    console.log(`Cart has been deleted successfully..`);
  }

  //DELETE -- Delete product from cart
  async DeleteProductFromCart(
    cartId: string,
    productId: string,
  ): Promise<void> {
    const response = await this.request.delete(
      `${process.env.API_BASE_URL}/carts/${cartId}/product/${productId}`,
      {
        headers: this.getHeaders(true),
      },
    );
    if (response.status() != 204) {
      throw new Error(
        `Delete Product from Cart failed with status: ${response.status()}`,
      );
    }
    console.log(`Product from cart has been deleted successfully..`);
  }

  private getHeaders(includeAuth: boolean = false) {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(includeAuth && { Authorization: `Bearer ${this.token}` }),
    };
  }
}
