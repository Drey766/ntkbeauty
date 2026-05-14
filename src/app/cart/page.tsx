'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { formatPrice, getShippingFee } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, itemCount, subtotal, removeItem, updateQty, clearCart } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const shippingFee = subtotal >= 5000 ? 0 : getShippingFee('Nairobi')
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0
  const total = subtotal - discount + shippingFee

  function applyPromo(e: React.FormEvent) {
    e.preventDefault()
    if (promoCode.toUpperCase() === 'GLOW10') {
      setPromoApplied(true)
      toast.success('Promo applied — 10% off! 🎉')
    } else {
      toast.error('Invalid promo code')
    }
  }

  if (items.length === 0) return (
    <div className="section-padding container-site text-center">
      <div className="text-6xl mb-6">🛍️</div>
      <h1 className="font-display text-3xl font-medium text-brand-dark mb-3">Your cart is empty</h1>
      <p className="text-brand-muted font-body mb-8">Start adding your favourite skincare products!</p>
      <Link href="/shop" className="btn-primary text-base px-8 py-4">Browse Products</Link>
    </div>
  )

  return (
    <div className="section-padding">
      <div className="container-site">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-medium text-brand-dark">Your Cart <span className="text-brand-muted font-light text-2xl">({itemCount} items)</span></h1>
          <button onClick={clearCart} className="text-xs text-brand-muted hover:text-brand-rose font-body transition-colors">Clear all</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Line items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.product.id} className="card p-4 flex gap-4 items-center">
                <Link href={`/shop/${item.product.slug}`} className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-brand-beige">
                  <Image src={item.product.images[0] || 'https://placehold.co/80x80'} alt={item.product.name} fill className="object-cover" sizes="80px" />
                </Link>
                <div className="flex-1 min-w-0">
                  {item.product.brand && <p className="text-xs text-brand-muted font-body">{item.product.brand}</p>}
                  <Link href={`/shop/${item.product.slug}`}>
                    <p className="text-sm font-body font-medium text-brand-dark hover:text-brand-rose transition-colors line-clamp-2">{item.product.name}</p>
                  </Link>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-brand-beige rounded-full overflow-hidden bg-white">
                      <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-brand-muted hover:text-brand-rose transition-colors">−</button>
                      <span className="w-7 text-center text-xs font-body font-medium text-brand-dark">{item.quantity}</span>
                      <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-brand-muted hover:text-brand-rose transition-colors">+</button>
                    </div>
                    <p className="text-sm font-body font-semibold text-brand-dark">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                </div>
                <button onClick={() => removeItem(item.product.id)} className="text-brand-beige hover:text-brand-rose transition-colors flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-28">
              <h2 className="font-display text-xl font-medium text-brand-dark mb-5">Order Summary</h2>
              <div className="space-y-3 text-sm font-body mb-5">
                <div className="flex justify-between"><span className="text-brand-muted">Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-brand-green"><span>Promo (GLOW10)</span><span>−{formatPrice(discount)}</span></div>}
                <div className="flex justify-between"><span className="text-brand-muted">Shipping</span><span className={shippingFee === 0 ? 'text-brand-green font-medium' : 'font-medium'}>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span></div>
                {subtotal < 5000 && <p className="text-xs text-brand-muted">Add {formatPrice(5000 - subtotal)} more for free delivery</p>}
              </div>
              <div className="border-t border-brand-beige pt-4 mb-5">
                <div className="flex justify-between font-body font-semibold text-brand-dark">
                  <span>Total</span><span className="text-lg">{formatPrice(total)}</span>
                </div>
              </div>
              {/* Promo code */}
              <form onSubmit={applyPromo} className="flex gap-2 mb-4">
                <input className="input flex-1 text-sm py-2" placeholder="Promo code" value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} disabled={promoApplied} />
                <button type="submit" disabled={promoApplied} className="btn-outline px-3 py-2 text-xs rounded-lg">Apply</button>
              </form>
              <Link href="/checkout" className="btn-primary w-full justify-center py-3.5 text-base">Proceed to Checkout</Link>
              <Link href="/shop" className="btn-ghost w-full justify-center mt-2 text-sm">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
