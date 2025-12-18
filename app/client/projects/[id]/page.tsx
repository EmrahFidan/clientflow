'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy, updateDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/lib/AuthContext';

type Project = { id: string; name: string; status: 'active' | 'completed'; deadline: Date };
type Update = {
  id: string;
  title: string;
  description: string;
  category: 'design' | 'dev' | 'marketing';
  status?: 'pending' | 'approved' | 'needs_revision';
  createdAt: Date;
};

export default function ClientProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.clientId) return;

      try {
        const projectDoc = await getDoc(doc(db, 'projects', projectId));

        if (!projectDoc.exists()) {
          setError('Proje bulunamadı');
          setLoading(false);
          return;
        }

        const projectData = projectDoc.data();

        // Erişim kontrolü
        if (projectData.clientId !== user.clientId) {
          setError('Bu projeye erişim yetkiniz yok');
          setLoading(false);
          return;
        }

        setProject({
          id: projectDoc.id,
          name: projectData.name,
          status: projectData.status,
          deadline: projectData.deadline.toDate(),
        });

        // Güncellemeleri getir
        const updatesQuery = query(
          collection(db, 'updates'),
          where('projectId', '==', projectId),
          orderBy('createdAt', 'desc')
        );
        const updatesSnapshot = await getDocs(updatesQuery);

        setUpdates(updatesSnapshot.docs.map((d) => ({
          id: d.id,
          title: d.data().title,
          description: d.data().description,
          category: d.data().category,
          status: d.data().status || 'pending',
          createdAt: d.data().createdAt.toDate(),
        })));
      } catch (err) {
        console.error(err);
        setError('Proje yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, user]);

  const handleUpdateStatus = async (updateId: string, status: 'approved' | 'needs_revision') => {
    try {
      const updateRef = doc(db, 'updates', updateId);
      await updateDoc(updateRef, {
        status,
        reviewedAt: Timestamp.now(),
        reviewedBy: user?.id,
      });

      setUpdates(updates.map(u => u.id === updateId ? { ...u, status } : u));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('İşlem sırasında hata oluştu');
    }
  };

  const formatDate = (date: Date) => new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (date: Date) => new Date(date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  const categoryConfig = {
    design: { color: 'var(--color-category-design)', bg: '#fdf2f8', label: 'Tasarım' },
    dev: { color: 'var(--color-category-dev)', bg: 'var(--color-primary-light)', label: 'Geliştirme' },
    marketing: { color: 'var(--color-category-marketing)', bg: '#ecfeff', label: 'Pazarlama' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-4">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto"
            style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
          />
          <p style={{ color: 'var(--color-text-secondary)' }}>Proje yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>{error || 'Proje bulunamadı'}</h3>
          <button
            onClick={() => router.push('/client/dashboard')}
            className="px-6 py-3 rounded-xl font-medium text-white"
            style={{ background: 'var(--gradient-primary)' }}
          >
            Projelere Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.push('/client/dashboard')}
        className="flex items-center gap-2 mb-6 transition-all hover:gap-3"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Projelere Dön</span>
      </button>

      {/* Project Header */}
      <div
        className="rounded-2xl p-8 mb-8"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
          {project.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="flex items-center gap-4 p-4 rounded-xl"
            style={{ backgroundColor: 'var(--color-border-light)' }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary-light)' }}
            >
              <svg className="w-6 h-6" style={{ color: 'var(--color-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Bitiş Tarihi</p>
              <p className="font-semibold" style={{ color: 'var(--color-text)' }}>{formatDate(project.deadline)}</p>
            </div>
          </div>

          <div
            className="flex items-center gap-4 p-4 rounded-xl"
            style={{ backgroundColor: 'var(--color-border-light)' }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-accent-light)' }}
            >
              <svg className="w-6 h-6" style={{ color: 'var(--color-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Güncellemeler</p>
              <p className="font-semibold" style={{ color: 'var(--color-text)' }}>{updates.length} güncelleme</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div
        className="rounded-2xl p-8"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
          Proje Zaman Çizelgesi
        </h2>

        {updates.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--color-text-secondary)' }}>Henüz güncelleme yok</p>
          </div>
        ) : (
          <div className="relative">
            <div
              className="absolute left-6 top-0 bottom-0 w-0.5"
              style={{ background: 'linear-gradient(180deg, #8b5cf6 0%, #ec4899 50%, var(--color-border) 100%)' }}
            />

            <div className="space-y-6">
              {updates.map((update) => {
                const config = categoryConfig[update.category];
                return (
                  <div key={update.id} className="relative flex gap-6">
                    <div
                      className="relative z-10 flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: config.color }}
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

                    <div
                      className="flex-1 rounded-2xl p-6"
                      style={{
                        backgroundColor: 'var(--color-bg-card)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                            {update.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
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

                      <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                        {update.description}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        {update.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(update.id, 'approved')}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                              style={{
                                backgroundColor: 'var(--color-success-light)',
                                color: 'var(--color-success)',
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Onayla
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(update.id, 'needs_revision')}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                              style={{
                                backgroundColor: 'var(--color-warning-light)',
                                color: 'var(--color-warning)',
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Revize İste
                            </button>
                          </>
                        )}
                        {update.status === 'approved' && (
                          <span
                            className="px-4 py-2 rounded-lg text-sm font-semibold"
                            style={{
                              backgroundColor: 'var(--color-success-light)',
                              color: 'var(--color-success)',
                            }}
                          >
                            ✓ Onaylandı
                          </span>
                        )}
                        {update.status === 'needs_revision' && (
                          <span
                            className="px-4 py-2 rounded-lg text-sm font-semibold"
                            style={{
                              backgroundColor: 'var(--color-warning-light)',
                              color: 'var(--color-warning)',
                            }}
                          >
                            ⟳ Revize Bekleniyor
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
