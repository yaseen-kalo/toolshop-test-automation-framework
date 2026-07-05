export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserAddress {
  street: string;
  house_number: string | null;
  city: string;
  state: string | null;
  country: string;
  postal_code: string | null;
}

export interface UserProfileResponse {
  id: string;
  provider: string | null;
  first_name: string;
  last_name: string;
  phone: string | null;
  dob: string; // Dynamic ISO/Date string representation
  email: string;
  totp_enabled: boolean;
  created_at: string;
  address: UserAddress;
}
