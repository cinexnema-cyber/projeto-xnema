import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Redirect to appropriate dashboard based on user type
    console.log('🔄 Dashboard router - User role:', user.role, 'Subscriber:', user.assinante);

    if (user.assinante && user.role === 'subscriber') {
      console.log('🚀 Redirecting subscriber to subscriber dashboard');
      navigate('/subscriber-dashboard', { replace: true });
    } else if (user.role === 'user') {
      console.log('🚀 Redirecting basic user to user dashboard');
      navigate('/user-dashboard', { replace: true });
    } else if (user.role === 'admin') {
      console.log('🚀 Redirecting admin to admin dashboard');
      navigate('/admin-dashboard', { replace: true });
    } else if (user.role === 'creator') {
      console.log('🚀 Redirecting creator to creator dashboard');
      navigate('/creator-dashboard', { replace: true });
    } else {
      // Fallback for unknown roles - default to user dashboard
      console.log('🚀 Unknown role, redirecting to user dashboard');
      navigate('/user-dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Show loading while determining redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-xnema-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecionando para sua área...</p>
      </div>
    </div>
  );
}
