export const env = {
  // Defaults to the same-origin API path, which is what Vercel serves in
  // production (see the rewrite rules in vercel.json) and what the Vite dev
  // proxy forwards to the local server.
  API_URL: import.meta.env.VITE_API_URL || "/api/v1",

  // The public OAuth client id. This value is public by design - it is the
  // same one Google sees in the browser - so it can live in the bundle. When
  // it is empty Google sign-in is unavailable and the button is hidden.
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
} as const;
