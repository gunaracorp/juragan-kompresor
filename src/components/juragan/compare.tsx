'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { X, GitCompareArrows, ShoppingCart, Trophy, Star } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { formatIDR } from '@/lib/serialize'
import { TYPE_LABEL, CATEGORY_LABEL } from '@/lib/types'
import type { Product } from '@/lib/types'
import { useJuragan } from '@/lib/store'

export function CompareBar({ products }: { products: Product[] }) {
  const compare = useJuragan((s) => s.compare)
  const toggleCompare = useJuragan((s) => s.toggleCompare)
  const setCompareOpen = useJuragan((s) => s.setCompareOpen)
  const compareOpen = useJuragan((s) => s.compareOpen)

  if (compare.length === 0 || compareOpen) return null
  const items = compare.map((slug) => products.find((p) => p.slug === slug)).filter(Boolean) as Product[]

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white/95 p-3 shadow-2xl backdrop-blur-xl">
        <div className="flex -space-x-2">
          {items.map((p) => (
            <div key={p.slug} className="relative h-10 w-10 overflow-hidden rounded-xl border-2 border-white bg-zinc-50 shadow">
              <Image src={p.image} alt={p.name} fill className="object-contain p-0.5" sizes="40px" />
              <button
                onClick={() => toggleCompare(p.slug)}
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white"
                aria-label={`Hapus ${p.name} dari perbandingan`}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-extrabold text-zinc-900">{compare.length}/4 produk dipilih</p>
          <p className="truncate text-[11px] text-muted-foreground">{items[0]?.name}</p>
        </div>
        <Button
          size="sm"
          disabled={compare.length < 2}
          onClick={() => setCompareOpen(true)}
          className="h-9 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-4 text-xs font-extrabold text-white disabled:opacity-50"
        >
          <GitCompareArrows className="mr-1 h-3.5 w-3.5" /> Bandingkan
        </Button>
      </div>
    </motion.div>
  )
}

export function CompareSheet({ products }: { products: Product[] }) {
  const compareOpen = useJuragan((s) => s.compareOpen)
  const setCompareOpen = useJuragan((s) => s.setCompareOpen)
  const compare = useJuragan((s) => s.compare)
  const toggleCompare = useJuragan((s) => s.toggleCompare)
  const clearCompare = useJuragan((s) => s.clearCompare)
  const addToCart = useJuragan((s) => s.addToCart)
  const setDetailSlug = useJuragan((s) => s.setDetailSlug)

  const items = compare.map((slug) => products.find((p) => p.slug === slug)).filter(Boolean) as Product[]
  const cheapest = items.length ? Math.min(...items.map((p) => p.price)) : 0

  const rows: Array<{ label: string; render: (p: Product) => React.ReactNode }> = [
    { label: 'Harga', render: (p) => (
      <span className={`font-extrabold ${p.price === cheapest ? 'text-orange-600' : 'text-zinc-900'}`}>
        {formatIDR(p.price)}
        {p.price === cheapest && (
          <span className="ml-1.5 inline-flex items-center gap-0.5 rounded-full bg-orange-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-orange-700">
            <Trophy className="h-2.5 w-2.5" /> Termurah
          </span>
        )}
      </span>
    )},
    { label: 'Kapasitas', render: (p) => `${p.capacity} PK` },
    { label: 'Tipe', render: (p) => TYPE_LABEL[p.type] ?? p.type },
    { label: 'Refrigerant', render: (p) => p.refrigerant },
    { label: 'Tegangan', render: (p) => p.voltage },
    { label: 'Kategori', render: (p) => CATEGORY_LABEL[p.category] ?? p.category },
    { label: 'Stok', render: (p) => (p.stock > 0 ? <span className="font-bold text-emerald-600">{p.stock} unit</span> : <span className="font-bold text-red-500">Habis</span>) },
    { label: 'Rating', render: (p) => (
      <span className="inline-flex items-center gap-1 font-bold text-amber-600">
        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {p.rating.toFixed(1)} ({p.reviews})
      </span>
    )},
    { label: 'Garansi', render: (p) => p.warranty },
    { label: 'Kode Model', render: (p) => <span className="font-mono text-xs">{p.modelCode}</span> },
  ]

  return (
    <Sheet open={compareOpen} onOpenChange={setCompareOpen}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-zinc-100 px-5 py-4">
            <SheetTitle className="flex items-center gap-2 text-left text-lg font-extrabold">
              <GitCompareArrows className="h-5 w-5 text-orange-600" /> Perbandingan Kompresor
            </SheetTitle>
            <SheetDescription>Bandingkan hingga 4 kompresor sekaligus — highlight oranye = pilihan paling ekonomis.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-auto scrollbar-thin p-5">
            {items.length < 2 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <GitCompareArrows className="h-10 w-10 text-zinc-300" />
                <p className="font-bold text-zinc-700">Pilih minimal 2 produk untuk membandingkan.</p>
              </div>
            ) : (
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="w-28 p-2 text-left align-bottom text-xs font-extrabold uppercase tracking-wider text-zinc-400">Spesifikasi</th>
                    {items.map((p) => (
                      <th key={p.slug} className="min-w-44 p-2 align-bottom">
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-left">
                          <div className="relative mx-auto mb-2 aspect-square w-20">
                            <Image src={p.image} alt={p.name} fill className="object-contain" sizes="80px" />
                          </div>
                          <button
                            onClick={() => { setCompareOpen(false); setDetailSlug(p.slug) }}
                            className="line-clamp-2 text-left text-xs font-extrabold leading-snug text-zinc-900 hover:text-orange-700"
                          >
                            {p.name}
                          </button>
                          <button
                            onClick={() => toggleCompare(p.slug)}
                            className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-red-500 hover:underline"
                          >
                            <X className="h-3 w-3" /> Hapus
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, ri) => (
                    <tr key={row.label} className={ri % 2 === 0 ? 'bg-zinc-50/60' : ''}>
                      <td className="p-2.5 text-xs font-extrabold uppercase tracking-wide text-zinc-500">{row.label}</td>
                      {items.map((p) => (
                        <td key={p.slug} className="p-2.5 text-center text-xs font-semibold text-zinc-700">{row.render(p)}</td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="p-2.5" />
                    {items.map((p) => (
                      <td key={p.slug} className="p-2.5 text-center">
                        <Button
                          size="sm"
                          className="h-9 rounded-xl bg-zinc-900 px-3 text-xs font-bold text-white hover:bg-orange-600"
                          disabled={p.stock === 0}
                          onClick={() => addToCart(p)}
                        >
                          <ShoppingCart className="mr-1 h-3.5 w-3.5" /> Tambah
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          <div className="border-t border-zinc-100 p-4 text-center">
            <Button variant="ghost" size="sm" onClick={() => { clearCompare(); setCompareOpen(false) }} className="text-xs font-bold text-zinc-500">
              Kosongkan perbandingan
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
