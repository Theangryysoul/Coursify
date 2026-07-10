import axios from "axios";

import { env } from "@/config/env";
import { useAuthStore } from "@/store/auth.store";

export const api = axios.create({
  baseURL: env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore
    .getState()
    .accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});