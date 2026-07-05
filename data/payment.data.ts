import { PaymentRequest } from "@models/payment.types";
export const getPaymentCheckPayload = {
  payment_method: "bank-transfer",
  payment_details: {
    bank_name: "Erste Bank",
    account_name: "Jane Doe",
    account_number: "1234567890",
  },
};
