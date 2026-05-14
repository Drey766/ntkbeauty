import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// Browser client — safe to use in Client Components
export function createSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Singleton for convenience in client components
let _supabase: ReturnType<typeof createSupabaseClient> | null = null
export function getSupabase() {
  if (!_supabase) _supabase = createSupabaseClient()
  return _supabase
}

// Admin client with service role key — ONLY use in API routes (server-side)
// Never import this in client components or pages
export function createSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
