'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Star, Minus, Plus, ShoppingCart, MessageCircle, ShieldCheck, Package, Gauge, Snowflake, Zap, BadgeCheck, CheckCircle2 } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatIDR, discountPct } from '@/lib/serialize'
import { TYPE_LABEL, CATEGORY_LABEL } from '@/lib/types'
import type { Product } from '@/lib/types'
import { useJuragan, tierPriceFor } from '@/lib/store'

export default function ProductDetailSheet({ products }: { products: Product[] }) {
  const detailSlug = useJuragan((s) => s.detailSlug)
  const setDetailSlug = useJuragan((s) => s.setDetailSlug)
  const addToCart = useJuragan((s) => s.addToCart)
  const [qty, setQty] = useState(1)

  const product = useMemo(
    () => products.find((p) => p.slug === detailSlug) ?? null,
    [products, detailSlug],
  )

  const unitPrice = product ? tierPriceFor(qty, product.tierPrices) : 0
  const disc = product ? discountPct(product.price, product.oldPrice) : null

  const close = () => {
    setDetailSlug(null)
    setQty(1)
  }

  const waText = product
    ? encodeURIComponent(`Halo Juragan! Saya tertarik dengan ${product.name} (${product.modelCode}). Apakah ready dan berapa harga terbaiknya?`)
    : ''

  return (
    <Sheet open={!!product} onOpenChange={(open) => !open && close()}>
      <SheetContent side="right" className="w-full overflow-y-auto scrollbar-thin sm:max-w-xl sm:rounded-l-3xl p-0">
        {product && (
          <div className="flex h-full flex-col">
            <SheetHeader className="p-0">
              <div className="relative">
                <div className="absolute left-4 top-4 z-10 flex gap-1.5">
                  {product.badge && (
                    <Badge className="bg-gradient-to-r from-orange-600 to-amber-500 font-extrabold text-white shadow">
                      {product.badge.toUpperCase()}
                    </Badge>
                  )}
                  {disc && <Badge className="bg-red-500 font-extrabold text-white">-{disc}%</Badge>}
                </div>
                <div className="relative aspect-square w-full bg-gradient-to-b from-zinc-50 to-orange-50/50 p-6">
                  <Image
                    src={product.image}
                    alt={`${product.name} — spesifikasi lengkap`}
                    fill
                    className="object-contain p-6"
                    sizes="(max-width: 640px) 100vw, 576px"
                  />
                </div>
              </div>
              <div className="px-5 pb-2 pt-4">
                <SheetDescription className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
                  {product.brand} · {TYPE_LABEL[product.type]} · {CATEGORY_LABEL[product.category]}
                </SheetDescription>
                <SheetTitle asChild>
                  <h3 className="mt-1 pr-6 text-lg font-extrabold leading-snug text-zinc-900">{product.name}</h3>
                </SheetTitle>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span className="flex items-center gap-1 font-bold text-amber-600">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> {product.rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">{product.reviews} ulasan</span>
                  <span className="text-muted-foreground">· {product.soldCount.toLocaleString('id-ID')} terjual</span>
                  <span className="flex items-center gap-1 font-bold text-emerald-600">
                    <ShieldCheck className="h-3.5 w-3.5" /> {product.warranty}
                  </span>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto scrollbar-thin px-5 pb-4">
              {/* Harga */}
              <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-4">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-extrabold text-orange-600">{formatIDR(unitPrice)}</span>
                  {product.oldPrice && qty === 1 && (
                    <span className="text-sm font-semibold text-zinc-400 line-through">{formatIDR(product.oldPrice)}</span>
                  )}
                </div>
                {qty > 1 && unitPrice < product.price && (
                  <p className="mt-1 text-xs font-extrabold text-emerald-600">
                    Harga grosir aktif! Hemat {formatIDR((product.price - unitPrice) * qty)}
                  </p>
                )}
                {/* Tier pricing */}
                {product.tierPrices.length > 1 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.tierPrices.map((t) => (
                      <span
                        key={t.minQty}
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                          qty >= t.minQty
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-zinc-200 bg-white text-zinc-500'
                        }`}
                      >
                        {t.minQty}+ unit: {formatIDR(t.price)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Spesifikasi */}
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {[
                  { icon: Gauge, label: 'Kapasitas', value: `${product.capacity} PK` },
                  { icon: Snowflake, label: 'Refrigerant', value: product.refrigerant },
                  { icon: Zap, label: 'Tegangan', value: product.voltage },
                  { icon: Package, label: 'Kode Model', value: product.modelCode },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white p-3">
                    <s.icon className="h-4 w-4 shrink-0 text-orange-500" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{s.label}</p>
                      <p className="truncate text-xs font-extrabold text-zinc-800">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stok */}
              <div className="mt-4 flex items-center gap-2 text-sm">
                <BadgeCheck className={`h-4 w-4 ${product.stock > 0 ? 'text-emerald-500' : 'text-red-400'}`} />
                {product.stock > 0 ? (
                  <p className="font-bold text-emerald-600">Ready stok {product.stock} unit — kirim hari ini!</p>
                ) : (
                  <p className="font-bold text-red-500">Stok habis — po dulu yuk, chat teknisi.</p>
                )}
              </div>

              {/* Deskripsi */}
              <p className="mt-4 text-sm leading-relaxed text-zinc-600">{product.description}</p>

              {/* Fitur */}
              <h4 className="mt-5 text-sm font-extrabold text-zinc-900">Keunggulan Produk</h4>
              <ul className="mt-2 space-y-1.5">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" /> {f}
                  </li>
                ))}
              </ul>

              {/* Kompatibilitas */}
              <h4 className="mt-5 text-sm font-extrabold text-zinc-900">Cocok Untuk Model AC</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.compatible.map((c) => (
                  <span key={c} className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                    {c}
                  </span>
                ))}
              </div>
              <Separator className="my-5" />
            </div>

            {/* Footer aksi */}
            <div className="sticky bottom-0 border-t border-zinc-100 bg-white/95 p-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl border border-zinc-200">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-l-xl" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Kurangi jumlah">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center text-sm font-extrabold" aria-live="polite">{qty}</span>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-r-xl" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Tambah jumlah">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  className="h-10 flex-1 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 font-extrabold text-white shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.02] active:scale-95"
                  disabled={product.stock === 0}
                  onClick={() => { addToCart(product, qty) }}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> Keranjang — {formatIDR(unitPrice * qty)}
                </Button>
                <a
                  href={`https://wa.me/6281234567890?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md transition hover:bg-emerald-600"
                  aria-label="Chat teknisi via WhatsApp"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
