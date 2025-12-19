'use client';

import Link from 'next/link';

type Project = {
  id: string;
  name: string;
  status: 'active' | 'completed';
  deadline: Date;
  clientName?: string;
  updatesCount?: number;
};

export default function ProjectCard({ project }: { project: Project }) {
  const statusConfig = {
    active: {
      bg: 'var(--color-primary-light)',
      text: 'var(--color-primary)',
      label: 'Devam Ediyor',
    },
    completed: {
      bg: 'var(--color-success-light)',
      text: 'var(--color-success)',
      label: 'Tamamlandı',
    },
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getDaysRemaining = (deadline: Date) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = getDaysRemaining(project.deadline);
  const config = statusConfig[project.status];

  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <div
        className="rounded-2xl p-6 cursor-pointer group transition-all duration-300 hover:translate-y-[-4px]"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          e.currentTarget.style.borderColor = 'var(--color-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          e.currentTarget.style.borderColor = 'var(--color-border)';
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3
              className="text-lg font-semibold transition-colors mb-1"
              style={{ color: '#0f172a' }}
            >
              {project.name}
            </h3>
            {project.clientName && (
              <p className="text-sm" style={{ color: '#475569' }}>
                {project.clientName}
              </p>
            )}
          </div>
          <span
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: config.bg, color: config.text }}
          >
            {config.label}
          </span>
        </div>

        {/* Progress indicator for active projects */}
        {project.status === 'active' && (
          <div className="mb-4">
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--color-border-light)' }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: daysRemaining > 30 ? '30%' : daysRemaining > 15 ? '60%' : '85%',
                  background: 'var(--gradient-primary)',
                }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: '1px solid #e2e8f0' }}
        >
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: '#64748b' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(project.deadline)}</span>
          </div>

          {project.status === 'active' && (
            <div className="text-sm font-medium">
              {daysRemaining > 0 ? (
                <span style={{ color: '#64748b' }}>{daysRemaining} gün</span>
              ) : (
                <span style={{ color: 'var(--color-accent)' }}>Süre geçti!</span>
              )}
            </div>
          )}

          {project.updatesCount !== undefined && (
            <div
              className="flex items-center gap-1.5 text-sm"
              style={{ color: '#64748b' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span>{project.updatesCount}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
