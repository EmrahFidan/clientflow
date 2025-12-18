
# Proje: ClientFlow - Faz 2: The Translator (Yapay Zeka Katmanı)

## 📋 Proje Bağlamı

**Açıklama:** Faz 1'de kurulan yapıya "AI Çevirmen" özelliğinin eklenmesi. Amaç, teknik personelin yazdığı jargonlu notları, müşterinin anlayacağı profesyonel ve sade bir dile çevirmektir.

**Başarı Kriteri:** "Güncelleme Ekle" formunda yazılan teknik bir notun, tek tuşla müşteri dostu bir metne dönüşmesi.

---

## 🛠️ Teknoloji Stack (Eklemeler)

| Katman | Teknoloji | Versiyon |
|--------|-----------|----------|
| AI Model | OpenAI GPT-4o Mini | Cost-effective text generation |
| API | Next.js API Routes | Server-side AI calls |

---

## 🚀 Faz 2 Görevleri: AI Entegrasyonu

### 2.1 Backend API
- [x] **Görev:** `api/generate-update` Endpoint'i
  - **Detay:** OpenAI SDK kur: `npm install openai`
  - **Detay:** `.env.local` dosyasına OpenAI API key ekle:
    ```env
    OPENAI_API_KEY=sk-...
    ```
  - **Detay:** `app/api/generate-update/route.ts` dosyasında OpenAI API'ye bağlanan bir Next.js Route Handler oluştur.
  - **Prompt Engineering:** Sisteme şu rolü ver: *"Sen profesyonel bir proje yöneticisisin. Sana verilen teknik notu, müşterinin anlayacağı, nazik ve güven verici bir dile çevir. Teknik terimleri basitleştir."*
  - **Girdi:** "API endpoint fixlendi, 500 hatası gitti."
  - **Çıktı:** "Veri akışında yaşanan kesinti giderildi, sistem şu an stabil çalışıyor."
  - **Kabul Kriteri:** API endpoint'e POST request atıldığında AI-generated metin dönüyor.

### 2.2 UI Entegrasyonu
- [x] **Görev:** "Sihirli Değnek" Butonu
  - **Konum:** Faz 1'deki "Güncelleme Ekle" formundaki açıklama kutusunun yanına.
  - **Aksiyon:** Kullanıcı ham notu yazar -> Butona basar -> Loading döner -> Textarea'daki yazı AI çıktısı ile değişir.
  - **Kabul Kriteri:** Kullanıcı AI'ın yazdığı metni beğenmezse elle düzeltebilmeli.

### 2.3 Kategori Tahmini (Bonus)
- [x] **Görev:** Otomatik Etiketleme
  - **Detay:** AI sadece metni çevirmiyor, aynı zamanda bu işin "Tasarım" mı "Yazılım" mı olduğunu tahmin edip dropdown'ı seçiyor.

---

## 🐛 Bilinen Sorunlar (Faz 2)

| Senaryo | Beklenen Davranış | Notlar |
|---------|-------------------|--------|
| API Hata Verirse | Manuel girişe izin ver | AI zorunlu olmamalı, yardımcı olmalı. |
| Çok kısa girdi | AI saçmalayabilir | "Lütfen en az 3 kelime girin" uyarısı. |

---

## ✅ İlerleme Takibi

| Faz | Durum |
|-----|-------|
| 2.1 AI Endpoint | ✅ Tamamlandı |
| 2.2 UI Butonu | ✅ Tamamlandı |
| 2.3 Prompt Ayarı | ✅ Tamamlandı |

---

## 📝 Uygulama Detayları

### API Endpoint: `/api/generate-update`
- **Dosya:** `app/api/generate-update/route.ts`
- **Desteklenen Aksiyonlar:**
  - `translate`: Teknik notu müşteri dostu metne çevir
  - `categorize`: Kategoriyi tahmin et (design/dev/marketing)
  - Aksiyonsuz istek: Her iki işlemi paralel çalıştır

### UI: Sihirli Değnek Butonu
- **Dosya:** `components/dashboard/AddUpdateForm.tsx`
- **Özellikler:**
  - Yıldız ikonu ile "Sihirli Değnek" butonu
  - Loading state ile animasyonlu spinner
  - Otomatik kategori seçimi
  - Hata durumunda kullanıcıya bilgilendirme

### Gerekli Ortam Değişkeni
```env
OPENAI_API_KEY=sk-your-api-key-here
```
