'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function HomePage() {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (token) router.replace('/dashboard');
      else router.replace('/login');
    }
  }, [token, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl gradient-paw flex items-center justify-center shadow-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="4" cy="8" r="2"/>
              <path d="M9 10a5 5 0 0 1 6 0l2 3a3 3 0 0 1-2 5H9a3 3 0 0 1-2-5l2-3z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
            PawDock
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</p>
      </div>
    </div>
  );
}
