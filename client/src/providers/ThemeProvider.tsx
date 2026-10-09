import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      // The Appearance card on the settings page offers Light, Dark *and*
      // System. With `enableSystem` off, choosing System was silently ignored
      // and the app stayed on whatever theme was active, which made the setting
      // look broken.
      enableSystem
      storageKey="coursify-theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}