'use client'

import { create } from 'zustand'
import type { Product, CartItem } from '@/lib/types'

interface JuraganState {
  cart: CartItem[]
  cartOpen: boolean
  compare: string[]
  compareOpen: boolean
  detailSlug: string | null
  presetPk: number | null
  presetRefrigerant: string | null
  chatOpen: boolean

  addToCart: (p: Product, qty?: number) => void
  removeFromCart: (slug: string) => void
  setQty: (slug: string, qty: number) => void
  clearCart: () => void
  setCartOpen: (open: boolean) => void

  toggleCompare: (slug: string) => void
  clearCompare: () => void
  setCompareOpen: (open: boolean) => void

  setDetailSlug: (slug: string | null) => void
  setCatalogPreset: (pk: number | null, refrigerant?: string | null) => void
  setChatOpen: (open: boolean) => void
}

export const useJuragan = create<JuraganState>((set) => ({
  cart: [],
  cartOpen: false,
  compare: [],
  compareOpen: false,
  detailSlug: null,
  presetPk: null,
  presetRefrigerant: null,
  chatOpen: false,

  addToCart: (p, qty = 1) =>
    set((state) => {
      const existing = state.cart.find((i) => i.slug === p.slug)
      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.slug === p.slug ? { ...i, qty: Math.min(i.qty + qty, 99) } : i,
          ),
        }
      }
      return {
        cart: [
          ...state.cart,
          { slug: p.slug, name: p.name, brand: p.brand, price: p.price, qty, image: p.image, capacity: p.capacity },
        ],
      }
    }),

  removeFromCart: (slug) => set((state) => ({ cart: state.cart.filter((i) => i.slug !== slug) })),

  setQty: (slug, qty) =>
    set((state) => ({
      cart:
        qty <= 0
          ? state.cart.filter((i) => i.slug !== slug)
          : state.cart.map((i) => (i.slug === slug ? { ...i, qty: Math.min(qty, 99) } : i)),
    })),

  clearCart: () => set({ cart: [] }),
  setCartOpen: (cartOpen) => set({ cartOpen }),

  toggleCompare: (slug) =>
    set((state) => {
      if (state.compare.includes(slug)) {
        return { compare: state.compare.filter((s) => s !== slug) }
      }
      if (state.compare.length >= 4) return state
      return { compare: [...state.compare, slug] }
    }),
  clearCompare: () => set({ compare: [] }),
  setCompareOpen: (compareOpen) => set({ compareOpen }),

  setDetailSlug: (detailSlug) => set({ detailSlug }),
  setCatalogPreset: (presetPk, presetRefrigerant = null) => set({ presetPk, presetRefrigerant }),
  setChatOpen: (chatOpen) => set({ chatOpen }),
}))

export function tierPriceFor(qty: number, tiers: { minQty: number; price: number }[]): number {
  if (!tiers.length) return 0
  const sorted = [...tiers].sort((a, b) => a.minQty - b.minQty)
  let price = sorted[0].price
  for (const t of sorted) {
    if (qty >= t.minQty) price = t.price
  }
  return price
}
