'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Truck, BadgePercent, Wrench, Sparkles, PackageCheck } from 'lucide-react'
import SectionHeading from './section-heading'

const USPS = [
  {
    icon: ShieldCheck,
    title: '100% Original & Bergaransi',
    desc: 'Segel resmi distributor, nomor seri terverifikasi, garansi 1 tahun penuh. Tidak original = uang kembali 100%.',
  },
  {
    icon: Truck,
    title: 'Kirim Same-Day',
    desc: 'Order sebelum jam 15.00, kompresor meluncur hari itu juga ke se-Jabodetabek. Luar pulau 2–4 hari, asuransi penuh.',
  },
  {
    icon: BadgePercent,
    title: 'Harga Grosir Teknisi',
    desc: 'Beli 3+ unit diskon 4%, 5+ unit diskon 8%. Proyek besar? Minta Penawaran resmi dari tim B2B kami.',
  },
  {
    icon: Wrench,
    title: 'Konsultasi Teknisi 15+ Tahun',
    desc: 'Bingung pilih? Teknisi senior kami siap bantu via WhatsApp — gratis, tanpa syarat beli.',
  },
  {
    icon: Sparkles,
    title: 'AI Tanya Juragan 24 Jam',
    desc: 'Satu-satunya toko kompresor dengan asisten AI: tanya spek, cocok-kocok model AC, atau minta rekomendasi kapan saja.',
  },
  {
    icon: PackageCheck,
    title: 'Packing Anti-Cacat',
    desc: 'Bubble wrap tebal + double box, opsi packing kayu untuk unit scroll & industrial. Sampai dengan aman.',
  },
]

export default function UspSection() {
  return (
    <section id="keunggulan" className="bg-dots py-16 sm:py-20" aria-label="Keunggulan Juragan Kompresor">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Kenapa Juragan?"
          title="6 Alasan Teknisi &amp; Pemilik Rumah Balik Lagi"
          subtitle="Fitur terbaik dari 20 toko kompresor terkemuka di dunia, kami distilasi jadi satu pengalaman belanja yang benar-benar berbeda."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {USPS.map((u, i) => (
            <motion.article
              key={u.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-orange-100"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-50 transition-transform duration-500 group-hover:scale-[2.5]" aria-hidden="true" />
              <div className="relative">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25">
                  <u.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-zinc-900">{u.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{u.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
