import { env } from "./config/env.js";
import { connectDB } from "./config/database.js";
import app from "./api.js";

// Local development only. On Vercel the service entrypoint is the plain
// JavaScript `index.js` in the server root, which loads the compiled build;
// this file just boots the same app on a port for `pnpm dev`.
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

void startServer();
