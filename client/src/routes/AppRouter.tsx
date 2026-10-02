import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import CoursesPage from "@/pages/courses/CoursesPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import { DashboardLayout } from "@/layout/DashboardLayout";
import ImportPage from "@/pages/import/ImportPage";
import ProgressPage from "@/pages/progress/ProgressPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import CourseDetailsPage from "@/pages/courses/CourseDetailsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.HOME}
          element={<Navigate to={ROUTES.DASHBOARD} replace />}
        />

        <Route element={<PublicRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.COURSES} element={<CoursesPage />} />
            <Route path={ROUTES.IMPORT} element={<ImportPage />} />
            <Route path={ROUTES.PROGRESS} element={<ProgressPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
            <Route path={ROUTES.COURSE_DETAILS} element={<CourseDetailsPage />}/>
          </Route>
        </Route>

        {/* Unknown paths fall back to the dashboard, which sends signed-out
            visitors on to the login page. */}
        <Route
          path="*"
          element={<Navigate to={ROUTES.DASHBOARD} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
