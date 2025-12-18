# Proje: ClientFlow - Faz 4: The Handover (Canlıya Alma & Markalama)

## 📋 Proje Bağlamı

**Açıklama:** Ürün kodlandı, test edildi ve çalışıyor. Şimdi "Localhost"tan çıkıp gerçek dünyaya (Production) açılma zamanı. Bu faz, uygulamanın bir sunucuya yüklenmesini (Deployment) ve Ajansın kendi marka kimliğini (Logo, Renk, Domain) sisteme giydirmesini (Whitelabeling) kapsar.

**Hedef:** Sistemin `localhost:3000` yerine `portal.ajansadi.com` adresinde çalışması ve ajansın kurumsal kimliğini yansıtması.

**Başarı Kriteri:** Canlı bir URL üzerinden, SSL sertifikalı (Güvenli) bir şekilde, ajans logosuyla giriş yapılabilmesi.

---

## 🛠️ Teknoloji Stack (Deployment)

| Katman | Teknoloji | Notlar |
|--------|-----------|--------|
| Hosting | Vercel | Next.js için en iyi performans ve kolaylık |
| Domain | Custom Domain | Ajansın kendi alt alan adı (subdomain) |
| Analytics | Vercel Analytics | Kim girmiş, ne kadar kalmış? (Basit takip) |

---

## 🚀 Faz 4 Görevleri: Final Cila ve Dağıtım

### 4.1 Deployment (Vercel)
- [ ] **Görev:** Vercel Proje Bağlantısı
  - **Detay:** GitHub reposunu Vercel hesabına bağla.
  - **Environment Variables:** `.env.local` içindeki tüm anahtarları Vercel paneline kopyala:
    ```env
    # Firebase Config
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=

    # OpenAI
    OPENAI_API_KEY=sk-...
    ```
  - **Kabul Kriteri:** Build işlemi hatasız tamamlanıyor ve size `.vercel.app` uzantılı çalışan bir link veriyor.

### 4.2 Whitelabeling (Marka Giydirme)
- [ ] **Görev:** Dinamik Markalama (Theming)
  - **Detay:** `tailwind.config.ts` içinde ana renkleri (primary color) değişken yap.
  - **Logic:** Admin panelinden yüklenen logoyu Navbar'da göster.
  - **Varsayılan:** Eğer logo yüklenmediyse "ClientFlow" yazısı kalsın.

- [ ] **Görev:** Metadata ve SEO
  - **Detay:** `layout.js` içindeki `metadata` objesini düzenle.
  - **Çıktı:** Tarayıcı sekmesinde "Create Next App" yerine "Müşteri Portalı | [Ajans Adı]" yazmalı.
  - **Favicon:** Next.js varsayılan ikonunu kaldır, ajans ikonunu koy.

### 4.3 Domain Ayarları
- [ ] **Görev:** Custom Domain Bağlantısı (Opsiyonel ama Önemli)
  - **Detay:** Vercel ayarlarından `portal.ajans.com` gibi bir domain ekle.
  - **DNS:** CNAME kayıtlarını DNS sağlayıcına (GoDaddy, Cloudflare vb.) gir.

### 4.4 Hata Sayfaları (Error Handling)
- [ ] **Görev:** Özel 404 ve 500 Sayfaları
  - **Detay:** Kullanıcı yanlış bir linke tıkladığında Next.js'in siyah-beyaz hata ekranı yerine, "Yolunu mu kaybettin?" diyen şık bir `not-found.js` sayfası tasarla.
  - **Amaç:** Profesyonel algıyı korumak.

---

## 🐛 Canlı Ortam Kontrol Listesi (Pre-Flight Checklist)

| Kontrol | Durum | Notlar |
|---------|-------|--------|
| Firebase Config | ⬜ | Production Firebase projesi kullanılıyor mu? |
| Auth Redirects | ⬜ | Firebase Console → Authentication → Settings → Authorized domains'e production URL eklendi mi? |
| Email Link URL | ⬜ | `sendSignInLinkToEmail` içindeki `url` parametresi production URL'e güncellendi mi? |
| Firestore Rules | ⬜ | Security Rules production'da aktif mi? Test mode kapalı mı? |
| Console Log | ⬜ | Gereksiz `console.log`lar temizlendi mi? |
| Mobile View | ⬜ | Telefondan girince tablo taşıyor mu? |
| Environment Variables | ⬜ | Tüm Firebase ve OpenAI anahtarları Vercel'de doğru mu? |

---

## ✅ İlerleme Takibi

| Faz | Durum |
|-----|-------|
| 4.1 Vercel Deploy | ⬜ Başlamadı |
| 4.2 Markalama | ⬜ Başlamadı |
| 4.3 Domain | ⬜ Başlamadı |
| 4.4 Hata Sayfaları| ⬜ Başlamadı |
