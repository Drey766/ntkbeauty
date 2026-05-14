'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-brand-cream">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600&q=85"
          alt="Skincare products flat lay"
          fill
          className="object-cover object-center opacity-30"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-cream via-brand-cream/80 to-transparent" />
      </div>

      <div className="container-site relative z-10 py-20">
        <div className="max-w-xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-brand-rose/10 border border-brand-rose/20 text-brand-rose text-xs font-body font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            🌸 K-Beauty in Kenya
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-medium text-brand-dark leading-[1.1] mb-6">
            Your Skin
            <br />
            <em className="text-brand-rose font-light">Deserves</em>
            <br />
            the Best
          </h1>

          {/* Subheadline */}
          <p className="font-body text-brand-muted text-lg leading-relaxed mb-8 max-w-md">
            Genuine Korean skincare and luxury beauty products, curated for Kenyan skin and our climate. Pay with M-Pesa. Get expert advice free.
          </p>

          {/* CTA group */}
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="btn-primary text-base px-8 py-4">
              Shop Now
            </Link>
            <a href="https://wa.me/254700000000?text=Hi!%20I%20need%20help%20choosing%20skincare%20products."
              target="_blank" rel="noopener noreferrer"
              className="btn-outline text-base px-8 py-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Free Skin Consultation
            </a>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center gap-6 mt-10 text-xs font-body text-brand-muted">
            <span className="flex items-center gap-1.5"><span className="text-brand-green">✓</span> Genuine products</span>
            <span className="flex items-center gap-1.5"><span className="text-brand-green">✓</span> M-Pesa accepted</span>
            <span className="flex items-center gap-1.5"><span className="text-brand-green">✓</span> Nationwide delivery</span>
            <span className="flex items-center gap-1.5"><span className="text-brand-green">✓</span> Free skin advice</span>
          </div>
        </div>
      </div>

      {/* Floating product card — decorative */}
      <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2 z-10">
        <div className="card p-6 w-52 shadow-card-hover rotate-3 hover:rotate-0 transition-transform duration-500">
          <div className="relative h-40 rounded-xl overflow-hidden mb-3 bg-white">
            <Image
              src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80"
              alt="Serum"
              fill className="object-cover"
              sizes="208px"
            />
          </div>
          <p className="text-xs text-brand-muted font-body">COSRX</p>
          <p className="text-sm font-body font-medium text-brand-dark">Advanced Snail 96 Mucin Power Essence</p>
          <p className="text-sm font-body font-semibold text-brand-rose mt-1">KShs 2,500</p>
        </div>
      </div>
    </section>
  )
}
