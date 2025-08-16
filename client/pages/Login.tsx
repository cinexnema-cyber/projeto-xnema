import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Crown, Video, Mail, Lock, User, CreditCard, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { paymentRecognition, handleMercadoPagoCallback, requestNotificationPermission } from "../utils/paymentRecognition";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'completed'>('idle');

  useEffect(() => {
    // Check for payment callback in URL
    const urlParams = new URLSearchParams(window.location.search);
    const checkPaymentCallback = async () => {
      const result = await handleMercadoPagoCallback(urlParams);
      if (result.success) {
        setPaymentStatus('completed');
        setTimeout(() => {
          window.location.href = '/smart-dashboard';
        }, 2000);
      }
    };

    // Request notification permission
    requestNotificationPermission();

    // Check for payment callback
    if (urlParams.has('payment_id')) {
      checkPaymentCallback();
    }
  }, []);

  const handleSubscriberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to smart dashboard
      window.location.href = '/smart-dashboard';
    }, 1500);
  };

  const handleCreatorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/creator-portal';
    }, 1500);
  };

  const handlePaymentRedirect = () => {
    setPaymentStatus('processing');
    
    // Open Mercado Pago in new window
    const paymentWindow = window.open('https://mpago.la/1p9Jkyy', '_blank', 'width=800,height=600');
    
    // Check for payment completion (simulation)
    const checkPayment = setInterval(() => {
      if (paymentWindow?.closed) {
        clearInterval(checkPayment);
        setPaymentStatus('completed');
        
        // Auto-login after payment
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    }, 1000);
  };

  if (paymentStatus === 'completed') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-foreground">Pagamento Confirmado!</CardTitle>
              <CardDescription>Bem-vindo à XNEMA Premium</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Seu pagamento foi processado com sucesso. Você será redirecionado automaticamente.
              </p>
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div className="bg-xnema-orange h-2 rounded-full animate-pulse" style={{ width: '100%' }} />
              </div>
              <p className="text-sm text-muted-foreground">Redirecionando para seu painel...</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Acesse sua <span className="text-transparent bg-gradient-to-r from-xnema-orange to-xnema-purple bg-clip-text">Conta</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Entre como assinante ou criador de conteúdo
              </p>
            </div>

            <Tabs defaultValue="subscriber" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="subscriber" className="text-lg py-3">
                  <Crown className="w-5 h-5 mr-2" />
                  Assinante
                </TabsTrigger>
                <TabsTrigger value="creator" className="text-lg py-3">
                  <Video className="w-5 h-5 mr-2" />
                  Criador
                </TabsTrigger>
              </TabsList>

              {/* Subscriber Login */}
              <TabsContent value="subscriber">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Login Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Crown className="w-6 h-6 text-xnema-orange" />
                        <span>Login de Assinante</span>
                      </CardTitle>
                      <CardDescription>
                        Acesse todo o catálogo premium da XNEMA
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubscriberLogin} className="space-y-6">
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            <label className="text-sm font-medium text-foreground">Email</label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                              <input 
                                type="email" 
                                placeholder="seu@email.com"
                                required
                                className="pl-10 flex h-10 w-full rounded-md border border-xnema-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-xnema-orange"
                              />
                            </div>
                          </div>
                          
                          <div className="grid gap-2">
                            <label className="text-sm font-medium text-foreground">Senha</label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                              <input 
                                type="password" 
                                placeholder="••••••••"
                                required
                                className="pl-10 flex h-10 w-full rounded-md border border-xnema-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-xnema-orange"
                              />
                            </div>
                          </div>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full bg-xnema-orange hover:bg-xnema-orange/90 text-black font-semibold"
                          disabled={isLoading}
                        >
                          {isLoading ? "Entrando..." : "Entrar como Assinante"}
                        </Button>

                        <div className="text-center">
                          <Link to="/forgot-password" className="text-sm text-xnema-orange hover:underline">
                            Esqueceu sua senha?
                          </Link>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Subscribe Option */}
                  <Card className="border-xnema-orange">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <CreditCard className="w-6 h-6 text-xnema-orange" />
                        <span>Ainda não é assinante?</span>
                      </CardTitle>
                      <CardDescription>
                        Assine agora e tenha acesso completo ao catálogo
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-xnema-orange mb-2">R$ 19,90</div>
                        <div className="text-sm text-muted-foreground mb-4">por mês após o 1º mês grátis</div>
                      </div>
                      
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-foreground">Primeiro mês grátis</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-foreground">Catálogo completo</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-foreground">Streaming 4K</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-foreground">Between Heaven and Hell</span>
                        </li>
                      </ul>

                      <Button 
                        onClick={handlePaymentRedirect}
                        className="w-full bg-gradient-to-r from-xnema-orange to-xnema-purple text-black font-semibold"
                        disabled={paymentStatus === 'processing'}
                      >
                        {paymentStatus === 'processing' ? "Processando Pagamento..." : "Assinar Agora"}
                      </Button>

                      {paymentStatus === 'processing' && (
                        <div className="text-center">
                          <div className="w-full bg-muted rounded-full h-2 mb-2">
                            <div className="bg-xnema-orange h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                          </div>
                          <p className="text-sm text-muted-foreground">Aguardando confirmação do pagamento...</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Creator Login */}
              <TabsContent value="creator">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Creator Login Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Video className="w-6 h-6 text-xnema-purple" />
                        <span>Login de Criador</span>
                      </CardTitle>
                      <CardDescription>
                        Acesse o portal exclusivo para criadores de conteúdo
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleCreatorLogin} className="space-y-6">
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            <label className="text-sm font-medium text-foreground">Email do Criador</label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                              <input 
                                type="email" 
                                placeholder="criador@email.com"
                                defaultValue="cinexnema@gmail.com"
                                required
                                className="pl-10 flex h-10 w-full rounded-md border border-xnema-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-xnema-purple"
                              />
                            </div>
                          </div>
                          
                          <div className="grid gap-2">
                            <label className="text-sm font-medium text-foreground">Senha</label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                              <input 
                                type="password" 
                                placeholder="••••••••"
                                required
                                className="pl-10 flex h-10 w-full rounded-md border border-xnema-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-xnema-purple"
                              />
                            </div>
                          </div>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full bg-xnema-purple hover:bg-xnema-purple/90 text-white font-semibold"
                          disabled={isLoading}
                        >
                          {isLoading ? "Entrando..." : "Entrar como Criador"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Creator Benefits */}
                  <Card className="border-xnema-purple">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Crown className="w-6 h-6 text-xnema-purple" />
                        <span>Benefícios do Criador</span>
                      </CardTitle>
                      <CardDescription>
                        Vantagens exclusivas para criadores XNEMA
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500 mb-2">100%</div>
                          <div className="text-sm text-foreground">dos primeiros 3 meses</div>
                        </div>
                      </div>
                      
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-foreground">Upload ilimitado de vídeos</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-foreground">Dashboard de analytics</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-foreground">Pagamentos automáticos</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-foreground">Suporte prioritário</span>
                        </li>
                      </ul>

                      <Button variant="outline" className="w-full border-xnema-purple text-xnema-purple hover:bg-xnema-purple hover:text-white" asChild>
                        <Link to="/creators">
                          Saiba Mais sobre o Programa
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}
