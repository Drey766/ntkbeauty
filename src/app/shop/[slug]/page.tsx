'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import ProductCard from '@/components/shop/ProductCard'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()

  useEffect(() => {
    const supabase = getSupabase()
    supabase.from('products').select('*').eq('slug', slug).single()
      .then(({ data }) => {
        if (data) {
          setProduct(data as Product)
          // Fetch related products
          supabase.from('products').select('*')
            .eq('category', (data as Product).category)
            .neq('id', (data as Product).id)
            .limit(4)
            .then(({ data: rel }) => { if (rel) setRelated(rel as Product[]) })
        }
        setLoading(false)
      })
  }, [slug])

  if (loading) return (
    <div className="section-padding container-site animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square bg-brand-cream rounded-2xl" />
        <div className="space-y-4">
          <div className="h-6 bg-brand-cream rounded w-1/4" />
          <div className="h-10 bg-brand-cream rounded w-3/4" />
          <div className="h-4 bg-brand-cream rounded w-1/3" />
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="section-padding container-site text-center">
      <p className="font-display text-2xl text-brand-dark mb-4">Product not found</p>
      <Link href="/shop" className="btn-primary">Back to Shop</Link>
    </div>
  )

  const inWishlist = isInWishlist(product.id)
  const discountPct = product.original_price && product.original_price > product.price
    ? Math.round((1 - product.price / product.original_price) * 100) : null

  function handleAddToCart() {
    addItem(product!, qty)
    toast.success(`${qty}× ${product!.name.slice(0, 25)}… added to cart ✓`)
  }

  return (
    <div className="section-padding">
      <div className="container-site">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-body text-brand-muted mb-8">
          <Link href="/" className="hover:text-brand-rose transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand-rose transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-brand-dark line-clamp-1">{product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-16">
          {/* Image gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-cream border border-brand-beige">
              <Image
                src={product.images[activeImg] || 'https://placehold.co/600x600'}
                alt={product.name}
                fill className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {discountPct && (
                <div className="absolute top-4 left-4 badge-sale text-sm px-3 py-1">-{discountPct}%</div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={`thumb-${i}`} onClick={() => setActiveImg(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-brand-rose' : 'border-brand-beige hover:border-brand-muted'}`}>
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            {product.brand && (
              <p className="text-xs uppercase tracking-widest text-brand-muted font-body font-semibold mb-2">{product.brand}</p>
            )}
            <h1 className="font-display text-3xl md:text-4xl font-medium text-brand-dark leading-tight mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <svg key={`pd-star-${s}`} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'text-amber-400' : 'text-brand-beige'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm font-body text-brand-muted">{product.rating} ({product.review_count} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="font-display text-3xl font-semibold text-brand-dark">{formatPrice(product.price)}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-lg font-body text-brand-muted line-through">{formatPrice(product.original_price)}</span>
              )}
            </div>

            {/* Skin type badges */}
            {product.skin_types.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="label">Skin Type:</span>
                {product.skin_types.map((st, i) => (
                  <span key={`st-${i}`} className="px-2.5 py-0.5 bg-brand-cream border border-brand-beige text-xs font-body text-brand-dark rounded-full">{st}</span>
                ))}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="font-body text-brand-dark/80 text-sm leading-relaxed mb-6 border-l-2 border-brand-beige pl-4">{product.description}</p>
            )}

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-brand-beige rounded-full overflow-hidden bg-white">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-brand-muted hover:text-brand-rose transition-colors text-lg">−</button>
                <span className="w-8 text-center text-sm font-body font-medium text-brand-dark">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-brand-muted hover:text-brand-rose transition-colors text-lg">+</button>
              </div>
              <button onClick={handleAddToCart} className="btn-primary flex-1 py-3.5 text-base justify-center">
                Add to Cart · {formatPrice(product.price * qty)}
              </button>
              <button onClick={() => { toggleItem(product); toast.success(inWishlist ? 'Removed from wishlist' : '❤️ Saved to wishlist') }}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${inWishlist ? 'bg-brand-rose border-brand-rose text-white' : 'border-brand-beige text-brand-muted hover:border-brand-rose hover:text-brand-rose'}`}>
                <svg className="w-5 h-5" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* WhatsApp CTA */}
            <a href={`https://wa.me/254700000000?text=Hi!%20I'm%20interested%20in%20${encodeURIComponent(product.name)}%20and%20need%20advice.`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-body text-brand-green hover:text-green-700 transition-colors mt-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Not sure if this suits your skin? Chat with us on WhatsApp
            </a>

            {/* Concerns */}
            {product.concerns.length > 0 && (
              <div className="mt-5 pt-5 border-t border-brand-beige">
                <p className="label mb-2">Targets:</p>
                <div className="flex flex-wrap gap-2">
                  {product.concerns.map((c, i) => (
                    <span key={`concern-${i}`} className="badge-clean">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-medium text-brand-dark mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
