export const ACCESS_TOKEN_EXPIRY = "7d";

export const REFRESH_TOKEN_EXPIRY = "30d";

// Must stay in sync with REFRESH_TOKEN_EXPIRY. The cookie has to live at least
// as long as the refresh token it carries, otherwise the browser drops the
// cookie while the token inside is still valid.
export const REFRESH_TOKEN_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
