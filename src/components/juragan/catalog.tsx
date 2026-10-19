'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, SlidersHorizontal, X, PackageSearch, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TYPE_LABEL, CATEGORY_LABEL } from '@/lib/types'
import type { Product } from '@/lib/types'
import { useJuragan } from '@/lib/store'
import ProductCard from './product-card'
import SectionHeading from './section-heading'

const PK_RANGES = [
  { key: 'all', label: 'Semua PK' },
  { key: 'k0', label: '≤ 1 PK' },
  { key: 'k1', label: '1 – 2 PK' },
  { key: 'k2', label: '2 – 5 PK' },
  { key: 'k3', label: '> 5 PK' },
] as const

const PRICE_RANGES = [
  { key: 'all', label: 'Semua Harga' },
  { key: 'p1', label: '< Rp 1,2 jt' },
  { key: 'p2', label: 'Rp 1,2 – 2,5 jt' },
  { key: 'p3', label: 'Rp 2,5 – 10 jt' },
  { key: 'p4', label: '> Rp 10 jt' },
] as const

function inPkRange(key: string, pk: number) {
  switch (key) {
    case 'k0': return pk <= 1
    case 'k1': return pk > 1 && pk <= 2
    case 'k2': return pk > 2 && pk <= 5
    case 'k3': return pk > 5
    default: return true
  }
}

function inPriceRange(key: string, price: number) {
  switch (key) {
    case 'p1': return price < 1200000
    case 'p2': return price >= 1200000 && price <= 2500000
    case 'p3': return price > 2500000 && price <= 10000000
    case 'p4': return price > 10000000
    default: return true
  }
}

