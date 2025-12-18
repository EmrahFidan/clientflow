'use client';

import { useState } from 'react';

type ThemeColors = {
  bg: string;
  card: string;
  primary: string;
  primaryHover: string;
  accent: string;
  text: string;
  textMuted: string;
  border: string;
};

type Theme = {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
};

const themes: Theme[] = [
  {
    id: 'trust',
    name: 'Güven & Profesyonellik',
    description: 'Kurumsal, güvenilir, ciddi bir his. Lacivert ve altın tonları.',
    colors: {
      bg: '#f8f9fa',
      card: '#ffffff',
      primary: '#1e3a5f',
      primaryHover: '#152c47',
      accent: '#d4a574',
      text: '#1e3a5f',
      textMuted: '#6b7c93',
      border: '#e2e8f0',
    },
  },
  {
    id: 'warm',
    name: 'Sıcak & Samimi',
    description: 'Kreatif ajanslar için. Samimi, ulaşılabilir, dostça.',
    colors: {
      bg: '#faf8f5',
      card: '#ffffff',
      primary: '#4a7c59',
      primaryHover: '#3d6649',
      accent: '#e07b39',
      text: '#2d3748',
      textMuted: '#718096',
      border: '#e8e4df',
    },
  },
  {
    id: 'modern',
    name: 'Modern & Minimalist',
    description: 'Temiz, modern, şık. Mavi ve mint yeşil tonları.',
    colors: {
      bg: '#ffffff',
      card: '#f8fafc',
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      accent: '#10b981',
      text: '#1e293b',
      textMuted: '#64748b',
      border: '#e2e8f0',
    },
  },
  {
    id: 'soft',
    name: 'Soft & Pastel',
    description: 'Herkes için. Yumuşak, stressiz, kolay okunur.',
    colors: {
      bg: '#fefefe',
      card: '#ffffff',
      primary: '#7c3aed',
      primaryHover: '#6d28d9',
      accent: '#f97316',
      text: '#374151',
      textMuted: '#6b7280',
      border: '#f3f4f6',
    },
  },
];

function MiniPreview({ colors }: { colors: ThemeColors }) {
  return (
    <div
      className="rounded-lg p-4 mt-4"
      style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
    >
      <div
        className="rounded p-3 mb-3"
        style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: colors.primary }}
          >
            C
          </div>
          <span className="text-sm font-semibold" style={{ color: colors.text }}>
            ClientFlow
          </span>
        </div>
        <div className="flex gap-3">
          <span className="text-xs" style={{ color: colors.textMuted }}>Projeler</span>
          <span className="text-xs" style={{ color: colors.textMuted }}>Müşteriler</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-2 rounded text-center"
            style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
          >
            <div className="text-lg font-bold" style={{ color: colors.text }}>{i * 2}</div>
            <div className="text-xs" style={{ color: colors.textMuted }}>Proje</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {['Aktif', 'Beklemede'].map((status, i) => (
          <div
            key={i}
            className="p-2 rounded"
            style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
          >
            <div className="text-xs font-medium mb-1" style={{ color: colors.text }}>
              Proje {i + 1}
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{
                backgroundColor: i === 0 ? `${colors.accent}20` : `${colors.primary}20`,
                color: i === 0 ? colors.accent : colors.primary
              }}
            >
              {status}
            </span>
          </div>
        ))}
      </div>

      <button
        className="w-full py-2 rounded text-sm font-medium text-white"
        style={{ backgroundColor: colors.primary }}
      >
        Yeni Proje Ekle
      </button>
    </div>
  );
}

export default function ThemesPage() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Tema Seçimi
          </h1>
          <p className="text-gray-600">
            Kreatif ajansınız için en uygun temayı seçin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {themes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`bg-white rounded-xl shadow-md p-5 cursor-pointer transition-all ${
                selectedTheme === theme.id
                  ? 'ring-4 ring-blue-500 scale-[1.02]'
                  : 'hover:shadow-lg'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{theme.name}</h2>
                  <p className="text-sm text-gray-500">{theme.description}</p>
                </div>
                {selectedTheme === theme.id && (
                  <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-lg"
                  style={{ backgroundColor: theme.colors.primary }}
                  title="Ana Renk"
                />
                <div
                  className="w-8 h-8 rounded-lg"
                  style={{ backgroundColor: theme.colors.accent }}
                  title="Aksan Renk"
                />
                <div
                  className="w-8 h-8 rounded-lg border"
                  style={{ backgroundColor: theme.colors.bg, borderColor: theme.colors.border }}
                  title="Arka Plan"
                />
                <div
                  className="w-8 h-8 rounded-lg border"
                  style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border }}
                  title="Kart"
                />
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: theme.colors.text }}
                  title="Metin"
                >
                  <span className="text-white text-xs font-bold">Aa</span>
                </div>
              </div>

              <MiniPreview colors={theme.colors} />

              <div className="mt-4 text-center">
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                    selectedTheme === theme.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {selectedTheme === theme.id ? 'Seçildi' : 'Seçmek için tıkla'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedTheme && (
          <div className="text-center">
            <button
              onClick={() => alert(`"${themes.find(t => t.id === selectedTheme)?.name}" teması seçildi!`)}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
            >
              &quot;{themes.find(t => t.id === selectedTheme)?.name}&quot; Temasını Uygula
            </button>
          </div>
        )}

        <div className="text-center mt-6">
          <a href="/dashboard" className="text-gray-500 hover:text-gray-700 underline">
            ← Dashboard&apos;a Dön
          </a>
        </div>
      </div>
    </div>
  );
}
