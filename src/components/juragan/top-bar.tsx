'use client'

import { motion } from 'framer-motion'
import { Zap, ShieldCheck, Truck, Sparkles } from 'lucide-react'

export default function TopBar() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-orange-700 via-orange-600 to-amber-500 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-[11px] sm:text-xs font-semibold">
        <motion.span
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <Zap className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
        </motion.span>
        <span className="hidden sm:inline truncate">
          FLASH SALE HARI INI — Diskon s.d 25% + Gratis Ongkir se-Jabodetabek
        </span>
        <span className="sm:hidden truncate">FLASH SALE — Diskon s.d 25%!</span>
        <span className="hidden md:inline-flex items-center gap-1 text-orange-100">
          <ShieldCheck className="h-3.5 w-3.5" /> 100% Original
          <Truck className="ml-2 h-3.5 w-3.5" /> Kirim Hari Ini
          <Sparkles className="ml-2 h-3.5 w-3.5" /> Garansi 1 Tahun
        </span>
      </div>
    </div>
  )
}
