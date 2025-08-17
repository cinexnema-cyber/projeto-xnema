import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, CreditCard, Settings, Shield, Download, Bell, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isSubscriber = user.assinante;
  const subscriptionStatus = user.subscriptionStatus === 'ativo' ? 'Ativo' : 'Inativo';
  const userRole = user.role === 'subscriber' ? 'Assinante Premium' : 'Usuário Básico';

  const paymentHistory = [
    {
      id: 1,
      date: "15/12/2024",
      amount: "R$ 0,00",
      status: "Período Grátis",
      description: "Primeiro mês grátis"
    },
    {
      id: 2,
      date: "15/01/2025",
      amount: "R$ 19,90",
      status: "Pendente",
      description: "Assinatura Premium - Mensal"
    }
  ];

  const watchHistory = [
    {
      title: "Between Heaven and Hell",
      episode: "T1E01",
      progress: 85,
      lastWatched: "Hoje"
    },
    {
      title: "Horizonte Infinito",
      episode: "Filme Completo",
      progress: 100,
      lastWatched: "Ontem"
    },
    {
      title: "Mistérios da Cidade",
      episode: "Filme Completo",
      progress: 45,
      lastWatched: "2 dias atrás"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Minha Conta
                </h1>
                <p className="text-muted-foreground">
                  Gerencie sua assinatura e configurações
                </p>
              </div>
              <div className="flex items-center space-x-3 bg-xnema-surface rounded-lg px-4 py-2">
                <Crown className="w-5 h-5 text-xnema-orange" />
                <span className="text-foreground font-semibold">{userInfo.subscription}</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="billing">Cobrança</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
              <TabsTrigger value="privacy">Privacidade</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Status da Assinatura</CardTitle>
                    <Crown className="h-4 w-4 text-xnema-orange" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-xnema-orange">Premium Ativo</div>
                    <p className="text-xs text-muted-foreground">
                      Próxima cobrança: {userInfo.nextBilling}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tempo de Assinatura</CardTitle>
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">30 dias</div>
                    <p className="text-xs text-muted-foreground">
                      Membro desde {userInfo.subscriptionDate}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conteúdo Assistido</CardTitle>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12 horas</div>
                    <p className="text-xs text-muted-foreground">
                      Este mês
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Watch History */}
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Visualização</CardTitle>
                  <CardDescription>Continue assistindo de onde parou</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {watchHistory.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-xnema-surface rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.episode}</p>
                          <div className="mt-2">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-xnema-orange h-2 rounded-full" 
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{item.progress}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground ml-4">
                          {item.lastWatched}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Cobrança</CardTitle>
                  <CardDescription>Gerencie sua assinatura e método de pagamento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-xnema-surface rounded-lg">
                    <div>
                      <h4 className="font-semibold text-foreground">Plano Premium</h4>
                      <p className="text-sm text-muted-foreground">R$ 19,90/m��s após período grátis</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Alterar Plano
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-xnema-surface rounded-lg">
                    <div>
                      <h4 className="font-semibold text-foreground">Próxima Cobrança</h4>
                      <p className="text-sm text-muted-foreground">{userInfo.nextBilling} - R$ 19,90</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Alterar Método
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Pagamentos</CardTitle>
                  <CardDescription>Seus últimos pagamentos e faturas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentHistory.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 bg-xnema-surface rounded-lg">
                        <div>
                          <div className="flex items-center space-x-4">
                            <CreditCard className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <h4 className="font-semibold text-foreground">{payment.description}</h4>
                              <p className="text-sm text-muted-foreground">{payment.date}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-foreground">{payment.amount}</div>
                          <div className={`text-sm ${payment.status === 'Período Grátis' ? 'text-xnema-orange' : payment.status === 'Pendente' ? 'text-yellow-500' : 'text-green-500'}`}>
                            {payment.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Conta</CardTitle>
                  <CardDescription>Atualize suas informações pessoais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-foreground">Nome Completo</label>
                      <input 
                        type="text" 
                        defaultValue={userInfo.name}
                        className="flex h-10 w-full rounded-md border border-xnema-border bg-background px-3 py-2 text-sm text-foreground"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-foreground">Email</label>
                      <input 
                        type="email" 
                        defaultValue={userInfo.email}
                        className="flex h-10 w-full rounded-md border border-xnema-border bg-background px-3 py-2 text-sm text-foreground"
                      />
                    </div>
                  </div>
                  <Button className="bg-xnema-orange hover:bg-xnema-orange/90 text-black">
                    Salvar Alterações
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Reprodução</CardTitle>
                  <CardDescription>Configure sua experiência de visualização</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Reprodução Automática</h4>
                      <p className="text-sm text-muted-foreground">Reproduzir próximo episódio automaticamente</p>
                    </div>
                    <Button variant="outline" size="sm">Ativado</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Qualidade de Vídeo</h4>
                      <p className="text-sm text-muted-foreground">Qualidade padrão para reprodução</p>
                    </div>
                    <Button variant="outline" size="sm">4K Ultra HD</Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Legendas</h4>
                      <p className="text-sm text-muted-foreground">Idioma padrão das legendas</p>
                    </div>
                    <Button variant="outline" size="sm">Português</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Política de Privacidade</CardTitle>
                  <CardDescription>Entenda como protegemos seus dados</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose prose-sm max-w-none text-foreground">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Coleta de Dados</h3>
                    <p className="text-muted-foreground mb-4">
                      Coletamos apenas as informações necessárias para fornecer nossos serviços, incluindo:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                      <li>Informações de conta (nome, email)</li>
                      <li>Dados de pagamento processados pelo Mercado Pago</li>
                      <li>Histórico de visualização para recomendações</li>
                      <li>Preferências de reprodução</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-foreground mb-4">Uso de Dados</h3>
                    <p className="text-muted-foreground mb-4">
                      Utilizamos seus dados para:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                      <li>Fornecer acesso ao conteúdo da plataforma</li>
                      <li>Processar pagamentos e gerenciar assinaturas</li>
                      <li>Personalizar recomendações de conteúdo</li>
                      <li>Melhorar nossos serviços</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-foreground mb-4">Proteção de Dados</h3>
                    <p className="text-muted-foreground mb-4">
                      Implementamos medidas de segurança robustas para proteger suas informações:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                      <li>Criptografia SSL/TLS para transmissão de dados</li>
                      <li>Armazenamento seguro com criptografia</li>
                      <li>Acesso restrito aos dados pessoais</li>
                      <li>Monitoramento contínuo de seguran��a</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-foreground mb-4">Seus Direitos</h3>
                    <p className="text-muted-foreground mb-4">
                      Você tem direito a:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                      <li>Acessar seus dados pessoais</li>
                      <li>Corrigir informações incorretas</li>
                      <li>Solicitar exclusão de dados</li>
                      <li>Portabilidade de dados</li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-xnema-border">
                    <Button variant="outline" className="mr-4">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Dados
                    </Button>
                    <Button variant="outline">
                      <Shield className="w-4 h-4 mr-2" />
                      Configurar Privacidade
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
