'use client'
// Must be client component — same SSR fetch issue as home page
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getSupabase } from '@/lib/supabase'
import { BlogPost } from '@/types'
import { truncate } from '@/lib/utils'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('')

  useEffect(() => {
    const supabase = getSupabase()
    let q = supabase.from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false })
    if (activeCategory) q = q.eq('category', activeCategory)
    q.then(({ data }) => { if (data) setPosts(data as BlogPost[]); setLoading(false) })
  }, [activeCategory])

  const categories = ['Skincare Basics', 'Ingredients', 'K-Beauty', 'Skin Concerns', 'SPF & Sun Care']
  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <div className="section-padding">
      <div className="container-site">
        <div className="text-center mb-12">
          <span className="section-tag mx-auto">Skincare Knowledge</span>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-brand-dark mb-3">The NTK Beauty Blog</h1>
          <p className="text-brand-muted font-body max-w-md mx-auto">Expert skincare advice, ingredient breakdowns, and routine guides — tailored for Kenyan skin.</p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-10 justify-center">
          <button onClick={() => setActiveCategory('')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-body font-medium transition-colors ${!activeCategory ? 'bg-brand-rose text-white' : 'bg-brand-cream text-brand-dark border border-brand-beige hover:border-brand-rose/50'}`}>
            All Posts
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-body font-medium transition-colors ${activeCategory === cat ? 'bg-brand-rose text-white' : 'bg-brand-cream text-brand-dark border border-brand-beige hover:border-brand-rose/50'}`}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`skel-${i}`} className="card animate-pulse">
                <div className="aspect-video bg-brand-beige rounded-t-2xl" />
                <div className="p-5 space-y-2">
                  <div className="h-3 bg-brand-beige rounded w-1/4" />
                  <div className="h-5 bg-brand-beige rounded w-3/4" />
                  <div className="h-3 bg-brand-beige rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="group block card-hover overflow-hidden mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative aspect-video md:aspect-auto min-h-[240px]">
                    <Image src={featured.cover_image} alt={featured.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <span className="badge-new mb-3">Featured</span>
                    <h2 className="font-display text-2xl md:text-3xl font-medium text-brand-dark group-hover:text-brand-rose transition-colors mb-3">{featured.title}</h2>
                    <p className="text-brand-muted font-body text-sm leading-relaxed mb-4">{featured.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-brand-muted font-body">
                      <span>{featured.author_name}</span>
                      <span>•</span>
                      <span>{featured.read_time} min read</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Post grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group card-hover overflow-hidden">
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={post.cover_image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-widest text-brand-rose font-body font-semibold">{post.category}</span>
                      <span className="text-brand-beige text-xs">•</span>
                      <span className="text-xs text-brand-muted font-body">{post.read_time} min read</span>
                    </div>
                    <h2 className="font-display text-lg font-medium text-brand-dark group-hover:text-brand-rose transition-colors mb-2 leading-snug">{post.title}</h2>
                    <p className="text-sm text-brand-muted font-body leading-relaxed">{truncate(post.excerpt, 120)}</p>
                    <p className="text-xs text-brand-muted font-body mt-3">{post.author_name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
