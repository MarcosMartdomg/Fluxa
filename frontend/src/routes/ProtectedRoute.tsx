import { Navigate, Outlet } from 'react-router-dom';
import { PATHS } from './paths';

export const ProtectedRoute = () => {
  // Placeholder for real auth check
  const isAuthenticated = true; // TODO: Connect to auth state

  if (!isAuthenticated) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  return <Outlet />;
};
