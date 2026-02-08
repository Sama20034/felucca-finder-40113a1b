import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

const ADMIN_EMAIL = 'admin@gmail.com';

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only allow access if user is admin AND has the specific admin email
  if (!user || !isAdmin || user.email !== ADMIN_EMAIL) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
