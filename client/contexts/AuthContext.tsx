import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthService } from '@/lib/auth';
import { User } from '@/lib/supabase';

interface AuthUser {
  id: string;
  user_id: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  subscriptionStatus: 'ativo' | 'inativo';
  subscriptionStart?: Date;
  subscriptionEnd?: Date;
  subscriptionPlan?: 'monthly' | 'yearly';
  role: 'user' | 'admin' | 'creator' | 'subscriber';
  assinante: boolean;
  name: string;
  confirmationLink?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<any>;
  hasActiveSubscription: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with Supabase...');
      const { user: authUser, error } = await AuthService.login({ email, password });

      if (error || !authUser) {
        console.log('Supabase login failed, trying fallback...');
        // Fallback to MongoDB system
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const userData = await response.json();
          if (userData.success && userData.user) {
            const transformedUser: AuthUser = {
              id: userData.user.id,
              email: userData.user.email,
              username: userData.user.username || userData.user.email.split('@')[0],
              display_name: userData.user.name || userData.user.email.split('@')[0],
              bio: userData.user.bio || '',
              subscription_status: userData.user.assinante ? 'active' : 'inactive',
              subscription_start: userData.user.subscription?.startDate || '',
              subscription_end: userData.user.subscription?.endDate || '',
              created_at: userData.user.createdAt || new Date().toISOString(),
              updated_at: new Date().toISOString(),
              name: userData.user.name || userData.user.email.split('@')[0],
              assinante: userData.user.assinante || false,
              role: userData.user.role || (userData.user.assinante ? 'subscriber' : 'user')
            };

            setUser(transformedUser);
            localStorage.setItem('xnema_user', JSON.stringify(transformedUser));
            localStorage.setItem('xnema_token', userData.token);
            return true;
          }
        }
        return false;
      }

      // Transform Supabase user to AuthUser
      const transformedUser: AuthUser = {
        id: authUser.id || authUser.user_id,
        user_id: authUser.user_id,
        email: authUser.email,
        username: authUser.username,
        displayName: authUser.displayName,
        bio: authUser.bio || '',
        subscriptionStatus: authUser.subscriptionStatus,
        subscriptionStart: authUser.subscriptionStart,
        subscriptionEnd: authUser.subscriptionEnd,
        subscriptionPlan: authUser.subscriptionPlan,
        name: authUser.displayName,
        assinante: authUser.subscriptionStatus === 'ativo',
        role: authUser.subscriptionStatus === 'ativo' ? 'subscriber' : 'user',
        confirmationLink: authUser.confirmationLink
      };

      setUser(transformedUser);
      localStorage.setItem('xnema_user', JSON.stringify(transformedUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: any) => {
    try {
      console.log('Attempting registration with Supabase...');
      const { user: authUser, error } = await AuthService.register(userData);

      if (error || !authUser) {
        console.log('Supabase registration failed, trying fallback...');
        // Fallback to MongoDB system
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const result = await response.json();
        if (result.success && result.user) {
          const transformedUser: AuthUser = {
            id: result.user.id,
            email: result.user.email,
            username: result.user.username || result.user.email.split('@')[0],
            display_name: result.user.name || result.user.email.split('@')[0],
            bio: result.user.bio || '',
            subscription_status: result.user.assinante ? 'active' : 'inactive',
            subscription_start: result.user.subscription?.startDate || '',
            subscription_end: result.user.subscription?.endDate || '',
            created_at: result.user.createdAt || new Date().toISOString(),
            updated_at: new Date().toISOString(),
            name: result.user.name || result.user.email.split('@')[0],
            assinante: result.user.assinante || false,
            role: result.user.role || (result.user.assinante ? 'subscriber' : 'user')
          };

          setUser(transformedUser);
          localStorage.setItem('xnema_user', JSON.stringify(transformedUser));
          if (result.token) {
            localStorage.setItem('xnema_token', result.token);
          }

          return {
            success: true,
            user: transformedUser
          };
        }

        return {
          success: false,
          message: result.message || error || 'Registration failed'
        };
      }

      // Transform and set user
      const transformedUser: AuthUser = {
        id: authUser.user_id,
        email: authUser.email,
        username: authUser.username,
        display_name: authUser.displayName,
        bio: authUser.bio || '',
        subscription_status: authUser.subscriptionStatus === 'ativo' ? 'active' : 'inactive',
        subscription_start: authUser.subscriptionStart?.toString() || '',
        subscription_end: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: authUser.displayName,
        assinante: authUser.subscriptionStatus === 'ativo',
        role: authUser.subscriptionStatus === 'ativo' ? 'subscriber' : 'user'
      };

      setUser(transformedUser);
      localStorage.setItem('xnema_user', JSON.stringify(transformedUser));

      return {
        success: true,
        user: transformedUser
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'Registration failed'
      };
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
    localStorage.removeItem('xnema_user');
    localStorage.removeItem('xnema_token'); // Also remove old token
  };

  const hasActiveSubscription = async (): Promise<boolean> => {
    if (!user) return false;
    return await AuthService.hasActiveSubscription(user.id);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for saved user in localStorage first
        const savedUser = localStorage.getItem('xnema_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        // Try to get current user from Supabase
        const { user: currentUser } = await AuthService.getCurrentUser();
        if (currentUser) {
          const transformedUser: AuthUser = {
            id: currentUser.user_id,
            email: currentUser.email,
            username: currentUser.username,
            display_name: currentUser.displayName,
            bio: currentUser.bio || '',
            subscription_status: currentUser.subscriptionStatus === 'ativo' ? 'active' : 'inactive',
            subscription_start: currentUser.subscriptionStart?.toString() || '',
            subscription_end: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            name: currentUser.displayName,
            assinante: currentUser.subscriptionStatus === 'ativo',
            role: currentUser.subscriptionStatus === 'ativo' ? 'subscriber' : 'user'
          };
          setUser(transformedUser);
          localStorage.setItem('xnema_user', JSON.stringify(transformedUser));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    hasActiveSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
