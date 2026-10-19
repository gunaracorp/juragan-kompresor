'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Fan, ShoppingCart, GitCompareArrows, Menu, Phone, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useJuragan } from '@/lib/store'

const NAV_LINKS = [
  { href: '#katalog', label: 'Katalog' },
  { href: '#alat-bantu', label: 'Alat Bantu' },
  { href: '#artikel', label: 'Artikel' },
  { href: '#testimoni', label: 'Testimoni' },
  { href: '#faq', label: 'FAQ' },
]

export default function Navbar() {
  const cartCount = useJuragan((s) => s.cart.reduce((a, i) => a + i.qty, 0))
  const compareCount = useJuragan((s) => s.compare.length)
  const setCartOpen = useJuragan((s) => s.setCartOpen)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-all duration-300 ${
        scrolled
          ? 'border-border bg-white/85 backdrop-blur-xl shadow-[0_4px_24px_-12px_rgba(0,0,0,0.18)]'
          : 'border-transparent bg-white/60 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 shrink-0" aria-label="Juragan Kompresor - Beranda">
          <motion.span
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30"
          >
            <Fan className="h-5 w-5" />
          </motion.span>
          <span className="text-lg font-extrabold tracking-tight leading-none">
            Juragan<span className="text-orange-600">Kompresor</span>
            <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Toko Kompresor AC #1 Indonesia
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Navigasi utama">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3.5 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-orange-50 hover:text-orange-700"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="tel:+622188887777"
            className="hidden xl:flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-2 text-xs font-bold text-orange-700 transition hover:bg-orange-100"
          >
            <Phone className="h-3.5 w-3.5" /> (021) 8888-7777
          </a>

          <Button
            variant="ghost"
            size="icon"
            className="relative hidden sm:inline-flex"
            aria-label={`Bandingkan produk (${compareCount} dipilih)`}
            onClick={() => document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <GitCompareArrows className="h-5 w-5 text-zinc-600" />
            {compareCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white">
                {compareCount}
              </span>
            )}
          </Button>

          <Button
            onClick={() => setCartOpen(true)}
            className="relative h-10 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-4 sm:px-5 font-bold text-white shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.03] active:scale-95"
            aria-label={`Keranjang belanja (${cartCount} item)`}
          >
            <ShoppingCart className="mr-0 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Keranjang</span>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1.5 text-[11px] font-extrabold text-white ring-2 ring-white"
              >
                {cartCount}
              </motion.span>
            )}
          </Button>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden rounded-full" aria-label="Buka menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-left">
                  <Fan className="h-5 w-5 text-orange-600" /> Menu Juragan
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-2 flex flex-col gap-1 px-4" aria-label="Navigasi seluler">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-bold text-zinc-700 transition hover:bg-orange-50 hover:text-orange-700"
                  >
                    {l.label}
                    <X className="h-3.5 w-3.5 opacity-0" />
                  </a>
                ))}
                <div className="mt-4 rounded-2xl bg-orange-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-700">Butuh bantuan cepat?</p>
                  <a href="tel:+622188887777" className="mt-2 flex items-center gap-2 text-sm font-extrabold text-zinc-900">
                    <Phone className="h-4 w-4 text-orange-600" /> (021) 8888-7777
                  </a>
                  <p className="mt-1 text-xs text-muted-foreground">Senin–Minggu, 07.00–21.00 WIB</p>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 1, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent"
          />
        )}
      </AnimatePresence>
    </header>
  )
}
