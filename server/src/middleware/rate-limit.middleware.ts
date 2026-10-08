import rateLimit from "express-rate-limit";

/**
 * Throttles the YouTube endpoints per account.
 *
 * Every preview and import spends YouTube Data API quota that is shared by all
 * users of the deployment, so an impatient click-happy client (or a script)
 * can exhaust the daily allowance for everyone. Keying by user id rather than
 * IP means one account cannot drain the quota, while several users behind the
 * same NAT are not throttled as if they were one.
 */
export const youtubeRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 30,

  standardHeaders: "draft-7",

  legacyHeaders: false,

  keyGenerator: (req) => req.user?.userId ?? req.ip ?? "anonymous",

  message: {
    success: false,
    message:
      "Too many YouTube requests. Please wait a few minutes and try again.",
  },
});
