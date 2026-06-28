import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../shared/context/AuthContext';

export const normalizeRole = (role) =>
  String(role || '').replace(/^ROLE_/, '').toUpperCase();

export const isManagerRole = (role) => ['MANAGER', 'STAFF'].includes(normalizeRole(role));

export const getHomePathForRole = (role) =>
  isManagerRole(role) ? '/manager/dashboard' : '/';

export function GuestOnly({ children }) {
  const { user } = useAuth();
  const token = localStorage.getItem('ts_token');

  if (user && token) {
    return <Navigate to={getHomePathForRole(user.role)} replace />;
  }

  return children;
}

export function RequireRole({ children, roles, fallback }) {
  const { user } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem('ts_token');

  if (!user || !token) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }

  const allowedRoles = roles.map(normalizeRole);
  const currentRole = normalizeRole(user.role);

  if (!allowedRoles.includes(currentRole)) {
    return <Navigate to={fallback || getHomePathForRole(currentRole)} replace />;
  }

  return children;
}
