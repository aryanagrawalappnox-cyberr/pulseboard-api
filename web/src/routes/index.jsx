import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import LoginPage from "../features/auth/LoginPage.jsx";
import SignupPage from "../features/auth/SignupPage.jsx";
import ProjectsPage from "../features/projects/ProjectsPage.jsx";
import ProjectDetailPage from "../features/projects/ProjectDetailPage.jsx";
import NotFoundPage from "./NotFoundPage.jsx";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/projects" replace /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "projects/:projectId", element: <ProjectDetailPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
