// ----------------- Request Interfaces ------------------------------------------------
export interface ForgetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

// PUT Request
export interface UpdateSpecificUserRequest {
  first_name: string;
  last_name: string;
  address: Address;
  phone: string;
  dob: string;
  password: string;
  email: string;
}

// PATCH Request
export interface PartiallyUpdateSpecificUserRequest extends Partial<UpdateSpecificUserRequest> {}
// ----------------- Common Interfaces ------------------------------------------------

export interface Address {
  street: string | null;
  house_number?: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
}

export interface Customer {
  id: string;
  provider: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  dob: string | null;
  email: string | null;
  totp_enabled: boolean;
  created_at: string;
  address: Address;
  enabled: boolean;
  role: string | null;
  failed_login_attempts: number;
}

// ----------------- Response Interfaces ------------------------------------------------

// Forget & Change Password
//PUT & PATCH User
export interface UserMutationResponse {
  success: boolean;
}

// Get all users
export interface GetCustomersResponse {
  current_page: number;
  data: Customer[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

//Get current customer info
export type GetCurrentCustomerInfoResponse = Customer;

//Logout current User OR Invalidate the token
export interface LogoutRespose {
  message: string;
}

//Refresh token
export interface RefreshToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Get CustomerInfo By Id Response
export interface GetCustomerByIdResponse {
  id: string;
  provider: string | null;
  first_name: string;
  last_name: string;
  phone: string;
  dob: string;
  email: string;
  totp_enabled: boolean;
  created_at: string;
  address: Address;
  enabled: boolean;
  failed_login_attempts: number;
}

// Get Customers By Last Name
export type GetCustomersByLastNameResponse = GetCustomersResponse;
