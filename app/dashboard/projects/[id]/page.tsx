'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, getDocs, orderBy } from 'firebase/firestore';
import Timeline from '@/components/dashboard/Timeline';
import AddUpdateForm from '@/components/dashboard/AddUpdateForm';

type Project = { id: string; name: string; status: 'active' | 'completed'; deadline: Date; clientId: string };
type Client = { id: string; name: string; email: string };
type Update = { id: string; title: string; description: string; category: 'design' | 'dev' | 'marketing'; createdAt: Date };

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUpdates = useCallback(async () => {
    const updatesSnapshot = await getDocs(query(collection(db, 'updates'), orderBy('createdAt', 'desc')));
    setUpdates(updatesSnapshot.docs.filter((d) => d.data().projectId === projectId).map((d) => ({
      id: d.id, title: d.data().title, description: d.data().description, category: d.data().category, createdAt: d.data().createdAt.toDate()
    })));
  }, [projectId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectDoc = await getDoc(doc(db, 'projects', projectId));
        if (!projectDoc.exists()) { setError('Proje bulunamadı'); setLoading(false); return; }

        const projectData = projectDoc.data();
        setProject({ id: projectDoc.id, name: projectData.name, status: projectData.status, deadline: projectData.deadline.toDate(), clientId: projectData.clientId });

        const clientDoc = await getDoc(doc(db, 'clients', projectData.clientId));
        if (clientDoc.exists()) setClient({ id: clientDoc.id, ...clientDoc.data() } as Client);

        await fetchUpdates();
      } catch (err) { console.error(err); setError('Proje yüklenirken hata oluştu'); } finally { setLoading(false); }
    };
    fetchData();
  }, [projectId, fetchUpdates]);

  const formatDate = (date: Date) => new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const getDaysRemaining = (deadline: Date) => Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  if (loading) return (
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

  if (error || !project) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center space-y-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: 'var(--color-warning-light)' }}
        >
          <svg className="w-10 h-10" style={{ color: 'var(--color-warning)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>{error || 'Proje bulunamadı'}</h3>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 rounded-xl font-medium text-white transition-all hover:scale-105"
          style={{
            background: 'var(--gradient-primary)',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
          }}
        >
          Projelere Dön
        </button>
      </div>
    </div>
  );

  const daysRemaining = getDaysRemaining(project.deadline);
  const statusConfig = {
    active: { bg: 'var(--color-accent-light)', text: 'var(--color-accent)', label: 'Devam Ediyor' },
    completed: { bg: 'var(--color-success-light)', text: 'var(--color-success)', label: 'Tamamlandı' }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.push('/dashboard')}
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
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
              {project.name}
            </h1>
            {client && (
              <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">{client.name}</span>
                <span>•</span>
                <span>{client.email}</span>
              </div>
            )}
          </div>
          <span
            className="px-4 py-2 rounded-full text-sm font-semibold"
            style={{ backgroundColor: statusConfig[project.status].bg, color: statusConfig[project.status].text }}
          >
            {statusConfig[project.status].label}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Son Tarih</p>
              <p className="font-semibold" style={{ color: 'var(--color-text)' }}>{formatDate(project.deadline)}</p>
            </div>
          </div>

          {project.status === 'active' && (
            <div
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{ backgroundColor: 'var(--color-border-light)' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: daysRemaining > 0 ? 'var(--color-primary-light)' : 'var(--color-warning-light)' }}
              >
                <svg className="w-6 h-6" style={{ color: daysRemaining > 0 ? 'var(--color-primary)' : 'var(--color-warning)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Kalan Süre</p>
                <p className="font-semibold" style={{ color: daysRemaining > 0 ? 'var(--color-text)' : 'var(--color-warning)' }}>
                  {daysRemaining > 0 ? `${daysRemaining} gün` : 'Süre doldu!'}
                </p>
              </div>
            </div>
          )}

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

      {/* Timeline Section */}
      <div
        className="rounded-2xl p-8"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              Proje Zaman Çizelgesi
            </h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>Projenin gelişim sürecini takip edin</p>
          </div>
          <AddUpdateForm projectId={projectId} onSuccess={fetchUpdates} />
        </div>
        <Timeline updates={updates} />
      </div>
    </div>
  );
}
