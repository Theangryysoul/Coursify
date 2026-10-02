// Plain JavaScript on purpose.
//
// Vercel finds an Express service's entrypoint by filename (`app`, `index` or
// `server`, in the service root or in `src/`) and packs the function by tracing
// that entry's imports. Pointed at a TypeScript entry it cannot parse the
// types, so most of the import graph is never packed into the function and it
// dies on its first import - reported only as an opaque
// FUNCTION_INVOCATION_FAILED. Pointed at the compiled output it traces all 46
// files cleanly.
//
// This file therefore stays dependency-free apart from express and loads the
// built application (`tsc`, see package.json) on the first request. Because
// nothing here is imported at module scope, a failure to load the application
// is reported as JSON naming the cause instead of an unreadable platform error.
import express from "express";

const app = express();

let api = null;
let loadFailure = null;

const loadApi = async () => {
  if (api) {
    return api;
  }

  // Keep reporting the original failure rather than retrying on every request.
  if (loadFailure) {
    throw loadFailure;
  }

  try {
    api = (await import("./dist/api.js")).default;
    return api;
  } catch (error) {
    loadFailure = error instanceof Error ? error : new Error(String(error));
    throw loadFailure;
  }
};

app.use((req, res, next) => {
  loadApi()
    .then((handler) => handler(req, res, next))
    .catch((error) => {
      if (res.headersSent) {
        return;
      }

      res.status(500).json({
        success: false,
        message: `API failed to load: ${error.message}`,
        name: error.name,
        code: error.code,
        // Only ever sent while the API cannot load at all - it is what makes
        // the missing piece obvious. Once the API loads this branch is dead.
        stack: error.stack?.split("\n").slice(0, 12),
      });
    });
});

export default app;
