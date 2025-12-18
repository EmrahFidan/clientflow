'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

type SetupStep = {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  message?: string;
};

export default function SetupPage() {
  const router = useRouter();
  const [steps, setSteps] = useState<SetupStep[]>([
    { id: 'clients', name: 'Clients koleksiyonu oluştur', status: 'pending' },
    { id: 'projects', name: 'Projects koleksiyonu oluştur', status: 'pending' },
    { id: 'updates', name: 'Updates koleksiyonu oluştur', status: 'pending' },
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const updateStep = (id: string, updates: Partial<SetupStep>) => {
    setSteps(prev => prev.map(step =>
      step.id === id ? { ...step, ...updates } : step
    ));
  };

  const runSetup = async () => {
    setIsRunning(true);

    try {
      // 1. Create Clients Collection
      updateStep('clients', { status: 'running' });

      const clientsRef = collection(db, 'clients');
      const client1 = await addDoc(clientsRef, {
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        logoUrl: '',
        createdAt: serverTimestamp(),
      });

      const client2 = await addDoc(clientsRef, {
        name: 'TechStart Inc.',
        email: 'hello@techstart.com',
        logoUrl: '',
        createdAt: serverTimestamp(),
      });

      updateStep('clients', {
        status: 'completed',
        message: '2 test müşteri eklendi'
      });

      // 2. Create Projects Collection
      updateStep('projects', { status: 'running' });

      const projectsRef = collection(db, 'projects');
      const project1 = await addDoc(projectsRef, {
        clientId: client1.id,
        name: 'Website Yenileme Projesi',
        status: 'active',
        deadline: new Date('2025-03-15'),
        createdAt: serverTimestamp(),
      });

      const project2 = await addDoc(projectsRef, {
        clientId: client2.id,
        name: 'Mobil Uygulama Geliştirme',
        status: 'active',
        deadline: new Date('2025-04-30'),
        createdAt: serverTimestamp(),
      });

      updateStep('projects', {
        status: 'completed',
        message: '2 test proje eklendi'
      });

      // 3. Create Updates Collection
      updateStep('updates', { status: 'running' });

      const updatesRef = collection(db, 'updates');

      // Updates for project 1
      await addDoc(updatesRef, {
        projectId: project1.id,
        title: 'Proje Başlangıcı',
        description: 'Proje kickoff toplantısı yapıldı ve gereksinimler belirlendi.',
        category: 'design',
        createdAt: serverTimestamp(),
      });

      await addDoc(updatesRef, {
        projectId: project1.id,
        title: 'Tasarım Aşaması',
        description: 'Anasayfa ve iç sayfa tasarımları tamamlandı.',
        category: 'design',
        createdAt: serverTimestamp(),
      });

      await addDoc(updatesRef, {
        projectId: project1.id,
        title: 'Frontend Geliştirme',
        description: 'React bileşenleri kodlanmaya başlandı.',
        category: 'dev',
        createdAt: serverTimestamp(),
      });

      // Updates for project 2
      await addDoc(updatesRef, {
        projectId: project2.id,
        title: 'UI/UX Tasarımı',
        description: 'Mobil uygulama arayüz tasarımları hazırlandı.',
        category: 'design',
        createdAt: serverTimestamp(),
      });

      await addDoc(updatesRef, {
        projectId: project2.id,
        title: 'Backend API',
        description: 'REST API endpoint\'leri oluşturuldu.',
        category: 'dev',
        createdAt: serverTimestamp(),
      });

      updateStep('updates', {
        status: 'completed',
        message: '5 test güncelleme eklendi'
      });

      // Wait a bit to show success
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error('Setup error:', error);
      const currentStep = steps.find(s => s.status === 'running');
      if (currentStep) {
        updateStep(currentStep.id, {
          status: 'error',
          message: error instanceof Error ? error.message : 'Bilinmeyen hata',
        });
      }
    } finally {
      setIsRunning(false);
    }
  };

  const allCompleted = steps.every(s => s.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              🚀 ClientFlow Setup
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Firestore koleksiyonlarını ve test verilerini oluştur
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4 py-6">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                {/* Status Icon */}
                <div className="flex-shrink-0 mt-1">
                  {step.status === 'pending' && (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-500" />
                  )}
                  {step.status === 'running' && (
                    <div className="w-6 h-6">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                    </div>
                  )}
                  {step.status === 'completed' && (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                  {step.status === 'error' && (
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white text-sm">✗</span>
                    </div>
                  )}
                </div>

                {/* Step Info */}
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {step.name}
                  </p>
                  {step.message && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {step.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={runSetup}
              disabled={isRunning || allCompleted}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isRunning ? 'Kurulum Yapılıyor...' : allCompleted ? '✓ Kurulum Tamamlandı' : 'Kurulumu Başlat'}
            </button>

            {allCompleted && (
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Ana Sayfaya Dön
              </button>
            )}
          </div>

          {/* Info */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
              📦 Oluşturulacaklar:
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">▸</span>
                <span><strong>clients</strong>: 2 test müşteri (Acme Corp, TechStart Inc)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">▸</span>
                <span><strong>projects</strong>: 2 test proje (Website, Mobil App)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">▸</span>
                <span><strong>updates</strong>: 5 test güncelleme (tasarım, geliştirme)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
