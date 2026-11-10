import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { AuthProvider } from '@/context/AuthContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'NTK Beauty — Korean & Luxury Skincare in Kenya', template: '%s | NTK Beauty' },
  description: 'Shop premium Korean skincare, serums, sunscreens and beauty products in Kenya. Free advice, fast delivery, M-Pesa payments.',
  keywords: ['skincare Kenya', 'Korean skincare Nairobi', 'beauty products Kenya', 'sunscreen Kenya', 'serums Kenya'],
  openGraph: {
    title: 'NTK Beauty — Korean & Luxury Skincare in Kenya',
    description: 'Premium skincare curated for Kenyan skin. K-Beauty, serums, SPF and more.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="bg-brand-white text-brand-dark font-body antialiased">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#FDFCFB',
                    color: '#2C2019',
                    border: '1px solid #E8DDD0',
                    borderRadius: '12px',
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: '14px',
                  },
                }}
              />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
