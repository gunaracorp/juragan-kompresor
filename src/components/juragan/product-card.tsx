'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, ShoppingCart, GitCompareArrows, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatIDR, discountPct } from '@/lib/serialize'
import { TYPE_LABEL } from '@/lib/types'
import type { Product } from '@/lib/types'
import { useJuragan } from '@/lib/store'

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const addToCart = useJuragan((s) => s.addToCart)
  const toggleCompare = useJuragan((s) => s.toggleCompare)
  const compare = useJuragan((s) => s.compare)
  const setDetailSlug = useJuragan((s) => s.setDetailSlug)

  const disc = discountPct(product.price, product.oldPrice)
  const inCompare = compare.includes(product.slug)
  const topTier = product.tierPrices.length > 1 ? product.tierPrices[product.tierPrices.length - 1] : null

  const stockPct = Math.min(100, Math.round((product.stock / 60) * 100))

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: Math.min(index % 8, 4) * 0.05 }}
      whileHover={{ y: -5 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-orange-100"
    >
      {/* Badge & diskon */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        {product.badge && (
          <Badge className="bg-gradient-to-r from-orange-600 to-amber-500 text-[10px] font-extrabold text-white shadow">
            {product.badge.toUpperCase()}
          </Badge>
        )}
      </div>
      {disc && (
        <div className="absolute right-3 top-3 z-10 rounded-full bg-red-500 px-2 py-1 text-[10px] font-extrabold text-white shadow">
          -{disc}%
        </div>
      )}

      {/* Gambar */}
      <button
        onClick={() => setDetailSlug(product.slug)}
        className="relative block aspect-square w-full cursor-pointer overflow-hidden bg-gradient-to-b from-zinc-50 to-orange-50/40 p-4"
        aria-label={`Lihat detail ${product.name}`}
      >
        <Image
          src={product.image}
          alt={`${product.name} — kompresor AC ${product.brand} ${product.capacity} PK`}
          width={480}
          height={480}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </button>

      {/* Konten */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600">{product.brand}</span>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600">
            {TYPE_LABEL[product.type] ?? product.type} · {product.capacity} PK
          </span>
        </div>

        <button
          onClick={() => setDetailSlug(product.slug)}
          className="text-left text-sm font-bold leading-snug text-zinc-900 transition-colors hover:text-orange-700 line-clamp-2"
        >
          {product.name}
        </button>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="flex items-center gap-0.5 font-bold text-amber-600">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {product.rating.toFixed(1)}
          </span>
          <span className="text-muted-foreground">· {product.soldCount.toLocaleString('id-ID')} terjual</span>
        </div>

        {/* Harga */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-orange-600">{formatIDR(product.price)}</span>
            {product.oldPrice && (
              <span className="text-xs font-semibold text-zinc-400 line-through">{formatIDR(product.oldPrice)}</span>
            )}
          </div>
          {topTier && topTier.price < product.price && (
            <p className="mt-0.5 text-[11px] font-semibold text-emerald-600">
              Grosir {topTier.minQty}+ unit: {formatIDR(topTier.price)}
            </p>
          )}

          {/* Stok */}
          <div className="mt-2">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
              <div
                className={`h-full rounded-full transition-all ${stockPct > 25 ? 'bg-emerald-500' : 'bg-red-400'}`}
                style={{ width: `${Math.max(stockPct, 6)}%` }}
              />
            </div>
            <p className={`mt-1 text-[11px] font-bold ${stockPct > 25 ? 'text-emerald-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `Stok ${product.stock} unit — cepat!` : 'Stok Habis'}
            </p>
          </div>
        </div>

        {/* Aksi */}
        <div className="mt-2 flex items-center gap-2">
          <Button
            size="sm"
            className="h-9 flex-1 rounded-xl bg-zinc-900 text-xs font-bold text-white transition hover:bg-orange-600"
            disabled={product.stock === 0}
            onClick={() => addToCart(product)}
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            <ShoppingCart className="mr-1.5 h-3.5 w-3.5" /> Tambah
          </Button>
          <Button
            size="icon"
            variant="outline"
            className={`h-9 w-9 shrink-0 rounded-xl transition ${inCompare ? 'border-orange-500 bg-orange-50 text-orange-600' : 'text-zinc-500 hover:text-orange-600'}`}
            onClick={() => toggleCompare(product.slug)}
            aria-label={inCompare ? 'Hapus dari pembanding' : 'Tambahkan ke pembanding'}
            aria-pressed={inCompare}
          >
            {inCompare ? <Check className="h-4 w-4" /> : <GitCompareArrows className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </motion.article>
  )
}
