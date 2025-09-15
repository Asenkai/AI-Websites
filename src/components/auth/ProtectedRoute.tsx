import { Navigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { ReactNode } from 'react';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { session, loading } = useSession();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};