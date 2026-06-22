'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', facilityName: '', phone: '', city: '', district: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res: any = await api.auth.register(form);
      localStorage.setItem('pawdock_token', res.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg gradient-paw flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="4" cy="8" r="2"/>
              <path d="M9 10a5 5 0 0 1 6 0l2 3a3 3 0 0 1-2 5H9a3 3 0 0 1-2-5l2-3z"/>
            </svg>
          </div>
          <span className="text-xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>PawDock</span>
        </div>

        <h1 className="text-3xl font-display font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Yeni Hesap Oluşturun</h1>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Pet otelinizi birkaç dakikada dijitale taşıyın</p>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Ad</label>
              <input type="text" value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Soyad</label>
              <input type="text" value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} required className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tesis Adı</label>
            <input type="text" value={form.facilityName} onChange={(e) => setForm({...form, facilityName: e.target.value})} placeholder="Örn: Happy Paws Pet Otel" required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>E-posta</label>
            <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Şifre</label>
            <input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} minLength={6} required className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>İl</label>
              <input type="text" value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>İlçe</label>
              <input type="text" value={form.district} onChange={(e) => setForm({...form, district: e.target.value})} className="input-field" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-50 mt-2">
            {loading ? 'Oluşturuluyor...' : 'Hesap Oluştur'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Zaten hesabınız var mı?{' '}
          <Link href="/login" className="font-medium text-amber-500 hover:text-amber-400 transition-colors">Giriş Yapın</Link>
        </p>
      </div>
    </div>
  );
}
