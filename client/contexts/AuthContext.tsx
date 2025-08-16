import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthService } from '@/lib/auth';
import { User } from '@/lib/supabase';

interface AuthUser extends User {
  role: 'user' | 'admin' | 'creator' | 'subscriber';
  assinante: boolean;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
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
      const { user: authUser, error } = await AuthService.login({ email, password });
      
      if (error || !authUser) {
        console.error('Login error:', error);
        return false;
      }

      // Transform Supabase user to AuthUser
      const transformedUser: AuthUser = {
        ...authUser,
        name: authUser.display_name,
        assinante: authUser.subscription_status === 'active' || authUser.subscription_status === 'trial',
        role: authUser.subscription_status === 'active' ? 'subscriber' : 'user'
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
      const { user: authUser, error } = await AuthService.register(userData);
      
      if (error || !authUser) {
        return {
          success: false,
          message: error || 'Registration failed'
        };
      }

      // Transform and set user
      const transformedUser: AuthUser = {
        ...authUser,
        name: authUser.display_name,
        assinante: authUser.subscription_status === 'active' || authUser.subscription_status === 'trial',
        role: authUser.subscription_status === 'active' ? 'subscriber' : 'user'
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
            ...currentUser,
            name: currentUser.display_name,
            assinante: currentUser.subscription_status === 'active' || currentUser.subscription_status === 'trial',
            role: currentUser.subscription_status === 'active' ? 'subscriber' : 'user'
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
