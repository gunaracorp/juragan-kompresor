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

export function discountPct(price: number, oldPrice: number | null): number | null {
  if (!oldPrice || oldPrice <= price) return null
  return Math.round(((oldPrice - price) / oldPrice) * 100)
}
