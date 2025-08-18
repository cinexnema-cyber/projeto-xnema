import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn } from 'lucide-react';

export default function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(formData.email, formData.password);

      if (!success) {
        setError('Email ou senha incorretos');
        setLoading(false);
        return;
      }

      // Wait a moment for user state to update
      setTimeout(() => {
        // Get current user from context (after login)
        const savedUser = localStorage.getItem('xnema_user');
        if (savedUser) {
          const currentUser = JSON.parse(savedUser);

          // Redirect based on user type
          if (currentUser.assinante && currentUser.role === 'subscriber') {
            console.log('✅ Redirecting subscriber to subscriber dashboard');
            navigate('/subscriber-dashboard');
          } else if (currentUser.role === 'user') {
            console.log('✅ Redirecting basic user to user dashboard');
            navigate('/user-dashboard');
          } else if (currentUser.role === 'admin') {
            console.log('✅ Redirecting admin to admin dashboard');
            navigate('/admin-dashboard');
          } else if (currentUser.role === 'creator') {
            console.log('✅ Redirecting creator to creator portal');
            navigate('/creator-portal');
          } else {
            console.log('✅ Redirecting to general dashboard');
            navigate('/dashboard');
          }
        } else {
          // Fallback
          navigate('/dashboard');
        }
      }, 100);

    } catch (error) {
      console.error('Login error:', error);
      setError('Erro inesperado no login');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/password-recovery');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-xnema-dark via-xnema-surface to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-xnema-orange">
            {t('nav.login')}
          </CardTitle>
          <CardDescription>
            Access your XNEMA account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {resetEmailSent && (
              <Alert>
                <AlertDescription className="text-green-600">
                  Password reset email sent! Check your inbox.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
              />
            </div>

            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="link"
                onClick={handleForgotPassword}
                disabled={loading}
                className="p-0 h-auto text-sm"
              >
                {t('auth.forgotPassword')}
              </Button>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  {t('nav.login')}
                </>
              )}
            </Button>

            <div className="text-center text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-xnema-orange hover:underline">
                {t('auth.subscribeNow')}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
