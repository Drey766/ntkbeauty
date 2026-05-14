'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useAuth } from '@/context/AuthContext'
import CartDrawer from '@/components/cart/CartDrawer'
import AuthModal from '@/components/ui/AuthModal'
import { PRODUCT_CATEGORIES } from '@/lib/utils'

export default function Navbar() {
  const { itemCount } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { user, signOut, isAdmin } = useAuth()
  const [cartOpen, setCartOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-brand-white/95 backdrop-blur-md shadow-card' : 'bg-brand-white'}`}>
        {/* Announcement bar */}
        <div className="bg-brand-dark text-white text-xs text-center py-2 px-4 font-body tracking-wide">
          🌸 Free delivery on orders over KShs 5,000 &nbsp;|&nbsp; Pay with M-Pesa &nbsp;|&nbsp; <a href="https://wa.me/254700000000" className="underline hover:text-brand-rose transition-colors">WhatsApp us for skin advice</a>
        </div>

        <div className="container-site">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="font-display text-2xl font-semibold text-brand-dark tracking-wide hover:text-brand-rose transition-colors">
              NT <span className="text-brand-rose">Beauty</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-body text-brand-dark hover:text-brand-rose transition-colors">Home</Link>
              <div className="relative group" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
                <Link href="/shop" className="text-sm font-body text-brand-dark hover:text-brand-rose transition-colors flex items-center gap-1">
                  Shop
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </Link>
                {shopOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-brand-beige rounded-2xl shadow-card-hover p-4 grid grid-cols-3 gap-2 w-64 animate-fade-in">
                    {PRODUCT_CATEGORIES.map(cat => (
                      <Link key={cat.slug} href={`/shop?category=${cat.slug}`}
                        className="flex flex-col items-center text-center p-2 rounded-xl hover:bg-brand-cream transition-colors group/item">
                        <span className="text-xl mb-1">{cat.emoji}</span>
                        <span className="text-[11px] font-body text-brand-dark group-hover/item:text-brand-rose transition-colors leading-tight">{cat.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link href="/blog" className="text-sm font-body text-brand-dark hover:text-brand-rose transition-colors">Blog</Link>
              <Link href="/contact" className="text-sm font-body text-brand-dark hover:text-brand-rose transition-colors">Contact</Link>
              {isAdmin && <Link href="/admin" className="text-sm font-body text-brand-rose font-medium hover:text-brand-rose-dark transition-colors">Admin</Link>}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <Link href="/shop" className="text-brand-dark hover:text-brand-rose transition-colors hidden md:block">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative text-brand-dark hover:text-brand-rose transition-colors hidden md:block">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-rose text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{wishlistItems.length}</span>
                )}
              </Link>

              {/* Auth */}
              {user ? (
                <button onClick={signOut} className="hidden md:block text-xs font-body text-brand-muted hover:text-brand-rose transition-colors">Sign Out</button>
              ) : (
                <button onClick={() => setAuthOpen(true)} className="hidden md:block text-brand-dark hover:text-brand-rose transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </button>
              )}

              {/* Cart */}
              <button onClick={() => setCartOpen(true)} className="relative text-brand-dark hover:text-brand-rose transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-rose text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{itemCount}</span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-brand-dark">
                {mobileOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-brand-white border-t border-brand-beige px-4 py-4 space-y-3 animate-fade-in">
            {[{ href: '/', label: 'Home' }, { href: '/shop', label: 'Shop' }, { href: '/blog', label: 'Blog' }, { href: '/contact', label: 'Contact' }, { href: '/wishlist', label: 'Wishlist' }].map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className="block text-sm font-body text-brand-dark hover:text-brand-rose transition-colors py-1">{link.label}</Link>
            ))}
            {isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)} className="block text-sm font-body text-brand-rose font-medium py-1">Admin</Link>}
            {user ? (
              <button onClick={() => { signOut(); setMobileOpen(false) }} className="block text-sm font-body text-brand-muted py-1">Sign Out</button>
            ) : (
              <button onClick={() => { setAuthOpen(true); setMobileOpen(false) }} className="block text-sm font-body text-brand-dark py-1">Sign In</button>
            )}
          </div>
        )}
      </header>

      {/* Spacer for fixed header + announcement bar */}
      <div className="h-[88px]" />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
