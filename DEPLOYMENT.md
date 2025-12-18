# ClientFlow - Deployment Guide

## 🚀 Vercel'e Deploy Etme

### Adım 1: GitHub Repository Oluştur

```bash
git init
git add .
git commit -m "Initial commit - ClientFlow v1.0"
git branch -M main
git remote add origin https://github.com/username/clientflow.git
git push -u origin main
```

### Adım 2: Vercel'e Bağlan

1. [Vercel Dashboard](https://vercel.com/dashboard)'a git
2. "New Project" → GitHub repository'sini seç
3. Framework: **Next.js** (otomatik algılanır)
4. Root Directory: `./` (default)
5. "Deploy" butonuna BAS - henüz environment variables eklemeden!

### Adım 3: Environment Variables Ekle

Vercel Dashboard → Project Settings → Environment Variables:

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

**Not:** Her bir variable'ı ayrı ayrı ekleyin ve **Production, Preview, Development** ortamlarının hepsini seçin.

### Adım 4: Redeploy

Environment variables eklendikten sonra:
- Deployments sekmesine git
- En son deployment'a tıkla
- "Redeploy" → "Redeploy" (environment variables ile birlikte)

### Adım 5: Firebase Authorized Domains

Firebase Console → Authentication → Settings → Authorized domains:

```
your-project.vercel.app
```

Ekle!

---

## 🌐 Custom Domain Ekleme

### Vercel'de Domain Ayarı

1. Vercel Dashboard → Project Settings → Domains
2. "Add Domain" → `portal.ajansadi.com` yaz
3. DNS kayıtlarını kopyala

### DNS Sağlayıcıda (GoDaddy, Cloudflare, vb.)

**A Record:**
```
Type: A
Name: portal (veya @)
Value: 76.76.21.21
TTL: 3600
```

**CNAME Record (Önerilen):**
```
Type: CNAME
Name: portal
Value: cname.vercel-dns.com.
TTL: 3600
```

DNS propagation süresi: 24-48 saat (genelde 1 saat içinde aktif olur)

---

## 🔒 Production Checklist

### Firebase

- [ ] Authentication Email/Password + Email Link aktif
- [ ] Authorized Domains güncel (localhost + production domain)
- [ ] Firestore Security Rules deploy edildi
- [ ] Test kullanıcıları oluşturuldu (1 admin, 1 client)

### Vercel

- [ ] Environment variables ekli (7 adet)
- [ ] Build başarılı
- [ ] Production domain bağlı
- [ ] SSL sertifikası aktif (otomatik)

### Test

- [ ] Login çalışıyor (Magic Link email geliyor)
- [ ] Admin dashboard erişilebilir
- [ ] Client dashboard erişilebilir
- [ ] Security rules çalışıyor (client başkasının projesini göremiyor)
- [ ] AI text generation çalışıyor

### Performans

- [ ] Lighthouse score >90
- [ ] Mobile responsive
- [ ] Loading states doğru çalışıyor

---

## 🐛 Troubleshooting

### Build Hatası

```bash
# Local'de build test et
npm run build

# Hata varsa:
npm install
npm run build
```

### Email Gelmiyor

1. Firebase Console → Authentication → Templates → Email link sign-in
2. Email template'ı kontrol et
3. Spam klasörünü kontrol et
4. Production URL doğru mu? `actionCodeSettings.url`

### Environment Variables Çalışmıyor

- Vercel dashboard'da kontrol et
- Redeploy yap
- `NEXT_PUBLIC_` prefix'i var mı?

### Firestore Permission Denied

- Security rules deploy edildi mi?
- User document var mı? (users collection)
- `clientId` doğru mu?

---

## 📊 Post-Deployment

### Analytics

Vercel Analytics otomatik aktif. Dashboard'da görebilirsiniz:
- Page views
- Unique visitors
- Top pages

### Monitoring

Vercel otomatik monitör eder:
- Build status
- Function execution time
- Error tracking

---

## 🔄 Update Process

Yeni değişiklikler için:

```bash
git add .
git commit -m "feat: yeni özellik eklendi"
git push origin main
```

Vercel otomatik deploy eder. Preview deployment'lar her branch için otomatik oluşur.

---

## 💡 Best Practices

1. **Branching Strategy:**
   - `main`: Production
   - `staging`: Test environment
   - `feature/*`: Yeni özellikler

2. **Environment Variables:**
   - `.env.local` local development için
   - Vercel'de production için
   - Asla commit etmeyin!

3. **Testing:**
   - Local'de test et
   - Staging'de test et
   - Production'a deploy et

4. **Security:**
   - API keys'i güvenli tut
   - Security rules'ı regular update et
   - User feedback'e göre improve et
