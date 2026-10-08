import { Request, Response, type CookieOptions } from "express";
import { env } from "../config/env.js";
import { successResponse } from "../utils/api-response.js";
import { registerUser, loginUser, loginWithGoogle, refreshAccessToken, getCurrentUserService, changePassword } from "../services/auth.service.js";
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
