import darkLogo from "@/assets/logo.png";
import lightLogo from "@/assets/logo1.png";

import { useTheme } from "next-themes";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const { resolvedTheme } = useTheme();

  return (
    <img
      src={resolvedTheme === "dark" ? darkLogo : lightLogo}
      alt="Coursify"
      className={className}
    />
  );
}