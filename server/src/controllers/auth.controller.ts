import { Request, Response, type CookieOptions } from "express";
import { env } from "../config/env.js";
import { successResponse } from "../utils/api-response.js";
import { registerUser, loginUser, loginWithGoogle, refreshAccessToken, getCurrentUserService, changePassword, isGoogleSignInEnabled } from "../services/auth.service.js";
import { UnauthorizedError } from "../utils/errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_MAX_AGE_MS } from "../constants/auth.js";

const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: REFRESH_TOKEN_MAX_AGE_MS,
};

const setRefreshCookie = (
  res: Response,
  refreshToken: string
) => {
  res.cookie(
    REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    refreshCookieOptions
  );
};

// clearCookie only removes a cookie when every option except maxAge/expires
// matches the one used to set it, so the same options object is reused.
const clearRefreshCookie = (res: Response) => {
  res.clearCookie(
    REFRESH_TOKEN_COOKIE_NAME,
    refreshCookieOptions
  );
};

/**
 * What the sign-in screens need before anybody is logged in.
 *
 * The Google client id is public by design - it is the same value the browser
 * hands to Google - so serving it costs nothing and removes a way for a
 * deployment to go wrong: the button used to depend on `VITE_GOOGLE_CLIENT_ID`
 * being set again in the build environment, and when only the server had it the
 * button silently disappeared in production while working on localhost.
 *
 * The server has to be configured with the id anyway, because it is the
 * audience every ID token is verified against, so this is the one copy that
 * cannot be missing while sign-in still works.
 */
export const getAuthConfig = (_req: Request, res: Response) =>
  successResponse(res, "Auth configuration fetched successfully", {
    googleClientId: env.GOOGLE_CLIENT_ID,
    googleSignInEnabled: isGoogleSignInEnabled(),
  });

export const register = asyncHandler(
  async (req, res) => {
  const data = await registerUser(req.body);

  setRefreshCookie(res, data.refreshToken);

    return successResponse(
      res,
      "User registered successfully",
      {
        user: data.user,
        accessToken: data.accessToken,
      },
    201
    )
  }
);

export const login = asyncHandler(
  async (req, res) => {
  const data = await loginUser(req.body);

  setRefreshCookie(res, data.refreshToken);

  return successResponse(
    res,
    "Login successful",
    {
      user: data.user,
      accessToken: data.accessToken,
    })
  }
);

/**
 * Google sign-in. The client obtains an ID token from Google Identity Services
 * and posts it here; the server verifies it and issues the same refresh cookie
 * and access token as a password login, so everything downstream is identical.
 */
export const googleLogin = asyncHandler(
  async (req, res) => {
    const data = await loginWithGoogle(req.body.idToken);

    setRefreshCookie(res, data.refreshToken);

    return successResponse(
      res,
      "Login successful",
      {
        user: data.user,
        accessToken: data.accessToken,
      }
    );
  }
);

export const changePasswordController =
  asyncHandler(
    async (req, res) => {
      await changePassword(
        req.user.userId,
        req.body
      );

      return successResponse(
        res,
        "Password changed successfully"
      );
    }
  );

export const refresh = asyncHandler(
  async (req, res) => {
  const refreshToken =
    req.cookies[REFRESH_TOKEN_COOKIE_NAME];

  if (!refreshToken) {
    throw new UnauthorizedError();
  }

  const {
    user,
    accessToken,
  } = await refreshAccessToken(refreshToken);

  return successResponse(
    res,
    "Access token refreshed",
    {
      user,
      accessToken,
    })
  }
);

export const getCurrentUser = asyncHandler(
  async (req, res) => {
    const user = await getCurrentUserService(
      req.user.userId
    );

    return successResponse(
      res,
      "User fetched successfully",
      user
    );
  }
);

export const logout = (
  req: Request,
  res: Response
) => {
  clearRefreshCookie(res);

  return successResponse(
    res,
    "Logged out successfully",
  );
};
