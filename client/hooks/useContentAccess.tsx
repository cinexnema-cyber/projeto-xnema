import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ContentAccessInfo {
  hasAccess: boolean;
  isSubscriber: boolean;
  subscriptionStatus: string | null;
  isLoading: boolean;
}

export const useContentAccess = (): ContentAccessInfo => {
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, [user]);

  const checkAccess = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    if (user.role === 'admin') {
      // Admins have full access
      setSubscriptionData({ hasAccess: true, isActive: true });
      setIsLoading(false);
      return;
    }

    if (user.role !== 'subscriber') {
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('xnema_token');
      const response = await fetch('/api/subscription/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasAccess = user?.role === 'admin' || 
                   (user?.role === 'subscriber' && subscriptionData?.hasAccess);
  
  const isSubscriber = user?.role === 'subscriber';
  const subscriptionStatus = subscriptionData?.subscription?.status || null;

  return {
    hasAccess,
    isSubscriber,
    subscriptionStatus,
    isLoading
  };
};
