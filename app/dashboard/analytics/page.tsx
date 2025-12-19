'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportAnalyticsPDF } from '@/lib/exportPDF';
import { format, subDays, startOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    totalUpdates: 0,
    activeProjects: 0,
    pendingUpdates: 0,
    approvedUpdates: 0,
  });

  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Fetch all data
      const [clientsSnap, projectsSnap, updatesSnap] = await Promise.all([
        getDocs(collection(db, 'clients')),
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'updates')),
      ]);

      const projects = projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const updates = updatesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Calculate stats
      const activeProjects = projects.filter((p: any) => p.status === 'active').length;
      const pendingUpdates = updates.filter((u: any) => !u.status || u.status === 'pending').length;
      const approvedUpdates = updates.filter((u: any) => u.status === 'approved').length;

      setStats({
        totalClients: clientsSnap.size,
        totalProjects: projectsSnap.size,
        totalUpdates: updatesSnap.size,
        activeProjects,
        pendingUpdates,
        approvedUpdates,
      });

      // Category distribution
      const categories: any = {};
      updates.forEach((update: any) => {
        const cat = update.category || 'other';
        categories[cat] = (categories[cat] || 0) + 1;
      });

      const categoryChartData = Object.entries(categories).map(([key, value]) => ({
        name: key === 'design' ? 'Tasarım' : key === 'dev' ? 'Geliştirme' : key === 'testing' ? 'Test' : key,
        value: value as number,
      }));
      setCategoryData(categoryChartData);

      // Timeline data (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = startOfDay(subDays(new Date(), 6 - i));
        return {
          date,
          dateStr: format(date, 'dd MMM', { locale: tr }),
          count: 0,
        };
      });

      updates.forEach((update: any) => {
        if (update.createdAt && update.createdAt.toDate) {
          const updateDate = startOfDay(update.createdAt.toDate());
          const dayData = last7Days.find(d => d.date.getTime() === updateDate.getTime());
          if (dayData) {
            dayData.count++;
          }
        }
      });

      setTimelineData(last7Days.map(d => ({ date: d.dateStr, count: d.count })));

      setLoading(false);
    } catch (error) {
      console.error('Analytics error:', error);
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    exportAnalyticsPDF(stats);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Analitikler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">📊 Analitik Dashboard</h1>
            <p className="text-gray-300 mt-1">Proje ve müşteri istatistikleri</p>
          </div>
          <button
            onClick={handleExportPDF}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <span>📄</span>
            PDF İndir
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Müşteri</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalClients}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                👥
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Aktif Proje</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeProjects}</p>
                <p className="text-xs text-gray-500 mt-1">Toplam: {stats.totalProjects}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
                📁
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Güncelleme</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalUpdates}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Onaylı: {stats.approvedUpdates} | Bekleyen: {stats.pendingUpdates}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
                📝
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeline Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Son 7 Gün Aktivitesi</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} name="Güncelleme Sayısı" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Kategori Dağılımı</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Durum Dağılımı</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'Aktif Proje', value: stats.activeProjects },
                { name: 'Onaylı Güncelleme', value: stats.approvedUpdates },
                { name: 'Bekleyen Güncelleme', value: stats.pendingUpdates },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
