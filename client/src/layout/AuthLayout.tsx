import type { ReactNode } from "react";

import { Logo } from "@/components/common/Logo";

import { PlayCircle, ChartColumn, Clock3, LayoutDashboard } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

const FEATURES = [
  {
    icon: PlayCircle,
    title: "Import YouTube Playlists",
    description: "Import complete playlists in seconds.",
  },
  {
    icon: ChartColumn,
    title: "Track Your Progress",
    description: "Monitor your learning journey effortlessly.",
  },
  {
    icon: Clock3,
    title: "Continue Watching",
    description: "Resume exactly where you left off.",
  },
  {
    icon: LayoutDashboard,
    title: "Beautiful Dashboard",
    description: "Clean, modern and distraction-free.",
  },
];

export function AuthLayout({ children, description, title }: AuthLayoutProps) {
  return (
    /*
     * The panel is dark by design, but the theme is pinned with a class on this
     * subtree rather than by calling `setTheme("dark")`. Setting the global
     * theme here wrote "dark" over whatever the visitor had picked on the
     * settings page, so signing out and back in silently discarded their
     * Appearance choice.
     */
    <div className="dark bg-background text-foreground relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900" />

      <div className="absolute top-0 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:gap-6 lg:px-8">
        {/*
         * The hero is a desktop affordance. On a phone it filled the first
         * screen and pushed the form - the only thing the visitor came for -
         * below the fold, so below `lg` it is dropped and the mark moves next
         * to the form instead.
         */}
        <section className="hidden w-full max-w-md space-y-4 lg:block lg:w-[42%]">
          <Logo theme="dark" className="h-12 w-auto" />

          <div className="space-y-4">
            <h1 className="text-foreground text-4xl leading-none leading-tight font-black tracking-tight lg:text-[3.5rem]">
              Learn{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Smarter.
              </span>
              <br />
              Build{" "}
              <span className="bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
                Faster.
              </span>
            </h1>

            <p className="text-muted-foreground max-w-sm text-[15px] leading-6">
              Organize your courses, import YouTube playlists, track progress,
              and continue learning without distractions.
            </p>
          </div>

          <div className="space-y-2.5">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="border-border bg-card flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border backdrop-blur-md">
                  <Icon className="h-4 w-4 text-violet-400" />
                </div>

                <div>
                  <h3 className="text-foreground text-[16px] font-semibold">
                    {title}
                  </h3>

                  <p className="text-muted-foreground mt-0.5 text-[13px] leading-5">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Form */}
        <section className="w-full max-w-md lg:w-[45%]">
          <Logo
            theme="dark"
            className="mx-auto mb-6 h-10 w-auto lg:hidden"
          />

          <Card className="border-border bg-card gap-0 rounded-3xl border py-0 shadow-2xl backdrop-blur-2xl">
            <CardHeader className="px-5 pt-6 text-center sm:px-8 sm:pt-8">
              <CardTitle className="text-foreground text-3xl font-bold sm:text-4xl">
                {title}
              </CardTitle>

              <CardDescription className="text-muted-foreground text-sm sm:text-base">
                {description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 px-5 pt-6 pb-6 sm:px-8 sm:pt-7 sm:pb-8">
              {children}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
