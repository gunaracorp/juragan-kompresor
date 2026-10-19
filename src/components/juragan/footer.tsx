'use client'

import { Fan, MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube, MessageCircle, Building2, Crown } from 'lucide-react'
import { useJuragan } from '@/lib/store'
import { FOUNDER, CO_ENGINEER, SOCIALS, SUPPORT_COMPANIES } from '@/lib/branding'
import { XIcon, TikTokIcon, ThreadsIcon } from './brand-icons'

function SocialIcon({ icon, className }: { icon: string; className?: string }) {
  switch (icon) {
    case 'instagram': return <Instagram className={className} />
    case 'facebook': return <Facebook className={className} />
    case 'x': return <XIcon className={className} />
    case 'tiktok': return <TikTokIcon className={className} />
    case 'threads': return <ThreadsIcon className={className} />
    default: return null
  }
}

const CATEGORY_LINKS = [
  { label: 'Kompresor Rotary (Rumahan)', pk: 'k1' },
  { label: 'Kompresor Inverter Hemat Listrik', pk: 'k0' },
  { label: 'Kompresor Scroll (Komersial)', pk: 'k2' },
  { label: 'Kompresor Piston (Industrial)', pk: 'k3' },
]

const HELP_LINKS = [
  { label: 'Katalog Produk', href: '#katalog' },
  { label: 'Alat Bantu & Diagnosa', href: '#alat-bantu' },
  { label: 'Artikel & Edukasi', href: '#artikel' },
  { label: 'Testimoni Pembeli', href: '#testimoni' },
  { label: 'FAQ / Pertanyaan', href: '#faq' },
]

export default function Footer() {
  const setCatalogPreset = useJuragan((s) => s.setCatalogPreset)

  const goPk = (pk: string) => {
    const ranges: Record<string, number> = { k0: 0.75, k1: 1.5, k2: 3, k3: 10 }
    setCatalogPreset(ranges[pk])
    document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer id="kontak" className="mt-auto bg-zinc-950 text-zinc-400" aria-label="Footer Juragan Kompresor">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <a href="#" className="flex items-center gap-2.5" aria-label="Juragan Kompresor">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30">
                <Fan className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white">
                Juragan<span className="text-orange-500">Kompresor</span>
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed">
              Toko kompresor AC #1 Indonesia — distilasi fitur terbaik dari 20 toko kompresor terkemuka dunia.
              100% original, bergaransi resmi, dan ditemani AI ahli pendinginan 24 jam.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { icon: MessageCircle, label: 'WhatsApp Juragan Kompresor' },
                { icon: Instagram, label: 'Instagram Juragan Kompresor' },
                { icon: Facebook, label: 'Facebook Juragan Kompresor' },
                { icon: Youtube, label: 'YouTube Juragan Kompresor' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-zinc-400 transition hover:bg-orange-600 hover:text-white"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Kategori */}
          <nav aria-label="Kategori kompresor">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white">Kategori</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CATEGORY_LINKS.map((c) => (
                <li key={c.label}>
                  <button onClick={() => goPk(c.pk)} className="transition-colors hover:text-orange-400">
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bantuan */}
          <nav aria-label="Bantuan dan tautan">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white">Bantuan</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {HELP_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="transition-colors hover:text-orange-400">{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kontak */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white">Hubungi Juragan</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                Jl. Raya Kompresor No. 88, Glodok, Jakarta Barat 11180
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-orange-500" />
                <a href="tel:+622188887777" className="transition-colors hover:text-orange-400">(021) 8888-7777</a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 shrink-0 text-orange-500" />
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-orange-400">0812-3456-7890 (WA)</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-orange-500" />
                <a href="mailto:juragan@juragankompresor.id" className="transition-colors hover:text-orange-400">juragan@juragankompresor.id</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-orange-500" />
                Senin–Minggu, 07.00–21.00 WIB
              </li>
            </ul>
          </div>
        </div>

        {/* Kredit & branding — by Gugun Gunara */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-6 sm:p-8" aria-label="Kredit pembuat dan pendukung">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.25em] text-orange-500">
                <Crown className="h-3.5 w-3.5" /> Dibangun Oleh
              </p>
              <p className="mt-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                by{' '}
                <a
                  href={SOCIALS[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 bg-clip-text text-transparent transition hover:from-orange-300 hover:to-amber-300"
                >
                  {FOUNDER.name}
                </a>
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                Master Polymath · Sage Universal · The Ultimate Problem Solver — bersama{' '}
                <span className="font-bold text-zinc-200">{CO_ENGINEER.name}</span>
              </p>
              <p className="mt-1 text-[11px] font-semibold text-zinc-500">
                alias: prabudanling · santri angon
              </p>
            </div>

            {/* Sosial media founder */}
            <div>
              <p className="mb-2.5 text-[10px] font-extrabold uppercase tracking-[0.25em] text-zinc-500">Ikuti Juragan</p>
              <div className="flex flex-wrap gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${FOUNDER.name} di ${s.label} (${s.handle})`}
                    title={`${s.label} — ${s.handle}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-zinc-400 transition hover:-translate-y-0.5 hover:bg-orange-600 hover:text-white"
                  >
                    <SocialIcon icon={s.icon} className="h-4.5 w-4.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Perusahaan pendukung */}
          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
            {SUPPORT_COMPANIES.map((c) => (
              <a
                key={c.legalName}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 text-xs"
                title={`${c.legalName} — ${c.role}`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600/15 text-orange-400 transition group-hover:bg-orange-600 group-hover:text-white">
                  <Building2 className="h-4 w-4" />
                </span>
                <span>
                  <span className="block font-extrabold text-zinc-200 transition group-hover:text-orange-400">{c.legalName}</span>
                  <span className="block text-[10px] font-semibold text-zinc-500">{c.url.replace('https://', '')} · {c.role}</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Pembayaran & kirim */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-white/10 pt-6 text-[11px] font-bold">
          {['QRIS', 'Transfer Bank', 'COD Jabodetabek', 'Cicilan 0%', 'Same-Day Delivery', 'Asuransi Kirim'].map((b) => (
            <span key={b} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">{b}</span>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs sm:flex-row sm:px-6 sm:text-left">
          <p>© 2025 PT Juragan Kompresor Nusantara. Seluruh hak cipta dilindungi.</p>
          <p className="text-zinc-500">
            Diracik dengan <span className="text-orange-500">♥</span> oleh <strong className="text-zinc-300">Gugun Gunara</strong> —
            didukung <a href="https://topkonsultan.web.id" target="_blank" rel="noopener noreferrer" className="font-semibold text-zinc-400 underline-offset-2 transition hover:text-orange-400 hover:underline">PT Top Konsultan Internasional</a> ×{' '}
            <a href="https://digiman.id" target="_blank" rel="noopener noreferrer" className="font-semibold text-zinc-400 underline-offset-2 transition hover:text-orange-400 hover:underline">digiman.id</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
