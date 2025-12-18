# 🔥 Firebase Setup Rehberi

## Hızlı Kurulum (10 dakika)

### 1. Firebase Projesi Oluştur
- https://console.firebase.google.com
- "Add project" tıkla
- Proje adı: **ClientFlow Production**
- Google Analytics: İsteğe bağlı (şimdilik devre dışı bırakabilirsin)
- "Create project" → Tamamlanana kadar bekle

---

## 2. 🔐 Authentication Kurulumu

### Email/Password Provider
1. Firebase Console → **Authentication**
2. "Get started" tıkla
3. "Sign-in method" sekmesi
4. **Email/Password** → Enable et
5. "Email link (passwordless sign-in)" seçeneğini de AÇIK olarak işaretle ✅
6. Save

### Authorized Domains
1. Authentication → **Settings** → Authorized domains
2. Şu domainler ekli olmalı:
   - ✅ `localhost` (development için)
   - ✅ `your-project.firebaseapp.com` (otomatik eklenir)
   - ➕ Vercel URL'ini ekle: `clientflow.vercel.app`
   - ➕ Custom domain varsa onu da ekle

---

## 3. 💾 Firestore Database Kurulumu

### Database Oluştur
1. Firebase Console → **Firestore Database**
2. "Create database" tıkla
3. **Production mode** seç (Security rules deploy edeceğiz)
4. Location: `eur3 (europe-west)` (Europe'a en yakın)
5. "Enable"

### Security Rules Deploy Et
1. Bilgisayarında terminal aç:
```bash
cd C:\Users\emrah\OneDrive\Desktop\clientflow-new
npm install -g firebase-tools
firebase login
firebase init firestore
# Existing project → ClientFlow Production seç
# firestore.rules → ENTER (default)
# firestore.indexes.json → ENTER (default)
firebase deploy --only firestore:rules
```

**Alternatif (Manuel):**
1. Firestore Database → **Rules** sekmesi
2. `firestore.rules` dosyasının içeriğini kopyala
3. Firebase Console'a yapıştır
4. "Publish" tıkla

---

## 4. 👥 Test Kullanıcıları Oluştur

### Admin Kullanıcı
1. Firebase Console → **Authentication** → Users
2. "Add user" tıkla
   - Email: `admin@clientflow.com`
   - Password: `Admin123!` (güvenli bir şifre seç)
   - "Add user"
3. User ID'yi kopyala (örn: `xYz123AbC...`)
4. **Firestore Database** → Data → **users** collection
5. "Start collection" (ilk kayıt ise)
6. Document ID: Yukarıdaki User ID'yi yapıştır
7. Fields:
   ```
   email: admin@clientflow.com (string)
   role: admin (string)
   createdAt: [şu anki timestamp] (timestamp)
   ```
8. Save

### Client (Müşteri) Kullanıcı
1. Önce **clients** collection'da bir müşteri oluştur:
   - Collection: `clients`
   - Document ID: Auto-generate
   - Fields:
     ```
     name: Test Müşteri A.Ş. (string)
     email: musteri@firma.com (string)
     createdAt: [şu anki timestamp] (timestamp)
     ```
   - Client ID'yi kopyala (örn: `abc123def...`)

2. Authentication'da kullanıcı oluştur:
   - Email: `musteri@firma.com`
   - Password: `Musteri123!`
   - User ID'yi kopyala

3. Firestore → **users** collection → Add document:
   - Document ID: User ID'yi yapıştır
   - Fields:
     ```
     email: musteri@firma.com (string)
     role: client (string)
     clientId: abc123def... (yukarıdaki client ID) (string)
     createdAt: [şu anki timestamp] (timestamp)
     ```

---

## 5. 🔑 Firebase Credentials Al

1. Firebase Console → **Settings ⚙️** → Project settings
2. Scroll down → "Your apps" bölümü
3. **</> Web app** butonuna tıkla (yoksa ekle)
4. App nickname: **ClientFlow Web**
5. "Register app"
6. "Firebase SDK snippet" → **Config** seç
7. Şu değerleri kopyala:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

8. `.env.local` dosyasına yapıştır:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef...
```

---

## 6. ✅ Test Et

### Local Development
```bash
cd C:\Users\emrah\OneDrive\Desktop\clientflow-new
npm run dev
```

### Test Senaryosu
1. **Admin Login:**
   - http://localhost:3000/auth/login
   - Email: `admin@clientflow.com`
   - Magic Link email gelecek
   - Email'deki linke tıkla
   - `/dashboard` sayfasına yönlendirilmelisin

2. **Test Data Oluştur:**
   - http://localhost:3000/setup
   - "Kurulumu Başlat" tıkla
   - 3 client, 5 project, 15 update oluşturulacak

3. **Client Login:**
   - Logout yap
   - http://localhost:3000/auth/login
   - Email: `musteri@firma.com`
   - Magic Link gelecek
   - Email'deki linke tıkla
   - `/client/dashboard` sayfasına yönlendirilmelisin
   - Sadece kendi projelerini göreceksin

---

## 7. 🚀 Vercel'e Deploy Et

Artık hazırsın! **VERCEL-SETUP.md** dosyasını takip et.

---

## 📊 Firebase Quotas (Ücretsiz Plan)

### Spark Plan Limitleri
- **Firestore:**
  - 1 GB depolama
  - 50K read/day, 20K write/day
  - 20K delete/day

- **Authentication:**
  - Sınırsız kullanıcı
  - Email/Password: Sınırsız

### Limit Takibi
- Firebase Console → **Usage** sekmesi
- Quota aşımı uyarısı alacaksın
- Gerekirse Blaze Plan'a geç (Pay-as-you-go, aylık ~$1-5)

---

## 🐛 Sorun Giderme

### "Firebase: Error (auth/invalid-api-key)"
**Çözüm:** .env.local dosyasındaki API key yanlış
- Firebase Console'dan tekrar kopyala
- NEXT_PUBLIC_ prefix'i unutma
- Dev server'ı restart et

### Magic Link Emaili Gelmiyor
**Çözüm:**
1. Firebase Console → Auth → Templates
2. "Email link sign-in" template'ini kontrol et
3. Spam klasörüne bak
4. Gmail kullanıyorsan "Promotions" sekmesine bak

### "Permission Denied" Hatası
**Çözüm:** Security rules yanlış deploy edildi
1. Firestore Database → Rules
2. `firestore.rules` dosyasını tekrar deploy et
3. Publish

### User Document Bulunamıyor
**Çözüm:** Authentication UID ile Firestore user document ID eşleşmiyor
1. Authentication'dan User ID'yi kopyala
2. Firestore'da users collection'ında aynı ID'de document olmalı

---

## 🎯 Production Checklist

- [ ] Firebase projesi oluşturuldu
- [ ] Authentication enabled (Email/Password + Email Link)
- [ ] Firestore database oluşturuldu
- [ ] Security rules deploy edildi
- [ ] Admin kullanıcı oluşturuldu
- [ ] Test client kullanıcı oluşturuldu
- [ ] Firebase config kopyalandı
- [ ] .env.local dosyası oluşturuldu
- [ ] Local test başarılı
- [ ] Vercel URL authorized domains'e eklendi

---

**Sonraki Adım:** VERCEL-SETUP.md
