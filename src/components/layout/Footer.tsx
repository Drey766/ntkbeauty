'use client'
// Footer MUST be "use client" — contains newsletter form with onSubmit handler
import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { getSupabase } from '@/lib/supabase'
import { PRODUCT_CATEGORIES } from '@/lib/utils'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const supabase = getSupabase()
      const { error } = await supabase.from('newsletter_subscribers').insert({ email })
      if (error && error.code !== '23505') throw error
      toast.success('You\'re subscribed! ✨')
      setEmail('')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="bg-brand-dark text-white">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="container-site py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-medium mb-1">Join the Glow Club</h3>
            <p className="text-white/60 text-sm font-body">Skincare tips, new arrivals & exclusive offers — straight to your inbox.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm font-body focus:outline-none focus:border-brand-rose w-64 max-w-full"
            />
            <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
              {loading ? 'Joining…' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container-site py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="font-display text-2xl font-semibold mb-3">NT <span className="text-brand-rose">Beauty</span></div>
          <p className="text-white/60 text-sm font-body leading-relaxed mb-5">
            Kenya's home for Korean skincare and premium beauty. Curated for our climate, our skin tones, and our budget.
          </p>
          <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-body px-4 py-2 rounded-full transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat with us
          </a>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-white/40 font-body font-semibold mb-4">Shop</h4>
          <ul className="space-y-2.5">
            {PRODUCT_CATEGORIES.slice(0, 5).map(cat => (
              <li key={cat.slug}>
                <Link href={`/shop?category=${cat.slug}`} className="text-sm font-body text-white/70 hover:text-white transition-colors">{cat.label}</Link>
              </li>
            ))}
            <li><Link href="/shop" className="text-sm font-body text-brand-rose hover:text-brand-rose-light transition-colors">View all →</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-white/40 font-body font-semibold mb-4">Help</h4>
          <ul className="space-y-2.5">
            {[
              { href: '/blog', label: 'Skincare Blog' },
              { href: '/contact', label: 'Contact Us' },
              { href: '/contact#faq', label: 'FAQs' },
              { href: '/cart', label: 'Your Cart' },
              { href: '/wishlist', label: 'Wishlist' },
            ].map(link => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm font-body text-white/70 hover:text-white transition-colors">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-white/40 font-body font-semibold mb-4">Get in Touch</h4>
          <ul className="space-y-2.5 text-sm font-body text-white/70">
            <li>📍 Nairobi, Kenya</li>
            <li><a href="https://wa.me/254700000000" className="hover:text-white transition-colors">WhatsApp: +254 700 000 000</a></li>
            <li><a href="mailto:hello@ntbeauty.co.ke" className="hover:text-white transition-colors">hello@ntbeauty.co.ke</a></li>
            <li className="text-white/40 text-xs pt-2">Mon – Sat: 9am – 6pm EAT</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-site py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs font-body">© {new Date().getFullYear()} NT Beauty Kenya. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs font-body text-white/40">
            <span>M-Pesa accepted</span>
            <span>•</span>
            <span>Delivery nationwide</span>
            <span>•</span>
            <span>Genuine products</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
