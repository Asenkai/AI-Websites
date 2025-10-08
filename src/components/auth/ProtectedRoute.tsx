import { Navigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { ReactNode } from 'react';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { session, user, loading } = useSession();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">Loading authentication...</div>;
  }

  if (!session || !user || user.profile?.role !== 'admin') {
    // Redirect to login if not authenticated or not an admin
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};