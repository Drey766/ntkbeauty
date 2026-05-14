'use client'
// WishlistContext — manages saved/favourited products using useState
// Persists to localStorage

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product } from '@/types'

interface WishlistContextValue {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  toggleItem: (product: Product) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([])

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ntbeauty_wishlist')
      if (saved) setItems(JSON.parse(saved))
    } catch {
      // Ignore errors
    }
  }, [])

  // Persist whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('ntbeauty_wishlist', JSON.stringify(items))
  }, [items])

  const addItem = (product: Product) => {
    setItems(prev => prev.some(p => p.id === product.id) ? prev : [...prev, product])
  }

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(p => p.id !== productId))
  }

  const toggleItem = (product: Product) => {
    setItems(prev =>
      prev.some(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    )
  }

  const isInWishlist = (productId: string) => items.some(p => p.id === productId)
  const clearWishlist = () => setItems([])

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, toggleItem, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
