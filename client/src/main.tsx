import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryProvider } from "./providers/QueryProvider";
import { Toaster } from "sonner";

import "./index.css";

import AppRouter from "@/routes/AppRouter";
import { ThemeProvider } from "@/providers/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
  <QueryProvider>
    <AppRouter />
    <Toaster richColors position="top-right" />
  </QueryProvider>
  </ThemeProvider>
  </StrictMode>
);