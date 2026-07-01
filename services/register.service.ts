import { APIRequestContext } from "@playwright/test";
import { RegisterRequest, RegisterResponse } from "@models/register.types";

export class RegisterService {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    const response = await this.request.post(
      `${process.env.API_BASE_URL}/users/register`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: payload,
      },
    );

    if (!response.ok()) {
      throw new Error(`Registration failed with status: ${response.status()}`);
    }
    return response.json() as Promise<RegisterResponse>;
  }
  async registerPartial(payload: Partial<RegisterRequest>): Promise<RegisterResponse> {
    const response = await this.request.post(
      `${process.env.API_BASE_URL}/users/register`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: payload,
      },
    );

    if (!response.ok()) {
      throw new Error(`Registration failed with status: ${response.status()}`);
    }
    return response.json() as Promise<RegisterResponse>;
  }
}
