import type { User } from "./user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Every endpoint that establishes a session answers with the same shape:
 * the profile plus a fresh access token.
 */
export interface LoginResponse {
  user: User;
  accessToken: string;
}

export type RegisterResponse = LoginResponse;

export type RefreshResponse = LoginResponse;
