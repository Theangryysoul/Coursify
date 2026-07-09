import { useEffect, type ReactNode } from "react";
import { useTheme } from "next-themes";

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
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);
  return (
    <div className="bg-background text-foreground relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900" />

      <div className="absolute top-0 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center gap-4 px-8 py-8 lg:flex-row lg:gap-6">
        {/* Hero */}
        <section className="w-full max-w-md space-y-4 lg:w-[42%]">
          <Logo className="h-12 w-auto" />

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
          <Card className="border-border bg-card rounded-3xl border shadow-2xl backdrop-blur-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-foreground py-3 text-4xl font-bold">
                {title}
              </CardTitle>

              <CardDescription className="text-muted-foreground text-base">
                {description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 px-8 pb-8">
              {children}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
