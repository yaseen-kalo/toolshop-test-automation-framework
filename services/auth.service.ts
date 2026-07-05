import { APIRequestContext } from "@playwright/test";
import {
  LoginRequest,
  LoginResponse,
  UserProfileResponse,
} from "@models/auth.types";

export class AuthService {
  private request: APIRequestContext;
  private token?: string;

  constructor(request: APIRequestContext, token: string) {
    this.request = request;
    this.token = token;
  }

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await this.request.post(
      `${process.env.API_BASE_URL}/users/login`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: payload,
      },
    );

    if (!response.ok()) {
      throw new Error(`Login failed with status: ${response.status()}`);
    }

    return response.json() as Promise<LoginResponse>;
  }
  // get current user info
  async getCurrentUserInfo(): Promise<UserProfileResponse> {
    if (!this.token) {
      throw new Error(
        `Customer token is required to get the info of the current user`,
      );
    }

    const response = await this.request.get(
      `${process.env.API_BASE_URL}/users/me`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Get Info of current user failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<UserProfileResponse>;
  }
}
