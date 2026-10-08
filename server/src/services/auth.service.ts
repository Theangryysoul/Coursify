// bcryptjs, not bcrypt: the native `bcrypt` package loads its compiled binding
// through a dynamic `node-gyp-build` call, which Vercel's file tracer cannot
// follow, so the binding is left out of the deployed function and the API dies
// while loading with an opaque FUNCTION_INVOCATION_FAILED. bcryptjs is pure
// JavaScript and produces the same `$2b$` hashes, so stored hashes keep working.
import bcrypt from "bcryptjs";
import { isValidObjectId } from "mongoose";
import { OAuth2Client, type LoginTicket } from "google-auth-library";
import { env } from "../config/env.js";
import User from "../models/user.model.js";
import { RegisterUserInput, LoginUserInput } from "../types/auth.types.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { BadRequestError, NotFoundError, UnauthorizedError, } from "../utils/errors.js";

/**
 * Verifies Google ID tokens. Built lazily so an unconfigured deployment can
 * still serve every other route - constructing it at import time with an empty
 * client id would be a quiet trap.
 */
let googleClient: OAuth2Client | null = null;

const getGoogleClient = () => {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new BadRequestError(
      "Google sign-in is not configured on this server."
    );
  }

  googleClient ??= new OAuth2Client(env.GOOGLE_CLIENT_ID);

  return googleClient;
};

/** True when Google sign-in can work, so the client knows to show the button. */
export const isGoogleSignInEnabled = () => Boolean(env.GOOGLE_CLIENT_ID);

/**
 * Everything the client is allowed to know about a user.
 *
 * Never send a user document straight from Mongoose: `select: false` only
 * affects queries, so a document returned by `User.create()` still holds the
 * bcrypt hash in memory and would serialize it into the response.
 */
export interface PublicUser {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    url: string;
    publicId: string;
  };
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const sanitizeUser = (user: {
  _id: { toString(): string };
  name: string;
  email: string;
  avatar?: { url?: string; publicId?: string } | null;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}): PublicUser => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  avatar: {
    url: user.avatar?.url ?? "",
    publicId: user.avatar?.publicId ?? "",
  },
  bio: user.bio ?? "",
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const registerUser = async (userData: RegisterUserInput) => {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return createSession(sanitizeUser(user), user._id.toString());
};

export const loginUser = async (
  userData: LoginUserInput
) => {

  const { email, password } = userData;

  const user = await User.findOne({ email }).select("+password");

  // `!user.password` covers accounts created through Google: they never set a
  // password, and passing undefined to bcrypt.compare would throw a 500 where
  // the honest answer is "wrong credentials".
  if (!user || !user.password) {
  throw new UnauthorizedError("Invalid email or password");
  }

  const isPasswordCorrect = await bcrypt.compare(
  password,
  user.password
  );

  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid email or password");
  }

  return createSession(sanitizeUser(user), user._id.toString());

};

export const changePassword =
  async (
    userId: string,
    data: {
      currentPassword: string;
      newPassword: string;
    }
  ) => {
    const user =
      await User.findById(userId).select("+password");

    if (!user) {
      throw new NotFoundError(
        "User not found"
      );
    }

    // A Google-only account has no password to verify against, so the usual
    // "wrong current password" path would throw from inside bcrypt instead.
    if (!user.password) {
      throw new BadRequestError(
        "This account signs in with Google and has no password to change."
      );
    }

    const valid =
      await bcrypt.compare(
        data.currentPassword,
        user.password
      );

    if (!valid) {
      throw new UnauthorizedError(
        "Current password is incorrect"
      );
    }

    user.password = await bcrypt.hash(
      data.newPassword,
      10
    );

    await user.save();

    return;
  };

/**
 * Signs a user in with a Google ID token issued by Google Identity Services.
 *
 * The token is verified server-side against our own client id, so a token
 * minted for a different application - or a forged one - is rejected. The
 * email is trusted only when Google marks it verified: otherwise anybody able
 * to create a Google account with a victim's address could take over that
 * account by signing in.
 */
export const loginWithGoogle = async (idToken: string) => {
  const client = getGoogleClient();

  // google-auth-library reports every rejection as a plain Error with no status
  // code - an expired token, a token minted for a different client id, a forged
  // signature, or a failure to fetch Google's signing keys. Left to propagate,
  // the error handler answers 500 and the browser is shown the library's
  // internal wording ("No pem found for envelope: ..."), which says nothing
  // about what the user should do and looks like the server is broken. The
  // credential really was unacceptable, so it is a 401; the real cause goes to
  // the server log, where it is useful.
  let ticket: LoginTicket;

  try {
    ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
  } catch (error) {
    console.error("Google ID token verification failed:", error);

    throw new UnauthorizedError(
      "That Google sign-in could not be verified. Please try again."
    );
  }

  const payload = ticket.getPayload();

  if (!payload?.email) {
    throw new UnauthorizedError("Google account has no email address");
  }

  if (!payload.email_verified) {
    throw new UnauthorizedError("Google account email is not verified");
  }

  const email = payload.email.toLowerCase();

  // An account already created with this email is linked to the Google
  // identity rather than duplicated, so a user who signed up with a password
  // can switch to Google without losing their courses.
  let user = await User.findOne({
    $or: [{ googleId: payload.sub }, { email }],
  });

  if (user) {
    if (!user.googleId) {
      user.googleId = payload.sub;
    }

    // Fill in a name or avatar only where the account has none, so a profile
    // the user edited is never overwritten by Google's copy.
    if (!user.name && payload.name) {
      user.name = payload.name;
    }

    if (!user.avatar?.url && payload.picture) {
      user.avatar = { url: payload.picture, publicId: "" };
    }

    await user.save();
  } else {
    user = await User.create({
      name: payload.name ?? email.split("@")[0],
      email,
      googleId: payload.sub,
      avatar: payload.picture
        ? { url: payload.picture, publicId: "" }
        : undefined,
    });
  }

  return createSession(sanitizeUser(user), user._id.toString());
};

export const refreshAccessToken = async (
  refreshToken: string
) => {
  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError(
      "Invalid or expired refresh token"
    );
  }

  // The refresh token is only proof of identity; the profile is re-read so the
  // client can restore the whole session from a page reload.
  const user = await getCurrentUserService(decoded.userId);

  return {
    user,
    accessToken: generateAccessToken(decoded.userId),
  };
};

export const getCurrentUserService = async (
  userId: string
) => {
  if (!isValidObjectId(userId)) {
    throw new UnauthorizedError("Invalid session");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  return sanitizeUser(user);
};

const createSession = (user: PublicUser, userId: string) => ({
  user,
  accessToken: generateAccessToken(userId),
  refreshToken: generateRefreshToken(userId),
});
