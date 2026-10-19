import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import ZAI from 'z-ai-web-dev-sdk'
import { db } from '@/lib/db'
import { serializeProduct } from '@/lib/serialize'
import type { Product } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SYMPTOMS = [
  'tidak-dingin', 'mcb-jatuh', 'suara-berisik', 'outdoor-panas',
  'bau-gosong', 'pipa-beku', 'on-off-sendiri', 'umur-tua',
] as const

const schema = z.object({
  symptoms: z.array(z.enum(SYMPTOMS)).min(1, 'Pilih minimal 1 gejala'),
  brand: z.string().max(60).optional().nullable(),
  model: z.string().max(60).optional().nullable(),
  capacity: z.number().min(0.3).max(30).optional().nullable(),
})

interface AiDiagnosis {
  severity: 'RINGAN' | 'SEDANG' | 'BERAT'
  diagnosis: string
  action: string[]
  suggestedPk: number | null
  suggestedType: 'ROTARY' | 'SCROLL' | 'PISTON' | 'INVERTER' | null
  suggestedRefrigerant: string | null
}

function pickProducts(pk: number | null, type: string | null, refrigerant: string | null): Promise<Product[]> {
  const conds = []
  if (pk) conds.push({ capacity: { gte: Math.max(pk - 0.25, 0.3), lte: pk + 0.25 } })
  if (type) conds.push({ type })
  if (refrigerant) conds.push({ refrigerant })

  const tryWhere = async (where: Parameters<typeof db.product.findMany>[0] extends never ? never : { AND: unknown[] }) => {
    const rows = await db.product.findMany({ where: where as never, orderBy: { soldCount: 'desc' }, take: 3 })
    return rows.map(serializeProduct)
  }

  return (async () => {
    if (conds.length) {
      const rows = await tryWhere({ AND: conds })
      if (rows.length) return rows
    }
    const fallbackWhere = pk ? [{ capacity: { gte: Math.max(pk - 0.5, 0.3), lte: pk + 0.5 } }] : []
    if (fallbackWhere.length) {
      const rows = await tryWhere({ AND: fallbackWhere })
      if (rows.length) return rows
    }
    const featured = await db.product.findMany({ where: { isFeatured: true }, orderBy: { soldCount: 'desc' }, take: 3 })
    return featured.map(serializeProduct)
  })()
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Data tidak valid' }, { status: 400 })
    }

    const { symptoms, brand, model, capacity } = parsed.data
    const symptomText: Record<string, string> = {
      'tidak-dingin': 'AC menyala tapi tidak dingin / dingin lemah',
      'mcb-jatuh': 'MCB/pl/listrik sering jatuh saat AC menyala',
      'suara-berisik': 'Suara kompresor berisik, gemuruh, atau bergetar hebat',
      'outdoor-panas': 'Outdoor unit panas luar biasa tapi tidak ada angin panas dari kondensor',
      'bau-gosong': 'Timbul bau gosong di area outdoor unit',
      'pipa-beku': 'Pipa suction berembun parah atau membeku',
      'on-off-sendiri': 'AC mati nyala sendiri (proteksi overload sering aktif)',
      'umur-tua': 'Umur AC sudah lebih dari 6-10 tahun',
    }
    const symptomList = symptoms.map(s => `- ${symptomText[s] ?? s}`).join('\n')

    let ai: AiDiagnosis | null = null
    try {
      const zai = await ZAI.create()
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'assistant',
            content: `Kamu adalah master teknisi kompresor AC dengan 150 tahun pengalaman gabungan dari 46 dewan pakar pendinginan Indonesia. Tugasmu menganalisis gejala kerusakan kompresor AC dan memberikan diagnosa.

GEJALA YANG DILAPORKAN:
${symptomList}
Merk AC (opsional): ${brand || 'tidak disebutkan'}
Model AC (opsional): ${model || 'tidak disebutkan'}
Kapasitas AC (opsional, PK): ${capacity || 'tidak disebutkan'}

Balas HANYA dengan JSON valid (tanpa markdown, tanpa teks lain) dengan struktur:
{
  "severity": "RINGAN" | "SEDANG" | "BERAT",
  "diagnosis": "penjelasan diagnosa 2-3 kalimat bahasa Indonesia yang mudah dipahami orang awam",
  "action": ["langkah tindakan 1", "langkah tindakan 2", "langkah tindakan 3"],
  "suggestedPk": angka PK perkiraan (contoh: 1, 1.5, 2) atau null jika tidak yakin,
  "suggestedType": "ROTARY" | "SCROLL" | "PISTON" | "INVERTER" | null,
  "suggestedRefrigerant": "R32" | "R410A" | "R22" | null
}`,
          },
          { role: 'user', content: `Diagnosa gejala berikut untuk AC ${brand || ''} ${model || ''}`.trim() },
        ],
        thinking: { type: 'disabled' },
      })

      const raw = completion.choices[0]?.message?.content ?? ''
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        ai = JSON.parse(jsonMatch[0]) as AiDiagnosis
      }
    } catch (aiError) {
      console.error('AI diagnose fallback:', aiError)
    }

    // Fallback rule-based jika AI gagal
    if (!ai) {
      const critical = symptoms.some(s => ['mcb-jatuh', 'bau-gosong'].includes(s))
      ai = {
        severity: critical ? 'BERAT' : symptoms.length >= 3 ? 'SEDANG' : 'SEDANG',
        diagnosis: `Berdasarkan ${symptoms.length} gejala yang dilaporkan, kemungkinan besar kompresor AC kamu mengalami penurunan performa atau kerusakan komponen internal. ${critical ? 'Ada gejala kritis (listrik jatuh/bau gosong) — matikan AC dari listrik sekarang untuk mencegah kerusakan lebih parah.' : 'Sebaiknya segera lakukan pemeriksaan oleh teknisi sebelum kerusakan menyebar ke komponen lain.'}`,
        action: [
          'Matikan AC dan cabut dari listrik jika ada gejala kritis',
          'Panggil teknisi untuk ukur arus (ampere) dan tekanan refrigerant',
          'Cek apakah masih dalam masa layak perbaikan atau lebih baik ganti kompresor',
        ],
        suggestedPk: capacity ?? null,
        suggestedType: capacity && capacity <= 2 ? 'ROTARY' : capacity && capacity >= 3 ? 'SCROLL' : null,
        suggestedRefrigerant: null,
      }
    }

    const products = await pickProducts(ai.suggestedPk, ai.suggestedType, ai.suggestedRefrigerant)

    return NextResponse.json({
      severity: ai.severity,
      diagnosis: ai.diagnosis,
      action: ai.action,
      suggestedPk: ai.suggestedPk,
      suggestedType: ai.suggestedType,
      suggestedRefrigerant: ai.suggestedRefrigerant,
      products,
    })
  } catch (error) {
    console.error('POST /api/diagnose error:', error)
    return NextResponse.json({ error: 'Gagal menganalisis. Coba lagi ya.' }, { status: 500 })
  }
}
