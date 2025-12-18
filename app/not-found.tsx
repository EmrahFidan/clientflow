import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div
            className="text-9xl font-bold mb-4"
            style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </div>
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'var(--color-border-light)' }}
          >
            <svg
              className="w-12 h-12"
              style={{ color: 'var(--color-text-muted)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
          Sayfa Bulunamadı
        </h1>
        <p className="mb-8 text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl font-medium text-white transition-all hover:scale-105"
            style={{
              background: 'var(--gradient-primary)',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
            }}
          >
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/auth/login"
            className="px-6 py-3 rounded-xl font-medium transition-colors"
            style={{
              backgroundColor: 'var(--color-border-light)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Giriş Yap
          </Link>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Hala sorun yaşıyorsanız,{' '}
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
