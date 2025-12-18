# 🎯 Vercel Environment Variables - Manuel Ekleme

## Hızlı Yöntem: Web Dashboard (2 dakika)

### 1. Vercel Dashboard'a Git
https://vercel.com/emrahfidans-projects/clientflow-new/settings/environment-variables

### 2. Her Variable İçin:

`.env.local` dosyasını aç ve değerleri kopyala:

#### Variable 1: NEXT_PUBLIC_FIREBASE_API_KEY
```
Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: AIzaSyBdsrLgRwJbCgkDfD2tGMOR_8EZmS_sZgs
✅ Production ✅ Preview ✅ Development
[Save] tıkla
```

#### Variable 2: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
```
Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: clientflow-36522.firebaseapp.com
✅ Production ✅ Preview ✅ Development
[Save]
```

#### Variable 3: NEXT_PUBLIC_FIREBASE_PROJECT_ID
```
Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: clientflow-36522
✅ Production ✅ Preview ✅ Development
[Save]
```

#### Variable 4: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
```
Name: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: clientflow-36522.firebasestorage.app
✅ Production ✅ Preview ✅ Development
[Save]
```

#### Variable 5: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
```
Name: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: 261375564594
✅ Production ✅ Preview ✅ Development
[Save]
```

#### Variable 6: NEXT_PUBLIC_FIREBASE_APP_ID
```
Name: NEXT_PUBLIC_FIREBASE_APP_ID
Value: 1:261375564594:web:4dba7e34eaa24a8e2f552b
✅ Production ✅ Preview ✅ Development
[Save]
```

#### Variable 7: GROQ_API_KEY
```
Name: GROQ_API_KEY
Value: [.env.local dosyasından kopyala - gsk_ ile başlayan]
✅ Production ✅ Preview ✅ Development
[Save]
```

---

## ✅ Kontrol Et

Vercel Dashboard'da 7 environment variable görmelisin.

---

## 🚀 Deploy

```bash
vercel --prod
```

veya

Vercel Dashboard → Deployments → Redeploy

---

**İpucu:** Web dashboard en hızlısı! CLI interaktif olduğu için daha uzun sürer.
