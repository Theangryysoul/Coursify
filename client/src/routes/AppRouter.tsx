import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

import ProtectedRoute from "./ProtectedRoute";

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


        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

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
      </Routes>
    </BrowserRouter>
  );
}