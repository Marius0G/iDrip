import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';

interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useUserStore((s) => s.setAuth);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
      return;
    }

    const token = searchParams.get('token');

    if (!token) {
      navigate('/login?error=no_token', { replace: true });
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as JWTPayload;

      setAuth(token, {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        stylePreferences: [],
        budget: { monthlyBudget: 150, spent: 0, currency: 'USD' },
        createdAt: new Date().toISOString(),
      });

      navigate('/', { replace: true });
    } catch {
      navigate('/login?error=no_token', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-snowdrift">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--glacier))]" />
        <p className="text-sm text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
}
