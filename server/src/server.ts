import app from "./app.js";

// Keep this module free of static imports besides the app itself. Anything
// imported here is evaluated as the serverless function starts, so a single
// failing import would kill the function before any route or error handler
// exists - the failure Vercel reports as an opaque FUNCTION_INVOCATION_FAILED.
// The pieces only the local server needs are imported when it actually starts.
const startServer = async () => {
  const [{ env }, { connectDB }] = await Promise.all([
    import("./config/env.js"),
    import("./config/database.js"),
  ]);

  try {
    await connectDB();
  } catch {
    // The API routes retry the connection, so a slow database should not stop
    // the process from booting.
    console.warn("⚠️  Starting without a database connection");
  }

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  });
};

// On Vercel the app is imported and executed as a function, so it must not
// open a port there. Locally this file is the entrypoint that boots the server.
if (!process.env.VERCEL) {
  void startServer();
}

export default app;
