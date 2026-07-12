export const getForgetPasswordPaylaod = (email: string) => ({
  email: email,
});

export const getChangePasswordPayload = (
  currentPassword: string,
  newPassword: string,
) => ({
  current_password: currentPassword,
  new_password: newPassword,
  new_password_confirmation: newPassword,
});

export const getUpdateUserPayload = (password: string, email: string) => ({
  first_name: "John",
  last_name: "Doe",
  address: {
    street: "Street 1",
    city: "City",
    state: "State",
    country: "Country",
    postal_code: "1234AA",
  },
  phone: "0987654321",
  dob: "1970-01-01",
  password: password,
  email: email,
});

export const getPartialUpdateUserPayload = (
  password: string,
  email: string,
) => ({
  first_name: "John",
  last_name: "Doe",
  phone: "0987654321",
  dob: "1970-01-01",
  password: password,
  email: email,
});
