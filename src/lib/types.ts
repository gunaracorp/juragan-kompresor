export type TierPrice = { minQty: number; price: number }

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  type: string
  refrigerant: string
  capacity: number
  voltage: string
  modelCode: string
  category: string
  price: number
  oldPrice: number | null
  stock: number
  soldCount: number
  rating: number
  reviews: number
  badge: string | null
  warranty: string
  image: string
  features: string[]
  compatible: string[]
  tierPrices: TierPrice[]
  description: string
  isFeatured: boolean
  saleEndsAt: string | null
}

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  readTime: number
  publishedAt: string
}

export interface Testimonial {
  id: string
  name: string
  city: string
  role: string
  rating: number
  message: string
}

export interface Faq {
  id: string
  question: string
  answer: string
  order: number
}

export interface CartItem {
  slug: string
  name: string
  brand: string
  price: number
  qty: number
  image: string
  capacity: number
}

export interface DiagnoseResult {
  severity: 'RINGAN' | 'SEDANG' | 'BERAT'
  diagnosis: string
  action: string[]
  suggestedPk: number | null
  suggestedType: string | null
  suggestedRefrigerant: string | null
  products: Product[]
}

export const TYPE_LABEL: Record<string, string> = {
  ROTARY: 'Rotary',
  SCROLL: 'Scroll',
  PISTON: 'Piston',
  INVERTER: 'Inverter',
}

export const CATEGORY_LABEL: Record<string, string> = {
  RESIDENTIAL: 'Rumahan',
  LIGHT_COMMERCIAL: 'Komersial',
  INDUSTRIAL: 'Industrial',
}
