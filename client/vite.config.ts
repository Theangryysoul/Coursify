import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

const API_TARGET = "http://localhost:5000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,

        // When the API is not running the proxy would otherwise answer with a
        // bare 500 and an empty body, which reaches the browser as
        // "status of 500 ()" and tells nobody anything. Answering with JSON
        // lets the UI show which process is missing.
        configure: (proxy) => {
          proxy.on("error", (error, _req, res) => {
            console.error(
              `\n[vite] Could not reach the API at ${API_TARGET}: ${error.message}`
            );

            const response = res as unknown as {
              headersSent?: boolean;
              writeHead?: (
                status: number,
                headers: Record<string, string>
              ) => void;
              end?: (body?: string) => void;
            };

            if (
              !response.writeHead ||
              !response.end ||
              response.headersSent
            ) {
              return;
            }

            response.writeHead(503, {
              "Content-Type": "application/json",
            });

            response.end(
              JSON.stringify({
                success: false,
                message:
                  "The API server is not running. Start it with `pnpm dev` (or `pnpm server`).",
              })
            );
          });
        },
      },
    },
  },
});
