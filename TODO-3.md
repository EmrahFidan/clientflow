# Proje: ClientFlow - Faz 3: The Portal (Müşteri Açılışı)

## 📋 Proje Bağlamı

**Açıklama:** Sistemin müşterilere açılması. Bu faz, güvenlik ve erişim yönetimi (Auth) açısından en kritik fazdır. Müşteri sadece kendi projesini görmeli ve şifre hatırlamakla uğraşmamalıdır.

**Hedef Kullanıcı:** Müşteri (Client).

**Başarı Kriteri:** Müşterinin e-postasına gelen linke tıklayarak panele girmesi ve sadece kendisine ait projeyi görüntüleyip onay/revize işlemi yapabilmesi.

---

## 🚀 Faz 3 Görevleri: Müşteri Deneyimi ve Güvenlik

### 3.1 Authentication (Kimlik Doğrulama)
- [ ] **Görev:** Email Link Girişi (Magic Link)
  - **Servis:** Firebase Authentication
  - **Detay:** Firebase Console'da "Email/Password" authentication metodunu aktif et.
  - **Detay:** Login sayfasında "E-posta ile Giriş Yap" seçeneği:
    ```javascript
    import { sendSignInLinkToEmail } from 'firebase/auth';

    const actionCodeSettings = {
      url: 'https://clientflow.vercel.app/auth/verify', // Dönüş URL'i
      handleCodeInApp: true,
    };

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    // E-postayı localStorage'a kaydet (verify için gerekli)
    window.localStorage.setItem('emailForSignIn', email);
    ```
  - **Detay:** `/auth/verify` sayfasında email link'i doğrula:
    ```javascript
    import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';

    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn');
      await signInWithEmailLink(auth, email, window.location.href);
    }
    ```
  - **Kabul Kriteri:** E-postaya gelen linke tıklanınca kullanıcı "Authenticated" duruma geçiyor ve dashboard'a yönlendiriliyor.

### 3.2 Güvenlik (Firestore Security Rules)
- [ ] **Görev:** Veri Erişim Politikaları (KRİTİK)
  - **Detay:** Firebase Console → Firestore Database → Rules sekmesinde güvenlik kurallarını ayarla.
  - **Admin Tanımlama:** Firestore'da `users` koleksiyonu oluştur:
    ```javascript
    // users/{userId}
    {
      email: "admin@ajans.com",
      role: "admin", // veya "client"
      clientId: "optional - sadece client için"
    }
    ```
  - **Security Rules:**
    ```javascript
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {

        // Helper function: Kullanıcı admin mi?
        function isAdmin() {
          return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
        }

        // Helper function: Kullanıcının client ID'si
        function getUserClientId() {
          return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.clientId;
        }

        // CLIENTS koleksiyonu
        match /clients/{clientId} {
          allow read, write: if isAdmin();
          allow read: if request.auth.uid != null && getUserClientId() == clientId;
        }

        // PROJECTS koleksiyonu
        match /projects/{projectId} {
          allow read, write: if isAdmin();
          allow read: if request.auth.uid != null &&
                         getUserClientId() == resource.data.clientId;
        }

        // UPDATES koleksiyonu
        match /updates/{updateId} {
          allow read, write: if isAdmin();
          allow read: if request.auth.uid != null;
          allow update: if request.auth.uid != null &&
                          request.resource.data.keys().hasOnly(['status']);
        }

        // USERS koleksiyonu
        match /users/{userId} {
          allow read: if request.auth.uid == userId;
          allow write: if isAdmin();
        }
      }
    }
    ```
  - **Kabul Kriteri:**
    - Admin tüm koleksiyonlara erişebiliyor.
    - Müşteri A giriş yaptığında, sadece kendi `clientId`sine sahip projeleri görebiliyor.
    - Müşteri B'nin projesinin URL'ine gittiğinde Firestore "permission-denied" hatası veriyor.

### 3.3 Müşteri Dashboard UI
- [ ] **Görev:** Salt Okunur Timeline (Read-Only View)
  - **Detay:** Faz 1'deki Admin panelinin sadeleştirilmiş, düzenleme butonları olmayan hali.
  - **Ekstra:** Sayfanın en üstünde büyük bir "Proje Durumu" (Örn: %60 Tamamlandı) göstergesi.

### 3.4 Etkileşim
- [ ] **Görev:** Onay/Revize Mekanizması
  - **Detay:** Timeline üzerindeki güncellemelere "Onayla" veya "Revize İste" butonu ekle.
  - **Firestore İşlemi:**
    ```javascript
    import { doc, updateDoc } from 'firebase/firestore';

    const updateRef = doc(db, 'updates', updateId);
    await updateDoc(updateRef, {
      status: 'approved' // veya 'needs_revision'
    });
    ```
  - **Veri Modeli Güncellemesi:** `updates` koleksiyonuna `status` alanı ekle:
    ```javascript
    {
      // ... mevcut alanlar
      status: "pending | approved | needs_revision",
      reviewedAt: "timestamp (optional)",
      reviewedBy: "userId (optional)"
    }
    ```
  - **Kabul Kriteri:** Müşteri butona bastığında güncelleme durumu değişiyor ve admin panelinde bu değişiklik görünüyor.

---

## ✅ İlerleme Takibi

| Faz | Durum |
|-----|-------|
| 3.1 Magic Link | ⬜ Başlamadı |
| 3.2 RLS Güvenlik | ⬜ Başlamadı |
| 3.3 Müşteri UI | ⬜ Başlamadı |
| 3.4 Onay Sistemi | ⬜ Başlamadı |
