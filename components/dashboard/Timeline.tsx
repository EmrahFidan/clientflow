type Update = {
  id: string;
  title: string;
  description: string;
  category: 'design' | 'dev' | 'marketing';
  createdAt: Date;
};

export default function Timeline({ updates }: { updates: Update[] }) {
  const categoryConfig = {
    design: {
      color: 'var(--color-category-design)',
      bg: '#fdf2f8',
      label: 'Tasarım',
    },
    dev: {
      color: 'var(--color-category-dev)',
      bg: 'var(--color-primary-light)',
      label: 'Geliştirme',
    },
    marketing: {
      color: 'var(--color-category-marketing)',
      bg: '#ecfeff',
      label: 'Pazarlama',
    },
  };

  const formatDate = (date: Date) => new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (date: Date) => new Date(date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  if (updates.length === 0) {
    return (
      <div className="text-center py-12">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: 'var(--color-border-light)' }}
        >
          <svg className="w-10 h-10" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
          Henüz güncelleme yok
        </h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          İlk güncellemenizi ekleyerek başlayın
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div
        className="absolute left-6 top-0 bottom-0 w-0.5"
        style={{
          background: 'linear-gradient(180deg, #8b5cf6 0%, #ec4899 50%, var(--color-border) 100%)',
        }}
      />

      <div className="space-y-6">
        {updates.map((update, index) => {
          const config = categoryConfig[update.category];
          return (
            <div
              key={update.id}
              className="relative flex gap-6 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div
                className="relative z-10 flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
                style={{
                  backgroundColor: config.color,
                  boxShadow: `0 4px 12px ${config.color}40`,
                }}
              >
                {update.category === 'design' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                )}
                {update.category === 'dev' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                )}
                {update.category === 'marketing' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div
                className="flex-1 rounded-2xl p-6 transition-all hover:shadow-md"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {update.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: config.bg, color: config.color }}
                      >
                        {config.label}
                      </span>
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        {formatDate(update.createdAt)} • {formatTime(update.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <p
                  className="leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {update.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
