import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { AuthService } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { XnemaLogo } from "@/components/XnemaLogo";
import {
  Loader2,
  Key,
  Eye,
  EyeOff,
  Shield,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Lock,
  Timer,
  Check,
} from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    match: false,
  });

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Check token validity on component mount
  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    const type = searchParams.get("type");

    if (!accessToken || !refreshToken || type !== "recovery") {
      setError(
        "Link de redefinição inválido ou expirado. Solicite um novo link.",
      );
      setTokenValid(false);
      return;
    }

    // Set the session with the tokens from the URL
    const setSession = async () => {
      try {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          setError(
            "Link inválido ou expirado. Solicite um novo link de redefinição.",
          );
          setTokenValid(false);
        } else {
          setTokenValid(true);

          // Obter informações do usuário
          if (data.user) {
            setUserEmail(data.user.email);

            // Buscar perfil completo do usuário
            const { data: userProfile, error: profileError } = await supabase
              .from("CineXnema")
              .select("*")
              .eq("user_id", data.user.id)
              .single();

            if (!profileError && userProfile) {
              setUserInfo(userProfile);
            }
          }
        }
      } catch (err) {
        setError("Erro ao validar o link. Tente novamente.");
        setTokenValid(false);
      }
    };

    setSession();
  }, [searchParams]);

  const validatePassword = (password: string, confirmPassword: string) => {
    const validation = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === confirmPassword && password.length > 0,
    };

    setPasswordValidation(validation);
    return validation;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);

    if (name === "password" || name === "confirmPassword") {
      validatePassword(newFormData.password, newFormData.confirmPassword);
    }
  };

  const getPasswordStrength = () => {
    const validCount =
      Object.values(passwordValidation).filter((v) => v).length - 1; // Exclude match
    return (validCount / 5) * 100;
  };

  const getStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength < 40) return "bg-red-500";
    if (strength < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    const strength = getPasswordStrength();
    if (strength < 40) return "Fraca";
    if (strength < 80) return "Média";
    return "Forte";
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Final validation
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    const validation = validatePassword(
      formData.password,
      formData.confirmPassword,
    );
    const isPasswordValid =
      validation.length &&
      validation.uppercase &&
      validation.lowercase &&
      validation.number &&
      validation.special;

    if (!isPasswordValid) {
      setError("A senha não atende a todos os critérios de segurança");
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

      setSuccess(
        "Senha redefinida com sucesso! Fazendo login automaticamente...",
      );

      // Aguardar um momento para a atualização da senha
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Fazer login automático se temos o email
      if (userEmail) {
        try {
          const loginSuccess = await login(userEmail, formData.password);
          if (loginSuccess) {
            setSuccess("Login realizado com sucesso! Redirecionando...");
            setTimeout(() => {
              // Redirecionar baseado no status da assinatura
              if (userInfo?.subscriptionStatus === 'ativo') {
                navigate("/dashboard");
              } else {
                navigate("/pricing"); // Direcionar para assinatura se não for assinante
              }
            }, 2000);
          } else {
            setSuccess("Senha redefinida! Redirecionando para o login...");
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          }
        } catch (loginError) {
          console.error("Erro no login automático:", loginError);
          setSuccess("Senha redefinida! Redirecionando para o login...");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } else {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Token validation loading
  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-xnema-dark via-xnema-surface to-black flex items-center justify-center p-4">
        <div className="text-center">
          <XnemaLogo size="lg" />
          <div className="mt-8">
            <Loader2 className="w-8 h-8 animate-spin text-xnema-orange mx-auto" />
            <p className="text-gray-300 mt-4">
              Validando link de redefinição...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token
  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-xnema-dark via-xnema-surface to-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <XnemaLogo size="lg" />
            </Link>
          </div>

          <Card className="bg-xnema-surface border-gray-700">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-white">
                Link Inválido
              </CardTitle>
              <CardDescription className="text-gray-300">
                O link de redefinição de senha expirou ou é inválido
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm text-center">
                  {error ||
                    "Por favor, solicite um novo link de redefinição de senha."}
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  asChild
                  className="flex-1 border-gray-600 text-gray-300"
                >
                  <Link to="/forgot-password">
                    <div className="flex items-center">
                      <Key className="w-4 h-4 mr-2" />
                      Solicitar Novo Link
                    </div>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="flex-1 border-gray-600 text-gray-300"
                >
                  <Link to="/login">
                    <div className="flex items-center">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar ao Login
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isFormValid =
    Object.values(passwordValidation).every(Boolean) &&
    formData.password.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-xnema-dark via-xnema-surface to-black flex items-center justify-center py-12 p-4">
      <div className="w-full max-w-md">
        {/* XNEMA Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <XnemaLogo size="lg" />
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Redefinir{" "}
            <span className="text-transparent bg-gradient-to-r from-xnema-orange to-xnema-purple bg-clip-text">
              Senha
            </span>
          </h1>
          <p className="text-gray-300">
            Crie uma nova senha segura para sua conta XNEMA
          </p>
        </div>

        <Card className="bg-xnema-surface border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-xnema-orange" />
                <span className="text-white">Nova Senha</span>
              </div>
              {timeLeft > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Timer className="w-4 h-4" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {userEmail && (
                <div className="mb-2 p-2 bg-xnema-orange/10 border border-xnema-orange/20 rounded text-xs">
                  <span className="text-xnema-orange font-medium">Usuário identificado:</span> {userEmail}
                  {userInfo && (
                    <div className="mt-1">
                      <span className="text-gray-300">Status: </span>
                      <span className={userInfo.subscriptionStatus === 'ativo' ? 'text-green-400' : 'text-yellow-400'}>
                        {userInfo.subscriptionStatus === 'ativo' ? 'Assinante Ativo' : 'Sem Assinatura'}
                      </span>
                    </div>
                  )}
                </div>
              )}
              Sua senha deve atender aos critérios de segurança abaixo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-6">
              {error && (
                <Alert
                  variant="destructive"
                  className="bg-red-500/10 border-red-500/20"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-500/10 border-green-500/20">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-400">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Nova Senha
                </Label>
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
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Força da senha:</span>
                      <span
                        className={`font-semibold ${getPasswordStrength() < 40 ? "text-red-400" : getPasswordStrength() < 80 ? "text-yellow-400" : "text-green-400"}`}
                      >
                        {getStrengthText()}
                      </span>
                    </div>
                    <Progress value={getPasswordStrength()} className="h-2" />
                  </div>
                )}
              </div>

              {/* Password Validation */}
              {formData.password && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-white">
                    Critérios de Segurança:
                  </h4>
                  <div className="grid grid-cols-1 gap-1 text-xs">
                    {[
                      { key: "length", label: "Pelo menos 8 caracteres" },
                      { key: "uppercase", label: "Uma letra maiúscula (A-Z)" },
                      { key: "lowercase", label: "Uma letra minúscula (a-z)" },
                      { key: "number", label: "Um número (0-9)" },
                      {
                        key: "special",
                        label: "Um caractere especial (!@#$...)",
                      },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center space-x-2">
                        {passwordValidation[
                          key as keyof typeof passwordValidation
                        ] ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Lock className="w-3 h-3 text-gray-400" />
                        )}
                        <span
                          className={
                            passwordValidation[
                              key as keyof typeof passwordValidation
                            ]
                              ? "text-green-400"
                              : "text-gray-400"
                          }
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirmar Nova Senha
                </Label>
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
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {formData.confirmPassword && (
                  <div className="flex items-center space-x-2 text-xs">
                    {passwordValidation.match ? (
                      <>
                        <Check className="w-3 h-3 text-green-500" />
                        <span className="text-green-400">
                          As senhas coincidem
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 text-red-400" />
                        <span className="text-red-400">
                          As senhas não coincidem
                        </span>
                      </>
                    )}
                  </div>
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
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login")}
                  className="text-xnema-orange hover:text-xnema-orange/80"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-xnema-orange/10 border border-xnema-orange/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-xnema-orange flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <h4 className="font-semibold text-xnema-orange mb-1">
                Dica de Segurança
              </h4>
              <p className="text-gray-300">
                Use uma senha única que você não usa em outros sites. Considere
                usar um gerenciador de senhas para máxima segurança.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
