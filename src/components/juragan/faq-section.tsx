'use client'

import { motion } from 'framer-motion'
import { MessageCircleQuestion, HelpCircle } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { Faq } from '@/lib/types'
import SectionHeading from './section-heading'
import { useJuragan } from '@/lib/store'

export default function FaqSection({ faqs }: { faqs: Faq[] }) {
  const setChatOpen = useJuragan((s) => s.setChatOpen)

  return (
    <section id="faq" className="bg-white py-16 sm:py-20" aria-label="Pertanyaan yang sering diajukan">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="FAQ"
          title="Pertanyaan yang Sering Ditanyakan Juragan"
          subtitle="Transparan itu wajib. Kalau jawabanmu belum ada di sini, AI Tanya Juragan standby 24 jam."
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mt-10"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.id}
                value={`faq-${i}`}
                className="rounded-2xl border border-zinc-200 bg-white px-5 shadow-sm transition-colors data-[state=open]:border-orange-300 data-[state=open]:bg-orange-50/40"
              >
                <AccordionTrigger className="py-4 text-left text-sm font-extrabold text-zinc-900 hover:no-underline hover:text-orange-700 [&>svg]:text-orange-500">
                  <span className="flex items-start gap-2.5">
                    <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                    {f.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-zinc-600">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 p-6 text-center">
            <MessageCircleQuestion className="h-8 w-8 text-orange-500" />
            <p className="text-sm font-extrabold text-zinc-900">Masih ada yang bikin penasaran?</p>
            <button
              onClick={() => setChatOpen(true)}
              className="text-sm font-extrabold text-orange-600 underline decoration-orange-300 decoration-2 underline-offset-4 transition hover:text-orange-700"
            >
              Tanya langsung ke AI Tanya Juragan →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
