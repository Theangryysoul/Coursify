import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * A short fade-and-rise applied to each page as it mounts.
 *
 * Deliberately subtle: enough to make navigation feel connected rather than an
 * abrupt swap, short enough that it never delays reading. Users who have asked
 * their system to reduce motion get the content with no animation at all.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
