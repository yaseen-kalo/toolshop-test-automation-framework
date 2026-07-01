import { RegisterRequest } from "@models/register.types";

export const registerPayload = (
  email: string,
  password: string,
): RegisterRequest => ({
  first_name: "Smith",
  last_name: "Will",
  address: {
    street: "Street 1",
    house_number: "12",
    city: "City",
    state: "State",
    country: "Country",
    postal_code: "1234AA",
  },
  phone: "01234567",
  dob: "1993-01-01",
  password: password,
  email: email,
});

export const partialRegisterPayload: Partial<RegisterRequest> = {
  first_name: "Smith",
  last_name: "Will",
  address: {
    street: "Street 1",
    house_number: "12",
    city: "City",
    state: "State",
    country: "Country",
    postal_code: "1234AA",
  },
  phone: "01234567",
  dob: "1993-01-01",
  password: "tfddfTvw@12",
};
