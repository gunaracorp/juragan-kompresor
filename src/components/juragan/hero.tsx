'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { ShieldCheck, Truck, Star, ArrowRight, MessageCircle, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useJuragan } from '@/lib/store'

function CountUp({ target, suffix = '', decimals = 0 }: { target: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1600
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(target * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target])

  return (
    <span ref={ref}>
      {val.toLocaleString('id-ID', { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}

const STATS = [
  { value: 12500, suffix: '+', label: 'Kompresor Terjual', decimals: 0 },
  { value: 31, suffix: '+', label: 'Model Ready Stok', decimals: 0 },
  { value: 4.9, suffix: '/5', label: 'Rating Pembeli', decimals: 1 },
  { value: 24, suffix: ' Jam', label: 'Kirim Se-Indonesia', decimals: 0 },
]

const FLOAT_CHIPS = [
  { icon: ShieldCheck, text: '100% Original', className: 'animate-float top-8 -left-3 sm:-left-8' },
  { icon: Truck, text: 'Same-Day Jabodetabek', className: 'animate-float-delay top-1/3 -right-3 sm:-right-6' },
  { icon: BadgeCheck, text: 'Garansi Resmi 1 Tahun', className: 'animate-float bottom-[5.5rem] left-4 [animation-delay:2.4s]' },
]

export default function Hero({ productCount }: { productCount: number }) {
  const setChatOpen = useJuragan((s) => s.setChatOpen)

  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white" aria-label="Pembuka Juragan Kompresor">
      {/* dekorasi */}
      <div className="absolute inset-0 bg-grid-dark" aria-hidden="true" />
      <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-orange-600/25 blur-[130px]" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-500/15 blur-[110px]" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-8 lg:pb-24 lg:pt-20">
        {/* Kiri: copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </span>
            DIPERCAYA {productCount > 0 ? `${productCount}+ MODEL` : 'RIBUAN'} KOMPRESOR READY STOK
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            Jantung AC Kamu, <span className="text-shine">Urusan Juragan</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base"
          >
            Jual <strong className="text-orange-300">kompresor AC original</strong> Daikin, Panasonic, LG, Gree,
            Mitsubishi, Copeland, Danfoss, Bitzer &amp; 15+ merk lain — rotary, scroll, piston, hingga inverter R32.
            Bergaransi resmi, harga juragan, dan ditemani AI ahli pendinginan 24 jam.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button
              size="lg"
              className="h-12 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-7 text-sm font-extrabold shadow-xl shadow-orange-600/30 transition-transform hover:scale-[1.04] active:scale-95"
              onClick={() => document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Belanja Kompresor <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-zinc-700 bg-white/5 px-6 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10 hover:text-orange-300"
              onClick={() => setChatOpen(true)}
            >
              <MessageCircle className="mr-2 h-4 w-4 text-orange-400" /> Konsultasi AI Gratis
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.dl
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-2xl font-extrabold text-white sm:text-3xl">
                  <CountUp target={s.value} suffix={s.suffix} decimals={s.decimals} />
                </dd>
                <dd className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Kanan: gambar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
        >
          <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-orange-600/30 via-transparent to-amber-400/20 blur-2xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-orange-950/50">
            <Image
              src="/images/hero-compressor.png"
              alt="Kompresor AC rotary original dengan pipa tembaga premium — dijual di Juragan Kompresor"
              width={1344}
              height={768}
              priority
              className="h-auto w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" aria-hidden="true" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 backdrop-blur-md">
              <div>
                <p className="text-xs font-bold text-white">Daikin JT90 1 PK R32</p>
                <p className="text-[11px] text-orange-400">Terlaris bulan ini</p>
              </div>
              <div className="flex items-center gap-1 text-sm font-extrabold">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.9
                <span className="ml-1 text-[11px] font-semibold text-zinc-400">(214)</span>
              </div>
            </div>
          </div>

          {/* Chips melayang */}
          {FLOAT_CHIPS.map((chip) => (
            <div
              key={chip.text}
              className={`absolute z-10 hidden items-center gap-2 rounded-full border border-white/15 bg-zinc-900/85 px-3.5 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md sm:flex ${chip.className}`}
            >
              <chip.icon className="h-4 w-4 text-orange-400" />
              {chip.text}
            </div>
          ))}
        </motion.div>
      </div>

      {/* garis gradien bawah */}
      <div className="relative h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" aria-hidden="true" />
    </section>
  )
}
