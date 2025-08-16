import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing');
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
