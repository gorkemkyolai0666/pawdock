'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';

const statusLabels: Record<string, string> = { pending: 'Bekliyor', confirmed: 'Onaylandı', checked_in: 'Giriş Yapıldı', checked_out: 'Çıkış Yapıldı', cancelled: 'İptal' };
const statusColors: Record<string, string> = { pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400', confirmed: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400', checked_in: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', checked_out: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400', cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' };

export default function BookingsPage() {
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!authLoading && !token) { router.push('/login'); return; }
    if (token) {
      api.bookings.list(token, filter ? { status: filter } : undefined)
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
            <h1 className="text-xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>Rezervasyonlar</h1>
          </div>
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setLoading(true); }} className="input-field w-auto text-sm">
            <option value="">Tüm Durumlar</option>
            <option value="pending">Bekliyor</option>
            <option value="confirmed">Onaylandı</option>
            <option value="checked_in">Giriş Yapıldı</option>
            <option value="checked_out">Çıkış Yapıldı</option>
            <option value="cancelled">İptal</option>
          </select>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="glass-card p-5 animate-pulse">
                <div className="h-5 w-48 rounded bg-amber-200/20 dark:bg-amber-700/20 mb-2" />
                <div className="h-4 w-32 rounded bg-amber-200/20 dark:bg-amber-700/20" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-400"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <h3 className="text-lg font-display font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Rezervasyon Bulunamadı</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Filtreyle eşleşen rezervasyon yok.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((b: any) => (
              <div key={b.id} className="glass-card p-5 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-500"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{b.pet?.name} — {b.room?.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                        {b.pet?.owner && ` • ${b.pet.owner.firstName} ${b.pet.owner.lastName}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-amber-500">{formatCurrency(b.totalPrice)}</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[b.status] || ''}`}>
                      {statusLabels[b.status] || b.status}
                    </span>
                  </div>
                </div>
                {b.notes && <p className="mt-3 text-xs italic pl-16" style={{ color: 'var(--text-muted)' }}>{b.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
