'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

const typeLabels: Record<string, string> = { standard: 'Standart', premium: 'Premium', suite: 'Süit', outdoor: 'Açık Alan', isolation: 'İzolasyon' };
const statusLabels: Record<string, string> = { available: 'Boş', occupied: 'Dolu', maintenance: 'Bakımda', reserved: 'Rezerve' };
const statusColors: Record<string, string> = { available: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', occupied: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400', maintenance: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400', reserved: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400' };

export default function RoomsPage() {
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!authLoading && !token) { router.push('/login'); return; }
    if (token) {
      api.rooms.list(token, filter ? { status: filter } : undefined)
        .then((res: any) => setData(res.data || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [token, authLoading, router, filter]);

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
            <h1 className="text-xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>Odalar</h1>
          </div>
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setLoading(true); }} className="input-field w-auto text-sm">
            <option value="">Tüm Durumlar</option>
            <option value="available">Boş</option>
            <option value="occupied">Dolu</option>
            <option value="maintenance">Bakımda</option>
            <option value="reserved">Rezerve</option>
          </select>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card p-5 animate-pulse">
                <div className="h-5 w-32 rounded bg-amber-200/20 dark:bg-amber-700/20 mb-3" />
                <div className="h-4 w-24 rounded bg-amber-200/20 dark:bg-amber-700/20" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <h3 className="text-lg font-display font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Oda Bulunamadı</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Filtreyle eşleşen oda yok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {data.map((r: any) => (
              <div key={r.id} className="glass-card p-5 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{r.name}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[r.status] || ''}`}>
                    {statusLabels[r.status] || r.status}
                  </span>
                </div>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{typeLabels[r.roomType]} — Kat {r.floor}</p>
                <div className="grid grid-cols-2 gap-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Kapasite</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{r.capacity} hayvan</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Günlük</p>
                    <p className="text-sm font-medium text-amber-500">{formatCurrency(r.dailyRate)}</p>
                  </div>
                </div>
                {r.hasCamera && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-500">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    Kamera mevcut
                  </div>
                )}
                {r.notes && <p className="mt-2 text-xs italic" style={{ color: 'var(--text-muted)' }}>{r.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
