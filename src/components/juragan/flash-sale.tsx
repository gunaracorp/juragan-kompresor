'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Flame, ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatIDR, discountPct } from '@/lib/serialize'
import type { Product } from '@/lib/types'
import { useJuragan } from '@/lib/store'

function useCountdown(target: string | null) {
  // Mulai dari null supaya render awal server & client identik
  // (Date.now() di render awal menyebabkan hydration mismatch pada detik).
  // Nilai asli diisi via rAF/interval callback, bukan sinkron di body effect.
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setNow(Date.now()))
    if (!target) return () => cancelAnimationFrame(raf)
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(id)
    }
  }, [target])
  return useMemo(() => {
    if (!target || now === null) return null
    const diff = Math.max(0, new Date(target).getTime() - now)
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    return { h, m, s, done: diff <= 0 }
  }, [now, target])
}

export default function FlashSale({ product }: { product: Product | null }) {
  const addToCart = useJuragan((s) => s.addToCart)
  const setDetailSlug = useJuragan((s) => s.setDetailSlug)
  const countdown = useCountdown(product?.saleEndsAt ?? null)

  if (!product) return null
  const disc = discountPct(product.price, product.oldPrice) ?? 0
  const soldPct = Math.min(92, Math.max(35, Math.round((product.soldCount / (product.soldCount + product.stock)) * 100)))
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <section id="flash-sale" className="bg-gradient-to-r from-orange-700 via-orange-600 to-amber-500 py-10" aria-label="Flash sale hari ini">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid items-center gap-6 rounded-3xl bg-zinc-950/90 p-6 text-white backdrop-blur sm:p-8 lg:grid-cols-[auto_1fr_auto] lg:gap-8"
        >
          {/* Gambar */}
          <button onClick={() => setDetailSlug(product.slug)} className="relative mx-auto h-40 w-40 shrink-0 overflow-hidden rounded-2xl bg-white p-2 shadow-xl sm:h-44 sm:w-44" aria-label={`Lihat ${product.name}`}>
            <Image src={product.image} alt={product.name} fill className="object-contain p-2" sizes="176px" />
            <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-[10px] font-extrabold">
              <Flame className="h-3 w-3 fill-yellow-300 text-yellow-300" /> -{disc}%
            </span>
          </button>

          {/* Info */}
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-red-400">
              <Flame className="h-3.5 w-3.5 fill-red-500 text-red-500" /> Flash Sale Hari Ini
            </p>
            <h3 className="mt-2 line-clamp-2 text-lg font-extrabold leading-snug sm:text-xl">{product.name}</h3>
            <div className="mt-2 flex flex-wrap items-baseline justify-center gap-2 lg:justify-start">
              <span className="text-2xl font-extrabold text-orange-400 sm:text-3xl">{formatIDR(product.price)}</span>
              {product.oldPrice && <span className="text-sm font-semibold text-zinc-500 line-through">{formatIDR(product.oldPrice)}</span>}
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                <Star className="h-3.5 w-3.5 fill-amber-400" /> {product.rating.toFixed(1)} · {product.soldCount.toLocaleString('id-ID')} terjual
              </span>
            </div>
            {/* Progress terjual */}
            <div className="mx-auto mt-4 max-w-sm lg:mx-0">
              <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${soldPct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400"
                />
              </div>
              <p className="mt-1.5 text-[11px] font-bold text-zinc-400">🔥 {soldPct}% tercabut — sisa {product.stock} unit!</p>
            </div>
          </div>

          {/* Countdown + CTA */}
          <div className="flex flex-col items-center gap-3">
            {countdown && !countdown.done && (
              <div aria-label={`Berakhir dalam ${countdown.h} jam ${countdown.m} menit`}>
                <p className="mb-1.5 text-center text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Berakhir dalam</p>
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  {[
                    { v: pad(countdown.h), l: 'JAM' },
                    { v: pad(countdown.m), l: 'MNT' },
                    { v: pad(countdown.s), l: 'DTK' },
                  ].map((t, i) => (
                    <div key={t.l} className="flex items-center gap-1.5">
                      <div className="flex flex-col items-center">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-extrabold text-zinc-900 shadow-lg tabular-nums">{t.v}</span>
                        <span className="mt-1 text-[9px] font-bold text-zinc-500">{t.l}</span>
                      </div>
                      {i < 2 && <span className="pb-4 text-lg font-extrabold text-orange-500">:</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="h-12 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-7 font-extrabold shadow-xl shadow-orange-600/30 transition-transform hover:scale-105 active:scale-95"
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Amankan Sekarang
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
