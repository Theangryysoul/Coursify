import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryProvider } from "./providers/QueryProvider";
import { Toaster } from "sonner";

import "./index.css";

import AppRouter from "@/routes/AppRouter";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
  <QueryProvider>
    <AppRouter />
    <Toaster richColors position="top-right" />
  </QueryProvider>
  </StrictMode>
);