# 🚀 Vercel Environment Variables - Hızlı Ekleme

## ✅ HAZIR! Dosyalar Oluşturuldu

- `.env.local` → Local development için (✅ HAZIR)
- `.env.vercel` → Vercel'e import için (✅ HAZIR)
- `vercel-env-vars.txt` → Manuel copy-paste için (✅ HAZIR)

---

## 🎯 Seçenek 1: Vercel Web Dashboard (EN KOLAY - 2 dakika)

### Adım 1: Vercel'e Git
https://vercel.com → **clientflow-new** projesini seç

### Adım 2: Settings
- **Settings** → **Environment Variables** tıkla

### Adım 3: Değerleri Ekle
`.env.vercel` dosyasını aç ve her satırı copy-paste yap:

```
Variable Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: AIzaSyBdsrLgRwJbCgkDfD2tGMOR_8EZmS_sZgs
Environments: ✅ Production ✅ Preview ✅ Development
[Add] tıkla

(6 tane daha Firebase variable için tekrarla)

Variable Name: GROQ_API_KEY
Value: [.env.local dosyasından kopyala]
Environments: ✅ Production ✅ Preview ✅ Development
[Add] tıkla
```

**TOPLAM: 7 variable**

---

## 🎯 Seçenek 2: Vercel CLI (Otomatik - Zor)

CLI interaktif olduğu için biraz zahmetli. Web dashboard öneriyorum!

Yine de denemek istersen:
```bash
cd C:\Users\emrah\OneDrive\Desktop\clientflow-new
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# Value gir: AIzaSy...
# Environment seç: Production (SPACE), Preview (SPACE), Development (SPACE), ENTER
# 7 variable için tekrarla
```

---

## 🎯 Seçenek 3: Vercel Import Feature (Varsa)

Bazı Vercel versiyonlarında `.env` import özelliği var:

1. Vercel Dashboard → Project → Settings → Environment Variables
2. "Bulk Add" veya "Import .env" butonuna bak
3. Varsa → `.env.vercel` dosyasını yükle

---

## ✅ Eklendikten Sonra Kontrol

Vercel Dashboard'da 7 variable görmelisin:

| Variable | Ortam | Value (başı) |
|----------|-------|--------------|
| NEXT_PUBLIC_FIREBASE_API_KEY | Production, Preview, Development | AIzaSy... |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | Production, Preview, Development | clientflow... |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID | Production, Preview, Development | clientflow-36522 |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET | Production, Preview, Development | clientflow... |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | Production, Preview, Development | 261375... |
| NEXT_PUBLIC_FIREBASE_APP_ID | Production, Preview, Development | 1:26137... |
| GROQ_API_KEY | Production, Preview, Development | gsk_p2P... |

---

## 🚀 Deploy Et

Environment variables eklendikten sonra:

```bash
cd C:\Users\emrah\OneDrive\Desktop\clientflow-new
vercel --prod
```

Veya Vercel Dashboard → Deployments → Redeploy

---

## 🔗 Linkler

- **Vercel Dashboard:** https://vercel.com/emrahfidans-projects
- **Project:** clientflow-new
- **GitHub:** https://github.com/EmrahFidan/clientflow

---

Sorun olursa: PRODUCTION-CHECKLIST.md'ye bak!
