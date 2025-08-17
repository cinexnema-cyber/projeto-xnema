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
  const { login } = useAuth();
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
      const { user, error: loginError } = await AuthService.login({
        email: formData.email,
        password: formData.password
      });

      if (loginError) {
        setError(loginError);
        setLoading(false);
        return;
      }

      if (!user) {
        setError('Login failed');
        setLoading(false);
        return;
      }

      // Check subscription status
      const hasSubscription = await AuthService.hasActiveSubscription(user.id);
      
      if (!hasSubscription) {
        // Redirect to subscription page if no active subscription
        navigate('/register');
        return;
      }

      // Successful login with active subscription
      navigate('/');

    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address first');
      return;
    }

    setLoading(true);
    const { error } = await AuthService.requestPasswordReset(formData.email);
    
    if (error) {
      setError(error);
    } else {
      setResetEmailSent(true);
      setError('');
    }
    
    setLoading(false);
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
