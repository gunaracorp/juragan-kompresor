'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Clock, CalendarDays, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDateID } from '@/lib/serialize'
import type { Article } from '@/lib/types'
import SectionHeading from './section-heading'

function ArticleBody({ content }: { content: string }) {
  const blocks = content.split('\n\n')
  return (
    <div className="space-y-3.5">
      {blocks.map((b, i) => {
        const trimmed = b.trim()
        if (trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed) || trimmed.split('\n').every((l) => /^\d+\.\s|^-\s/.test(l.trim()))) {
          const isOrdered = /^\d+\.\s/.test(trimmed.split('\n')[0].trim())
          const items = trimmed.split('\n').map((l) => l.replace(/^-\s|^\d+\.\s/, '').trim())
          const ListTag = isOrdered ? 'ol' : 'ul'
          return (
            <ListTag key={i} className={`space-y-1.5 pl-1 ${isOrdered ? 'list-none' : ''}`}>
              {items.map((item, j) => (
                <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-zinc-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px] font-extrabold text-orange-700">
                    {isOrdered ? j + 1 : '•'}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ListTag>
          )
        }
        return <p key={i} className="text-sm leading-relaxed text-zinc-700">{trimmed}</p>
      })}
    </div>
  )
}

export default function ArticlesSection({ articles }: { articles: Article[] }) {
  const [open, setOpen] = useState<Article | null>(null)

  return (
    <section id="artikel" className="bg-white py-16 sm:py-20" aria-label="Artikel edukasi kompresor">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Kompresorpedia"
          title="Ilmu Kompresor, Diceritakan Manusia"
          subtitle="Konten edukasi SEO dari para praktisi: panduan memilih, perbandingan teknologi, sampai trik perawatan — supaya kamu belanja dengan kepala dingin."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <motion.article
              key={a.slug}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl hover:shadow-orange-100"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">{a.category}</Badge>
                <span className="flex items-center gap-1 text-[11px] font-bold text-zinc-400">
                  <Clock className="h-3 w-3" /> {a.readTime} mnt baca
                </span>
              </div>
              <h3 className="mt-3.5 text-base font-extrabold leading-snug text-zinc-900 transition-colors group-hover:text-orange-700">
                {a.title}
              </h3>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
              <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDateID(a.publishedAt)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(a)}
                  className="h-8 rounded-full px-3 text-xs font-extrabold text-orange-600 hover:bg-orange-50"
                >
                  <BookOpen className="mr-1.5 h-3.5 w-3.5" /> Baca
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto scrollbar-thin rounded-3xl sm:rounded-3xl">
          {open && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">{open.category}</Badge>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-zinc-400">
                    <Clock className="h-3 w-3" /> {open.readTime} menit baca
                  </span>
                </div>
                <DialogTitle asChild>
                  <h3 className="pr-6 text-left text-xl font-extrabold leading-snug text-zinc-900 sm:text-2xl">{open.title}</h3>
                </DialogTitle>
                <DialogDescription className="text-left text-sm leading-relaxed text-muted-foreground">
                  {open.excerpt}
                </DialogDescription>
              </DialogHeader>
              <ArticleBody content={open.content} />
              <div className="mt-2 rounded-2xl bg-orange-50 p-4 text-sm font-semibold text-orange-800">
                💡 Praktis, kan? Kalau masih ada pertanyaan, chat <strong>Tanya Juragan</strong> di kanan bawah — atau langsung belanja di katalog.
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
