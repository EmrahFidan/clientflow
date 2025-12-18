'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';

type Client = {
  id: string;
  name: string;
  email: string;
};

type NewProjectFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

export default function NewProjectForm({ onSuccess, onCancel }: NewProjectFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    clientId: '',
    status: 'active' as 'active' | 'completed',
    deadline: '',
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsSnapshot = await getDocs(collection(db, 'clients'));
        const clientsList = clientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Client[];
        setClients(clientsList);

        // İlk müşteriyi varsayılan olarak seç
        if (clientsList.length > 0) {
          setFormData(prev => ({ ...prev, clientId: clientsList[0].id }));
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
        alert('Müşteriler yüklenirken hata oluştu');
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.clientId || !formData.deadline) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'projects'), {
        name: formData.name.trim(),
        clientId: formData.clientId,
        status: formData.status,
        deadline: Timestamp.fromDate(new Date(formData.deadline)),
        createdAt: Timestamp.now(),
      });

      setFormData({ name: '', clientId: '', status: 'active', deadline: '' });
      onSuccess();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Proje oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loadingClients) {
    return (
      <div className="text-center py-8">
        <div
          className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin mx-auto"
          style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
        />
        <p className="mt-4" style={{ color: 'var(--color-text-secondary)' }}>
          Yükleniyor...
        </p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: 'var(--color-warning-light)' }}
        >
          <svg className="w-8 h-8" style={{ color: 'var(--color-warning)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
          Henüz müşteri yok
        </h3>
        <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Proje oluşturmak için önce bir müşteri eklemelisiniz
        </p>
        <button
          onClick={onCancel}
          className="px-6 py-3 rounded-xl font-medium text-white transition-all hover:scale-105"
          style={{
            background: 'var(--gradient-primary)',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
          }}
        >
          Tamam
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          Yeni Proje Oluştur
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Yeni bir proje ekleyin ve takibe başlayın
        </p>
      </div>

      {/* Proje Adı */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
          Proje Adı *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Örn: Website Yenileme Projesi"
          className="w-full px-4 py-3 rounded-xl transition-all focus:outline-none"
          style={{
            backgroundColor: 'var(--color-border-light)',
            border: '2px solid transparent',
            color: 'var(--color-text)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.backgroundColor = 'var(--color-bg-card)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.backgroundColor = 'var(--color-border-light)';
          }}
          required
        />
      </div>

      {/* Müşteri Seçimi */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
          Müşteri *
        </label>
        <select
          value={formData.clientId}
          onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
          className="w-full px-4 py-3 rounded-xl transition-all focus:outline-none"
          style={{
            backgroundColor: 'var(--color-border-light)',
            border: '2px solid transparent',
            color: 'var(--color-text)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.backgroundColor = 'var(--color-bg-card)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.backgroundColor = 'var(--color-border-light)';
          }}
          required
        >
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      {/* Durum */}
      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
          Durum *
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, status: 'active' })}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: formData.status === 'active' ? 'var(--color-primary-light)' : 'var(--color-border-light)',
              color: formData.status === 'active' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              border: `2px solid ${formData.status === 'active' ? 'var(--color-primary)' : 'transparent'}`,
            }}
          >
            Devam Ediyor
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, status: 'completed' })}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: formData.status === 'completed' ? 'var(--color-success-light)' : 'var(--color-border-light)',
              color: formData.status === 'completed' ? 'var(--color-success)' : 'var(--color-text-secondary)',
              border: `2px solid ${formData.status === 'completed' ? 'var(--color-success)' : 'transparent'}`,
            }}
          >
            Tamamlandı
          </button>
        </div>
      </div>

      {/* Son Tarih */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
          Bitiş Tarihi *
        </label>
        <input
          type="date"
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          className="w-full px-4 py-3 rounded-xl transition-all focus:outline-none"
          style={{
            backgroundColor: 'var(--color-border-light)',
            border: '2px solid transparent',
            color: 'var(--color-text)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.backgroundColor = 'var(--color-bg-card)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.backgroundColor = 'var(--color-border-light)';
          }}
          required
        />
      </div>

      {/* Butonlar */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl font-medium transition-colors"
          style={{
            backgroundColor: 'var(--color-border-light)',
            color: 'var(--color-text-secondary)',
          }}
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50 hover:scale-[1.02]"
          style={{
            background: 'var(--gradient-primary)',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
          }}
        >
          {loading ? 'Oluşturuluyor...' : 'Proje Oluştur'}
        </button>
      </div>
    </form>
  );
}
