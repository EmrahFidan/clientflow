# Proje: ClientFlow - Faz 1: The Mirror (İçgörü & Altyapı)

## 📋 Proje Bağlamı

**Açıklama:** ClientFlow, ajansların proje süreçlerini müşterilerine şeffaf bir şekilde sunmasını sağlayan bir portaldır. Bu fazın amacı, uygulamanın temelini atmak, veritabanını kurmak ve Ajans Yöneticisinin (Admin) projeleri ve güncellemeleri manuel olarak girebileceği yönetim panelini oluşturmaktır.

**Hedef Kullanıcı:** Ajans Yöneticisi / Proje Yöneticisi.

**Başarı Kriteri:** Adminin sisteme girip bir proje oluşturabilmesi, bu projeye bir "Timeline Update" (Zaman Çizelgesi Güncellemesi) ekleyebilmesi ve bunu görsel olarak görebilmesi.

---

## 🛠️ Teknoloji Stack

| Katman | Teknoloji | Notlar |
|--------|-----------|--------|
| Framework | Next.js 14+ (App Router) | React tabanlı full-stack yapı |
| Styling | Tailwind CSS | Hızlı UI geliştirme |
| Backend/DB | Firebase (Firestore) | NoSQL veritabanı ve Auth |
| UI Library | shadcn/ui (Önerilen) | Profesyonel görünüm için |

---

## 📁 Beklenen Klasör Yapısı
```
clientflow/
├── app/
│   ├── (auth)/              # Login sayfaları
│   ├── (dashboard)/         # Admin paneli (layout.js ile korunur)
│   │   ├── projects/
│   │   └── clients/
│   ├── api/                 # Backend fonksiyonları
│   └── page.js              # Landing page
├── components/
│   ├── ui/                  # Buton, Input vb.
│   ├── dashboard/           # Proje kartları, Timeline bileşeni
│   └── forms/               # Yeni proje/güncelleme formları
├── lib/
│   └── firebase.js          # Firebase config ve bağlantısı
└── types/                   # TypeScript tanımları
```

---

## 🚀 Faz 1 Görevleri: Altyapı ve Admin Paneli

### 1.1 Proje Kurulumu
- [x] **Görev:** Next.js ve Firebase Kurulumu
  - **Detay:** `npx create-next-app@latest` ile proje oluştur (TypeScript, Tailwind, App Router seç).
  - **Detay:** Firebase SDK kur: `npm install firebase`
  - **Detay:** Firebase Console'da yeni proje oluştur ve config bilgilerini `.env.local` dosyasına ekle:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=
    ```
  - **Detay:** `lib/firebase.js` dosyasında Firebase initialize et (OpsVoice projesindeki gibi).
  - **Kabul Kriteri:** Proje ayağa kalkıyor ve Firebase bağlantısı hatasız sağlanıyor.

### 1.2 Veritabanı Şeması (Firestore)
- [ ] **Görev:** Koleksiyonları Oluştur
  - **Collection `clients`:**
    ```javascript
    {
      id: "auto-generated",
      name: "string",
      email: "string",
      logoUrl: "string",
      createdAt: "timestamp"
    }
    ```
  - **Collection `projects`:**
    ```javascript
    {
      id: "auto-generated",
      clientId: "string (reference to clients)",
      name: "string",
      status: "active | completed",
      deadline: "timestamp",
      createdAt: "timestamp"
    }
    ```
  - **Collection `updates`:**
    ```javascript
    {
      id: "auto-generated",
      projectId: "string (reference to projects)",
      title: "string",
      description: "string",
      category: "design | dev | marketing",
      createdAt: "timestamp"
    }
    ```
  - **Kabul Kriteri:** Firebase Console'da koleksiyonlar görünüyor ve ilk test verisi eklenebiliyor.

### 1.3 UI: Admin Dashboard
- [ ] **Görev:** Proje Listeleme Ekranı
  - **Detay:** Veritabanındaki projeleri kartlar halinde gösteren bir sayfa.
  - **Kabul Kriteri:** "Yeni Proje Ekle" butonu çalışıyor ve listeye ekleniyor.

- [ ] **Görev:** Proje Detay ve Timeline
  - **Detay:** Bir projeye tıklandığında detay sayfasına git.
  - **Component:** Sol tarafta dikey bir çizgi (Timeline) üzerinde güncellemeleri listele.

### 1.4 Logic: Manuel Veri Girişi
- [ ] **Görev:** "Güncelleme Ekle" Formu
  - **Detay:** Adminin proje gidişatını (örn: "Anasayfa tasarımı bitti") elle yazıp kaydettiği form.
  - **Firestore İşlemi:**
    ```javascript
    import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

    await addDoc(collection(db, 'updates'), {
      projectId: selectedProjectId,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      createdAt: serverTimestamp()
    });
    ```
  - **Kabul Kriteri:** Form submit edildiğinde `updates` koleksiyonuna veri yazılıyor ve sayfada anında görünüyor (realtime listener veya refetch ile).

---

## ✅ İlerleme Takibi

| Faz | Durum |
|-----|-------|
| 1.1 Kurulum | ✅ Tamamlandı |
| 1.2 Veritabanı | ⬜ Başlamadı |
| 1.3 Dashboard UI | ⬜ Başlamadı |
| 1.4 Veri Girişi | ⬜ Başlamadı |
