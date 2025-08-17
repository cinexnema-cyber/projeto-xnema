import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";
import { AuthService } from "@/lib/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const { error } = await AuthService.requestPasswordReset(email);

      if (error) {
        setErrorMessage(error);
      } else {
        setEmailSent(true);
      }
    } catch (error) {
      setErrorMessage("Erro de conexão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-foreground">
                    Email Enviado!
                  </CardTitle>
                  <CardDescription>
                    Verifique sua caixa de entrada
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground text-center">
                    Se existe uma conta com o email <strong>{email}</strong>, enviamos um link para redefinir sua senha.
                  </p>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Não recebeu o email? Verifique:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Caixa de spam ou lixo eletrônico</li>
                      <li>• Se o email está escrito corretamente</li>
                      <li>• Aguarde alguns minutos</li>
                    </ul>
                  </div>

                  <div className="flex space-x-3">
                    <Button variant="outline" asChild className="flex-1">
                      <Link to="/login">
                        <div className="flex items-center justify-center space-x-2">
                          <ArrowLeft className="w-4 h-4" />
                          <span>Voltar ao Login</span>
                        </div>
                      </Link>
                    </Button>
                    <Button 
                      onClick={() => {
                        setEmailSent(false);
                        setEmail("");
                      }}
                      className="flex-1"
                    >
                      Tentar Novamente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Esqueceu sua <span className="text-transparent bg-gradient-to-r from-xnema-orange to-xnema-purple bg-clip-text">Senha?</span>
              </h1>
              <p className="text-muted-foreground">
                Digite seu email e enviaremos um link para redefinir sua senha
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-xnema-orange" />
                  <span>Recuperar Senha</span>
                </CardTitle>
                <CardDescription>
                  Informe o email da sua conta XNEMA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMessage && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                      <p className="text-sm text-destructive">{errorMessage}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 flex h-10 w-full rounded-md border border-xnema-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-xnema-orange"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-xnema-orange hover:bg-xnema-orange/90 text-black font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
                  </Button>

                  <div className="text-center">
                    <Link
                      to="/login"
                      className="text-sm text-xnema-orange hover:underline flex items-center justify-center space-x-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Voltar ao Login</span>
                    </Link>
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
