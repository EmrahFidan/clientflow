# 🚀 Production Checklist - ClientFlow

Bu checklist'i production'a çıkmadan önce **mutlaka** kontrol edin!

---

## 📋 Pre-Deployment

### Environment Setup

- [ ] `.env.local` dosyası oluşturuldu (local development için)
- [ ] `.env.example` template'i güncellendi
- [ ] Tüm secret keys `.gitignore`'da
- [ ] Production Firebase projesi oluşturuldu
- [ ] Groq API key'i alındı ve test edildi

### Firebase Configuration

- [ ] **Authentication**
  - [ ] Email/Password provider aktif
  - [ ] Email Link (passwordless) aktif
  - [ ] Authorized domains listesi güncellendi
    - [ ] `localhost` (development)
    - [ ] Production domain (ör: `portal.ajans.com`)
    - [ ] `*.vercel.app` (preview deployments)

- [ ] **Firestore**
  - [ ] Database oluşturuldu
  - [ ] Security Rules deploy edildi (`firestore.rules`)
  - [ ] Indexes oluşturuldu (gerekiyorsa)
  - [ ] Test verileri eklendi

- [ ] **Users Collection Setup**
  - [ ] Admin user document oluşturuldu
    ```javascript
    {
      email: "admin@ajans.com",
      role: "admin",
      createdAt: Timestamp
    }
    ```
  - [ ] En az 1 test client user oluşturuldu
    ```javascript
    {
      email: "musteri@firma.com",
      role: "client",
      clientId: "[client_id]",
      createdAt: Timestamp
    }
    ```

### Code Quality

- [ ] `npm run build` başarılı
- [ ] TypeScript hataları yok
- [ ] Console.log'lar temizlendi (production)
- [ ] Unused imports temizlendi
- [ ] Comments güncellendi

---

## 🌐 Vercel Deployment

### Project Setup

- [ ] GitHub repository oluşturuldu ve push edildi
- [ ] Vercel'e bağlandı
- [ ] Framework otomatik algılandı (Next.js)
- [ ] Build başarılı

### Environment Variables (7 adet)

**Vercel Dashboard → Settings → Environment Variables:**

- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `GROQ_API_KEY`

**Not:** Her variable için Production, Preview, Development seçildi mi?

### Domain Configuration

- [ ] Custom domain eklendi (opsiyonel)
- [ ] DNS kayıtları doğru yapılandırıldı
- [ ] SSL sertifikası aktif (otomatik)
- [ ] Firebase'e domain eklendi

---

## 🧪 Testing

### Functional Testing

- [ ] **Authentication Flow**
  - [ ] Login sayfası açılıyor
  - [ ] Magic link email geliyor (spam kontrol!)
  - [ ] Email link'e tıklayınca doğrulama çalışıyor
  - [ ] Admin `/dashboard`'a yönlendiriliyor
  - [ ] Client `/client/dashboard`'a yönlendiriliyor
  - [ ] Logout çalışıyor

- [ ] **Admin Dashboard**
  - [ ] Proje listesi görünüyor
  - [ ] İstatistikler doğru
  - [ ] "Yeni Proje" butonu çalışıyor
  - [ ] Proje oluşturma modal açılıyor
  - [ ] Müşteri listesi dropdown'da görünüyor
  - [ ] Proje başarıyla oluşturuluyor

- [ ] **Project Detail (Admin)**
  - [ ] Timeline görünüyor
  - [ ] "Güncelleme Ekle" butonu çalışıyor
  - [ ] Form açılıyor
  - [ ] Kategori seçimi çalışıyor
  - [ ] "Sihirli Değnek" (AI) butonu çalışıyor
  - [ ] Güncelleme başarıyla ekleniyor
  - [ ] Timeline'da görünüyor

- [ ] **Client Dashboard**
  - [ ] Sadece kendi projeleri görünüyor
  - [ ] İstatistikler doğru
  - [ ] Proje kartları çalışıyor

- [ ] **Project Detail (Client)**
  - [ ] Sadece kendi projesi açılıyor
  - [ ] Başkasının projesini açamıyor (URL ile denendi mi?)
  - [ ] Timeline görünüyor
  - [ ] "Onayla" butonu çalışıyor
  - [ ] "Revize İste" butonu çalışıyor
  - [ ] Status değişikliği Firestore'a yazılıyor

### Security Testing

