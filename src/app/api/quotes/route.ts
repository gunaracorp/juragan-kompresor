import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const schema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  phone: z.string().min(8, 'Nomor WhatsApp tidak valid'),
  address: z.string().min(5, 'Alamat minimal 5 karakter'),
  note: z.string().max(500).optional().nullable(),
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    qty: z.number().int().min(1).max(999),
    price: z.number().int().min(0),
  })).min(1, 'Keranjang masih kosong'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Data tidak valid' },
        { status: 400 },
      )
    }

    const { name, phone, address, note, items } = parsed.data
    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)

    const quote = await db.quoteRequest.create({
      data: {
        name,
        phone,
        address,
        note: note || null,
        items: JSON.stringify(items),
        total,
        status: 'NEW',
      },
    })

    // Buat pesan WhatsApp otomatis
    const lines = [
      `*PESANAN BARU — JURAGAN KOMPRESOR*`,
      `No. Pesanan: JK-${quote.id.slice(-8).toUpperCase()}`,
      ``,
      `*Detail Item:*`,
      ...items.map((i, idx) => `${idx + 1}. ${i.name} x${i.qty} — Rp ${new Intl.NumberFormat('id-ID').format(i.price * i.qty)}`),
      ``,
      `*Total: Rp ${new Intl.NumberFormat('id-ID').format(total)}*`,
      ``,
      `Nama: ${name}`,
      `WhatsApp: ${phone}`,
      `Alamat: ${address}`,
      note ? `Catatan: ${note}` : '',
    ].filter(Boolean)

    const waNumber = '6281234567890'
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(lines.join('\n'))}`

    return NextResponse.json({ ok: true, quoteId: `JK-${quote.id.slice(-8).toUpperCase()}`, total, waLink })
  } catch (error) {
    console.error('POST /api/quotes error:', error)
    return NextResponse.json({ error: 'Gagal mengirim pesanan. Coba lagi ya.' }, { status: 500 })
  }
}
