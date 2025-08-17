import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthService } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Key, Eye, EyeOff, Shield, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Check if we have the required parameters from the reset email
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (!accessToken || !refreshToken) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    // Set the session with the tokens from the URL
    const setSession = async () => {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });

      if (error) {
        setError('Invalid or expired reset link. Please request a new password reset.');
      }
    };

    setSession();
  }, [searchParams]);

  const validatePassword = (password: string) => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      setLoading(false);
      return;
    }

    const isPasswordValid = Object.values(passwordValidation).every(Boolean);
    if (!isPasswordValid) {
      setError('A senha não atende a todos os critérios de segurança');
      setLoading(false);
      return;
    }

    try {
      const { error } = await AuthService.resetPassword(formData.password);

      if (error) {
        setError(error);
        setLoading(false);
        return;
      }

      setSuccess('Senha redefinida com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const isFormValid = formData.password && formData.confirmPassword && isPasswordValid && formData.password === formData.confirmPassword;

  return (
    <Layout>
      <div className="min-h-screen bg-xnema-dark flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Redefinir <span className="text-transparent bg-gradient-to-r from-xnema-orange to-xnema-purple bg-clip-text">Senha</span>
              </h1>
              <p className="text-muted-foreground">
                Crie uma nova senha segura para sua conta XNEMA
              </p>
            </div>

            <Card className="bg-xnema-surface border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-xnema-orange" />
                  <span>Nova Senha</span>
                </CardTitle>
                <CardDescription>
                  Sua senha deve atender aos critérios de segurança
                </CardDescription>
              </CardHeader>
              <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Digite sua nova senha"
                  className="bg-xnema-dark border-gray-600 text-white pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Password Validation */}
            {formData.password && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white">Critérios de Segurança:</h4>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  {[
                    { key: 'length', label: 'Pelo menos 8 caracteres' },
                    { key: 'uppercase', label: 'Uma letra maiúscula' },
                    { key: 'lowercase', label: 'Uma letra minúscula' },
                    { key: 'number', label: 'Um número' },
                    { key: 'special', label: 'Um caractere especial' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      {passwordValidation[key as keyof typeof passwordValidation] ? (
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-gray-400" />
                      )}
                      <span className={passwordValidation[key as keyof typeof passwordValidation] ? 'text-green-500' : 'text-gray-400'}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirme sua nova senha"
                  className="bg-xnema-dark border-gray-600 text-white pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-400">As senhas não coincidem</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-xnema-orange hover:bg-xnema-orange/90 text-black font-semibold"
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  Redefinir Senha
                </>
              )}
            </Button>

            <div className="text-center">
              <Button variant="ghost" onClick={() => navigate('/login')} className="text-xnema-orange hover:text-xnema-orange/80">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Login
              </Button>
            </div>
          </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
