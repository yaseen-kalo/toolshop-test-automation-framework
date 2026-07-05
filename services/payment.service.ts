import { APIRequestContext } from "@playwright/test";
import { PaymentRequest } from "@models/payment.types";

export class PaymentService {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async checkPayment(payload: PaymentRequest): Promise<PaymentResponse> {
    const response = await this.request.post(
      `${process.env.API_BASE_URL}/payment/check`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: payload,
      },
    );
    if (!response.ok()) {
      throw new Error(`Payment check failed with status ${response.status()}`);
    }

    return response.json() as Promise<PaymentResponse>;
  }
}
