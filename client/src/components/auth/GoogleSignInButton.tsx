import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { env } from "@/config/env";
import { ROUTES } from "@/constants/routes";
import { useGoogleLogin } from "@/hooks/auth/useGoogleLogin";
import { getErrorMessage } from "@/utils/get-error-message";

/**
 * The slice of the Google Identity Services global this file uses. Declaring
 * it locally avoids depending on a types package for a script that is loaded
 * from Google at runtime.
 */
interface GoogleIdentityServices {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: { credential?: string }) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: Record<string, string | number>
      ) => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityServices;
  }
}

const GIS_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

// Loaded once per page, no matter how many forms ask for the button. The
// promise is shared so concurrent mounts do not inject duplicate scripts.
let gisScriptPromise: Promise<void> | null = null;

const loadGisScript = () => {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  gisScriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");

    script.src = GIS_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Could not load Google Sign-In"));

    document.head.appendChild(script);
  });

  return gisScriptPromise;
};

/**
 * Renders Google's own sign-in button via Google Identity Services.
 *
 * Renders nothing when the deployment has no client id configured, and
 * nothing if Google's script cannot be loaded - in both cases the password
 * form beside it keeps working, which is the important part.
 */
export function GoogleSignInButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [unavailable, setUnavailable] = useState(false);

  const googleLogin = useGoogleLogin();

  const navigate = useNavigate();
  const location = useLocation();

  // Where to land after signing in. Written from an effect rather than during
  // render because a ref is not allowed to be touched while rendering.
  const redirectTo = useRef<string>(ROUTES.DASHBOARD);

  useEffect(() => {
    redirectTo.current =
      (
        location.state as { from?: { pathname?: string } } | null
      )?.from?.pathname ?? ROUTES.DASHBOARD;
  }, [location.state]);

  useEffect(() => {
    if (!env.GOOGLE_CLIENT_ID) {
      return;
    }

    let cancelled = false;

    loadGisScript()
      .then(() => {
        const container = containerRef.current;

        if (cancelled || !container || !window.google) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: env.GOOGLE_CLIENT_ID,

          callback: ({ credential }) => {
            if (!credential) {
              toast.error("Google did not return a credential");
              return;
            }

            googleLogin.mutate(credential, {
              onSuccess: () => {
                toast.success("Signed in with Google");
                navigate(redirectTo.current, { replace: true });
              },
              onError: (error) => {
                toast.error(getErrorMessage(error));
              },
            });
          },

          // One Tap sign-in pops up unprompted over the page; the button is
          // enough, so it stays off.
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // StrictMode mounts effects twice; clearing first stops a second
        // iframe from being appended next to the first.
        container.innerHTML = "";

        window.google.accounts.id.renderButton(container, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
          logo_alignment: "center",
          width: container.offsetWidth || 320,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setUnavailable(true);
        }
      });

    return () => {
      cancelled = true;
    };
    // `googleLogin` is intentionally omitted: the mutation object is recreated
    // on every render and re-initialising GIS on each of those would re-render
    // Google's iframe over and over.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!env.GOOGLE_CLIENT_ID || unavailable) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="bg-border h-px flex-1" />

        <span className="text-muted-foreground text-xs tracking-wide uppercase">
          or
        </span>

        <span className="bg-border h-px flex-1" />
      </div>

      <div
        ref={containerRef}
        className="flex min-h-11 w-full justify-center overflow-hidden"
      />
    </div>
  );
}
