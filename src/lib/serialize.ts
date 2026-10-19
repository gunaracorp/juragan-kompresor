import { Product as DbProduct, Article as DbArticle } from '@prisma/client'
import type { Product, Article, TierPrice } from './types'

export function serializeProduct(p: DbProduct): Product {
  return {
    ...p,
    saleEndsAt: p.saleEndsAt ? p.saleEndsAt.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    features: safeParse<string[]>(p.features, []),
    compatible: safeParse<string[]>(p.compatible, []),
    tierPrices: safeParse<TierPrice[]>(p.tierPrices, [{ minQty: 1, price: p.price }]),
  }
}

export function serializeArticle(a: DbArticle): Article {
  return { ...a, publishedAt: a.publishedAt.toISOString() }
}

function safeParse<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function formatIDR(value: number): string {
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(value)
}

const BULAN_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
] as const

/**
 * Format tanggal deterministik dalam WIB (UTC+7) — aman SSR + hydrate.
 * Parsing ISO ber-Z bersifat spec-defined (identik di semua runtime),
 * lalu offset +7 jam dihitung aritmetika, tanpa timezone lokal/ICU.
 * Hasil server & client selalu identik.
 */
export function formatDateID(iso: string): string {
  const epoch = Date.parse(iso)
  if (Number.isNaN(epoch)) return iso
  const [y, m, d] = new Date(epoch + 7 * 3600 * 1000).toISOString().slice(0, 10).split('-').map(Number)
  if (!y || !m || !d) return iso
  return `${d} ${BULAN_ID[m - 1]} ${y}`
}

export function discountPct(price: number, oldPrice: number | null): number | null {
  if (!oldPrice || oldPrice <= price) return null
  return Math.round(((oldPrice - price) / oldPrice) * 100)
}
