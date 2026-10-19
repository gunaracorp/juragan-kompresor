import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import ZAI from 'z-ai-web-dev-sdk'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const schema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(2000),
  })).min(1).max(12),
})

async function buildCatalogContext() {
  const products = await db.product.findMany({
    orderBy: { soldCount: 'desc' },
    take: 31,
  })
  return products.map(p =>
    `- ${p.name} | ${p.brand} | ${p.capacity} PK | ${p.refrigerant} | ${p.type} | Rp ${new Intl.NumberFormat('id-ID').format(p.price)} | stok ${p.stock} | slug: ${p.slug}`
  ).join('\n')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Pesan tidak valid' }, { status: 400 })
    }

    const catalog = await buildCatalogContext()
    const systemPrompt = `Kamu adalah "Tanya Juragan", asisten AI ahli kompresor AC dari toko JURAGAN KOMPRESOR — toko kompresor AC #1 di Indonesia. Kamu dikuasai 46 dewan pakar pendinginan dengan pengalaman gabungan puluhan tahun.

ATURAN WAJIB:
1. Jawab SELALU dalam Bahasa Indonesia yang ramah, santai tapi profesional. Panggil user "Juragan".
2. Jawab ringkas padat (maksimal 180 kata), gunakan bullet/angka kalau perlu.
3. Jika user bertanya soal produk, rekomendasikan dari katalog berikut dan sebutkan nama produk + harganya:
${catalog}
4. Jika user menyebut gejala kerusakan (AC tidak dingin, MCB jatuh, suara berisik, dll), bantu diagnosa ringkas dan sarankan fitur "Diagnosa Kompresor" di website untuk analisis lengkap.
5. Jika ditanya hal di luar kompresor/AC/pendinginan, arahkan sopan kembali ke topik kompresor.
6. Jangan pernah mengarang produk yang tidak ada di katalog. Jika stok kosong atau tidak cocok, sarankan konsultasi teknisi via WhatsApp.
7. Tutup jawaban yang relevan dengan CTA singkat, misal: "Mau aku bantu carikan yang paling cocok, Juragan?" atau "Siap kirim same-day Jabodetabek!".`

    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        ...parsed.data.messages,
      ],
      thinking: { type: 'disabled' },
    })

    const reply = completion.choices[0]?.message?.content
    if (!reply || !reply.trim()) {
      throw new Error('Respon AI kosong')
    }

    return NextResponse.json({ reply: reply.trim() })
  } catch (error) {
    console.error('POST /api/chat error:', error)
    return NextResponse.json(
      { error: 'Waduh, Juragan AI-nya lagi istirahat. Coba lagi sebentar ya!' },
      { status: 500 },
    )
  }
}
