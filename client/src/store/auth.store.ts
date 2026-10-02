import { create } from "zustand";

import type { User } from "@/types/user";

/**
 * `loading` means "we do not know yet" - the refresh cookie has not been
 * checked. Route guards must wait for it instead of assuming signed out,
 * otherwise a page reload on a protected route looks like a logout.
 */
export type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  status: AuthStatus;

  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setStatus: (status: AuthStatus) => void;
  setSession: (user: User, accessToken: string) => void;
  clearSession: () => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  status: "loading",

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      status: user ? "authenticated" : "unauthenticated",
    }),

  setAccessToken: (accessToken) =>
    set({
      accessToken,
    }),

  setStatus: (status) =>
    set({
      status,
    }),

  setSession: (user, accessToken) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
      status: "authenticated",
    }),

  clearSession: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      status: "unauthenticated",
    }),

  login: (user, accessToken) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
      status: "authenticated",
    }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      status: "unauthenticated",
    }),
}));
