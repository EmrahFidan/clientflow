# 🔥 Firestore Users Dökümanları - Manuel Kurulum

Authentication kullanıcıları oluşturuldu! Şimdi Firestore'da users dökümanlarını ekleyelim.

## Adımlar (2 dakika)

### 1. Firebase Console'u Aç

```
https://console.firebase.google.com/project/clientflow-36522/firestore/databases/-default-/data
```

### 2. Users Collection Oluştur

Eğer **users** collection yoksa:
1. "**Start collection**" butonuna tıkla
2. Collection ID: `users`
3. "Next"

### 3. Admin User Dökümanı Ekle

**Document ID:** `kGjvmmLia9OBkg3vSPBoilb1vgT2`

Fields ekle:
```
email     (string):    admin@clientflow.com
role      (string):    admin
createdAt (timestamp): [Auto-generate timestamp]
```

"Save" butonuna tıkla.

---

### 4. Client User Dökümanı Ekle

Users collection'ında "**Add document**" butonuna tıkla.

**Document ID:** `buybWKosrvUeREB0l5EUl5EdHP33`

Fields ekle:
```
email     (string):    musteri@firma.com
role      (string):    client
clientId  (string):    null
createdAt (timestamp): [Auto-generate timestamp]
```

"Save" butonuna tıkla.

---

## ✅ Tamamlandı!

Artık giriş yapabilirsiniz:

```bash
npm run dev
```

```
http://localhost:3000/auth/login
```

**Giriş bilgileri:**
- Email: `admin@clientflow.com`
- Şifre: `Admin123`

---

## 🔐 Firestore Rules (Opsiyonel)

Güvenlik için firestore rules'ı deploy edin:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

Bu adım zorunlu değil, mevcut rules zaten güvenli.
