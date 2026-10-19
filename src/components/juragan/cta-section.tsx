'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { MessageCircle, FileText, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CtaSection() {
  const waB2B = encodeURIComponent(
    'Halo Tim B2B Juragan Kompresor! Saya ingin meminta penawaran resmi untuk kebutuhan proyek/bisnis. Berikut kebutuhan saya: ',
  )

  return (
    <section id="kontak-b2b" className="bg-white pb-16 pt-4 sm:pb-20" aria-label="Konsultasi dan penawaran B2B">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-zinc-950 via-zinc-900 to-orange-950 p-8 sm:p-12"
        >
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-orange-600/25 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-amber-500/15 blur-3xl" aria-hidden="true" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_auto]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-orange-400">
                Kontraktor · Toko AC · Hotel · Pabrik
              </span>
              <h2 className="mt-4 text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                Proyek Besar? Butuh Kompresor Langka?
                <span className="block text-orange-400">Tim B2B Kami Siap Berangkat.</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
                Penawaran resmi untuk laporan keuangan, harga khusus proyek 10+ unit, sourcing kompresor langka
                (R22 lawas, scroll industrial, semi-hermetic), sampai pendampingan teknis Engineer-to-Order.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`https://wa.me/6281234567890?text=${waB2B}`} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="h-12 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-6 font-extrabold shadow-xl shadow-orange-600/30 transition-transform hover:scale-105">
                    <MessageCircle className="mr-2 h-4 w-4" /> Minta Penawaran Resmi
                  </Button>
                </a>
                <a href="tel:+622188887777">
                  <Button size="lg" variant="outline" className="h-12 rounded-full border-zinc-700 bg-white/5 px-6 font-bold text-white hover:bg-white/10 hover:text-orange-300">
                    <Phone className="mr-2 h-4 w-4" /> (021) 8888-7777
                  </Button>
                </a>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-bold text-zinc-500">
                <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-orange-500" /> Faktur pajak resmi</span>
                <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-orange-500" /> Termin pembayaran fleksibel</span>
                <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-orange-500" /> Kontrak pasokan tahunan</span>
              </div>
            </div>

            <div className="relative mx-auto hidden w-72 lg:block">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-orange-600/40 to-transparent blur-xl" aria-hidden="true" />
              <Image
                src="/images/teknisi.png"
                alt="Teknisi AC senior Juragan Kompresor siap membantu konsultasi teknis"
                width={1344}
                height={768}
                className="relative rounded-3xl border border-white/10 object-cover shadow-2xl"
              />
              <div className="absolute -bottom-3 -left-3 rounded-2xl border border-white/10 bg-zinc-900/90 px-4 py-2.5 shadow-xl backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Respons B2B</p>
                <p className="text-sm font-extrabold text-orange-400">≤ 1 jam kerja ⚡</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
