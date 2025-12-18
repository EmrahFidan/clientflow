# 🚀 Hızlı Çözüm - Login Sorunu

Giriş yapamama sorununu **5 dakikada** çözelim!

## Sorun Nedir?

Firebase Authentication'da **Email/Password** provider'ı aktif değil. Bu yüzden kullanıcılar giriş yapamıyor.

---

## ✅ Çözüm Adımları

### 1️⃣ Firebase Console'da Authentication'ı Aktif Et (2 dakika)

**ÖNEMLİ:** Bu adım manuel yapılmalı, tek seferlik!

1. **Firebase Console'u aç:**
   ```
   https://console.firebase.google.com/project/clientflow-36522/authentication/providers
   ```

2. **Email/Password Provider'ı Aktif Et:**
   - Eğer "Get started" butonu görüyorsan, ona tıkla
   - "Sign-in method" sekmesine geç
   - "Email/Password" satırını bul
   - Sağdaki **kalem (edit) ikonuna** tıkla
   - **Enable** switch'ini AÇ (yeşil olmalı)
   - **"Email link (passwordless sign-in)"** seçeneğini KAPALI bırak (şifre ile giriş yapacağız)
   - **Save** butonuna bas

✅ **Tamamlandı!** Authentication artık aktif.

---

### 2️⃣ Test Kullanıcılarını Oluştur (3 dakika)

Terminal'i aç ve şu komutları çalıştır:

```bash
cd C:\Users\emrah\OneDrive\Desktop\clientflow-new

# 1. Dependencies yükle (eğer yüklemediysen)
npm install

# 2. Setup script'ini çalıştır
npm run setup:auth
```

**Script ne yapacak?**
- ✅ Admin kullanıcı oluştur: `admin@clientflow.com` / `Admin123`
- ✅ Client kullanıcı oluştur: `musteri@firma.com` / `Musteri123`
- ✅ Firestore'da users dökümanları oluştur

---

### 3️⃣ Test Et! (30 saniye)

```bash
# Dev server'ı başlat
npm run dev
```

Tarayıcıda aç:
```
http://localhost:3000/auth/login
```

**Giriş yap:**
- Email: `admin@clientflow.com`
- Şifre: `Admin123`

✅ **Başarılı!** Dashboard'a yönlendirileceksin.

---

## 🎯 Sorun Devam Ediyorsa

### Hata: "Firebase: Error (auth/operation-not-allowed)"
**Çözüm:** Adım 1'i tekrar kontrol et. Email/Password provider'ı mutlaka ENABLE olmalı.

### Hata: "Firebase: Error (auth/invalid-api-key)"
**Çözüm:** `.env.local` dosyasındaki Firebase config'i kontrol et. Project ID: `clientflow-36522`

### Hata: "User not found in Firestore"
**Çözüm:** Setup script'ini tekrar çalıştır: `npm run setup:auth`

---

## 📖 Detaylı Dokümantasyon

Daha fazla bilgi için:
- [FIREBASE-SETUP.md](./FIREBASE-SETUP.md) - Komple Firebase kurulum rehberi
- [README.md](./README.md) - Proje dokümantasyonu

---

## 🆘 Yardım

Sorun devam ediyorsa bana söyle, birlikte çözeriz! 🚀
