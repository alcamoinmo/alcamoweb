import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const supabaseUrl = 'https://ndouarmfpuzdfnkbulay.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kb3Vhcm1mcHV6ZGZua2J1bGF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjE1MzUsImV4cCI6MjA2NDYzNzUzNX0.QqoaE5JT5v5F_UThdvcdb-KgCjIUwCkk5kmWveNezdA'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey) 