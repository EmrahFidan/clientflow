# 🚀 ClientFlow - Ajans Müşteri Portalı

Yaratıcı ajanslar için proje yönetimi ve müşteri iletişim platformu. Projelerinizi müşterilerinizle şeffaf bir şekilde paylaşın, güncellemeleri AI ile çevirin, onay alın.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Firebase](https://img.shields.io/badge/Firebase-12-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4)

---

## ✨ Özellikler

### 🎯 Faz 1: The Mirror (Admin Panel)
- ✅ Proje yönetimi (CRUD)
- ✅ Müşteri yönetimi
- ✅ Timeline görünümü
- ✅ Güncelleme ekleme/düzenleme
- ✅ İstatistikler ve dashboard

### 🤖 Faz 2: The Translator (AI Entegrasyonu)
- ✅ Groq Llama 3.3 70B entegrasyonu
- ✅ Teknik notları müşteri dostu dile çevirme
- ✅ Otomatik kategori tahmini
- ✅ "Sihirli Değnek" butonu

### 🔐 Faz 3: The Portal (Müşteri Portalı)
- ✅ Magic Link authentication (şifresiz giriş)
- ✅ Role-based access control (Admin/Client)
- ✅ Müşteri dashboard (salt-okunur)
- ✅ Onay/Revize mekanizması
- ✅ Firestore Security Rules

### 🌐 Faz 4: The Handover (Production Hazırlık)
- ✅ Vercel deployment yapılandırması
- ✅ SEO optimizasyonu
- ✅ Custom 404/500 hata sayfaları
- ✅ Production checklist
- ✅ Deployment dokumentasyonu

---

## 🛠️ Teknoloji Stack

| Katman | Teknoloji | Versiyon |
|--------|-----------|----------|
| Framework | Next.js (App Router) | 16.0 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Database | Firebase Firestore | 12.6 |
| Auth | Firebase Auth (Email Link) | 12.6 |
| AI | Groq Llama 3.3 70B | 0.79 |
| Deployment | Vercel | - |

---

## 📦 Kurulum

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Firebase projesi
- Groq API key

### Adım Adım Kurulum

```bash
# 1. Projeyi klonla
git clone https://github.com/yourusername/clientflow.git
cd clientflow

# 2. Dependencies'i yükle
npm install

# 3. Environment variables'ı ayarla
cp .env.example .env.local
# .env.local dosyasını düzenle ve API keys'leri ekle

# 4. Development server'ı başlat
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini aç.

---

## 🔑 Environment Variables

`.env.local` dosyasına eklenecek değişkenler:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Groq API (OpenAI-compatible)
GROQ_API_KEY=gsk-your-groq-key-here
```

---

## 🚀 Hızlı Başlangıç

### Test Verisi Ekleme

```
http://localhost:3000/setup
```
"Kurulumu Başlat" butonuna tıklayın - otomatik test verileri oluşturulur.

### Firebase Kurulumu

Detaylı adımlar için: **TODO-3.md** ve **DEPLOYMENT.md**

1. Firebase Console'da Authentication aktif et
2. Firestore Database oluştur
3. Security Rules deploy et
4. Test kullanıcıları oluştur

---

## 📖 Kullanım

### Admin Kullanımı

1. `/auth/login` → Admin email'i gir
2. E-postaya gelen linke tıkla
3. `/dashboard` → Admin paneline eriş
4. **Proje Oluştur:** "Yeni Proje" butonu
5. **Güncelleme Ekle:** Proje detayında "Güncelleme Ekle"
6. **AI Kullan:** "Sihirli Değnek" butonu ile teknik notları çevir

### Müşteri Kullanımı

1. `/auth/login` → Müşteri email'i gir
2. E-postaya gelen linke tıkla
3. `/client/dashboard` → Kendi projelerini gör
4. **Proje Detayı:** Proje kartına tıkla, timeline'ı gör
5. **Onay Ver:** Güncellemelere "Onayla" veya "Revize İste"

---

## 📂 Proje Yapısı

```
clientflow/
├── app/
│   ├── auth/                # Login & Verify
│   ├── dashboard/           # Admin paneli
│   ├── client/              # Müşteri portalı
│   ├── api/                 # API endpoints
│   ├── setup/               # Test veri kurulumu
│   ├── error.tsx            # 500 error
│   ├── not-found.tsx        # 404 error
│   └── layout.tsx
├── components/
│   └── dashboard/
├── lib/
│   ├── auth.ts
│   ├── AuthContext.tsx
│   ├── firebase.ts
│   └── firestore/
├── types/
│   └── index.ts
├── firestore.rules
├── DEPLOYMENT.md
├── PRODUCTION-CHECKLIST.md
└── TODO-*.md
```

---

## 🚀 Deployment

**Vercel'e deploy için:** [DEPLOYMENT.md](./DEPLOYMENT.md)

**Production checklist:** [PRODUCTION-CHECKLIST.md](./PRODUCTION-CHECKLIST.md)

```bash
# 1. GitHub'a push
git add .
git commit -m "Initial commit"
git push origin main

# 2. Vercel'e bağlan (vercel.com)

# 3. Environment variables ekle

# 4. Deploy!
```

---

## 🔒 Güvenlik

- **Firestore Security Rules:** Role-based access control
- **Authentication:** Magic Link (şifresiz)
- **Admin:** Full access
- **Client:** Sadece kendi projeleri

---

## 📝 Dokumentasyon

- [TODO-1.md](./TODO-1.md) - Faz 1: Admin Panel
- [TODO-2.md](./TODO-2.md) - Faz 2: AI Entegrasyonu
- [TODO-3.md](./TODO-3.md) - Faz 3: Müşteri Portalı
- [TODO-4.md](./TODO-4.md) - Faz 4: Production
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [PRODUCTION-CHECKLIST.md](./PRODUCTION-CHECKLIST.md) - Go-live checklist

---

## 📞 İletişim

**Email:** destek@clientflow.com

---

**Made with ❤️ for creative agencies**
