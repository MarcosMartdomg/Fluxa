import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PATHS } from './paths';
import { ProtectedRoute } from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Main Pages
import DashboardPage from '../pages/tool/dashboard/DashboardPage';
import WorkflowsPage from '../pages/tool/workflows/WorkflowsPage';
import CreateWorkflowPage from '../pages/tool/workflows/CreateWorkflowPage';
import WorkflowDetailPage from '../pages/tool/workflows/WorkflowDetailPage';
import ProjectCanvasPage from '../pages/tool/projects/ProjectCanvasPage';
import ExecutionsPage from '../pages/tool/executions/ExecutionsPage';
import LogsPage from '../pages/tool/logs/LogsPage';
import SettingsPage from '../pages/tool/settings/SettingsPage';
import ShortcutsPage from '../pages/tool/shortcuts/ShortcutsPage';

import LandingPage from '../pages/landing/LandingPage';
import ProductPage from '../pages/landing/ProductPage';
import FeaturesPage from '../pages/landing/FeaturesPage';
import UseCasesPage from '../pages/landing/UseCasesPage';
import ContactPage from '../pages/landing/ContactPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: PATHS.CONTACT,
    element: <ContactPage />,
  },
  {
    path: PATHS.PRODUCT,
    element: <ProductPage />,
  },
  {
    path: PATHS.FEATURES,
    element: <FeaturesPage />,
  },
  {
    path: PATHS.USE_CASES,
    element: <UseCasesPage />,
  },
  {
    path: PATHS.LOGIN,
    element: <LoginPage />,
  },
  {
    path: PATHS.REGISTER,
    element: <RegisterPage />,
  },
  // Legacy Redirects
  {
    path: '/dashboard',
    element: <Navigate to={PATHS.DASHBOARD} replace />,
  },
  {
    path: '/projects/:id',
    element: <Navigate to="/tool/projects/:id" replace />,
  },
  {
    path: '/projects/:id/executions',
    element: <Navigate to="/tool/projects/:id/executions" replace />,
  },
  {
    path: '/workflows',
    element: <Navigate to={PATHS.WORKFLOWS} replace />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: PATHS.DASHBOARD,
            element: <DashboardPage />,
          },
          {
            path: PATHS.PROJECT_DETAIL,
            element: <ProjectCanvasPage />,
          },
          {
            path: PATHS.PROJECT_EXECUTIONS,
            element: <ExecutionsPage />,
          },
          {
            path: PATHS.WORKFLOWS,
            element: <WorkflowsPage />,
          },
          {
            path: PATHS.CREATE_WORKFLOW,
            element: <CreateWorkflowPage />,
          },
          {
            path: PATHS.WORKFLOW_DETAIL,
            element: <WorkflowDetailPage />,
          },
          {
            path: PATHS.EXECUTIONS,
            element: <ExecutionsPage />,
          },
          {
            path: PATHS.LOGS,
            element: <LogsPage />,
          },
          {
            path: PATHS.SETTINGS,
            element: <SettingsPage />,
          },
          {
            path: PATHS.SHORTCUTS,
            element: <ShortcutsPage />,
          },
        ],
      },
    ],
  },
]);
