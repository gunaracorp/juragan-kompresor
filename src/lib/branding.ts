/**
 * ============================================================================
 *  BRANDING — Single Source of Truth
 *  by Gugun Gunara · didukung PT Top Konsultan Internasional & PT Digital
 *  Bisnis Manajemen (digiman.id).
 *
 *  Semua tampilan kredit (footer, artikel, README) dan structured data
 *  (JSON-LD Person/Organization) BACA dari file ini — jangan hardcode
 *  nama/URL di komponen lain.
 * ============================================================================
 */

export const FOUNDER = {
  name: 'Gugun Gunara',
  role: 'Founder, Architect & Master Engineer',
  aliases: ['prabudanling', 'santri angon', 'gunaracorp'],
  jobTitle: 'Master Polymath & Ultimate Problem Solver',
  knowsAbout: [
    'Kompresor AC', 'HVAC', 'Refrigerasi', 'Next.js', 'Full-Stack Development',
    'Search Engine Optimization', 'Digital Business', 'Sistem Pendingin',
  ],
} as const

export const CO_ENGINEER = {
  name: 'Muhammad Lutfi Azmi',
  role: 'Co-Engineer',
} as const

export type BrandIcon = 'instagram' | 'threads' | 'tiktok' | 'facebook' | 'x'

export interface SocialLink {
  label: string
  handle: string
  url: string
  icon: BrandIcon
}

export const SOCIALS: SocialLink[] = [
  { label: 'Instagram', handle: '@prabudanling', url: 'https://www.instagram.com/prabudanling', icon: 'instagram' },
  { label: 'Threads', handle: '@prabudanling', url: 'https://www.threads.net/@prabudanling', icon: 'threads' },
  { label: 'TikTok', handle: '@gunaracorp', url: 'https://www.tiktok.com/@gunaracorp', icon: 'tiktok' },
  { label: 'Facebook', handle: 'bossdanling', url: 'https://www.facebook.com/bossdanling', icon: 'facebook' },
  { label: 'X (Twitter)', handle: '@gunzz_krenzz', url: 'https://x.com/gunzz_krenzz', icon: 'x' },
]

/** URL sosial utama sang founder — dipakai untuk schema.org `sameAs`. */
export const FOUNDER_SAME_AS = SOCIALS.map((s) => s.url)

export interface SupportCompany {
  name: string
  legalName: string
  url: string
  role: string
}

export const SUPPORT_COMPANIES: SupportCompany[] = [
  {
    name: 'Top Konsultan Internasional',
    legalName: 'PT Top Konsultan Internasional',
    url: 'https://topkonsultan.web.id',
    role: 'Konsultan & Dukungan Sistem',
  },
  {
    name: 'Digital Bisnis Manajemen',
    legalName: 'PT Digital Bisnis Manajemen',
    url: 'https://digiman.id',
    role: 'Digital & Manajemen — support system ini',
  },
]

/** Keyword tambahan untuk metadata SEO — nama orang/brand pendukung. */
export const BRAND_KEYWORDS = [
  'Gugun Gunara',
  'Muhammad Lutfi Azmi',
  'prabudanling',
  'santri angon',
  'gunaracorp',
  'PT Top Konsultan Internasional',
  'topkonsultan.web.id',
  'PT Digital Bisnis Manajemen',
  'digiman.id',
]
