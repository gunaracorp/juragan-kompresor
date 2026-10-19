'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingCart, PartyPopper, Loader2, BadgePercent, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { formatIDR } from '@/lib/serialize'
import type { CartItem } from '@/lib/types'
import { useJuragan, tierPriceFor } from '@/lib/store'

interface QuoteResponse {
  ok: boolean
  quoteId: string
  total: number
  waLink: string
}

export default function CartSheet() {
  const cart = useJuragan((s) => s.cart)
  const cartOpen = useJuragan((s) => s.cartOpen)
  const setCartOpen = useJuragan((s) => s.setCartOpen)
  const setQty = useJuragan((s) => s.setQty)
  const removeFromCart = useJuragan((s) => s.removeFromCart)
  const clearCart = useJuragan((s) => s.clearCart)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<QuoteResponse | null>(null)

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || phone.trim().length < 8 || address.trim().length < 5) {
      toast.error('Lengkapi dulu nama, WhatsApp, dan alamatmu ya, Juragan!')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, address, note: note || undefined,
          items: cart.map((i) => ({ productId: i.slug, name: i.name, qty: i.qty, price: i.price })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal mengirim pesanan')
      setSuccess(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const finish = () => {
    clearCart()
    setSuccess(null)
    setName(''); setPhone(''); setAddress(''); setNote('')
    setCartOpen(false)
  }

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md sm:rounded-l-3xl">
        <SheetHeader className="border-b border-zinc-100 px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-extrabold">
            <ShoppingCart className="h-5 w-5 text-orange-600" /> Keranjang Juragan
          </SheetTitle>
          <SheetDescription>
            {cart.length === 0 ? 'Belum ada item.' : `${cart.reduce((a, i) => a + i.qty, 0)} item siap meluncur.`}
          </SheetDescription>
        </SheetHeader>

        {success ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"
            >
              <PartyPopper className="h-10 w-10 text-emerald-600" />
            </motion.span>
            <h3 className="text-xl font-extrabold text-zinc-900">Pesanan Terkirim, Juragan!</h3>
            <p className="text-sm text-muted-foreground">
              No. Pesanan <span className="font-extrabold text-orange-600">{success.quoteId}</span> — total{' '}
              <span className="font-extrabold text-zinc-900">{formatIDR(success.total)}</span>. Langkah terakhir: konfirmasi
              via WhatsApp agar tim kami proses hari ini.
            </p>
            <a href={success.waLink} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button className="h-12 w-full rounded-2xl bg-emerald-500 font-extrabold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600">
                <MessageCircle className="mr-2 h-5 w-5" /> Konfirmasi via WhatsApp
              </Button>
            </a>
            <Button variant="ghost" onClick={finish} className="text-sm font-bold text-zinc-500">
              Selesai belanja
            </Button>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <ShoppingCart className="h-8 w-8 text-orange-400" />
            </span>
            <p className="font-extrabold text-zinc-800">Keranjangmu masih kosong</p>
            <p className="text-sm text-muted-foreground">Yuk isi dengan kompresor original — makin banyak makin murah!</p>
            <Button onClick={() => setCartOpen(false)} className="rounded-full bg-orange-600 font-bold text-white hover:bg-orange-700">
              Lihat Katalog
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4">
              <ul className="space-y-3">
                {(cart as CartItem[]).map((item) => (
                  <li key={item.slug} className="flex gap-3 rounded-2xl border border-zinc-200 bg-white p-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-50">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="64px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-extrabold leading-snug text-zinc-900">{item.name}</p>
                      <p className="mt-0.5 text-xs font-bold text-orange-600">{formatIDR(item.price)}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex items-center rounded-lg border border-zinc-200">
                          <button className="flex h-7 w-7 items-center justify-center text-zinc-500 hover:text-orange-600" onClick={() => setQty(item.slug, item.qty - 1)} aria-label={`Kurangi jumlah ${item.name}`}>
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-extrabold">{item.qty}</span>
                          <button className="flex h-7 w-7 items-center justify-center text-zinc-500 hover:text-orange-600" onClick={() => setQty(item.slug, item.qty + 1)} aria-label={`Tambah jumlah ${item.name}`}>
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="ml-auto text-sm font-extrabold text-zinc-900">{formatIDR(item.price * item.qty)}</span>
                        <button onClick={() => removeFromCart(item.slug)} className="text-zinc-300 transition hover:text-red-500" aria-label={`Hapus ${item.name} dari keranjang`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3">
                <p className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
                  <BadgePercent className="h-4 w-4" /> Harga grosir otomatis
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-emerald-700/80">
                  Beli 3+ unit kompresor yang sama? Diskon 4–8% langsung dihitung teknisi kami saat konfirmasi WhatsApp. Makin banyak, makin murah!
                </p>
              </div>

              {/* Form */}
              <form onSubmit={submit} className="mt-4 space-y-3" id="form-quote">
                <div className="text-sm font-extrabold text-zinc-900">Data Pengiriman</div>
                <div className="space-y-1.5">
                  <Label htmlFor="q-name" className="text-xs font-bold">Nama Lengkap *</Label>
                  <Input id="q-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="cth: Budi Santoso" className="h-10 rounded-xl" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="q-phone" className="text-xs font-bold">No. WhatsApp *</Label>
                  <Input id="q-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="cth: 0812 3456 7890" className="h-10 rounded-xl" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="q-address" className="text-xs font-bold">Alamat Pengiriman *</Label>
                  <Textarea id="q-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Jalan, nomor, kota… " className="min-h-20 rounded-xl" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="q-note" className="text-xs font-bold">Catatan (opsional)</Label>
                  <Textarea id="q-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="cth: minta packing kayu, tolong dikirim sore" className="min-h-16 rounded-xl" />
                </div>
              </form>
            </div>

            <div className="border-t border-zinc-100 bg-white p-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="font-semibold text-zinc-500">Total ({cart.reduce((a, i) => a + i.qty, 0)} item)</span>
                <span className="text-xl font-extrabold text-orange-600">{formatIDR(total)}</span>
              </div>
              <Button
                type="submit"
                form="form-quote"
                disabled={loading}
                className="h-12 w-full rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 text-sm font-extrabold text-white shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.01] active:scale-95"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim pesanan…</>
                ) : (
                  'Kirim Pesanan & Konfirmasi WhatsApp'
                )}
              </Button>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                Tanpa DP — bayar setelah konfirmasi stok oleh tim kami.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
