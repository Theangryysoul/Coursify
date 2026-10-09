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
 * Public configuration the sign-in screens read before there is a session.
 *
 * `googleClientId` is the value Google Identity Services is initialised with.
 * It is served by the API so the browser and the server cannot disagree about
 * which OAuth client they are using - the server verifies ID tokens against
 * this same id, so a mismatch would reject every sign-in.
 */
export interface AuthConfig {
  googleClientId: string;
  googleSignInEnabled: boolean;
}

/**
 * The ID token Google Identity Services hands the browser. The server verifies
 * it against the OAuth client id and answers with a session, so the client
 * never sees or handles a Google secret.
 */
export interface GoogleLoginRequest {
  idToken: string;
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
