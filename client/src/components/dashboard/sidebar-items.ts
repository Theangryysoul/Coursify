import {
  LayoutDashboard,
  BookOpen,
  PlayCircle,
  ChartNoAxesColumn,
  User,
  Settings,
} from "lucide-react";

import { ROUTES } from "@/constants/routes";

export const SIDEBAR_ITEMS = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: ROUTES.DASHBOARD,
  },
  {
    title: "Courses",
    icon: BookOpen,
    href: ROUTES.COURSES,
  },
  {
    title: "Import",
    icon: PlayCircle,
    href: ROUTES.IMPORT,
  },
  {
    title: "Progress",
    icon: ChartNoAxesColumn,
    href: ROUTES.PROGRESS,
  },
  {
    title: "Profile",
    icon: User,
    href: ROUTES.PROFILE,
  },
  {
    title: "Settings",
    icon: Settings,
    href: ROUTES.SETTINGS,
  },
];