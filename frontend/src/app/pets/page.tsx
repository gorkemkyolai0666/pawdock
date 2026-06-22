'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

const speciesLabels: Record<string, string> = { dog: 'Köpek', cat: 'Kedi', bird: 'Kuş', rabbit: 'Tavşan', hamster: 'Hamster', fish: 'Balık', reptile: 'Sürüngen', other: 'Diğer' };
const speciesEmoji: Record<string, string> = { dog: '🐕', cat: '🐈', bird: '🐦', rabbit: '🐇', hamster: '🐹', fish: '🐟', reptile: '🦎', other: '🐾' };
const sizeLabels: Record<string, string> = { tiny: 'Minik', small: 'Küçük', medium: 'Orta', large: 'Büyük', giant: 'Dev' };

export default function PetsPage() {
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!authLoading && !token) { router.push('/login'); return; }
    if (token) {
      api.pets.list(token, filter ? { species: filter } : undefined)
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
            <h1 className="text-xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>Hayvanlar</h1>
          </div>
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setLoading(true); }} className="input-field w-auto text-sm">
            <option value="">Tüm Türler</option>
            <option value="dog">Köpek</option>
            <option value="cat">Kedi</option>
            <option value="bird">Kuş</option>
            <option value="rabbit">Tavşan</option>
            <option value="other">Diğer</option>
          </select>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-5 animate-pulse">
                <div className="h-5 w-32 rounded bg-amber-200/20 dark:bg-amber-700/20 mb-3" />
                <div className="h-4 w-48 rounded bg-amber-200/20 dark:bg-amber-700/20 mb-2" />
                <div className="h-4 w-24 rounded bg-amber-200/20 dark:bg-amber-700/20" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-3xl">🐾</div>
            <h3 className="text-lg font-display font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Hayvan Bulunamadı</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Henüz kayıtlı hayvan yok veya filtreyle eşleşen sonuç yok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map((p: any) => (
              <div key={p.id} className="glass-card p-5 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xl">
                      {speciesEmoji[p.species] || '🐾'}
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.breed || speciesLabels[p.species]}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.vaccinated ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                    {p.vaccinated ? 'Aşılı' : 'Aşısız'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Boyut</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{sizeLabels[p.size] || p.size}</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Yaş</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.age ? `${p.age} yaş` : '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Sahip</p>
                    <p className="text-sm font-medium text-violet-500">{p.owner?.firstName} {p.owner?.lastName}</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Ağırlık</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.weight ? `${p.weight} kg` : '—'}</p>
                  </div>
                </div>
                {(p.specialNeeds || p.allergies) && (
                  <div className="mt-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                    <p className="text-xs text-red-600 dark:text-red-400">{p.specialNeeds || p.allergies}</p>
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
