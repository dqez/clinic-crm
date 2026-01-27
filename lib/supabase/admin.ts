import "server-only"

import { createClient } from '@supabase/supabase-js'
import { Database } from '../database.types'
import { getSupabaseEnv } from './env'

export const createAdminClient = () => {
  const { url: supabaseUrl, serviceRoleKey: supabaseServiceKey } = getSupabaseEnv();

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }


  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
