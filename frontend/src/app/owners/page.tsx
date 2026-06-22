'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

export default function OwnersPage() {
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authLoading && !token) { router.push('/login'); return; }
    if (token) {
      const timeout = setTimeout(() => {
        api.owners.list(token, search ? { search } : undefined)
          .then((res: any) => setData(res.data || []))
          .catch(() => {})
          .finally(() => setLoading(false));
      }, search ? 300 : 0);
      return () => clearTimeout(timeout);
    }
  }, [token, authLoading, router, search]);

  if (authLoading || !token) return null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <header className="sticky top-0 z-10 backdrop-blur-md border-b" style={{ background: 'var(--glass-bg)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              Panel
            </Link>
            <h1 className="text-xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>Sahipler</h1>
          </div>
          <input type="text" placeholder="İsim veya e-posta ara..." value={search} onChange={(e) => { setSearch(e.target.value); setLoading(true); }} className="input-field w-64 text-sm" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-5 animate-pulse">
                <div className="h-5 w-40 rounded bg-amber-200/20 dark:bg-amber-700/20 mb-3" />
                <div className="h-4 w-48 rounded bg-amber-200/20 dark:bg-amber-700/20" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
            <h3 className="text-lg font-display font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Sahip Bulunamadı</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Aramayla eşleşen kayıt yok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map((o: any) => (
              <div key={o.id} className="glass-card p-5 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full gradient-violet flex items-center justify-center text-white text-sm font-bold">
                    {o.firstName?.[0]}{o.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{o.firstName} {o.lastName}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{o.email}</p>
                  </div>
                </div>
                {o.phone && <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{o.phone}</p>}
                {o.pets && o.pets.length > 0 && (
                  <div className="mt-3 pt-3 flex flex-wrap gap-2" style={{ borderTop: '1px solid var(--border)' }}>
                    {o.pets.map((pet: any) => (
                      <span key={pet.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                        {pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐈' : '🐾'} {pet.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
