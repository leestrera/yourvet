import { createClient } from '@supabase/supabase-js'

// IMPORTANT: This client uses the SERVICE_ROLE_KEY.
// It bypasses all Row Level Security (RLS) policies.
// ONLY use this in secure server-side API routes or Server Actions
// where you have already validated the user's input/authorization.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
