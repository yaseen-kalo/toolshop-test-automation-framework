export interface PaymentRequest {
  payment_method: string;
  payment_details: PaymentDetails;
}

export interface PaymentDetails {
  bank_name: string;
  account_name: string;
  account_number: string;
}

export interface PaymentResponse {
  message: string;
}
