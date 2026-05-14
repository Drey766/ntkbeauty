import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const limit = parseInt(searchParams.get('limit') || '20')

  const supabase = createSupabaseAdmin()
  let query = supabase.from('products').select('*').eq('in_stock', true)

  if (category) query = query.eq('category', category)
  if (featured === 'true') query = query.eq('is_featured', true)

  const { data, error } = await query.order('created_at', { ascending: false }).limit(limit)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
