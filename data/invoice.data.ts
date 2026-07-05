// ===================================================================================================================
// 1. OBJECT BUILDERS
// ===================================================================================================================

export const buildPaymentDetails = (
  bankName: string,
  accountName: string,
  accountNumber: string,
) => ({
  bank_name: bankName,
  account_name: accountName,
  account_number: accountNumber,
});

export const getCustomerInvoicePayload = (
  cartId: string,
  billingStreet: string,
  billingCity: string,
  billingCountry: string,
  billingState: string,
  billingPostalCode: string,
  paymentMethod: string,
  bankName: string,
  accountName: string,
  accountNumber: string,
) => ({
  billing_street: billingStreet,
  billing_city: billingCity,
  billing_state: billingState,
  billing_country: billingCountry,
  billing_postal_code: billingPostalCode,
  payment_method: paymentMethod,
  cart_id: cartId,
  payment_details: buildPaymentDetails(bankName, accountName, accountNumber),
});

export const getGuestInvoicePayload = (
  cartId: string,
  email: string,
  firstName: string,
  lastName: string,
  billingStreet: string,
  billingCity: string,
  billingCountry: string,
  billingState: string,
  billingPostalCode: string,
  paymentMethod: string,
  bankName: string,
  accountName: string,
  accountNumber: string,
) => ({
  billing_street: billingStreet,
  billing_city: billingCity,
  billing_state: billingState,
  billing_country: billingCountry,
  billing_postal_code: billingPostalCode,
  payment_method: paymentMethod,
  cart_id: cartId,
  payment_details: buildPaymentDetails(bankName, accountName, accountNumber),
  guest_email: email,
  guest_first_name: firstName,
  guest_last_name: lastName,
});

export const getUpdateInvoicePayload = (
  cartId: string,
  billingStreet: string,
  billingCity: string,
  billingCountry: string,
  billingState: string,
  billingPostalCode: string,
  paymentMethod: string,
  bankName: string,
  accountName: string,
  accountNumber: string,
) => ({
  billing_street: billingStreet,
  billing_city: billingCity,
  billing_state: billingState,
  billing_country: billingCountry,
  billing_postal_code: billingPostalCode,
  payment_method: paymentMethod,
  cart_id: cartId,
  payment_details: buildPaymentDetails(bankName, accountName, accountNumber),
});

export const getPartialUpdateInvoicePayload = (overrides: any) => {
  return {
    billing_street: overrides.billingStreet,
    billing_city: overrides.billingCity,
    billing_state: overrides.billingState,
    billing_country: overrides.billingCountry,
    billing_postal_code: overrides.billingPostalCode,
    cart_id: overrides.cartId,
    payment_method: overrides.paymentMethod,
  };
};

export const getUpdateInvoiceStatusPayload = (
  status: string,
  message: string,
) => ({
  status,
  status_message: message,
});
