import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, UserX, Clock } from "lucide-react";
import { SubscriptionPrompt } from "@/components/SubscriptionPrompt";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireSubscription?: boolean;
  requireApproval?: boolean;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  requireSubscription = false,
  requireApproval = false,
  fallbackPath = "/login"
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);

  // Auto-show subscription prompt for premium content - MOVED TO TOP
  React.useEffect(() => {
    if (requireSubscription && user && !user.assinante) {
      const timer = setTimeout(() => setShowSubscriptionPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [requireSubscription, user?.assinante]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-xnema-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role permissions
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserX className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Access Denied
            </h2>
            <p className="text-muted-foreground mb-6">
              You don't have permission to access this page.
              {allowedRoles.includes("admin") && " This area is restricted to administrators."}
              {allowedRoles.includes("creator") && " This area is restricted to approved creators."}
              {allowedRoles.includes("subscriber") && " This area is restricted to subscribers."}
            </p>
            <div className="space-y-3">
              <Button asChild variant="outline" className="w-full">
                <Navigate to="/" replace />
                Back to Home
              </Button>
              <p className="text-sm text-muted-foreground">
                Your current profile: <span className="font-medium capitalize">{user.role}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check subscription requirement - show prompt instead of blocking
  if (requireSubscription && !user.assinante) {
    return (
      <>
        {children}
        {showSubscriptionPrompt && (
          <SubscriptionPrompt
            contentTitle={location.pathname.includes('between-heaven-hell') ? 'Between Heaven and Hell' : 'Conteúdo Premium'}
            contentType="series"
            onClose={() => setShowSubscriptionPrompt(false)}
          />
        )}
      </>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
};

// Hook para verificar permissões
export const usePermissions = () => {
  const { user } = useAuth();

  const hasRole = (role: string) => user?.role === role;
  const hasAnyRole = (roles: string[]) => user ? roles.includes(user.role) : false;

  const isAdmin = () => hasRole("admin");
  const isCreator = () => hasRole("creator");
  const isSubscriber = () => hasRole("subscriber");

  const hasActiveSubscription = () => {
    // Admins always have access
    if (isAdmin()) return true;
    return user?.assinante === true || user?.subscription_status === 'active';
  };

  return {
    user,
    hasRole,
    hasAnyRole,
    isAdmin,
    isCreator,
    isSubscriber,
    hasActiveSubscription
  };
};

export default ProtectedRoute;
