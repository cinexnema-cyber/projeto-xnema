import { supabase } from './supabase';
import { User } from './supabase';

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  displayName: string;
  bio?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  // Register new user
  static async register(userData: RegisterData): Promise<{ user: User | null; error: string | null }> {
    try {
      // First, create auth user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Failed to create user' };
      }

      // Then create user profile in our users table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: userData.email,
          username: userData.username,
          display_name: userData.displayName,
          bio: userData.bio || '',
          subscription_status: 'inactive'
        }])
        .select()
        .single();

      if (profileError) {
        // If profile creation fails, we should cleanup the auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        return { user: null, error: profileError.message };
      }

      return { user: userProfile, error: null };
    } catch (error) {
      return { user: null, error: 'Registration failed' };
    }
  }

  // Login user
  static async login(loginData: LoginData): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Login failed' };
      }

      // Get user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        return { user: null, error: 'Failed to get user profile' };
      }

      return { user: userProfile, error: null };
    } catch (error) {
      return { user: null, error: 'Login failed' };
    }
  }

  // Logout user
  static async logout(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message || null };
    } catch (error) {
      return { error: 'Logout failed' };
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData.user) {
        return { user: null, error: authError?.message || 'No user found' };
      }

      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        return { user: null, error: profileError.message };
      }

      return { user: userProfile, error: null };
    } catch (error) {
      return { user: null, error: 'Failed to get current user' };
    }
  }

  // Request password reset
  static async requestPasswordReset(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      return { error: error?.message || null };
    } catch (error) {
      return { error: 'Failed to send reset email' };
    }
  }

  // Reset password with token
  static async resetPassword(password: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      return { error: error?.message || null };
    } catch (error) {
      return { error: 'Failed to reset password' };
    }
  }

  // Check if user has active subscription
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('subscription_status, subscription_end')
        .eq('id', userId)
        .single();

      if (error || !user) return false;

      if (user.subscription_status === 'active' && user.subscription_end) {
        const endDate = new Date(user.subscription_end);
        return endDate > new Date();
      }

      return user.subscription_status === 'trial';
    } catch (error) {
      return false;
    }
  }

  // Create subscription
  static async createSubscription(userId: string, planType: 'monthly' | 'yearly'): Promise<{ error: string | null }> {
    try {
      const startDate = new Date();
      const endDate = new Date();
      
      if (planType === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      // Update user subscription status
      const { error: userError } = await supabase
        .from('users')
        .update({
          subscription_status: 'active',
          subscription_start: startDate.toISOString(),
          subscription_end: endDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (userError) {
        return { error: userError.message };
      }

      // Create subscription record
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: userId,
          status: 'active',
          plan_type: planType,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString()
        }]);

      if (subscriptionError) {
        return { error: subscriptionError.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'Failed to create subscription' };
    }
  }
}
