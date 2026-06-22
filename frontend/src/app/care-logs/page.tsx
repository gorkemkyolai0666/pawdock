'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

const careLabels: Record<string, string> = { feeding: 'Besleme', walking: 'Yürüyüş', grooming: 'Tımar', playtime: 'Oyun', medication: 'İlaç', health_check: 'Sağlık Kontrolü', bath: 'Banyo', training: 'Eğitim', other: 'Diğer' };
const careColors: Record<string, string> = { feeding: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400', walking: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', grooming: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400', playtime: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', medication: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400', health_check: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400', bath: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400', training: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400', other: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' };

export default function CareLogsPage() {
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!authLoading && !token) { router.push('/login'); return; }
    if (token) {
      api.careLogs.list(token, filter ? { careType: filter } : undefined)
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
            <h1 className="text-xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>Bakım Günlüğü</h1>
          </div>
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setLoading(true); }} className="input-field w-auto text-sm">
            <option value="">Tüm Türler</option>
            <option value="feeding">Besleme</option>
            <option value="walking">Yürüyüş</option>
            <option value="grooming">Tımar</option>
            <option value="playtime">Oyun</option>
            <option value="medication">İlaç</option>
            <option value="bath">Banyo</option>
          </select>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-4 animate-pulse">
                <div className="h-4 w-64 rounded bg-amber-200/20 dark:bg-amber-700/20 mb-2" />
                <div className="h-3 w-40 rounded bg-amber-200/20 dark:bg-amber-700/20" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </div>
            <h3 className="text-lg font-display font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Bakım Kaydı Bulunamadı</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Filtreyle eşleşen kayıt yok.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((cl: any) => (
              <div key={cl.id} className="glass-card p-4 hover:shadow-md transition-shadow duration-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 text-lg">
                    {cl.pet?.species === 'dog' ? '🐕' : cl.pet?.species === 'cat' ? '🐈' : '🐾'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                      {cl.pet?.name} — {cl.description}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {cl.staffName} {cl.duration ? `• ${cl.duration} dk` : ''}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${careColors[cl.careType] || careColors.other}`}>
                  {careLabels[cl.careType] || cl.careType}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
