// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "https://parinwztwdzodihkfgcc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhcmlud3p0d2R6b2RpaGtmZ2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMDYzNDYsImV4cCI6MjA3MDU4MjM0Nn0.3ZPdXifUPctv-C3i9IBRjjC8rjfc9aVzYJYnvMif7G8";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "lucero-auth", // <- añade esto
  },
});
