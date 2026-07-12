import { APIRequestContext } from "@playwright/test";
import {
  ForgetPasswordRequest,
  ChangePasswordRequest,
  UpdateSpecificUserRequest,
  PartiallyUpdateSpecificUserRequest,
  UserMutationResponse,
  GetCustomersResponse,
  GetCurrentCustomerInfoResponse,
  GetCustomerByIdResponse,
  GetCustomersByLastNameResponse,
  RefreshToken,
  LogoutRespose,
} from "@models/user.type";
import { error } from "node:console";

export class UserService {
  private request: APIRequestContext;
  private token?: string;

  constructor(request: APIRequestContext, token: string) {
    this.request = request;
    this.token = token;
  }

  // get Customer Details
  async getCustomersDetails(): Promise<GetCustomersResponse> {
    if (!this.token) {
      throw new Error(`Admin token is required to get the customers details`);
    }

    const response = await this.request.get(
      `${process.env.API_BASE_URL}/users`,
      {
        headers: this.getHeaders(true),
      },
    );

    if (!response.ok()) {
      throw new Error(
        `Get user details failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<GetCustomersResponse>;
  }

  // get Current User Info
  async getCustomerInfoDetails(): Promise<GetCurrentCustomerInfoResponse> {
    if (!this.token) {
      throw new Error(
        `Admin token is required to get the current customer info`,
      );
    }

    const response = await this.request.get(
      `${process.env.API_BASE_URL}/users/me`,
      {
        headers: this.getHeaders(true),
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Get Current User info failed with status: ${response.status()}`,
      );
    }
    return response.json() as Promise<GetCurrentCustomerInfoResponse>;
  }

  // get Refresh token
  async getRefreshToken(): Promise<RefreshToken> {
    if (!this.token) {
      throw new Error(`Admin token is required to get the refreshed token`);
    }

    const response = await this.request.get(
      `${process.env.API_BASE_URL}/users/refresh`,
      {
        headers: this.getHeaders(true),
      },
    );

    if (!response.ok()) {
      throw new Error(
        `Get refresh token failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<RefreshToken>;
  }

  // Logout & Invalidate the token
  async InvalidateTheToken(): Promise<LogoutRespose> {
    if (!this.token) {
      throw new Error(`Admin token is required to logout the User`);
    }

    const response = await this.request.get(
      `${process.env.API_BASE_URL}/users/logout`,
      {
        headers: this.getHeaders(true),
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Invalidate the token request failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<LogoutRespose>;
  }

  // get User info by Id
  async getUserInfoById(id: string): Promise<GetCustomerByIdResponse> {
    if (!this.token) {
      throw new Error(`Admin token is required to get the User info by id`);
    }

    const response = await this.request.get(
      `${process.env.API_BASE_URL}/users/${id}`,
      {
        headers: this.getHeaders(true),
      },
    );

    if (!response.ok()) {
      throw new Error(
        `Get the User Info by Id failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<GetCustomerByIdResponse>;
  }

  // get User Info By Name
  async getUserInfoByName(
    name: string,
  ): Promise<GetCustomersByLastNameResponse> {
    if (!this.token) {
      throw new Error(`Admin token is required to get the user info by name`);
    }

    const response = await this.request.get(
      `${process.env.API_BASE_URL}/users/search`,
      {
        headers: this.getHeaders(true),
        params: {
          q: name,
        },
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Get User info by name failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<GetCustomersByLastNameResponse>;
  }

  //delete the user by Id
  async deleteUserById(id: string): Promise<void> {
    if (!this.token) {
      throw new Error(`Admin token is required to get the user info by name`);
    }
    const response = await this.request.delete(
      `${process.env.API_BASE_URL}/users/${id}`,
      {
        headers: this.getHeaders(true),
      },
    );
    if (response.status() != 204) {
      throw new Error(`User deletion failed with status: ${response.status()}`);
    }
    console.log(`User with Id: ${id} -- has been successfully deleted`);
  }

  //Update the User Completly
  async updateTheUser(
    id: string,
    payload: UpdateSpecificUserRequest,
  ): Promise<UserMutationResponse> {
    if (!this.token) {
      throw new Error(`Admin token is required to get the user info by name`);
    }

    const response = await this.request.put(
      `${process.env.API_BASE_URL}/users/${id}`,
      {
        headers: this.getHeaders(true),
        data: payload,
      },
    );

    if (!response.ok()) {
      throw new Error(
        `User update has been failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<UserMutationResponse>;
  }

  //Partially Update the User
  async partialUpdateTheUser(
    id: string,
    payload: PartiallyUpdateSpecificUserRequest,
  ): Promise<UserMutationResponse> {
    if (!this.token) {
      throw new Error(`Admin token is required to get the user info by name`);
    }

    const response = await this.request.patch(
      `${process.env.API_BASE_URL}/users/${id}`,
      {
        headers: this.getHeaders(true),
        data: payload,
      },
    );

    if (!response.ok()) {
      throw new Error(
        `User partially update has been failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<UserMutationResponse>;
  }

  //forget Password
  async forgetPassword(
    payload: ForgetPasswordRequest,
  ): Promise<UserMutationResponse> {
    const response = await this.request.post(
      `${process.env.API_BASE_URL}/users/forgot-password`,
      {
        headers: this.getHeaders(false),
        data: payload,
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Forget Password request failed with status: ${response.status()}`,
      );
    }
    return response.json() as Promise<UserMutationResponse>;
  }

  //change Password
  async changePassword(
    payload: ChangePasswordRequest,
  ): Promise<UserMutationResponse> {
    const response = await this.request.post(
      `${process.env.API_BASE_URL}/users/change-password`,
      {
        headers: this.getHeaders(true),
        data: payload,
      },
    );
    if (!response.ok()) {
      console.log("Body:", await response.text());
      throw new Error(
        `Forget Password request failed with status: ${response.status()}`,
      );
    }
    return response.json() as Promise<UserMutationResponse>;
  }

  private getHeaders(includeAuth: boolean = false) {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(includeAuth && { Authorization: `Bearer ${this.token}` }),
    };
  }
}
