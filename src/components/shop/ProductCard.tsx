'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/types'
import toast from 'react-hot-toast'
import { LuCheck } from 'react-icons/lu'

interface Props { product: Product }

export default function ProductCard({ product }: Props) {
  const { addItem, isInCart } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const [imgError, setImgError] = useState(false)
  const inWishlist = isInWishlist(product.id)
  const inCart = isInCart(product.id)

  const discountPct = product.original_price && product.original_price > product.price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    addItem(product)
    toast.success(`Added to cart`)
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    toggleItem(product)
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="card-hover relative overflow-hidden">
        <div className="relative aspect-square bg-white overflow-hidden">
          <Image
            src={imgError ? 'https://placehold.co/400x400/F5F0EA/9C8B7A?text=NT+Beauty' : (product.images[0] || 'https://placehold.co/400x400')}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImgError(true)}
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_new && <span className="badge-new">New</span>}
            {discountPct && <span className="badge-sale">-{discountPct}%</span>}
          </div>
          <button onClick={handleWishlist}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-card transition-all duration-200 ${inWishlist ? 'bg-brand-rose text-white' : 'bg-white/90 text-brand-muted hover:text-brand-rose hover:bg-white'}`}>
            <svg className="w-4 h-4" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button onClick={handleAddToCart}
              className={`w-full py-3 text-sm font-body font-medium transition-colors ${inCart ? 'bg-brand-green text-white' : 'bg-brand-dark text-white hover:bg-brand-rose'}`}>
              {inCart ? <span className="inline-flex items-center justify-center gap-1.5"><LuCheck className="w-4 h-4" aria-hidden /> In Cart</span> : 'Quick Add'}
            </button>
          </div>
        </div>
        <div className="p-3">
          {product.brand && <p className="text-[10px] uppercase tracking-widest text-brand-muted font-body font-medium mb-0.5">{product.brand}</p>}
          <h3 className="text-sm font-body font-medium text-brand-dark line-clamp-2 leading-snug mb-2 group-hover:text-brand-rose transition-colors">{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[1,2,3,4,5].map(star => (
                <svg key={`star-${product.id}-${star}`} className={`w-3 h-3 ${star <= Math.round(product.rating) ? 'text-amber-400' : 'text-brand-beige'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <span className="text-[10px] text-brand-muted font-body">({product.review_count})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-body font-semibold text-brand-dark">{formatPrice(product.price)}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-xs font-body text-brand-muted line-through">{formatPrice(product.original_price)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
