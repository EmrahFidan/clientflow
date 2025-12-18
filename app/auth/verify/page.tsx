'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyEmailLink } from '@/lib/auth';
import { getUser } from '@/lib/firestore/users';

export default function VerifyPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const emailLink = window.location.href;

        // Email link'i doğrula ve giriş yap
        const uid = await verifyEmailLink(emailLink);

        // Kullanıcı bilgilerini kontrol et
        const user = await getUser(uid);

        if (!user) {
          setStatus('error');
          setError('Kullanıcı bulunamadı. Lütfen yöneticinizle iletişime geçin.');
          return;
        }

        setStatus('success');

        // Role'e göre yönlendir
        setTimeout(() => {
          if (user.role === 'admin') {
            router.push('/dashboard');
          } else {
            router.push('/client/dashboard');
          }
        }, 2000);
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Doğrulama başarısız oldu');
      }
    };

    verify();
  }, [router]);

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
        {status === 'verifying' && (
          <>
            <div
              className="w-20 h-20 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-6"
              style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
            />
            <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
              Doğrulanıyor...
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Giriş bilgileriniz kontrol ediliyor.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'var(--color-success-light)' }}
            >
              <svg className="w-10 h-10" style={{ color: 'var(--color-success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
              Giriş Başarılı!
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Panele yönlendiriliyorsunuz...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'var(--color-warning-light)' }}
            >
              <svg className="w-10 h-10" style={{ color: 'var(--color-warning)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
              Doğrulama Başarısız
            </h1>
            <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              {error}
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-6 py-3 rounded-xl font-medium text-white transition-all hover:scale-105"
              style={{
                background: 'var(--gradient-primary)',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
              }}
            >
              Giriş Sayfasına Dön
            </button>
          </>
        )}
      </div>
    </div>
  );
}
