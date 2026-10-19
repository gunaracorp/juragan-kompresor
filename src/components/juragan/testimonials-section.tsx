'use client'

import { motion } from 'framer-motion'
import { Star, Quote, MapPin } from 'lucide-react'
import type { Testimonial } from '@/lib/types'
import SectionHeading from './section-heading'

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section id="testimoni" className="bg-dots py-16 sm:py-20" aria-label="Testimoni pembeli">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Kata Mereka"
          title="Teknisi &amp; Pemilik Rumah Sudah Membuktikan"
          subtitle="4.9/5 rata-rata dari ribuan ulasan. Ini sebagian cerita nyata dari lapangan."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="relative flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <Quote className="absolute right-5 top-5 h-8 w-8 text-orange-100" aria-hidden="true" />
              <div className="flex gap-0.5" aria-label={`Rating ${t.rating} dari 5 bintang`}>
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600">&ldquo;{t.message}&rdquo;</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-zinc-100 pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-sm font-extrabold text-white">
                  {t.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </span>
                <div>
                  <p className="text-sm font-extrabold text-zinc-900">{t.name}</p>
                  <p className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                    {t.role} · <MapPin className="h-3 w-3" /> {t.city}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
