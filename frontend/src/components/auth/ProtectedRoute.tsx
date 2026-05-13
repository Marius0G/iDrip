import { Navigate } from 'react-router-dom';
import { useUserStore } from '@/stores/useUserStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
