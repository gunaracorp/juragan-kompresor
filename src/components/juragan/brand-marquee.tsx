'use client'

import { motion } from 'framer-motion'

const BRANDS = [
  'DAIKIN', 'PANASONIC', 'LG', 'GREE', 'MITSUBISHI', 'COPELAND', 'DANFOSS', 'BITZER',
  'GMCC', 'HIGHLY', 'TOSHIBA', 'SANYO', 'HITACHI', 'FUJITSU', 'SHARP', 'SAMSUNG',
  'KULTHORN', 'TECUMSEH', 'MIDEA', 'CHANGHONG',
]

export default function BrandMarquee() {
  const row = [...BRANDS, ...BRANDS]
  return (
    <section aria-label="Merk kompresor yang tersedia" className="border-b border-border bg-white py-6">
      <p className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        Distributor &amp; Supplier Resmi 20+ Merk Dunia
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee flex w-max items-center gap-3 px-3">
          {row.map((b, i) => (
            <motion.span
              key={`${b}-${i}`}
              whileHover={{ scale: 1.06 }}
              className="whitespace-nowrap rounded-full border border-zinc-200 bg-zinc-50 px-5 py-2 text-sm font-extrabold tracking-wide text-zinc-600 transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
            >
              {b}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}
