'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import { BlogPost } from '@/types'

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [related, setRelated] = useState<BlogPost[]>([])

  useEffect(() => {
    const supabase = getSupabase()
    supabase.from('blog_posts').select('*').eq('slug', slug).single()
      .then(({ data }) => {
        if (data) {
          setPost(data as BlogPost)
          supabase.from('blog_posts').select('*').eq('published', true).neq('slug', slug).limit(3)
            .then(({ data: rel }) => { if (rel) setRelated(rel as BlogPost[]) })
        }
      })
  }, [slug])

  if (!post) return (
    <div className="section-padding container-site animate-pulse">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="aspect-video bg-brand-cream rounded-2xl" />
        <div className="h-10 bg-brand-cream rounded w-3/4" />
        <div className="h-4 bg-brand-cream rounded w-full" />
        <div className="h-4 bg-brand-cream rounded w-5/6" />
      </div>
    </div>
  )

  return (
    <article className="section-padding">
      <div className="container-site max-w-3xl">
        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-brand-muted hover:text-brand-rose transition-colors font-body mb-6">
          ← Back to Blog
        </Link>

        {/* Category & read time */}
        <div className="flex items-center gap-3 mb-3">
          <span className="badge-new">{post.category}</span>
          <span className="text-xs text-brand-muted font-body">{post.read_time} min read</span>
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl md:text-5xl font-medium text-brand-dark leading-tight mb-4">{post.title}</h1>

        {/* Author */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-brand-beige">
          <div className="w-9 h-9 rounded-full bg-brand-rose/10 flex items-center justify-center text-brand-rose font-body font-semibold text-sm">
            {post.author_name[0]}
          </div>
          <div>
            <p className="text-sm font-body font-medium text-brand-dark">{post.author_name}</p>
            <p className="text-xs text-brand-muted font-body">NT Beauty Editorial</p>
          </div>
          {/* Share */}
          <div className="ml-auto flex gap-2">
            <a href={`https://wa.me/?text=${encodeURIComponent(post.title + ' — read on NT Beauty')}`} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-brand-cream border border-brand-beige flex items-center justify-center text-brand-muted hover:text-brand-green transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>

        {/* Cover image */}
        <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
          <Image src={post.cover_image} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" priority />
        </div>

        {/* Content */}
        <div className="prose-article" dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* CTA */}
        <div className="mt-12 p-6 card text-center">
          <h3 className="font-display text-2xl font-medium text-brand-dark mb-2">Ready to Start Your Routine?</h3>
          <p className="text-brand-muted font-body text-sm mb-4">Shop the products mentioned in this article — or get personalised advice on WhatsApp.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/shop" className="btn-primary">Shop Now</Link>
            <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="btn-outline">Get Free Advice</a>
          </div>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="container-site mt-16">
          <h2 className="font-display text-2xl font-medium text-brand-dark mb-6">More from the Blog</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map(rp => (
              <Link key={rp.id} href={`/blog/${rp.slug}`} className="group card-hover overflow-hidden">
                <div className="relative aspect-video overflow-hidden">
                  <Image src={rp.cover_image} alt={rp.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="33vw" />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-medium text-brand-dark group-hover:text-brand-rose transition-colors">{rp.title}</h3>
                  <p className="text-xs text-brand-muted font-body mt-1">{rp.read_time} min read</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
