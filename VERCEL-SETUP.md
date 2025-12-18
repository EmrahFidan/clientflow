# 🚀 Vercel Deployment Rehberi

## Hızlı Deployment Adımları

### 1. Vercel'e Giriş Yap
- https://vercel.com adresine git
- GitHub hesabınla giriş yap

### 2. Yeni Proje Oluştur
- "Add New..." → "Project" tıkla
- **EmrahFidan/clientflow** repository'sini seç
- "Import" butonuna tıkla

### 3. Environment Variables Ekle

Aşağıdaki 7 environment variable'ı ekle. **ÖNEMLİ:** Her variable için "Production", "Preview", "Development" ortamlarının hepsini seç!

```bash
# Firebase Configuration (6 adet)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Groq AI API (1 adet)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Deploy Et
- "Deploy" butonuna tıkla
- 2-3 dakika bekle
- Deployment tamamlanınca URL'i al (örn: clientflow.vercel.app)

### 5. Firebase'de Domain Ekle
- Firebase Console → Authentication → Settings → Authorized domains
- Vercel URL'ini ekle: `clientflow.vercel.app`
- localhost zaten ekli (development için)

---

## 🔑 API Key'leri Nasıl Alınır?

### Firebase Keys
1. Firebase Console'a git: https://console.firebase.google.com
2. Projenizi seçin
3. **Settings ⚙️ → Project settings**
4. "Your apps" bölümünde web app'inizi seçin
5. "Firebase SDK snippet" → "Config" seçin
6. Tüm değerleri kopyalayın

### Groq API Key
1. https://console.groq.com adresine git
2. Hesap oluştur/giriş yap
3. "API Keys" bölümüne git
4. "Create API Key" tıkla
5. Key'i kopyala (bir daha gösterilmez!)

---

## ✅ Deployment Sonrası Kontroller

### 1. Build Başarılı mı?
- Vercel dashboard'da "Deployment" yeşil ✅ işaretli olmalı
- Hata varsa "Build Logs" sekmesine bak

### 2. Environment Variables Doğru mu?
- Vercel → Project → Settings → Environment Variables
- 7 variable'ın hepsinin olduğundan emin ol
- Production + Preview + Development için seçili mi kontrol et

### 3. Site Açılıyor mu?
- Vercel URL'ini aç (örn: https://clientflow.vercel.app)
- Ana sayfa yüklenmelid (Login sayfası görünmeli)

### 4. Firebase Bağlantısı Çalışıyor mu?
- `/auth/login` sayfasına git
- Email gir ve "Giriş Linki Gönder" tıkla
- Eğer "Firebase: Error" görüyorsan → Environment variables yanlış
- Eğer email gelmediyse → Firebase Auth ayarları kontrol et

---

## 🐛 Sık Karşılaşılan Sorunlar

### Build Hatası: "Module not found"
**Çözüm:** package.json'daki dependency'ler eksik
```bash
cd clientflow-new
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### "Firebase: Error (auth/configuration-not-found)"
**Çözüm:** Environment variables yanlış veya eksik
- Vercel'de tüm Firebase değişkenlerini kontrol et
- NEXT_PUBLIC_ prefix'i unutma!
- Redeploy yap (Vercel → Deployments → ... → Redeploy)

### "Groq API Error: Invalid API Key"
**Çözüm:** GROQ_API_KEY yanlış
- Groq Console'dan yeni key oluştur
- Vercel'de güncelle
- Redeploy yap

### Email Linki Çalışmıyor
**Çözüm:** Firebase Authorized Domains eksik
- Firebase Console → Auth → Settings → Authorized domains
- Vercel URL'ini ekle: `clientflow.vercel.app`

---

## 📊 Production Monitoring

### Vercel Analytics
- Vercel Dashboard → Analytics
- Real-time traffic, performance metrics

### Firebase Console
- Authentication → Users (kullanıcı sayısı)
- Firestore → Data (veri kontrol)
- Usage → Quotas (limit takibi)

### Groq API Usage
- https://console.groq.com → Usage
- Request sayısı, token kullanımı

---

## 🎯 Custom Domain (Opsiyonel)

### 1. Domain Satın Al
- Namecheap, GoDaddy, veya Cloudflare

### 2. Vercel'de Ekle
- Vercel → Project → Settings → Domains
- Domain adını gir (örn: clientflow.com)
- DNS kayıtlarını göreceksin

### 3. DNS Ayarla
- Domain sağlayıcında:
  - A Record: `76.76.21.21`
  - CNAME: `cname.vercel-dns.com`

### 4. Firebase'de Ekle
- Firebase Console → Auth → Authorized domains
- Yeni domain'i ekle

---

## 🔄 Güncelleme Yapmak

```bash
# Kod değişikliği yap
git add .
git commit -m "Feature: new update"
git push

# Vercel otomatik deploy eder (30-60 saniye)
```

---

## 🎉 Tebrikler!

ClientFlow production'da!

**URL:** https://clientflow.vercel.app
**GitHub:** https://github.com/EmrahFidan/clientflow
**Vercel Dashboard:** https://vercel.com/emrahfidans-projects

Sorun olursa: PRODUCTION-CHECKLIST.md'ye bak
