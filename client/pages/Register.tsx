import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { AuthService } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Crown, Calendar, CreditCard } from 'lucide-react';

export default function Register() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nomeCompleto: '',
    bio: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Register user
      const { user, error: registerError } = await AuthService.register({
        email: formData.email,
        password: formData.password,
        username: formData.nomeCompleto,
        displayName: formData.nomeCompleto,
        bio: formData.bio
      });

      if (registerError) {
        setError(registerError);
        setLoading(false);
        return;
      }

      if (!user) {
        setError('Registration failed');
        setLoading(false);
        return;
      }

      console.log('🔍 Debug - User object after registration:', user);
      console.log('🔍 Debug - User ID type:', typeof user.id, 'Value:', user.id);

      // Create subscription
      const { error: subscriptionError } = await AuthService.createSubscription(user.id, selectedPlan);

      if (subscriptionError) {
        setError(`Registration successful but subscription failed: ${subscriptionError}`);
        setLoading(false);
        return;
      }

      // Show confirmation link if available
      if (user.confirmationLink) {
        setSuccess(`Registro e assinatura realizados com sucesso!
        🔗 Link de acesso direto: ${user.confirmationLink}
        Redirecionando...`);
      } else {
        setSuccess('Registration and subscription successful! Redirecting...');
      }

      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-xnema-dark via-xnema-surface to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-xnema-orange">
            {t('subscription.title')}
          </CardTitle>
          <CardDescription>
            Join XNEMA and access premium content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert>
                <AlertDescription className="text-green-600">{success}</AlertDescription>
              </Alert>
            )}

            {/* Subscription Plan Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Choose Your Plan</Label>
              <Tabs value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as 'monthly' | 'yearly')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="monthly" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t('subscription.monthly')}
                  </TabsTrigger>
                  <TabsTrigger value="yearly" className="flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    {t('subscription.yearly')}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="monthly" className="mt-3">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">R$ 19,90</div>
                        <div className="text-sm text-muted-foreground">per month</div>
                        <div className="mt-2 text-sm">Full access to all content</div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="yearly" className="mt-3">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">R$ 199,90</div>
                        <div className="text-sm text-muted-foreground">per year</div>
                        <div className="mt-2 text-sm text-green-600">Save 16% • 2 months free!</div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* User Information */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomeCompleto">Nome Completo</Label>
                <Input
                  id="nomeCompleto"
                  name="nomeCompleto"
                  type="text"
                  placeholder="Digite seu nome completo"
                  required
                  value={formData.nomeCompleto}
                  onChange={handleInputChange}
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {t('auth.subscribeNow')}
                </>
              )}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{' '}
              <Button variant="link" onClick={() => navigate('/login')} className="p-0">
                Sign in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
