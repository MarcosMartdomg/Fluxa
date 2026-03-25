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
import ExecutionsPage from '../pages/tool/executions/ExecutionsPage';
import LogsPage from '../pages/tool/logs/LogsPage';
import SettingsPage from '../pages/tool/settings/SettingsPage';

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
