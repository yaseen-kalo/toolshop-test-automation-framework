import { APIRequestContext } from "@playwright/test";
import { LoginRequest, LoginResponse } from "@models/auth.types";

export class AuthService {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await this.request.post(
      `${process.env.API_BASE_URL}/users/login`,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        data: payload,
      },
    );

    if (!response.ok()) {
      throw new Error(`Login failed with status: ${response.status()}`);
    }

    return response.json() as Promise<LoginResponse>;
  }
}
