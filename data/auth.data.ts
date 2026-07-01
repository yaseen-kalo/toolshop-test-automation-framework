import { LoginRequest } from "@models/auth.types";

export const loginPayload = (password: string): LoginRequest => ({
  email: process.env.ADMIN_EMAIL!,
  password: password,
});
