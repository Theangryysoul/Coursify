import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { env } from "@/config/env";
import { useAuthStore } from "@/store/auth.store";
import type { ApiResponse } from "@/types/api";
import type { RefreshResponse } from "@/types/auth";

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

// These endpoints must never trigger the refresh-and-retry below: a 401 from
// them means the credentials themselves are wrong, and retrying /auth/refresh
// would recurse into the same interceptor forever.
const RETRY_EXCLUDED_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
];

type RetriableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

// A single in-flight refresh shared by every request that gets a 401 at the
// same time, so a page that fires ten queries at once still refreshes once.
let refreshPromise: Promise<string> | null = null;

const requestNewAccessToken = async (): Promise<string> => {
  // Uses the bare axios instance on purpose: going through `api` would send
  // this request into the interceptor that started it.
  const response = await axios.post<ApiResponse<RefreshResponse>>(
    `${env.API_URL}/auth/refresh`,
    undefined,
    { withCredentials: true }
  );

  const { user, accessToken } = response.data.data;

  useAuthStore.getState().setSession(user, accessToken);

  return accessToken;
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;

    const isUnauthorized = error.response?.status === 401;

    const isExcluded = RETRY_EXCLUDED_ENDPOINTS.some((endpoint) =>
      original?.url?.includes(endpoint)
    );

    if (!isUnauthorized || !original || original._retry || isExcluded) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      refreshPromise ??= requestNewAccessToken().finally(() => {
        refreshPromise = null;
      });

      const accessToken = await refreshPromise;

      original.headers.Authorization = `Bearer ${accessToken}`;

      return await api(original);
    } catch (refreshError) {
      // The refresh cookie is gone or expired: the session is over. Clearing
      // the store flips the route guards and sends the user to /login.
      useAuthStore.getState().clearSession();

      return Promise.reject(refreshError);
    }
  }
);
