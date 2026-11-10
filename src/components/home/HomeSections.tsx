'use client'
import Link from 'next/link'
import Image from 'next/image'
import { PRODUCT_CATEGORIES, SKIN_CONCERNS } from '@/lib/utils'
import { LuSparkle } from 'react-icons/lu'
import ProductCard from '@/components/shop/ProductCard'
import { Product } from '@/types'

// ── Marquee brand strip ───────────────────────────────────────────────────────
const BRANDS = ['COSRX', 'Some By Mi', 'Anua', 'Skin1004', 'Beauty of Joseon', 'Purito', 'Tirtir', 'Etude', 'Laneige', 'Innisfree', 'Klairs', 'Dr. Jart+', 'Torriden', 'Axis-Y']

export function MarqueeBar() {
  return (
    <div className="bg-brand-cream border-y border-brand-beige py-4 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...BRANDS, ...BRANDS].map((brand, i) => (
          <span key={`brand-${i}`} className="mx-8 text-sm font-display font-medium text-brand-muted tracking-wide">
            {brand} <LuSparkle className="inline-block mx-4 w-3 h-3 text-brand-beige" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Category grid ────────────────────────────────────────────────────────────
const CAT_IMAGES: Record<string, string> = {
  cleansers: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
  serums: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
  moisturizers: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400&q=80',
  sunscreen: 'https://images.unsplash.com/photo-1533643767029-0a5d02c5041f?w=400&q=80',
  toners: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80',
  masks: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80',
  eyecare: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&q=80',
  treatments: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80',
  bodycare: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80',
}

export function CategoryGrid() {
  return (
    <section className="section-padding bg-brand-white">
      <div className="container-site">
        <div className="text-center mb-10">
          <span className="section-tag mx-auto">Shop by Category</span>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-brand-dark">Find Your Routine</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {PRODUCT_CATEGORIES.map(cat => (
            <Link key={cat.slug} href={`/shop?category=${cat.slug}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
              <Image
                src={CAT_IMAGES[cat.slug] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80'}
                alt={cat.label}
                fill className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <cat.icon className="w-5 h-5 mb-1" aria-hidden />
                <p className="font-display text-sm font-medium leading-tight">{cat.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Featured products ─────────────────────────────────────────────────────────
export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-site">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="section-tag">Bestsellers</span>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-brand-dark">Community Favourites</h2>
          </div>
          <Link href="/shop?featured=true" className="btn-ghost hidden md:flex">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-8 md:hidden">
          <Link href="/shop?featured=true" className="btn-outline">View All Favourites</Link>
        </div>
      </div>
    </section>
  )
}

// ── Skin concern section ──────────────────────────────────────────────────────
export function SkinConcernSection() {
  return (
    <section className="section-padding bg-brand-white">
      <div className="container-site">
        <div className="text-center mb-10">
          <span className="section-tag mx-auto">Shop by Concern</span>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-brand-dark">What Does Your Skin Need?</h2>
          <p className="text-brand-muted font-body mt-3 max-w-md mx-auto text-sm">
            Every skin concern has a solution. We'll help you find yours.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {SKIN_CONCERNS.map(concern => (
            <Link key={concern.slug} href={`/shop?concern=${concern.slug}`}
              className="group card-hover p-5 text-center hover:border-brand-rose/40">
              <concern.icon className="w-8 h-8 mx-auto mb-3 text-brand-rose" aria-hidden />
              <h3 className="font-body font-semibold text-sm text-brand-dark group-hover:text-brand-rose transition-colors mb-1">{concern.label}</h3>
              <p className="text-xs text-brand-muted font-body leading-snug">{concern.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'Amina W.', location: 'Nairobi', text: 'Finally found a store that actually understands Kenyan skin! My hyperpigmentation has improved so much with the serums I found here.', rating: 5 },
  { name: 'Grace K.', location: 'Mombasa', text: 'The WhatsApp consultation was amazing — they recommended exactly what I needed for my oily skin. Fast delivery and genuine products!', rating: 5 },
  { name: 'Lilian M.', location: 'Kisumu', text: 'Been buying K-beauty products from NTK Beauty for 8 months now. The quality is unmatched and M-Pesa payment makes it so easy.', rating: 5 },
  { name: 'Faith N.', location: 'Eldoret', text: 'My skin has never looked better. The sunscreen recommendations are perfect for our Kenyan climate.', rating: 5 },
]

export function Testimonials() {
  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-site">
        <div className="text-center mb-10">
          <span className="section-tag mx-auto">Reviews</span>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-brand-dark">Real Skin, Real Results</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={`testimonial-${i}`} className="card p-5">
              <div className="flex mb-3">
                {[1,2,3,4,5].map(s => (
                  <svg key={`ts-${i}-${s}`} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-sm font-body text-brand-dark/80 leading-relaxed mb-4 italic">"{t.text}"</p>
              <div>
                <p className="text-sm font-body font-semibold text-brand-dark">{t.name}</p>
                <p className="text-xs text-brand-muted font-body">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── WhatsApp consultation CTA ─────────────────────────────────────────────────
export function WhatsAppCTA() {
  return (
    <section className="py-12 bg-brand-green/10 border-y border-brand-green/20">
      <div className="container-site flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h3 className="font-display text-2xl font-medium text-brand-dark mb-1">Not sure what's right for your skin?</h3>
          <p className="text-brand-muted font-body text-sm">Our skincare experts are ready to help — for free. Chat with us on WhatsApp.</p>
        </div>
        <a href="https://wa.me/254700000000?text=Hi!%20I%20need%20skincare%20advice."
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white font-body font-medium px-6 py-3 rounded-full transition-all duration-200 hover:shadow-lg whitespace-nowrap">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Chat with a Skin Expert
        </a>
      </div>
    </section>
  )
}

// ── Instagram teaser ─────────────────────────────────────────────────────────
export function InstagramFeed() {
  const imgs = [
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=300&q=80',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80',
    'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=300&q=80',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&q=80',
  ]
  return (
    <section className="section-padding bg-brand-white">
      <div className="container-site text-center">
        <span className="section-tag mx-auto">@ntkbeautykenya</span>
        <h2 className="font-display text-3xl font-medium text-brand-dark mb-8">Follow Our Journey</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
          {imgs.map((src, i) => (
            <a key={`insta-${i}`} href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="relative aspect-square overflow-hidden rounded-xl group">
              <Image src={src} alt={`Instagram ${i+1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="200px" />
              <div className="absolute inset-0 bg-brand-rose/0 group-hover:bg-brand-rose/20 transition-colors duration-300 flex items-center justify-center">
                <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            </a>
          ))}
        </div>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn-outline">Follow on Instagram</a>
      </div>
    </section>
  )
}
