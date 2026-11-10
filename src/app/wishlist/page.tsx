'use client'
import Link from 'next/link'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import ProductCard from '@/components/shop/ProductCard'
import toast from 'react-hot-toast'
import { LuHeart } from 'react-icons/lu'

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlist()
  const { addItem } = useCart()

  function addAllToCart() {
    items.forEach(p => addItem(p))
    toast.success(`${items.length} items added to cart`)
  }

  return (
    <div className="section-padding">
      <div className="container-site">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="section-tag">Your Saved Items</span>
            <h1 className="font-display text-4xl font-medium text-brand-dark">Wishlist</h1>
          </div>
          {items.length > 0 && (
            <div className="flex gap-3">
              <button onClick={addAllToCart} className="btn-primary">Move All to Cart</button>
              <button onClick={clearWishlist} className="btn-outline">Clear All</button>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <LuHeart className="w-16 h-16 mx-auto mb-5 text-brand-rose" aria-hidden />
            <h2 className="font-display text-2xl text-brand-dark mb-3">Your wishlist is empty</h2>
            <p className="text-brand-muted font-body text-sm mb-8">Save products you love by clicking the heart icon</p>
            <Link href="/shop" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
