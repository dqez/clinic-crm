"use client"

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '../database.types'
import { getSupabaseEnv } from './env';

export const createClient = () => {

    const { url: supabaseUrl, anonKey: supabaseAnonKey } = getSupabaseEnv();
  
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
      );
    }
    
  createBrowserClient<Database>(
    supabaseUrl, supabaseAnonKey
  )
}
