import { test, expect } from "@playwright/test";
import { PaymentService } from "@services/payment.service";
import { getPaymentCheckPayload } from "@data/payment.data";

test.describe("Payment API Endpoints", () => {
  test("should successfully validate a bank-transfer payment payload", async ({
    request,
  }) => {
    // Arrange
    const paymentService = new PaymentService(request);
    const payload = getPaymentCheckPayload;

    // Act
    const response = await paymentService.checkPayment(payload);

    // Assert
    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty("message", "Payment was successful");

    console.log("Payment validation response:", response.message);
  });

  test("should throw an error when payment payload validation fails", async ({
    request,
  }) => {
    // Arrange
    const paymentService = new PaymentService(request);

    // Intentionally sending an invalid account number format to verify error handling
    const invalidPayload = {
      payment_method: "bank-transfer",
      payment_details: {
        bank_name: "Erste Bank",
        account_name: "Jane Doe",
        account_number: "invalid-acc-format-123",
      },
    };

    // Act & Assert
    await expect(paymentService.checkPayment(invalidPayload)).rejects.toThrow(
      "Payment check failed with status 422",
    );
  });
});
