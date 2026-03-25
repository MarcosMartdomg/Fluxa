import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PATHS } from './paths';
import { ProtectedRoute } from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Main Pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import WorkflowsPage from '../pages/workflows/WorkflowsPage';
import CreateWorkflowPage from '../pages/workflows/CreateWorkflowPage';
import WorkflowDetailPage from '../pages/workflows/WorkflowDetailPage';
import ExecutionsPage from '../pages/executions/ExecutionsPage';
import LogsPage from '../pages/logs/LogsPage';
import SettingsPage from '../pages/settings/SettingsPage';

import LandingPage from '../pages/landing/LandingPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: PATHS.LOGIN,
    element: <LoginPage />,
  },
  {
    path: PATHS.REGISTER,
    element: <RegisterPage />,
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
        ],
      },
    ],
  },
]);