export default function CatalogSection({ products }: { products: Product[] }) {
  const setCatalogPreset = useJuragan((s) => s.setCatalogPreset)

  const [search, setSearch] = useState('')
  const [brands, setBrands] = useState<string[]>([])
  const [types, setTypes] = useState<string[]>([])
  const [refrigerants, setRefrigerants] = useState<string[]>([])
  const [pkRange, setPkRange] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<string>('all')
  const [sort, setSort] = useState('populer')
  const [visible, setVisible] = useState(12)
  const [showFilters, setShowFilters] = useState(false)

  // Terima preset dari Kalkulator PK / kategori footer (via zustand subscribe)
  useEffect(() => {
    const applyPk = (pk: number) => {
      setPkRange(pk <= 1 ? 'k0' : pk <= 2 ? 'k1' : pk <= 5 ? 'k2' : 'k3')
      setVisible(24)
      useJuragan.getState().setCatalogPreset(null)
    }
    const applyRefrigerant = (r: string) => {
      setRefrigerants([r])
      setVisible(24)
      useJuragan.getState().setCatalogPreset(null)
    }
    const unsub = useJuragan.subscribe((state, prev) => {
      if (state.presetPk !== null && state.presetPk !== prev.presetPk) applyPk(state.presetPk)
      if (state.presetRefrigerant && state.presetRefrigerant !== prev.presetRefrigerant) applyRefrigerant(state.presetRefrigerant)
    })
    return unsub
  }, [])

  const allBrands = useMemo(() => [...new Set(products.map((p) => p.brand))].sort(), [products])
  const allTypes = useMemo(() => [...new Set(products.map((p) => p.type))], [products])
  const allRefrigerants = useMemo(() => [...new Set(products.map((p) => p.refrigerant))].sort(), [products])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = products.filter((p) => {
      if (q) {
        const hay = `${p.name} ${p.brand} ${p.modelCode} ${p.compatible.join(' ')} ${p.description}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (brands.length && !brands.includes(p.brand)) return false
      if (types.length && !types.includes(p.type)) return false
      if (refrigerants.length && !refrigerants.includes(p.refrigerant)) return false
      if (!inPkRange(pkRange, p.capacity)) return false
      if (!inPriceRange(priceRange, p.price)) return false
      return true
    })
    switch (sort) {
      case 'termurah': list = [...list].sort((a, b) => a.price - b.price); break
      case 'termahal': list = [...list].sort((a, b) => b.price - a.price); break
      case 'rating': list = [...list].sort((a, b) => b.rating - a.rating); break
      case 'terbaru': list = [...list].sort((a, b) => (a.badge === 'Baru' ? -1 : 0) - (b.badge === 'Baru' ? -1 : 0)); break
      default: list = [...list].sort((a, b) => b.soldCount - a.soldCount)
    }
    return list
  }, [products, search, brands, types, refrigerants, pkRange, priceRange, sort])

  const activeFilterCount = brands.length + types.length + refrigerants.length + (pkRange !== 'all' ? 1 : 0) + (priceRange !== 'all' ? 1 : 0) + (search ? 1 : 0)

  const resetAll = () => {
    setSearch('')
    setBrands([]); setTypes([]); setRefrigerants([])
    setPkRange('all'); setPriceRange('all'); setSort('populer')
  }

  const toggle = (list: string[], setList: (v: string[]) => void, v: string) =>
    setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all ${
        active
          ? 'border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/25'
          : 'border-zinc-200 bg-white text-zinc-600 hover:border-orange-300 hover:text-orange-600'
      }`}
    >
      {children}
    </button>
  )

  return (
    <section id="katalog" className="bg-white py-16 sm:py-20" aria-label="Katalog kompresor">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Katalog Lengkap"
          title="Semua Kompresor, Semua Merk, Satu Atap"
          subtitle="Filter teknis ala marketplace terbaik: merk, PK, refrigerant, teknologi, harga. Data stok real-time dari gudang kami."
        />

        {/* Search & toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 flex flex-col gap-3"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setVisible(12) }}
                placeholder="Cari merk, kode model, atau model AC kamu… cth: JT90, FTV15, Panasonic 1 PK"
                className="h-12 rounded-2xl border-zinc-200 bg-white pl-11 pr-4 text-sm shadow-sm focus-visible:ring-orange-500"
                aria-label="Cari kompresor"
              />
            </div>
            <Button
              variant="outline"
              className={`h-12 shrink-0 rounded-2xl px-4 font-bold lg:hidden ${showFilters ? 'border-orange-500 text-orange-600' : ''}`}
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="mr-1.5 h-4 w-4" /> Filter
              {activeFilterCount > 0 && (
                <span className="ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-extrabold text-white">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          {/* Filter panel */}
          <div className={`${showFilters ? 'block' : 'hidden'} rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4 lg:block`}>
            <div className="space-y-3">
              <div>
                <p className="mb-2 text-[11px] font-extrabold uppercase tracking-widest text-zinc-500">Merk</p>
                <div className="flex max-h-24 flex-wrap gap-2 overflow-y-auto scrollbar-thin">
                  {allBrands.map((b) => (
                    <Chip key={b} active={brands.includes(b)} onClick={() => { toggle(brands, setBrands, b); setVisible(12) }}>{b}</Chip>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-[11px] font-extrabold uppercase tracking-widest text-zinc-500">Tipe Teknologi</p>
                  <div className="flex flex-wrap gap-2">
                    {allTypes.map((t) => (
                      <Chip key={t} active={types.includes(t)} onClick={() => { toggle(types, setTypes, t); setVisible(12) }}>{TYPE_LABEL[t] ?? t}</Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-extrabold uppercase tracking-widest text-zinc-500">Refrigerant</p>
                  <div className="flex flex-wrap gap-2">
                    {allRefrigerants.map((r) => (
                      <Chip key={r} active={refrigerants.includes(r)} onClick={() => { toggle(refrigerants, setRefrigerants, r); setVisible(12) }}>{r}</Chip>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-[11px] font-extrabold uppercase tracking-widest text-zinc-500">Kapasitas</p>
                  <div className="flex flex-wrap gap-2">
                    {PK_RANGES.map((r) => (
                      <Chip key={r.key} active={pkRange === r.key} onClick={() => { setPkRange(r.key); setVisible(12) }}>{r.label}</Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-extrabold uppercase tracking-widest text-zinc-500">Harga</p>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_RANGES.map((r) => (
                      <Chip key={r.key} active={priceRange === r.key} onClick={() => { setPriceRange(r.key); setVisible(12) }}>{r.label}</Chip>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Toolbar bawah */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-zinc-600" aria-live="polite">
              Menampilkan <span className="font-extrabold text-orange-600">{Math.min(visible, filtered.length)}</span>{' '}
              dari <span className="font-extrabold text-zinc-900">{filtered.length}</span> kompresor
              {activeFilterCount > 0 && (
                <button onClick={resetAll} className="ml-3 inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline">
                  <RotateCcw className="h-3 w-3" /> Reset filter
                </button>
              )}
            </p>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-10 w-[190px] rounded-xl border-zinc-200 font-bold" aria-label="Urutkan produk">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="populer">Paling Populer</SelectItem>
                <SelectItem value="termurah">Harga Termurah</SelectItem>
                <SelectItem value="termahal">Harga Tertinggi</SelectItem>
                <SelectItem value="rating">Rating Tertinggi</SelectItem>
                <SelectItem value="terbaru">Produk Terbaru</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="mt-14 flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              <PackageSearch className="h-8 w-8" />
            </span>
            <div>
              <p className="font-extrabold text-zinc-900">Waduh, kompresornya nggak ketemu!</p>
              <p className="mt-1 text-sm text-muted-foreground">Coba longgarkan filter, atau chat AI Tanya Juragan di kanan bawah.</p>
            </div>
            <Button onClick={resetAll} className="rounded-full bg-orange-600 font-bold text-white hover:bg-orange-700">
              <RotateCcw className="mr-1.5 h-4 w-4" /> Reset Semua Filter
            </Button>
          </div>
        ) : (
          <>
            <motion.div layout className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {filtered.slice(0, visible).map((p, i) => (
                  <ProductCard key={p.slug} product={p} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
            {visible < filtered.length && (
              <div className="mt-10 text-center">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setVisible((v) => v + 12)}
                  className="h-12 rounded-full border-orange-300 px-8 font-extrabold text-orange-700 transition hover:bg-orange-50"
                >
                  Muat Lebih Banyak ({filtered.length - visible} lagi)
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