- [ ] **Firestore Security Rules**
  - [ ] Client başkasının projesini göremiyor
  - [ ] Client başkasının müşteri bilgilerine erişemiyor
  - [ ] Client sadece status field'ını güncelleyebiliyor
  - [ ] Admin tüm erişimlere sahip
  - [ ] Unauthenticated user hiçbir şey göremiyor

- [ ] **API Endpoints**
  - [ ] `/api/generate-update` sadece authenticated users
  - [ ] Rate limiting var mı? (opsiyonel)
  - [ ] Error handling düzgün

### Performance Testing

- [ ] Lighthouse audit yapıldı
  - [ ] Performance: >90
  - [ ] Accessibility: >90
  - [ ] Best Practices: >90
  - [ ] SEO: >90

- [ ] Loading states çalışıyor
  - [ ] Dashboard loading
  - [ ] Project detail loading
  - [ ] Form submission loading

- [ ] Mobile responsive
  - [ ] iPhone (375px)
  - [ ] iPad (768px)
  - [ ] Desktop (1024px+)

### Error Handling

- [ ] 404 sayfası görünüyor
- [ ] 500 sayfası görünüyor (test edildi mi?)
- [ ] Network hataları gracefully handle ediliyor
- [ ] Firebase hataları user-friendly

---

## 📱 User Experience

- [ ] Email template'i test edildi
  - [ ] Spam klasörüne düşmüyor
  - [ ] Link çalışıyor
  - [ ] Branding doğru (ajans logosu varsa)

- [ ] Success messages görünüyor
  - [ ] Proje oluşturuldu
  - [ ] Güncelleme eklendi
  - [ ] Status değişti

- [ ] Error messages anlaşılır
  - [ ] "Permission denied" → "Bu işlem için yetkiniz yok"
  - [ ] "Network error" → "Bağlantı hatası, tekrar deneyin"

---

## 🔐 Security

- [ ] API keys güvenli
  - [ ] `.env.local` git'e commit edilmedi
  - [ ] Vercel environment variables'da
  - [ ] Public keys (NEXT_PUBLIC_) sadece client-safe

- [ ] Firebase Security Rules
  - [ ] Test mode kapalı
  - [ ] Production rules aktif
  - [ ] Rules test edildi

- [ ] HTTPS aktif (Vercel otomatik)

---

## 📊 Monitoring & Analytics

- [ ] Vercel Analytics aktif
- [ ] Error tracking yapılandırıldı
- [ ] Performance monitoring aktif

---

## 📝 Documentation

- [ ] README.md güncel
- [ ] DEPLOYMENT.md okundu
- [ ] API documentation var (gerekiyorsa)
- [ ] User manual hazır (gerekiyorsa)

---

## 🎯 Post-Deployment

### Verification

- [ ] Production URL'i açılıyor
- [ ] SSL sertifikası geçerli (kilit ikonu)
- [ ] Tüm sayfalara erişilebiliyor
- [ ] 2-3 kişi test etti

### Client Handoff

- [ ] Admin credentials iletildi
- [ ] Test client credentials iletildi
- [ ] Documentation paylaşıldı
- [ ] Support email/contact bildirildi

### Backup & Recovery

- [ ] Firestore backup stratejisi belirlendi
- [ ] Rollback planı var
- [ ] Emergency contact bilgileri paylaşıldı

---

## ✅ Final Sign-Off

**Deployment Date:** _____________

**Deployed By:** _____________

**Reviewed By:** _____________

**Production URL:** _____________

**Status:** 🟢 Live / 🟡 Soft Launch / 🔴 Issues

**Notes:**
```
```

---

## 🆘 Troubleshooting

### Email gelmiyor?
1. Spam klasörünü kontrol et
2. Firebase Console → Authentication → Templates → Email kontrol et
3. Authorized domains'e production domain eklendi mi?

### Build failed?
1. Local'de `npm run build` çalıştır
2. TypeScript hatalarını düzelt
3. Dependencies güncellendi mi? `npm install`

### Firestore permission denied?
1. Security rules deploy edildi mi?
2. User document var mı (users collection)?
3. clientId doğru mu?

### AI çalışmıyor?
1. `GROQ_API_KEY` Vercel'de var mı?
2. API key geçerli mi?
3. Rate limit aşıldı mı?

---

**🎉 Tebrikler! ClientFlow production'da!**
