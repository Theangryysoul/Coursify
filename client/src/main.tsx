import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryProvider } from "./providers/QueryProvider";
import { Toaster } from "sonner";

import "./index.css";

import AppRouter from "@/routes/AppRouter";
import { ThemeProvider } from "@/providers/ThemeProvider";
import AuthInitializer from "@/components/auth/AuthInitializer";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <AuthInitializer>
          <AppRouter />
        </AuthInitializer>
        <Toaster richColors position="top-right" />
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>
);