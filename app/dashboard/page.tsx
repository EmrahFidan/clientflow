'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import ProjectCard from '@/components/dashboard/ProjectCard';
import NewProjectForm from '@/components/dashboard/NewProjectForm';

type Client = {
  id: string;
  name: string;
  email: string;
};

type Project = {
  id: string;
  name: string;
  status: 'active' | 'completed';
  deadline: Date;
  clientId: string;
  clientName?: string;
  updatesCount?: number;
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Record<string, Client>>({});
  const [loading, setLoading] = useState(true);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const clientsSnapshot = await getDocs(collection(db, 'clients'));
      const clientsMap: Record<string, Client> = {};
      clientsSnapshot.docs.forEach((doc) => {
        clientsMap[doc.id] = { id: doc.id, ...doc.data() } as Client;
      });
      setClients(clientsMap);

      const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const projectsSnapshot = await getDocs(projectsQuery);

      const projectsData = await Promise.all(
        projectsSnapshot.docs.map(async (doc) => {
          const projectData = doc.data();
          const updatesSnapshot = await getDocs(query(collection(db, 'updates')));
          const updatesCount = updatesSnapshot.docs.filter(
            (updateDoc) => updateDoc.data().projectId === doc.id
          ).length;

          return {
            id: doc.id,
            name: projectData.name,
            status: projectData.status,
            deadline: projectData.deadline.toDate(),
            clientId: projectData.clientId,
            clientName: clientsMap[projectData.clientId]?.name,
            updatesCount,
          } as Project;
        })
      );

      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeProjects = projects.filter((p) => p.status === 'active');
  const completedProjects = projects.filter((p) => p.status === 'completed');

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
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">
              Projeler
            </h1>
            <p className="text-gray-300">
              Toplam {projects.length} proje • {activeProjects.length} aktif
            </p>
          </div>
          <button
            onClick={() => setShowNewProjectForm(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-white transition-all hover:scale-105"
            style={{
              background: 'var(--gradient-primary)',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Yeni Proje
          </button>
        </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className="rounded-2xl p-6 transition-all hover:scale-[1.02]"
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
              <p className="text-3xl font-bold text-white">{projects.length}</p>
              <p className="text-sm font-medium text-gray-300">Toplam Proje</p>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-6 transition-all hover:scale-[1.02]"
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
              <p className="text-3xl font-bold text-white">{activeProjects.length}</p>
              <p className="text-sm font-medium text-gray-300">Aktif Proje</p>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-6 transition-all hover:scale-[1.02]"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{Object.keys(clients).length}</p>
              <p className="text-sm font-medium text-gray-300">Müşteri</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Projects */}
      {activeProjects.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
            <h2 className="text-xl font-semibold" style={{ color: '#f8fafc' }}>
              Aktif Projeler
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Projects */}
      {completedProjects.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--color-success)' }}
            />
            <h2 className="text-xl font-semibold" style={{ color: '#f8fafc' }}>
              Tamamlanan Projeler
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
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
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#f8fafc' }}>
            Henüz proje yok
          </h3>
          <p className="mb-6" style={{ color: '#cbd5e1' }}>
            İlk projenizi oluşturarak başlayın
          </p>
          <button
            onClick={() => setShowNewProjectForm(true)}
            className="px-6 py-3 rounded-xl font-medium text-white transition-all hover:scale-105"
            style={{
              background: 'var(--gradient-primary)',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
            }}
          >
            Yeni Proje Oluştur
          </button>
        </div>
      )}
      </div>

      {/* New Project Modal */}
      {showNewProjectForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowNewProjectForm(false)}
        >
          <div
            className="max-w-2xl w-full rounded-2xl p-8"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <NewProjectForm
              onSuccess={() => {
                setShowNewProjectForm(false);
                fetchData();
              }}
              onCancel={() => setShowNewProjectForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
