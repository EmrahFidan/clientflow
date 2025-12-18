'use client';

import { useState } from 'react';
import { sendMagicLink } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sendMagicLink(email);
      setSent(true);
    } catch (err) {
      console.error('Error sending magic link:', err);
      setError(err instanceof Error ? err.message : 'E-posta gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div
          className="max-w-md w-full rounded-2xl p-8 text-center"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          {/* Success Icon */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'var(--color-success-light)' }}
          >
            <svg className="w-10 h-10" style={{ color: 'var(--color-success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
            E-posta Gönderildi!
          </h1>

          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            <strong>{email}</strong> adresine bir giriş linki gönderdik.
            E-postanızı kontrol edin ve linke tıklayarak giriş yapın.
          </p>

          <div
            className="rounded-xl p-4 mb-6"
            style={{ backgroundColor: 'var(--color-primary-light)' }}
          >
            <p className="text-sm" style={{ color: 'var(--color-primary)' }}>
              💡 <strong>İpucu:</strong> E-posta birkaç dakika içinde gelmezse spam klasörünüzü kontrol edin.
            </p>
          </div>

          <button
            onClick={() => {
              setSent(false);
              setEmail('');
            }}
            className="w-full px-6 py-3 rounded-xl font-medium transition-colors"
            style={{
              backgroundColor: 'var(--color-border-light)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Başka E-posta ile Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div
        className="max-w-md w-full rounded-2xl p-8"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'var(--gradient-primary)',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
            }}
          >
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            ClientFlow
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Proje portalına giriş yapın
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              E-posta Adresi
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@sirket.com"
              className="w-full px-4 py-3 rounded-xl transition-all focus:outline-none"
              style={{
                backgroundColor: 'var(--color-border-light)',
                border: '2px solid transparent',
                color: 'var(--color-text)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.backgroundColor = 'var(--color-bg-card)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.backgroundColor = 'var(--color-border-light)';
              }}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: 'var(--color-warning-light)' }}
            >
              <p className="text-sm" style={{ color: 'var(--color-warning)' }}>
                ⚠️ {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50 hover:scale-[1.02]"
            style={{
              background: 'var(--gradient-primary)',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Gönderiliyor...
              </span>
            ) : (
              'Giriş Linki Gönder'
            )}
          </button>
        </form>

        {/* Info */}
        <div
          className="mt-6 rounded-xl p-4"
          style={{ backgroundColor: 'var(--color-border-light)' }}
        >
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            🔒 <strong>Güvenli giriş:</strong> Şifre gerektirmez. E-postanıza özel bir giriş linki gönderilir.
          </p>
        </div>
      </div>
    </div>
  );
}
