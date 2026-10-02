export const env = {
  // Defaults to the same-origin API path, which is what Vercel serves in
  // production (see the rewrite rules in vercel.json) and what the Vite dev
  // proxy forwards to the local server.
  API_URL: import.meta.env.VITE_API_URL || "/api/v1",
} as const;
