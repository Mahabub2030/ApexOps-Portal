import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { ThemeProvider } from "./providers/theme.provider";
import { ToastProvider } from "./components/ui/toast.tsx";
import { RouterProvider } from "react-router";
import { router } from "./routes/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <ToastProvider />
    </ThemeProvider>
  </StrictMode>,
);
