import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@shared/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, UserX, Clock } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
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
  const location = useLocation();

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
              Acesso Negado
            </h2>
            <p className="text-muted-foreground mb-6">
              Você não tem permissão para acessar esta página.
              {allowedRoles.includes("admin") && " Esta área é restrita a administradores."}
              {allowedRoles.includes("creator") && " Esta área é restrita a criadores aprovados."}
              {allowedRoles.includes("subscriber") && " Esta área é restrita a assinantes."}
            </p>
            <div className="space-y-3">
              <Button asChild variant="outline" className="w-full">
                <Navigate to="/" replace />
                Voltar ao Início
              </Button>
              {!allowedRoles.includes(user.role) && (
                <p className="text-sm text-muted-foreground">
                  Seu perfil atual: <span className="font-medium capitalize">{user.role}</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check subscription requirement for subscribers (admins bypass this check)
  if (requireSubscription && user.role === "subscriber") {
    const subscriberUser = user as any;
    const hasActiveSubscription = subscriberUser.subscription?.status === "active" ||
                                  subscriberUser.assinante === true;

    if (!hasActiveSubscription) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-xnema-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-xnema-orange" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Assinatura Necessária
              </h2>
              <p className="text-muted-foreground mb-6">
                Esta área é exclusiva para assinantes. Assine nosso plano premium
                por apenas R$ 19,90/mês e tenha acesso a todo o conteúdo.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full bg-xnema-orange hover:bg-xnema-orange/90 text-black">
                  <Navigate to="/pricing" replace />
                  Ver Planos
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Navigate to="/" replace />
                  Voltar ao Início
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Check approval requirement for creators
  if (requireApproval && user.role === "creator") {
    const creatorUser = user as any;
    const isApproved = creatorUser.profile?.status === "approved";

    if (!isApproved) {
      const status = creatorUser.profile?.status || "pending";

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {status === "pending" && "Aguardando Aprovação"}
                {status === "rejected" && "Cadastro Rejeitado"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {status === "pending" &&
                  "Sua conta de criador está sendo analisada pela nossa equipe. " +
                  "Este processo pode levar até 5 dias úteis."
                }
                {status === "rejected" &&
                  "Sua solicitação para se tornar criador foi rejeitada. " +
                  "Entre em contato conosco para mais informações."
                }
              </p>
              <div className="space-y-3">
                <Button asChild variant="outline" className="w-full">
                  <a href="https://wa.me/5515997636161" target="_blank" rel="noopener noreferrer">
                    Falar no WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Navigate to="/" replace />
                  Voltar ao Início
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // All checks passed, render children
  return <>{children}</>;
};

// Hook para verificar permissões
export const usePermissions = () => {
  const { user } = useAuth();

  const hasRole = (role: UserRole) => user?.role === role;
  const hasAnyRole = (roles: UserRole[]) => user ? roles.includes(user.role) : false;

  const isAdmin = () => hasRole("admin");
  const isCreator = () => hasRole("creator");
  const isSubscriber = () => hasRole("subscriber");

  const isApprovedCreator = () => {
    if (!isCreator()) return false;
    const creatorUser = user as any;
    return creatorUser.profile?.status === "approved";
  };

  const hasActiveSubscription = () => {
    // Admins always have access
    if (isAdmin()) return true;
    if (!isSubscriber()) return false;
    const subscriberUser = user as any;
    return subscriberUser.subscription?.status === "active" || subscriberUser.assinante === true;
  };

  return {
    user,
    hasRole,
    hasAnyRole,
    isAdmin,
    isCreator,
    isSubscriber,
    isApprovedCreator,
    hasActiveSubscription
  };
};

export default ProtectedRoute;
