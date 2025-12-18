'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Home() {
  const [firebaseStatus, setFirebaseStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Test Firebase connection
    const testConnection = async () => {
      try {
        // Try to access Firestore (even if empty)
        const testCollection = collection(db, 'test');
        await getDocs(testCollection);
        setFirebaseStatus('connected');
      } catch (err) {
        setFirebaseStatus('error');
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-2xl mx-auto p-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              ClientFlow
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Ajans - Müşteri Proje Yönetim Portalı
            </p>
          </div>

          {/* Firebase Status */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              🔥 Firebase Bağlantı Durumu
            </h2>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              {firebaseStatus === 'testing' && (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Firebase bağlantısı test ediliyor...
                  </span>
                </>
              )}

              {firebaseStatus === 'connected' && (
                <>
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-medium text-green-700 dark:text-green-400">
                      Başarılı!
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Firebase bağlantısı çalışıyor
                    </p>
                  </div>
                </>
              )}

              {firebaseStatus === 'error' && (
                <>
                  <span className="text-2xl">❌</span>
                  <div className="flex-1">
                    <p className="font-medium text-red-700 dark:text-red-400">
                      Bağlantı Hatası
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {error}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Project Info */}
          <div className="border-t pt-6 space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Framework:</span>
              <span className="font-medium text-gray-900 dark:text-white">Next.js 16 (App Router)</span>
            </div>
            <div className="flex justify-between">
              <span>Database:</span>
              <span className="font-medium text-gray-900 dark:text-white">Firebase Firestore</span>
            </div>
            <div className="flex justify-between">
              <span>Styling:</span>
              <span className="font-medium text-gray-900 dark:text-white">Tailwind CSS v4</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-medium text-green-600 dark:text-green-400">Faz 1.1 ✓</span>
            </div>
          </div>

          {/* Next Steps */}
          {firebaseStatus === 'connected' && (
            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
                🚀 Sıradaki Adımlar:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">▸</span>
                  <span>Faz 1.2: Firestore koleksiyonları (clients, projects, updates)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">▸</span>
                  <span>Faz 1.3: Admin Dashboard UI</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">▸</span>
                  <span>Faz 1.4: Manuel veri girişi formu</span>
                </li>
              </ul>

              <div className="flex gap-4">
                <a
                  href="/setup"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg text-center transition-all shadow-lg hover:shadow-xl"
                >
                  🚀 Kurulum (Faz 1.2)
                </a>
                <a
                  href="/dashboard"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg text-center transition-all shadow-lg hover:shadow-xl"
                >
                  📊 Dashboard (Faz 1.3)
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
