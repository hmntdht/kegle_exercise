import { createClient } from '@supabase/supabase-js'

// These come from your Supabase project settings (Project Settings -> API).
// Set them in a .env.local file — see .env.example for the exact variable names.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // The app still runs fully offline without these — sync is just disabled.
  console.warn(
    '[kegel-trainer] Supabase env vars are missing. Cross-device sync is disabled until ' +
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set (see .env.example).'
  )
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)
