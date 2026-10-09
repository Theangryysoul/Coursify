import darkLogo from "@/assets/logo.png";
import lightLogo from "@/assets/logo1.png";

import { useTheme } from "next-themes";

interface LogoProps {
  className?: string;

  /**
   * Renders the mark against a background the caller controls rather than the
   * active theme. The auth pages paint their own dark panel whatever theme the
   * visitor has chosen, so they pass "dark" here instead of changing the global
   * theme to make the logo match.
   */
  theme?: "light" | "dark";
}

export function Logo({ className, theme }: LogoProps) {
  const { resolvedTheme } = useTheme();

  const isDark = (theme ?? resolvedTheme) === "dark";

  return (
    <img
      src={isDark ? darkLogo : lightLogo}
      alt="Coursify"
      className={className}
    />
  );
}