'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

interface Props { open: boolean; onClose: () => void }

export default function CartDrawer({ open, onClose }: Props) {
  const { items, itemCount, subtotal, removeItem, updateQty } = useCart()

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-brand-dark/40 z-50 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-beige">
          <h2 className="font-display text-xl font-semibold text-brand-dark">
            Your Cart {itemCount > 0 && <span className="text-brand-rose">({itemCount})</span>}
          </h2>
          <button onClick={onClose} className="text-brand-muted hover:text-brand-dark transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <div className="text-5xl">🛍️</div>
              <div>
                <p className="font-display text-xl text-brand-dark mb-1">Your cart is empty</p>
                <p className="text-sm text-brand-muted font-body">Add some skincare goodness!</p>
              </div>
              <button onClick={onClose} className="btn-primary mt-2">Browse Products</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.product.id} className="flex gap-3 p-3 bg-brand-cream rounded-xl border border-brand-beige">
                {/* Image */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                  <Image
                    src={item.product.images[0] || 'https://placehold.co/80x80'}
                    alt={item.product.name}
                    fill className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-medium text-brand-dark line-clamp-2 leading-snug">{item.product.name}</p>
                  {item.product.brand && <p className="text-xs text-brand-muted font-body mt-0.5">{item.product.brand}</p>}
                  <div className="flex items-center justify-between mt-2">
                    {/* Qty controls */}
                    <div className="flex items-center gap-2 bg-white rounded-full border border-brand-beige px-2 py-0.5">
                      <button onClick={() => updateQty(item.product.id, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-brand-muted hover:text-brand-rose transition-colors text-sm">−</button>
                      <span className="text-xs font-body font-medium text-brand-dark w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.product.id, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-brand-muted hover:text-brand-rose transition-colors text-sm">+</button>
                    </div>
                    <p className="text-sm font-body font-semibold text-brand-dark">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                </div>

                {/* Remove */}
                <button onClick={() => removeItem(item.product.id)}
                  className="text-brand-beige hover:text-brand-rose transition-colors self-start mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer summary */}
        {items.length > 0 && (
          <div className="border-t border-brand-beige p-5 space-y-3">
            <div className="flex items-center justify-between text-sm font-body">
              <span className="text-brand-muted">Subtotal</span>
              <span className="font-semibold text-brand-dark">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-brand-muted font-body">Shipping calculated at checkout</p>
            <Link href="/checkout" onClick={onClose} className="btn-primary w-full justify-center text-base py-3.5">
              Checkout with M-Pesa
            </Link>
            <Link href="/cart" onClick={onClose} className="btn-outline w-full justify-center">
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
