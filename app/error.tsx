'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="text-center max-w-md">
        {/* Error Illustration */}
        <div className="mb-8">
          <div
            className="text-9xl font-bold mb-4"
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            500
          </div>
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'var(--color-warning-light)' }}
          >
            <svg
              className="w-12 h-12"
              style={{ color: 'var(--color-warning)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
          Bir Şeyler Yanlış Gitti
        </h1>
        <p className="mb-2 text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          Üzgünüz, beklenmeyen bir hata oluştu.
        </p>

        {/* Error Details (Development) */}
        {process.env.NODE_ENV === 'development' && (
          <div
            className="my-6 p-4 rounded-xl text-left"
            style={{
              backgroundColor: 'var(--color-border-light)',
              maxHeight: '200px',
              overflow: 'auto',
            }}
          >
            <p className="text-xs font-mono" style={{ color: 'var(--color-text-secondary)' }}>
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs font-mono mt-2" style={{ color: 'var(--color-text-muted)' }}>
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl font-medium text-white transition-all hover:scale-105"
            style={{
              background: 'var(--gradient-primary)',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
            }}
          >
            Tekrar Dene
          </button>
          <a
            href="/dashboard"
            className="px-6 py-3 rounded-xl font-medium transition-colors inline-block"
            style={{
              backgroundColor: 'var(--color-border-light)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Ana Sayfaya Dön
          </a>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Sorun devam ederse,{' '}
          <a
            href="mailto:destek@clientflow.com"
            className="underline"
            style={{ color: 'var(--color-primary)' }}
          >
            destek ekibi
          </a>
          yle iletişime geçin.
        </p>
      </div>
    </div>
  );
}
