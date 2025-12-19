'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import { exportProjectPDF } from '@/lib/exportPDF';

type Project = {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed';
  deadline: Date;
  clientId: string;
  createdAt?: Date;
};

type Client = {
  id: string;
  name: string;
  email: string;
  company?: string;
};

type Update = {
  id: string;
  title: string;
  description: string;
  category: 'design' | 'dev' | 'testing' | 'other';
  status: 'pending' | 'approved';
  createdAt: Date;
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);

        // Fetch project
        const projectDoc = await getDoc(doc(db, 'projects', projectId));
        if (!projectDoc.exists()) {
          router.push('/dashboard');
          return;
        }

        const projectData = projectDoc.data();
        const projectInfo: Project = {
          id: projectDoc.id,
          name: projectData.name,
          description: projectData.description,
          status: projectData.status,
          deadline: projectData.deadline.toDate(),
          clientId: projectData.clientId,
          createdAt: projectData.createdAt?.toDate(),
        };
        setProject(projectInfo);

        // Fetch client
        const clientDoc = await getDoc(doc(db, 'clients', projectData.clientId));
        if (clientDoc.exists()) {
          const clientData = clientDoc.data();
          setClient({
            id: clientDoc.id,
            name: clientData.name,
            email: clientData.email,
            company: clientData.company,
          });
        }

        // Fetch updates
        const updatesQuery = query(
          collection(db, 'updates'),
          where('projectId', '==', projectId),
          orderBy('createdAt', 'desc')
        );
        const updatesSnapshot = await getDocs(updatesQuery);
        const updatesData = updatesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            category: data.category,
            status: data.status || 'pending',
            createdAt: data.createdAt?.toDate(),
          } as Update;
        });
        setUpdates(updatesData);
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, router]);

  const handleExportPDF = () => {
    if (project && client) {
      exportProjectPDF(
        project,
        client,
        updates.map(u => ({
          ...u,
          createdAt: u.createdAt || new Date(),
        }))
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-4">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto"
            style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
          />
          <p className="text-gray-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!project || !client) {
    return null;
  }

  const approvedUpdates = updates.filter((u) => u.status === 'approved').length;
  const pendingUpdates = updates.filter((u) => u.status === 'pending').length;

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'design':
        return 'Tasarım';
      case 'dev':
        return 'Geliştirme';
      case 'testing':
        return 'Test';
      default:
        return 'Diğer';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'design':
        return '#3B82F6';
      case 'dev':
        return '#10B981';
      case 'testing':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'approved' ? '#10B981' : '#F59E0B';
  };

  const getStatusLabel = (status: string) => {
    return status === 'approved' ? 'Onaylandı' : 'Beklemede';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Projelere Dön
      </Link>

      {/* Project Header */}
      <div
        className="rounded-2xl p-8 mb-8"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 text-white">{project.name}</h1>
            {project.description && (
              <p className="text-lg text-gray-300 mb-4">{project.description}</p>
            )}
            <Link
              href={`/dashboard/clients/${client.id}`}
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {client.name}
              {client.company && ` · ${client.company}`}
            </Link>
          </div>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-white transition-all hover:scale-105"
            style={{
              background: 'var(--gradient-primary)',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF İndir
          </button>
        </div>

        {/* Progress Bar for Active Projects */}
        {project.status === 'active' && (
          <div>
            <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
              <span>İlerleme</span>
              <span>{approvedUpdates} / {updates.length} güncelleme onaylandı</span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'rgba(148, 163, 184, 0.2)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${updates.length > 0 ? (approvedUpdates / updates.length) * 100 : 0}%`,
                  background: 'var(--gradient-primary)',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500 bg-opacity-20 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {new Date(project.deadline).toLocaleDateString('tr-TR')}
              </p>
              <p className="text-sm text-gray-300">Son Tarih</p>
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
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: project.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)' }}
            >
              <svg className={`w-6 h-6 ${project.status === 'active' ? 'text-green-400' : 'text-indigo-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {project.status === 'active' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {project.status === 'active' ? 'Aktif' : 'Tamamlandı'}
              </p>
              <p className="text-sm text-gray-300">Durum</p>
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
            <div className="w-12 h-12 rounded-xl bg-purple-500 bg-opacity-20 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{updates.length}</p>
              <p className="text-sm text-gray-300">Toplam Güncelleme</p>
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
            <div className="w-12 h-12 rounded-xl bg-green-500 bg-opacity-20 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{approvedUpdates}</p>
              <p className="text-sm text-gray-300">Onaylanan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Updates Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Proje Güncellemeleri</h2>

        {updates.length > 0 ? (
          <div className="space-y-4">
            {updates.map((update) => (
              <div
                key={update.id}
                className="rounded-2xl p-6 transition-all hover:scale-[1.01]"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{update.title}</h3>
                    <p className="text-gray-300">{update.description}</p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: getCategoryColor(update.category) }}
                    >
                      {getCategoryLabel(update.category)}
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: getStatusColor(update.status) }}
                    >
                      {getStatusLabel(update.status)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {update.createdAt
                      ? new Date(update.createdAt).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Tarih bilgisi yok'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="rounded-2xl p-12 text-center"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div className="w-16 h-16 rounded-full bg-gray-700 bg-opacity-30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Henüz güncelleme yok</h3>
            <p className="text-gray-400">Bu proje için henüz bir güncelleme eklenmemiş</p>
          </div>
        )}
      </div>
    </div>
  );
}
