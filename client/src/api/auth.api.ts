import { api } from "./axios";

import type { ApiResponse } from "@/types/api";
import type {
  AuthConfig,
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";

/**
 * Public auth configuration, read before there is a session. It never answers
 * 401, so it is not one of the endpoints the refresh interceptor has to skip.
 */
export const getAuthConfig = async () => {
  const response = await api.get<ApiResponse<AuthConfig>>("/auth/config");

  return response.data.data;
};

export const login = async (data: LoginRequest) => {
  const response = await api.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    data
  );

  return response.data.data;
};

export const register = async (data: RegisterRequest) => {
  const response = await api.post<ApiResponse<RegisterResponse>>(
    "/auth/register",
    data
  );

  return response.data.data;
};

/**
 * Exchanges a Google ID token for a Coursify session. The token comes from
 * Google Identity Services in the browser; the server verifies it.
 */
export const loginWithGoogle = async (idToken: string) => {
  const response = await api.post<ApiResponse<LoginResponse>>(
    "/auth/google",
    { idToken }
  );

  return response.data.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export const refresh = async () => {
  const response = await api.post<ApiResponse<RefreshResponse>>(
    "/auth/refresh"
  );

  return response.data.data;
};

export const changePassword = async (data: ChangePasswordRequest) => {
  await api.patch("/auth/change-password", data);
};
