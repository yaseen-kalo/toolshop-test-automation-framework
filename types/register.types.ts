export interface Address {
  street: string;
  house_number: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  address: Address;
  phone: string;
  dob: string;
  password: string;
  email: string;
}

export interface RegisterResponse {
  first_name: string;
  last_name: string;
  phone: string;
  dob: string;
  email: string;
  id: string;
  created_at: string;
  address: Address;
}
