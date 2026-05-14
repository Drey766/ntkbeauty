'use client'
// MUST wrap useSearchParams() usage in <Suspense> or production build fails
import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { Product } from '@/types'
import ProductCard from '@/components/shop/ProductCard'
import { PRODUCT_CATEGORIES, SKIN_CONCERNS } from '@/lib/utils'

function ShopSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={`skel-${i}`} className="card animate-pulse">
          <div className="aspect-square bg-brand-beige rounded-t-2xl" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-brand-beige rounded w-1/3" />
            <div className="h-3 bg-brand-beige rounded w-full" />
            <div className="h-3 bg-brand-beige rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ShopContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [brands, setBrands] = useState<string[]>([])

  // Filter state
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [concern, setConcern] = useState(searchParams.get('concern') || '')
  const [brand, setBrand] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('newest')
  const [search, setSearch] = useState('')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const supabase = getSupabase()
    let query = supabase.from('products').select('*').eq('in_stock', true)
    if (category) query = query.eq('category', category)
    if (brand) query = query.eq('brand', brand)
    if (minPrice) query = query.gte('price', parseInt(minPrice))
    if (maxPrice) query = query.lte('price', parseInt(maxPrice))
    if (search) query = query.ilike('name', `%${search}%`)
    if (concern) query = query.contains('concerns', [concern.replace(/-/g, ' ').split(' ').map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ')])

    if (sort === 'price-asc') query = query.order('price', { ascending: true })
    else if (sort === 'price-desc') query = query.order('price', { ascending: false })
    else if (sort === 'rating') query = query.order('rating', { ascending: false })
    else query = query.order('created_at', { ascending: false })

    const { data } = await query.limit(60)
    setProducts((data as Product[]) || [])
    setLoading(false)
  }, [category, concern, brand, minPrice, maxPrice, sort, search])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // Fetch distinct brands once
  useEffect(() => {
    const supabase = getSupabase()
    supabase.from('products').select('brand').then(({ data }) => {
      if (data) {
        const unique = [...new Set(data.map((d: { brand: string }) => d.brand).filter(Boolean))].sort()
        setBrands(unique as string[])
      }
    })
  }, [])

  return (
    <div className="flex gap-8">
      {/* Sidebar filters */}
      <aside className="hidden lg:block w-56 flex-shrink-0">
        <div className="sticky top-28 space-y-6">
          <div>
            <h3 className="label mb-3">Category</h3>
            <div className="space-y-1">
              <button onClick={() => setCategory('')}
                className={`block w-full text-left text-sm font-body px-3 py-1.5 rounded-lg transition-colors ${!category ? 'bg-brand-rose text-white' : 'text-brand-dark hover:bg-brand-cream'}`}>
                All Products
              </button>
              {PRODUCT_CATEGORIES.map(cat => (
                <button key={cat.slug} onClick={() => setCategory(cat.slug)}
                  className={`block w-full text-left text-sm font-body px-3 py-1.5 rounded-lg transition-colors ${category === cat.slug ? 'bg-brand-rose text-white' : 'text-brand-dark hover:bg-brand-cream'}`}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="label mb-3">Skin Concern</h3>
            <div className="space-y-1">
              {SKIN_CONCERNS.map(c => (
                <button key={c.slug} onClick={() => setConcern(concern === c.slug ? '' : c.slug)}
                  className={`block w-full text-left text-sm font-body px-3 py-1.5 rounded-lg transition-colors ${concern === c.slug ? 'bg-brand-rose/10 text-brand-rose' : 'text-brand-dark hover:bg-brand-cream'}`}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="label mb-3">Price Range (KShs)</h3>
            <div className="flex gap-2 items-center">
              <input className="input text-xs py-1.5 px-2" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} type="number" />
              <span className="text-brand-muted text-xs">–</span>
              <input className="input text-xs py-1.5 px-2" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} type="number" />
            </div>
          </div>

          {brands.length > 0 && (
            <div>
              <h3 className="label mb-3">Brand</h3>
              <select className="input text-sm" value={brand} onChange={e => setBrand(e.target.value)}>
                <option value="">All Brands</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          )}

          <button onClick={() => { setCategory(''); setConcern(''); setBrand(''); setMinPrice(''); setMaxPrice(''); setSearch('') }}
            className="btn-ghost text-xs">
            Clear all filters
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <input
            className="input flex-1 min-w-[180px] max-w-xs"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="input w-44" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <p className="text-sm text-brand-muted font-body ml-auto">{products.length} products</p>
        </div>

        {/* Mobile category chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 lg:hidden">
          <button onClick={() => setCategory('')} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors ${!category ? 'bg-brand-rose text-white' : 'bg-brand-cream text-brand-dark border border-brand-beige'}`}>All</button>
          {PRODUCT_CATEGORIES.map(cat => (
            <button key={cat.slug} onClick={() => setCategory(cat.slug)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors ${category === cat.slug ? 'bg-brand-rose text-white' : 'bg-brand-cream text-brand-dark border border-brand-beige'}`}>
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <ShopSkeleton />
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="font-display text-2xl text-brand-dark mb-2">No products found</p>
            <p className="text-brand-muted font-body text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <div className="section-padding">
      <div className="container-site">
        <div className="mb-8">
          <span className="section-tag">Our Collection</span>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-brand-dark">Shop Skincare</h1>
        </div>
        {/* Suspense wrapper required because ShopContent uses useSearchParams() */}
        <Suspense fallback={<ShopSkeleton />}>
          <ShopContent />
        </Suspense>
      </div>
    </div>
  )
}
