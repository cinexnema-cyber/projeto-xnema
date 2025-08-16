import { createClient } from '@supabase/supabase-js';

// Environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yddjuglsfqyajdykkoqv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sbp_7a9e632ca0f3b0f06f3a40cf402ddbaf013497e3';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing');
  throw new Error('Supabase configuration is required');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  username: string;
  display_name: string;
  bio?: string;
  subscription_status: 'active' | 'inactive' | 'trial';
  subscription_start?: string;
  subscription_end?: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'inactive' | 'cancelled' | 'trial';
  plan_type: 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  payment_method?: string;
  created_at: string;
  updated_at: string;
}
