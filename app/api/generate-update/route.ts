import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Groq API - OpenAI uyumlu
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const SYSTEM_PROMPT = `Sen profesyonel bir proje yöneticisisin. Sana verilen teknik notu, müşterinin anlayacağı, nazik ve güven verici bir dile çevir.

Kurallar:
- Teknik terimleri basitleştir ama tamamen çıkarma
- Profesyonel ve güven verici bir ton kullan
- Müşteriye değer kattığını hissettir
- Kısa ve öz ol (1-3 cümle)
- Türkçe yaz

Örnek:
Girdi: "API endpoint fixlendi, 500 hatası gitti."
Çıktı: "Sistemdeki veri akışı sorunu giderildi. Artık tüm işlemler sorunsuz çalışıyor."`;

const CATEGORY_PROMPT = `Verilen güncelleme metnini analiz et ve en uygun kategoriyi belirle.

Kategoriler:
- design: UI/UX tasarım, görsel düzenlemeler, renk, font, layout değişiklikleri
- dev: Yazılım geliştirme, bug fix, API, veritabanı, backend/frontend kodlama
- marketing: Pazarlama, SEO, içerik, sosyal medya, reklam, analitik

Sadece kategori adını döndür: design, dev veya marketing`;

export async function POST(request: NextRequest) {
  try {
    const { text, action } = await request.json();

    if (!text || text.trim().length < 3) {
      return NextResponse.json(
        { error: 'Lütfen en az 3 karakter girin' },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Groq API key yapılandırılmamış' },
        { status: 500 }
      );
    }

    // Generate customer-friendly text
    if (action === 'translate') {
      const completion = await openai.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: text },
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      const translatedText = completion.choices[0]?.message?.content?.trim();

      if (!translatedText) {
        return NextResponse.json(
          { error: 'AI yanıt üretemedi' },
          { status: 500 }
        );
      }

      return NextResponse.json({ translatedText });
    }

    // Predict category
    if (action === 'categorize') {
      const completion = await openai.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: CATEGORY_PROMPT },
          { role: 'user', content: text },
        ],
        temperature: 0.3,
        max_tokens: 20,
      });

      const category = completion.choices[0]?.message?.content?.trim().toLowerCase();

      if (!category || !['design', 'dev', 'marketing'].includes(category)) {
        return NextResponse.json({ category: 'dev' }); // Default to dev
      }

      return NextResponse.json({ category });
    }

    // Full process: translate + categorize
    const [translateResponse, categoryResponse] = await Promise.all([
      openai.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: text },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
      openai.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: CATEGORY_PROMPT },
          { role: 'user', content: text },
        ],
        temperature: 0.3,
        max_tokens: 20,
      }),
    ]);

    const translatedText = translateResponse.choices[0]?.message?.content?.trim();
    let category = categoryResponse.choices[0]?.message?.content?.trim().toLowerCase();

    if (!['design', 'dev', 'marketing'].includes(category || '')) {
      category = 'dev';
    }

    return NextResponse.json({
      translatedText: translatedText || text,
      category: category || 'dev',
    });
  } catch (error) {
    console.error('AI API Error:', error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API hatası: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Bir hata oluştu, lütfen tekrar deneyin' },
      { status: 500 }
    );
  }
}
