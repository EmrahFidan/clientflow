'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

type NewClientFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

export default function NewClientForm({ onSuccess, onCancel }: NewClientFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setError('İsim ve email zorunludur');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await addDoc(collection(db, 'clients'), {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        company: company.trim() || null,
        createdAt: serverTimestamp(),
      });

      onSuccess();
    } catch (err) {
      console.error('Error creating client:', err);
      setError('Müşteri oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
          Yeni Müşteri Ekle
        </h2>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">
          İsim <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border text-white transition-colors focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            borderColor: 'var(--color-border)',
          }}
          placeholder="Müşteri adı"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border text-white transition-colors focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            borderColor: 'var(--color-border)',
          }}
          placeholder="ornek@email.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Telefon
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border text-white transition-colors focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            borderColor: 'var(--color-border)',
          }}
          placeholder="+90 555 123 4567"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Şirket
        </label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border text-white transition-colors focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            borderColor: 'var(--color-border)',
          }}
          placeholder="Şirket adı"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 rounded-xl font-medium transition-colors"
          style={{
            backgroundColor: 'var(--color-border-light)',
            color: 'var(--color-text-secondary)',
          }}
          disabled={loading}
        >
          İptal
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3 rounded-xl font-medium text-white transition-all"
          style={{
            background: 'var(--gradient-primary)',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
          }}
          disabled={loading}
        >
          {loading ? 'Oluşturuluyor...' : 'Müşteri Oluştur'}
        </button>
      </div>
    </form>
  );
}
