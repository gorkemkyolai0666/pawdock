'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface Stats {
  totalPets: number;
  totalOwners: number;
  totalRooms: number;
  availableRooms: number;
  totalBookings: number;
  activeBookings: number;
  totalCareLogs: number;
  totalRevenue: number;
  recentBookings: any[];
  recentCareLogs: any[];
}

const navItems = [
  { href: '/dashboard', label: 'Panel', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/pets', label: 'Hayvanlar', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { href: '/owners', label: 'Sahipler', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { href: '/rooms', label: 'Odalar', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { href: '/bookings', label: 'Rezervasyonlar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { href: '/care-logs', label: 'Bakım Günlüğü', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
];

function NavSidebar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const router = useRouter();

  return (
    <aside className="w-64 min-h-screen flex flex-col gradient-paw border-r border-amber-700/30">
      <div className="p-6 border-b border-amber-700/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="4" cy="8" r="2"/>
              <path d="M9 10a5 5 0 0 1 6 0l2 3a3 3 0 0 1-2 5H9a3 3 0 0 1-2-5l2-3z"/>
            </svg>
          </div>
          <span className="text-lg font-display font-bold text-white">PawDock</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-amber-100 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.icon} />
            </svg>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-amber-700/30">
        <button onClick={toggle} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-amber-100 hover:text-white hover:bg-white/10 transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {theme === 'dark' ? <><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></> : <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>}
          </svg>
          {theme === 'dark' ? 'Açık Mod' : 'Koyu Mod'}
        </button>
        <div className="mt-2 px-4 py-2 text-xs text-amber-300/70">{user?.firstName} {user?.lastName}</div>
        <button onClick={() => { logout(); router.push('/login'); }} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m5 5H9"/>
          </svg>
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  const colorMap: Record<string, string> = {
    amber: 'from-amber-400 to-amber-600',
    violet: 'from-violet-400 to-violet-600',
    emerald: 'from-emerald-400 to-emerald-600',
    rose: 'from-rose-400 to-rose-600',
  };

  return (
    <div className="glass-card p-5 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorMap[color] || colorMap.amber} flex items-center justify-center flex-shrink-0`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={icon} />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !token) { router.push('/login'); return; }
    if (token) {
      api.dashboard.stats(token)
        .then((data: any) => setStats(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [token, authLoading, router]);

  if (authLoading || !token) return null;

  const statusLabels: Record<string, string> = { pending: 'Bekliyor', confirmed: 'Onaylandı', checked_in: 'Giriş Yapıldı', checked_out: 'Çıkış Yapıldı', cancelled: 'İptal' };
  const careLabels: Record<string, string> = { feeding: 'Besleme', walking: 'Yürüyüş', grooming: 'Tımar', playtime: 'Oyun', medication: 'İlaç', health_check: 'Sağlık', bath: 'Banyo', training: 'Eğitim', other: 'Diğer' };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <NavSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Panel</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Pet otel operasyon özeti</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass-card p-5 animate-pulse">
                  <div className="h-4 w-24 rounded bg-amber-200/20 dark:bg-amber-700/20 mb-3" />
                  <div className="h-7 w-16 rounded bg-amber-200/20 dark:bg-amber-700/20" />
                </div>
              ))}
            </div>
          ) : stats ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatCard label="Toplam Hayvan" value={stats.totalPets} icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" color="amber" />
                <StatCard label="Aktif Konaklama" value={stats.activeBookings} icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" color="violet" />
                <StatCard label="Boş Oda" value={stats.availableRooms} icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" color="emerald" />
                <StatCard label="Toplam Gelir" value={formatCurrency(stats.totalRevenue)} icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" color="rose" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatCard label="Toplam Sahip" value={stats.totalOwners} icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" color="violet" />
                <StatCard label="Toplam Oda" value={stats.totalRooms} icon="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" color="amber" />
                <StatCard label="Toplam Rezervasyon" value={stats.totalBookings} icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" color="emerald" />
                <StatCard label="Bakım Kaydı" value={stats.totalCareLogs} icon="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" color="rose" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="text-lg font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Son Rezervasyonlar</h3>
                  {stats.recentBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-400"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Henüz rezervasyon yok</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {stats.recentBookings.map((b: any) => (
                        <div key={b.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                          <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{b.pet?.name} ({b.room?.name})</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{b.pet?.owner?.firstName} {b.pet?.owner?.lastName}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${b.status === 'checked_in' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : b.status === 'confirmed' ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
                            {statusLabels[b.status] || b.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-lg font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Son Bakım Kayıtları</h3>
                  {stats.recentCareLogs.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Henüz bakım kaydı yok</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {stats.recentCareLogs.map((cl: any) => (
                        <div key={cl.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                          <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{cl.pet?.name} — {cl.description}</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{cl.staffName}</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                            {careLabels[cl.careType] || cl.careType}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p style={{ color: 'var(--text-muted)' }}>Veri yüklenemedi</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
