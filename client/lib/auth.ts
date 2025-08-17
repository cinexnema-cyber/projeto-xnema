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
      // Test Supabase connection first
      console.log('Testing Supabase connection...');

      // First, create auth user in Supabase Auth
      console.log('Attempting to create auth user...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        console.error('Auth error:', authError);
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        console.error('No user returned from auth');
        return { user: null, error: 'Failed to create user' };
      }

      // Then create user profile in our CineXnema table
      const { data: userProfile, error: profileError } = await supabase
        .from('CineXnema')
        .insert([{
          user_id: authData.user.id,
          username: userData.username,
          email: userData.email,
          displayName: userData.displayName,
          bio: userData.bio || '',
          passwordHash: '', // Will be handled by Supabase auth
          subscriptionStatus: 'inativo',
          subscriptionStart: new Date(),
          comissaoPercentual: 0
        }])
        .select()
        .single();

      if (profileError) {
        // If profile creation fails, we should cleanup the auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        return { user: null, error: profileError.message };
      }

      // Generate JWT token for email confirmation
      const confirmationToken = await this.generateConfirmationToken(authData.user.id, userData.email, 'subscriber');
      const confirmationLink = `${window.location.origin}/welcome?token=${confirmationToken}`;

      console.log('🔗 Link de confirmação gerado:', confirmationLink);
      console.log('📧 Copie este link para acessar diretamente:', confirmationLink);

      // Return user profile with Supabase Auth UUID (not table ID)
      return {
        user: {
          ...userProfile,
          id: authData.user.id, // Use Supabase Auth UUID instead of table ID
          confirmationLink
        },
        error: null
      };
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
        .from('CineXnema')
        .select('*')
        .eq('user_id', authData.user.id)
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
        .from('CineXnema')
        .select('*')
        .eq('user_id', authData.user.id)
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
        .from('CineXnema')
        .select('subscriptionStatus, subscriptionStart')
        .eq('user_id', userId)
        .single();

      if (error || !user) return false;

      return user.subscriptionStatus === 'ativo';
    } catch (error) {
      return false;
    }
  }

  // Create subscription
  static async createSubscription(userId: string, planType: 'monthly' | 'yearly'): Promise<{ error: string | null }> {
    try {
      console.log('🔍 createSubscription called with:', { userId, planType, userIdType: typeof userId });

      // Convert to string if needed
      const userIdString = String(userId);
      console.log('🔍 Converted userId to string:', userIdString);

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(userIdString)) {
        console.error('❌ Invalid UUID format. Expected UUID, got:', userIdString);
        console.error('❌ This typically means the user ID is coming from the database table ID instead of Supabase Auth UUID');
        return { error: `Invalid user ID format: ${userIdString}. Expected UUID format.` };
      }

      console.log('✅ UUID validation passed for:', userIdString);

      const startDate = new Date();
      const endDate = new Date();

      if (planType === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      // Update user subscription status
      const { error: userError } = await supabase
        .from('CineXnema')
        .update({
          subscriptionStatus: 'ativo',
          subscriptionStart: startDate,
        })
        .eq('user_id', userIdString);

      if (userError) {
        console.error('❌ User update error:', userError);
        return { error: userError.message };
      }

      console.log('✅ User subscription status updated successfully');

      // Create subscription record with validated UUID
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: userIdString, // Now guaranteed to be a valid UUID
          status: 'active',
          plan_type: planType,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString()
        }]);

      if (subscriptionError) {
        console.error('❌ Subscription creation error:', subscriptionError);
        return { error: subscriptionError.message };
      }

      console.log('✅ Subscription created successfully for user:', userIdString);
      return { error: null };
    } catch (error) {
      console.error('Unexpected error in createSubscription:', error);
      return { error: 'Failed to create subscription' };
    }
  }

  // Generate confirmation token (simulated - in production, this would be done server-side)
  private static async generateConfirmationToken(userId: string, email: string, role: string): Promise<string> {
    // In a real implementation, this would call your backend to generate the JWT
    // For now, we'll create a simple token structure
    const payload = {
      userId,
      email,
      role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24 hours
    };

    // In production, encode this properly with your JWT secret
    return btoa(JSON.stringify(payload));
  }

  // Validate and auto-login from token
  static async loginFromToken(token: string): Promise<{ user: User | null; error: string | null }> {
    try {
      // Decode token (in production, verify with JWT library)
      const payload = JSON.parse(atob(token));

      // Check token expiry
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return { user: null, error: 'Token expired' };
      }

      // Get user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('CineXnema')
        .select('*')
        .eq('user_id', payload.userId)
        .single();

      if (profileError) {
        return { user: null, error: 'Invalid token or user not found' };
      }

      return { user: userProfile, error: null };
    } catch (error) {
      return { user: null, error: 'Invalid token format' };
    }
  }
}
