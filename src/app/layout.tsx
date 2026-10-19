import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const SITE_URL = 'https://juragankompresor.id'
const TITLE = 'Juragan Kompresor — Jual Kompresor AC Original 100% | Terlengkap & Bergaransi'
const DESCRIPTION =
  'Toko kompresor AC #1 Indonesia. Jual kompresor AC original Daikin, Panasonic, LG, Gree, Mitsubishi, Copeland, Danfoss, Bitzer — rotary, scroll, piston & inverter, 0.5 PK s.d 15 PK. Garansi resmi 1 tahun, kirim same-day Jabodetabek, harga grosir teknisi, konsultasi AI 24 jam.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: '%s | Juragan Kompresor' },
  description: DESCRIPTION,
  keywords: [
    'kompresor ac', 'jual kompresor ac', 'kompresor ac original', 'kompresor ac 1 pk',
    'kompresor ac 2 pk', 'kompresor ac daikin', 'kompresor ac panasonic', 'kompresor copeland scroll',
    'kompresor danfoss', 'kompresor bitzer', 'kompresor inverter r32', 'sparepart ac',
    'harga kompresor ac', 'kompresor ac murah', 'toko kompresor ac jakarta', 'kompresor rotary',
    'kompresor scroll', 'kompresor piston', 'servis kompresor ac', 'juragan kompresor',
  ],
  authors: [{ name: 'Juragan Kompresor' }],
  creator: 'Juragan Kompresor',
  publisher: 'Juragan Kompresor',
  category: 'shopping',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: SITE_URL,
    siteName: 'Juragan Kompresor',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/images/og-image.jpg', width: 1344, height: 768, alt: 'Juragan Kompresor — Toko Kompresor AC #1 Indonesia' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: '#ea580c',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
