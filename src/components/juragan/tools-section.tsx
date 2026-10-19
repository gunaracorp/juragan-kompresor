'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Stethoscope, SearchCheck, Loader2, ArrowRight, AlertTriangle, AlertCircle, ShieldAlert, Wrench, Snowflake, Gauge, Wind } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { formatIDR } from '@/lib/serialize'
import { TYPE_LABEL } from '@/lib/types'
import type { Product, DiagnoseResult } from '@/lib/types'
import { useJuragan } from '@/lib/store'
import SectionHeading from './section-heading'

/* ============ 1. KALKULATOR PK ============ */
function PkCalculator() {
  const setCatalogPreset = useJuragan((s) => s.setCatalogPreset)
  const [area, setArea] = useState(16)
  const [tallCeiling, setTallCeiling] = useState(false)
  const [topFloor, setTopFloor] = useState(false)
  const [hotSun, setHotSun] = useState(false)
  const [manyDevices, setManyDevices] = useState(false)
  const [people, setPeople] = useState(2)

  const btu = Math.round(
    area * 550 *
    (tallCeiling ? 1.1 : 1) *
    (topFloor ? 1.2 : 1) *
    (hotSun ? 1.1 : 1) *
    (manyDevices ? 1.08 : 1) +
    Math.max(0, people - 2) * 600 +
    (manyDevices ? 600 : 0),
  )
  const rawPk = btu / 9000
  const stdSizes = [0.5, 0.75, 1, 1.5, 2, 2.5, 3, 5, 10, 15]
  const suggested = stdSizes.find((s) => s >= rawPk) ?? 15

  const goCatalog = () => {
    setCatalogPreset(suggested)
    document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold">Luas Ruangan</Label>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-extrabold text-orange-700">{area} m²</span>
          </div>
          <Slider value={[area]} onValueChange={(v) => setArea(v[0])} min={5} max={60} step={1} className="mt-3" aria-label="Luas ruangan dalam meter persegi" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold">Jumlah Orang (rata-rata)</Label>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-extrabold text-orange-700">{people} orang</span>
          </div>
          <Slider value={[people]} onValueChange={(v) => setPeople(v[0])} min={1} max={15} step={1} className="mt-3" aria-label="Jumlah orang di ruangan" />
        </div>
        <div className="space-y-2.5 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4">
          {[
            { label: 'Plafon tinggi (> 3 m)', value: tallCeiling, set: setTallCeiling },
            { label: 'Lantai atas / atap langsung matahari', value: topFloor, set: setTopFloor },
            { label: 'Terkkena panas matahari terik', value: hotSun, set: setHotSun },
            { label: 'Banyak peralatan elektronik panas', value: manyDevices, set: setManyDevices },
          ].map((o) => (
            <div key={o.label} className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-zinc-700">{o.label}</span>
              <Switch checked={o.value} onCheckedChange={o.set} aria-label={o.label} />
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-950 to-zinc-900 p-6 text-center text-white">
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-orange-600/30 blur-2xl" aria-hidden="true" />
        <motion.div
          key={suggested}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="relative"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-orange-400">Rekomendasi Dewan Pakar</p>
          <p className="mt-1 text-5xl font-extrabold text-white">{suggested} <span className="text-2xl text-orange-400">PK</span></p>
          <p className="mt-1 text-sm font-semibold text-zinc-400">≈ {btu.toLocaleString('id-ID')} BTU/jam</p>
          <div className="mx-auto mt-4 grid w-full max-w-xs grid-cols-3 gap-2 text-[10px] font-bold text-zinc-400">
            <span className="rounded-lg bg-white/5 py-1.5">Luas: {area} m²</span>
            <span className="rounded-lg bg-white/5 py-1.5">{people} orang</span>
            <span className="rounded-lg bg-white/5 py-1.5">{[tallCeiling && 'Plafon ↑', topFloor && 'Lantai ↑', hotSun && 'Terik ↑', manyDevices && 'Elektronik ↑'].filter(Boolean).length} faktor</span>
          </div>
          <Button onClick={goCatalog} className="mt-5 h-11 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-6 font-extrabold shadow-lg shadow-orange-600/30">
            Lihat Kompresor {suggested} PK <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
          <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
            Rumus: 1 m² ≈ 550 BTU. Dikoreksi otomatis untuk plafon, lantai atas, matahari & elektronik.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

/* ============ 2. DIAGNOSA KOMPRESOR ============ */
const SYMPTOMS = [
  { key: 'tidak-dingin', label: 'AC menyala tapi tidak dingin / dingin lemah' },
  { key: 'mcb-jatuh', label: 'MCB / listrik sering jatuh saat AC menyala' },
  { key: 'suara-berisik', label: 'Suara berisik, gemuruh, atau getar hebat' },
  { key: 'outdoor-panas', label: 'Outdoor panas luar biasa, tidak ada angin panas' },
  { key: 'bau-gosong', label: 'Ada bau gosong di outdoor unit' },
  { key: 'pipa-beku', label: 'Pipa suction berembun / membeku' },
  { key: 'on-off-sendiri', label: 'AC mati-nyala sendiri terus-menerus' },
  { key: 'umur-tua', label: 'Umur AC sudah lebih dari 6–10 tahun' },
]

const SEVERITY_STYLE = {
  RINGAN: { icon: ShieldAlert, cls: 'bg-emerald-100 text-emerald-700', text: 'Kondisi Ringan' },
  SEDANG: { icon: AlertCircle, cls: 'bg-amber-100 text-amber-700', text: 'Waspada — Sedang' },
  BERAT: { icon: AlertTriangle, cls: 'bg-red-100 text-red-700', text: 'Kritis — Segera Tindak!' },
} as const

function DiagnoseTool({ products }: { products: Product[] }) {
  const setDetailSlug = useJuragan((s) => s.setDetailSlug)
  const [selected, setSelected] = useState<string[]>([])
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [capacity, setCapacity] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<(DiagnoseResult & { products: Product[] }) | null>(null)

  const toggleSymptom = (key: string) =>
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))

  const analyze = async () => {
    if (selected.length === 0) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: selected,
          brand: brand || undefined,
          model: model || undefined,
          capacity: capacity ? Number(capacity) : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
    } catch {
      setResult({
        severity: 'SEDANG',
        diagnosis: 'Analisis sedang sibuk, tapi berdasarkan gejala yang kamu pilih, sebaiknya AC segera diperiksa teknisi. Kamu juga bisa chat Tanya Juragan (AI) di kanan bawah.',
        action: ['Matikan AC dari listrik bila ada gejala kritis', 'Hubungi teknisi untuk pengukuran arus & tekanan'],
        suggestedPk: capacity ? Number(capacity) : null,
        suggestedType: null,
        suggestedRefrigerant: null,
        products: products.filter((p) => p.isFeatured).slice(0, 3),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-4 lg:col-span-2">
        <div>
          <Label className="text-sm font-bold">Centang Gejala yang Muncul</Label>
          <div className="mt-2.5 space-y-2">
            {SYMPTOMS.map((s) => (
              <label
                key={s.key}
                className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-xs font-semibold transition-all ${
                  selected.includes(s.key)
                    ? 'border-orange-400 bg-orange-50 text-orange-900 shadow-sm'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:border-orange-200'
                }`}
              >
                <Checkbox checked={selected.includes(s.key)} onCheckedChange={() => toggleSymptom(s.key)} className="mt-0.5" aria-label={s.label} />
                {s.label}
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="d-brand" className="text-xs font-bold">Merk AC (opsional)</Label>
            <Input id="d-brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="cth: Daikin" className="h-10 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="d-cap" className="text-xs font-bold">Kapasitas PK</Label>
            <Input id="d-cap" type="number" step="0.5" min="0.3" max="30" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="cth: 1" className="h-10 rounded-xl" />
          </div>
        </div>
        <Button
          onClick={analyze}
          disabled={loading || selected.length === 0}
          className="h-12 w-full rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 font-extrabold text-white shadow-lg shadow-orange-500/25 disabled:opacity-50"
        >
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Dewan pakar sedang menganalisis…</> : <><Stethoscope className="mr-2 h-4 w-4" /> Analisis Sekarang ({selected.length} gejala)</>}
        </Button>
      </div>

      <div className="lg:col-span-3">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full min-h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50">
              <div className="relative">
                <Wind className="h-10 w-10 animate-spin text-orange-500" />
                <Wrench className="absolute -bottom-1 -right-2 h-6 w-6 text-zinc-400" />
              </div>
              <p className="text-sm font-bold text-zinc-500">46 dewan pakar sedang bermusyawarah…</p>
              <div className="w-48"><div className="h-1.5 overflow-hidden rounded-full bg-zinc-200"><motion.div className="h-full w-1/2 rounded-full bg-orange-500" animate={{ x: ['-100%', '200%'] }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }} /></div></div>
            </motion.div>
          ) : result ? (
            <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${SEVERITY_STYLE[result.severity].cls}`}>
                  {(() => { const S = SEVERITY_STYLE[result.severity]; return <S.icon className="h-3.5 w-3.5" /> })()}
                  {SEVERITY_STYLE[result.severity].text}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-zinc-700">{result.diagnosis}</p>
                <div className="mt-4">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">Langkah yang Disarankan</p>
                  <ol className="mt-2 space-y-1.5">
                    {result.action.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px] font-extrabold text-orange-700">{i + 1}</span>
                        {a}
                      </li>
                    ))}
                  </ol>
                </div>
                {(result.suggestedPk || result.suggestedType || result.suggestedRefrigerant) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {result.suggestedPk && <Badge variant="outline" className="border-orange-300 bg-orange-50 font-bold text-orange-700"><Gauge className="mr-1 h-3 w-3" /> {result.suggestedPk} PK</Badge>}
                    {result.suggestedType && <Badge variant="outline" className="border-orange-300 bg-orange-50 font-bold text-orange-700"><Wrench className="mr-1 h-3 w-3" /> {TYPE_LABEL[result.suggestedType] ?? result.suggestedType}</Badge>}
                    {result.suggestedRefrigerant && <Badge variant="outline" className="border-orange-300 bg-orange-50 font-bold text-orange-700"><Snowflake className="mr-1 h-3 w-3" /> {result.suggestedRefrigerant}</Badge>}
                  </div>
                )}
              </div>

              {result.products.length > 0 && (
                <div>
                  <p className="text-sm font-extrabold text-zinc-900">Rekomendasi Kompresor Pengganti:</p>
                  <div className="mt-2.5 grid gap-3 sm:grid-cols-3">
                    {result.products.map((p) => (
                      <button
                        key={p.slug}
                        onClick={() => setDetailSlug(p.slug)}
                        className="group rounded-2xl border border-zinc-200 bg-white p-3 text-left transition-all hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
                      >
                        <div className="relative mx-auto aspect-square w-full max-w-24">
                          <Image src={p.image} alt={p.name} fill className="object-contain" sizes="96px" />
                        </div>
                        <p className="mt-2 line-clamp-2 text-xs font-extrabold leading-snug text-zinc-900 group-hover:text-orange-700">{p.name}</p>
                        <p className="mt-1 text-xs font-extrabold text-orange-600">{formatIDR(p.price)}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full min-h-72 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/60 p-8 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <Stethoscope className="h-8 w-8 text-orange-500" />
              </span>
              <p className="text-sm font-extrabold text-zinc-800">Hasil diagnosa muncul di sini</p>
              <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
                Centang gejala di kiri, lalu biarkan 46 dewan pakar kami menganalisis — lengkap dengan rekomendasi kompresor pengganti.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ============ 3. CEK KOMPATIBILITAS ============ */
function CompatChecker({ products }: { products: Product[] }) {
  const setDetailSlug = useJuragan((s) => s.setDetailSlug)
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const matches = q.length >= 3
    ? products
        .map((p) => {
          const hit = p.compatible.find((c) => c.toLowerCase().includes(q))
          const inName = `${p.name} ${p.modelCode}`.toLowerCase().includes(q)
          return hit || inName ? { p, hit: hit ?? `${p.brand} (kode ${p.modelCode})` } : null
        })
        .filter((x): x is { p: Product; hit: string } => x !== null)
        .slice(0, 6)
    : []

  return (
    <div>
      <div className="mx-auto max-w-xl">
        <Label htmlFor="cc-input" className="text-sm font-bold">Masukkan Model AC / Kode Kompresor Lama</Label>
        <div className="relative mt-2">
          <SearchCheck className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            id="cc-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="cth: FTV15, SRK12, Panasonic PU9, ZP38…"
            className="h-12 rounded-2xl pl-11 pr-4 text-sm shadow-sm focus-visible:ring-orange-500"
          />
        </div>
        {q.length > 0 && q.length < 3 && (
          <p className="mt-2 text-xs text-muted-foreground">Ketik minimal 3 karakter ya, Juragan.</p>
        )}
      </div>

      <div className="mt-6">
        {q.length >= 3 && matches.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/60 p-8 text-center">
            <p className="text-sm font-extrabold text-zinc-800">Belum ada kecocokan persis</p>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
              Tenang — kompresor lintas merk sering bisa saling ganti. Chat AI Tanya Juragan di kanan bawah, sebutkan model AC kamu, nanti dibantu carikan padanannya.
            </p>
          </div>
        ) : matches.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map(({ p, hit }) => (
              <motion.button
                layout
                key={p.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setDetailSlug(p.slug)}
                className="group rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 text-left transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="relative h-16 w-16 shrink-0">
                    <Image src={p.image} alt={p.name} fill className="object-contain" sizes="64px" />
                  </div>
                  <div className="min-w-0">
                    <span className="inline-block rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white">✓ Cocok</span>
                    <p className="mt-1 line-clamp-2 text-xs font-extrabold leading-snug text-zinc-900 group-hover:text-orange-700">{p.name}</p>
                    <p className="mt-0.5 truncate text-[10px] font-bold text-emerald-700">untuk: {hit}</p>
                    <p className="mt-1 text-xs font-extrabold text-orange-600">{formatIDR(p.price)}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {['Daikin FTV15', 'Panasonic CS-PU9', 'Mitsubishi SRK12'].map((ex) => (
              <button key={ex} onClick={() => setQuery(ex)} className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs font-bold text-zinc-600 transition hover:border-orange-300 hover:text-orange-600">
                Coba: {ex}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ============ SECTION WRAPPER ============ */
export default function ToolsSection({ products }: { products: Product[] }) {
  return (
    <section id="alat-bantu" className="bg-zinc-950 py-16 sm:py-20" aria-label="Alat bantu teknis">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          dark
          eyebrow="Alat Bantu Pintar"
          title="Tidak Ada di Toko Lain: 3 Senjata Rahasia Juragan"
          subtitle="Fitur dari masa depan — kalkulator kebutuhan, diagnosa berbasis AI, dan pemeriksa kompatibilitas. Semua gratis, semua instan."
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mt-10"
        >
          <Tabs defaultValue="kalkulator" className="w-full">
            <TabsList className="mx-auto grid h-auto w-full max-w-xl grid-cols-3 gap-1 rounded-2xl bg-white/5 p-1.5 backdrop-blur">
              {[
                { value: 'kalkulator', icon: Calculator, label: 'Kalkulator PK' },
                { value: 'diagnosa', icon: Stethoscope, label: 'Diagnosa Kompresor' },
                { value: 'kompatibel', icon: SearchCheck, label: 'Cek Kompatibilitas' },
              ].map((t) => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="flex flex-col items-center gap-1 rounded-xl py-2.5 text-[11px] font-extrabold text-zinc-400 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-600 data-[state=active]:to-amber-500 data-[state=active]:text-white sm:flex-row sm:text-xs"
                >
                  <t.icon className="h-4 w-4" /> {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="kalkulator" className="mt-6 rounded-3xl border border-white/10 bg-white p-5 sm:p-8">
              <PkCalculator />
            </TabsContent>
            <TabsContent value="diagnosa" className="mt-6 rounded-3xl border border-white/10 bg-white p-5 sm:p-8">
              <DiagnoseTool products={products} />
            </TabsContent>
            <TabsContent value="kompatibel" className="mt-6 rounded-3xl border border-white/10 bg-white p-5 sm:p-8">
              <CompatChecker products={products} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}
