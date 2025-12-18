'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

type AddUpdateFormProps = {
  projectId: string;
  onSuccess: () => void;
};

export default function AddUpdateForm({ projectId, onSuccess }: AddUpdateFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'dev' as 'design' | 'dev' | 'marketing',
  });

  const categoryOptions = [
    { value: 'design', label: 'Tasarım', color: 'var(--color-category-design)', bg: '#fdf2f8' },
    { value: 'dev', label: 'Geliştirme', color: 'var(--color-category-dev)', bg: 'var(--color-primary-light)' },
    { value: 'marketing', label: 'Pazarlama', color: 'var(--color-category-marketing)', bg: '#ecfeff' },
  ];

  const handleAITranslate = async () => {
    if (!formData.description.trim() || formData.description.trim().length < 3) {
      alert('Lütfen en az 3 karakter içeren bir açıklama yazın');
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch('/api/generate-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: formData.description }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'AI işlemi başarısız');
      }

      setFormData({
        ...formData,
        description: data.translatedText || formData.description,
        category: data.category || formData.category,
      });
    } catch (error) {
      console.error('AI Error:', error);
      alert(error instanceof Error ? error.message : 'AI işlemi sırasında hata oluştu');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'updates'), {
        projectId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        createdAt: Timestamp.now(),
      });

      setFormData({ title: '', description: '', category: 'dev' });
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error adding update:', error);
      alert('Güncelleme eklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white transition-all hover:scale-105"
        style={{
          background: 'var(--gradient-primary)',
          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
        }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Güncelleme Ekle
      </button>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 mb-6"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
          Yeni Güncelleme
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--color-text-secondary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-border-light)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
            Kategori
          </label>
          <div className="flex gap-3">
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, category: option.value as 'design' | 'dev' | 'marketing' })}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  backgroundColor: formData.category === option.value ? option.bg : 'var(--color-border-light)',
                  color: formData.category === option.value ? option.color : 'var(--color-text-secondary)',
                  border: `2px solid ${formData.category === option.value ? option.color : 'transparent'}`,
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
            Başlık
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Güncelleme başlığı..."
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

        {/* Description with AI Button */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              Açıklama
            </label>
            <button
              type="button"
              onClick={handleAITranslate}
              disabled={aiLoading || !formData.description.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:cursor-not-allowed hover:scale-105"
              style={{
                background: aiLoading ? 'var(--color-border-light)' : (!formData.description.trim() ? 'var(--color-border-light)' : 'var(--gradient-accent)'),
                color: aiLoading ? 'var(--color-text-secondary)' : (!formData.description.trim() ? 'var(--color-text-muted)' : 'white'),
                boxShadow: (!formData.description.trim() || aiLoading) ? 'none' : '0 4px 12px rgba(14, 165, 233, 0.4)',
                opacity: (!formData.description.trim() || aiLoading) ? '0.6' : '1',
              }}
              title={!formData.description.trim() ? "Önce açıklama yazın" : "Teknik notu müşteri dostu bir dile çevir"}
            >
              {aiLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Dönüştürülüyor...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span>Sihirli Değnek</span>
                </>
              )}
            </button>
          </div>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Teknik notunuzu yazın... (örn: 'API endpoint fixlendi, 500 hatası gitti')"
            rows={4}
            className="w-full px-4 py-3 rounded-xl transition-all focus:outline-none resize-none"
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
          <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
            Teknik jargon kullanabilirsiniz, &quot;Sihirli Değnek&quot; müşteri dostu bir dile çevirecek.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
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
            disabled={loading || !formData.title.trim() || !formData.description.trim()}
            className="flex-1 px-4 py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50 hover:scale-[1.02]"
            style={{
              background: 'var(--gradient-primary)',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
            }}
          >
            {loading ? 'Ekleniyor...' : 'Güncelleme Ekle'}
          </button>
        </div>
      </form>
    </div>
  );
}
