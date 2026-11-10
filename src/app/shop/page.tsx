'use client'

// MUST wrap useSearchParams() usage in <Suspense> or production build fails
import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { Product } from '@/types'
import ProductCard from '@/components/shop/ProductCard'
import { PRODUCT_CATEGORIES, SKIN_CONCERNS } from '@/lib/utils'
import { LuSearch } from 'react-icons/lu'

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

function formatConcern(value: string) {
  return value
    .replace(/-/g, ' ')
    .split(' ')
    .map(
      word =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(' ')
}

function ShopContent() {
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [brands, setBrands] = useState<string[]>([])

  // Filter state
  const [category, setCategory] = useState('')
  const [concern, setConcern] = useState('')
  const [brand, setBrand] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('newest')
  const [search, setSearch] = useState('')

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Initialize URL params after mount
  useEffect(() => {
    setCategory(searchParams.get('category') || '')
    setConcern(searchParams.get('concern') || '')
  }, [searchParams])

  // Debounce typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)

      const supabase = getSupabase()

      let query = supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)

      if (category) {
        query = query.eq('category', category)
      }

      if (brand) {
        query = query.eq('brand', brand)
      }

      const min = Number(minPrice)
      const max = Number(maxPrice)

      if (!isNaN(min) && minPrice !== '') {
        query = query.gte('price', min)
      }

      if (!isNaN(max) && maxPrice !== '') {
        query = query.lte('price', max)
      }

      if (debouncedSearch) {
        query = query.ilike(
          'name',
          `%${debouncedSearch}%`
        )
      }

      if (concern) {
        query = query.contains(
          'concerns',
          [formatConcern(concern)]
        )
      }

      switch (sort) {
        case 'price-asc':
          query = query.order('price', {
            ascending: true
          })
          break

        case 'price-desc':
          query = query.order('price', {
            ascending: false
          })
          break

        case 'rating':
          query = query.order('rating', {
            ascending: false
          })
          break

        default:
          query = query.order('created_at', {
            ascending: false
          })
      }

      const { data, error } =
        await query.limit(60)

      if (error) {
        throw error
      }

      setProducts(
        (data as Product[]) || []
      )
    } catch (error) {
      console.error(
        'Failed to fetch products:',
        error
      )
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [
    category,
    concern,
    brand,
    minPrice,
    maxPrice,
    sort,
    debouncedSearch
  ])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const supabase = getSupabase()

        const { data, error } =
          await supabase
            .from('products')
            .select('brand')

        if (error) {
          throw error
        }

        if (data) {
          // Fixed Set build error
          const unique = Array.from(
            new Set(
              data
                .map(
                  (d: {
                    brand: string
                  }) => d.brand
                )
                .filter(Boolean)
            )
          ).sort()

          setBrands(unique)
        }
      } catch (error) {
        console.error(
          'Failed to fetch brands:',
          error
        )
      }
    }

    fetchBrands()
  }, [])

  const clearFilters = () => {
    setCategory('')
    setConcern('')
    setBrand('')
    setMinPrice('')
    setMaxPrice('')
    setSearch('')
    setSort('newest')
  }

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <aside className="hidden lg:block w-56 flex-shrink-0">
        <div className="sticky top-28 space-y-6">

          <div>
            <h3 className="label mb-3">
              Category
            </h3>

            <div className="space-y-1">
              <button
                onClick={() =>
                  setCategory('')
                }
                className={`block w-full text-left text-sm font-body px-3 py-1.5 rounded-lg transition-colors ${
                  !category
                    ? 'bg-brand-rose text-white'
                    : 'text-brand-dark hover:bg-brand-cream'
                }`}
              >
                All Products
              </button>

              {PRODUCT_CATEGORIES.map(
                cat => (
                  <button
                    key={cat.slug}
                    onClick={() =>
                      setCategory(
                        cat.slug
                      )
                    }
                    className={`block w-full text-left text-sm font-body px-3 py-1.5 rounded-lg transition-colors ${
                      category ===
                      cat.slug
                        ? 'bg-brand-rose text-white'
                        : 'text-brand-dark hover:bg-brand-cream'
                    }`}
                  >
                    <cat.icon className="inline-block w-4 h-4 mr-1.5 -mt-0.5" aria-hidden />
                    {cat.label}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <h3 className="label mb-3">
              Skin Concern
            </h3>

            <div className="space-y-1">
              {SKIN_CONCERNS.map(
                c => (
                  <button
                    key={c.slug}
                    onClick={() =>
                      setConcern(
                        concern ===
                          c.slug
                          ? ''
                          : c.slug
                      )
                    }
                    className={`block w-full text-left text-sm font-body px-3 py-1.5 rounded-lg transition-colors ${
                      concern ===
                      c.slug
                        ? 'bg-brand-rose/10 text-brand-rose'
                        : 'text-brand-dark hover:bg-brand-cream'
                    }`}
                  >
                    <c.icon className="inline-block w-4 h-4 mr-1.5 -mt-0.5" aria-hidden />
                    {c.label}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <h3 className="label mb-3">
              Price Range (KShs)
            </h3>

            <div className="flex gap-2 items-center">
              <input
                className="input text-xs py-1.5 px-2"
                placeholder="Min"
                value={minPrice}
                onChange={e =>
                  setMinPrice(
                    e.target.value
                  )
                }
                type="number"
              />

              <span className="text-brand-muted text-xs">
                –
              </span>

              <input
                className="input text-xs py-1.5 px-2"
                placeholder="Max"
                value={maxPrice}
                onChange={e =>
                  setMaxPrice(
                    e.target.value
                  )
                }
                type="number"
              />
            </div>
          </div>

          {brands.length > 0 && (
            <div>
              <h3 className="label mb-3">
                Brand
              </h3>

              <select
                className="input text-sm"
                value={brand}
                onChange={e =>
                  setBrand(
                    e.target.value
                  )
                }
              >
                <option value="">
                  All Brands
                </option>

                {brands.map(
                  b => (
                    <option
                      key={b}
                      value={b}
                    >
                      {b}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          <button
            onClick={clearFilters}
            className="btn-ghost text-xs"
          >
            Clear all filters
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">

        <div className="flex flex-wrap items-center gap-3 mb-6">

          <input
            className="input flex-1 min-w-[180px] max-w-xs"
            placeholder="Search products..."
            value={search}
            onChange={e =>
              setSearch(
                e.target.value
              )
            }
          />

          <select
            className="input w-44"
            value={sort}
            onChange={e =>
              setSort(
                e.target.value
              )
            }
          >
            <option value="newest">
              Newest First
            </option>

            <option value="price-asc">
              Price: Low to High
            </option>

            <option value="price-desc">
              Price: High to Low
            </option>

            <option value="rating">
              Top Rated
            </option>
          </select>

          <p className="text-sm text-brand-muted font-body ml-auto">
            {products.length} products
          </p>
        </div>

        {loading ? (
          <ShopSkeleton />
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <LuSearch className="w-12 h-12 mx-auto mb-4 text-brand-muted" aria-hidden />

            <p className="font-display text-2xl text-brand-dark mb-2">
              No products found
            </p>

            <p className="text-brand-muted font-body text-sm">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {products.map(p => (
              <ProductCard
                key={p.id}
                product={p}
              />
            ))}
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
          <span className="section-tag">
            Our Collection
          </span>

          <h1 className="font-display text-4xl md:text-5xl font-medium text-brand-dark">
            Shop Skincare
          </h1>
        </div>

        <Suspense
          fallback={<ShopSkeleton />}
        >
          <ShopContent />
        </Suspense>
      </div>
    </div>
  )
}