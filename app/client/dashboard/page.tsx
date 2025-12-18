'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import Link from 'next/link';

type Project = {
  id: string;
  name: string;
  status: 'active' | 'completed';
  deadline: Date;
  updatesCount?: number;
};

export default function ClientDashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.clientId) {
        setLoading(false);
        return;
      }

      try {
        // Kullanıcının clientId'sine göre projeleri getir
        const projectsQuery = query(
          collection(db, 'projects'),
          where('clientId', '==', user.clientId),
          orderBy('createdAt', 'desc')
        );

        const projectsSnapshot = await getDocs(projectsQuery);

        const projectsData = await Promise.all(
          projectsSnapshot.docs.map(async (doc) => {
            const projectData = doc.data();

            // Güncelleme sayısını getir
            const updatesSnapshot = await getDocs(
              query(collection(db, 'updates'), where('projectId', '==', doc.id))
            );

            return {
              id: doc.id,
              name: projectData.name,
              status: projectData.status,
              deadline: projectData.deadline.toDate(),
              updatesCount: updatesSnapshot.size,
            } as Project;
          })
        );

        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const activeProjects = projects.filter((p) => p.status === 'active');
  const completedProjects = projects.filter((p) => p.status === 'completed');

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-4">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto"
            style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
          />
          <p style={{ color: 'var(--color-text-secondary)' }}>Projeler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          Projelerim
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {projects.length === 0 ? 'Henüz proje yok' : `${projects.length} proje • ${activeProjects.length} devam ediyor`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary-light)' }}
            >
              <svg className="w-7 h-7" style={{ color: 'var(--color-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{projects.length}</p>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Toplam Proje</p>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-accent-light)' }}
            >
              <svg className="w-7 h-7" style={{ color: 'var(--color-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{activeProjects.length}</p>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Devam Ediyor</p>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-success-light)' }}
            >
              <svg className="w-7 h-7" style={{ color: 'var(--color-success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{completedProjects.length}</p>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Tamamlandı</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project List */}
      {activeProjects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            Aktif Projeler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProjects.map((project) => (
              <Link key={project.id} href={`/client/projects/${project.id}`}>
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
                  <div className="flex items-start justify-between mb-4">
                    <h3
                      className="text-lg font-semibold transition-colors"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {project.name}
                    </h3>
                    <span
                      className="px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      Devam Ediyor
                    </span>
                  </div>

                  <div
                    className="flex items-center justify-between pt-4"
                    style={{ borderTop: '1px solid var(--color-border-light)' }}
                  >
                    <div
                      className="flex items-center gap-2 text-sm"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(project.deadline)}</span>
                    </div>

                    {project.updatesCount !== undefined && (
                      <div
                        className="flex items-center gap-1.5 text-sm"
                        style={{ color: 'var(--color-text-secondary)' }}
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
            ))}
          </div>
        </div>
      )}

      {completedProjects.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            Tamamlanan Projeler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedProjects.map((project) => (
              <Link key={project.id} href={`/client/projects/${project.id}`}>
                <div
                  className="rounded-2xl p-6 cursor-pointer opacity-80 hover:opacity-100 transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {project.name}
                    </h3>
                    <span
                      className="px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: 'var(--color-success-light)',
                        color: 'var(--color-success)',
                      }}
                    >
                      Tamamlandı
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-16">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'var(--color-border-light)' }}
          >
            <svg className="w-12 h-12" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            Henüz proje yok
          </h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Ajanstanız size bir proje atadığında burada görünecek.
          </p>
        </div>
      )}
    </div>
  );
}
