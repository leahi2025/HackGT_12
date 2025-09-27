import { createClient } from '@supabase/supabase-js'

// Vite exposes client-side env vars through import.meta.env and
// only variables prefixed with VITE_ are exposed to the browser.
// Make sure your frontend/.env contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
const SUPABASE_DATABASE_URL = import.meta.env.VITE_SUPABASE_DATABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_DATABASE_URL || !SUPABASE_ANON_KEY) {
  // Throwing early helps spot misconfiguration during development.
  throw new Error(
    'Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env and restart the dev server.'
  )
}

const supabase = createClient(SUPABASE_DATABASE_URL, SUPABASE_ANON_KEY)

// Export the client so other modules can import it and so ESLint doesn't
// report it as an unused variable.
export default supabase