'use client'
// Home page MUST be a Client Component — server-side Supabase fetch fails in local dev
import { useEffect, useState } from 'react'
import { getSupabase } from '@/lib/supabase'
import { Product } from '@/types'
import HeroSection from '@/components/home/HeroSection'
import {
  MarqueeBar, CategoryGrid, FeaturedProducts,
  SkinConcernSection, Testimonials, WhatsAppCTA, InstagramFeed
} from '@/components/home/HomeSections'

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])

  useEffect(() => {
    const supabase = getSupabase()
    supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('in_stock', true)
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => { if (data) setFeatured(data as Product[]) })
  }, [])

  return (
    <>
      <HeroSection />
      <MarqueeBar />
      <CategoryGrid />
      <FeaturedProducts products={featured} />
      <SkinConcernSection />
      <WhatsAppCTA />
      <Testimonials />
      <InstagramFeed />
    </>
  )
}
