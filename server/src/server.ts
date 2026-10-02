import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/database.js";

const startServer = async () => {
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
