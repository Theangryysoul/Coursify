import express from "express";

// The real API lives in `create-app.ts` and is loaded on the first request
// rather than at import time.
//
// Vercel packs the API into a serverless function by tracing imports
// statically. If anything in that graph fails to load - a file the tracer did
// not pick up, a dependency left out of the bundle - a static import kills the
// function while it is still loading. Express never gets to run, so no route,
// error handler or log line can explain it, and every request answers with an
// opaque `FUNCTION_INVOCATION_FAILED` (text/plain) from the platform itself.
//
// Loading it lazily keeps this module dependency-free, so the function always
// starts and a load failure is reported as JSON naming the real cause instead.
const app = express();

let api: express.Express | null = null;
let loadFailure: Error | null = null;

const loadApi = async () => {
  if (api) {
    return api;
  }

  // Report the original failure on every request instead of retrying, so the
  // cause stays stable and readable.
  if (loadFailure) {
    throw loadFailure;
  }

  try {
    api = (await import("./create-app.js")).default;
    return api;
  } catch (error) {
    loadFailure = error instanceof Error ? error : new Error(String(error));
    throw loadFailure;
  }
};

app.use((req, res, next) => {
  loadApi()
    .then((api) => (api as express.RequestHandler)(req, res, next))
    .catch((error: Error) => {
      if (res.headersSent) {
        return;
      }

      const cause = error as NodeJS.ErrnoException;

      res.status(500).json({
        success: false,
        message: `API failed to load: ${cause.message}`,
        name: cause.name,
        code: cause.code,
        // Only ever sent while the API cannot load at all - it is what makes
        // the missing module obvious. Once the API loads this branch is dead.
        stack: cause.stack?.split("\n").slice(0, 12),
      });
    });
});

export default app;
