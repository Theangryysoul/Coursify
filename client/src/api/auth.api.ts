import { api } from "./axios";

import type { ApiResponse } from "@/types/api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "@/types/auth";
import type { User } from "@/types/user";

export const login = async (data: LoginRequest) => {
  const response = await api.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    data
  );

  return response.data.data;
};

export const register = async (data: RegisterRequest) => {
  const response = await api.post<ApiResponse<User>>(
    "/auth/register",
    data
  );

  return response.data.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export const refresh = async () => {
  const response = await api.post<
    ApiResponse<{ accessToken: string }>
  >("/auth/refresh");

  return response.data.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>("/users/me");

  return response.data.data;
};