import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeProduct } from '@/lib/serialize'
import type { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams
    const search = sp.get('search')?.trim() || ''
    const brand = sp.get('brand') || ''
    const type = sp.get('type') || ''
    const refrigerant = sp.get('refrigerant') || ''
    const category = sp.get('category') || ''
    const minPk = sp.get('minPk') ? Number(sp.get('minPk')) : null
    const maxPk = sp.get('maxPk') ? Number(sp.get('maxPk')) : null
    const minPrice = sp.get('minPrice') ? Number(sp.get('minPrice')) : null
    const maxPrice = sp.get('maxPrice') ? Number(sp.get('maxPrice')) : null
    const sort = sp.get('sort') || 'populer'
    const limit = Math.min(Number(sp.get('limit')) || 60, 100)

    const where: Prisma.ProductWhereInput = {}
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { modelCode: { contains: search } },
        { compatible: { contains: search } },
        { description: { contains: search } },
      ]
    }
    if (brand) where.brand = brand
    if (type) where.type = type
    if (refrigerant) where.refrigerant = refrigerant
    if (category) where.category = category
    if (minPk !== null || maxPk !== null) {
      where.capacity = {}
      if (minPk !== null && !Number.isNaN(minPk)) (where.capacity as Prisma.FloatFilter).gte = minPk
      if (maxPk !== null && !Number.isNaN(maxPk)) (where.capacity as Prisma.FloatFilter).lte = maxPk
    }
    if (minPrice !== null || maxPrice !== null) {
      where.price = {}
      if (minPrice !== null && !Number.isNaN(minPrice)) (where.price as Prisma.IntFilter).gte = minPrice
      if (maxPrice !== null && !Number.isNaN(maxPrice)) (where.price as Prisma.IntFilter).lte = maxPrice
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === 'termurah' ? { price: 'asc' } :
      sort === 'termahal' ? { price: 'desc' } :
      sort === 'rating' ? { rating: 'desc' } :
      sort === 'terbaru' ? { createdAt: 'desc' } :
      { soldCount: 'desc' }

    const products = await db.product.findMany({ where, orderBy, take: limit })
    const total = await db.product.count({ where })

    return NextResponse.json({ products: products.map(serializeProduct), total })
  } catch (error) {
    console.error('GET /api/products error:', error)
    return NextResponse.json({ error: 'Gagal memuat produk' }, { status: 500 })
  }
}
