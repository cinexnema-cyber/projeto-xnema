import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, CreditCard, Settings, Shield, Download, Bell, User, LogOut, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  // Component for Non-Subscribers (Basic Users)
  const BasicUserDashboard = () => (
    <div className="space-y-6">
      <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-700 dark:text-orange-300">
          <strong>Conta Básica:</strong> Você tem acesso limitado. Faça upgrade para Premium e tenha acesso completo ao XNEMA!
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-semibold">{user.displayName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Conta</p>
              <p className="font-semibold text-gray-600">{userRole}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-xnema-orange" />
              Upgrade Premium
            </CardTitle>
            <CardDescription>
              Tenha acesso ilimitado a todo o conteúdo XNEMA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">✅ Acesso a toda biblioteca de filmes</p>
                <p className="text-sm">✅ Série exclusiva "Entre o Céu e o Inferno"</p>
                <p className="text-sm">✅ Qualidade 4K sem anúncios</p>
                <p className="text-sm">✅ Downloads para assistir offline</p>
              </div>
              <Button asChild className="w-full">
                <Link to="/register">Fazer Upgrade Agora</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conteúdo Gratuito</CardTitle>
          <CardDescription>
            Explore algumas opções disponíveis para usuários básicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-xnema-surface rounded-lg">
              <h4 className="font-semibold mb-2">Catálogo Público</h4>
              <p className="text-sm text-muted-foreground mb-3">Veja trailers e informações dos filmes</p>
              <Button asChild variant="outline" size="sm">
                <Link to="/catalog">Explorar</Link>
              </Button>
            </div>
            <div className="p-4 bg-xnema-surface rounded-lg">
              <h4 className="font-semibold mb-2">Categorias</h4>
              <p className="text-sm text-muted-foreground mb-3">Navegue pelas categorias de conteúdo</p>
              <Button asChild variant="outline" size="sm">
                <Link to="/categories">Ver Categorias</Link>
              </Button>
            </div>
            <div className="p-4 bg-xnema-surface rounded-lg">
              <h4 className="font-semibold mb-2">Preços</h4>
              <p className="text-sm text-muted-foreground mb-3">Conheça nossos planos Premium</p>
              <Button asChild variant="outline" size="sm">
                <Link to="/pricing">Ver Planos</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Component for Subscribers (Premium Users)
  const SubscriberDashboard = () => (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="content">Conteúdo</TabsTrigger>
        <TabsTrigger value="billing">Cobrança</TabsTrigger>
        <TabsTrigger value="settings">Configurações</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status da Assinatura</CardTitle>
              <Crown className="h-4 w-4 text-xnema-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-xnema-orange">{subscriptionStatus}</div>
              <p className="text-xs text-muted-foreground">
                Plano: {user.subscriptionPlan || 'Premium'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo de Assinatura</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Premium</div>
              <p className="text-xs text-muted-foreground">
                Membro desde {user.subscriptionStart ? new Date(user.subscriptionStart).toLocaleDateString() : 'Hoje'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Acesso Total</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100%</div>
              <p className="text-xs text-muted-foreground">
                Todo conteúdo disponível
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Conta Premium</CardTitle>
            <CardDescription>Detalhes da sua assinatura ativa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-semibold">{user.displayName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Conta</p>
                <p className="font-semibold text-xnema-orange">{userRole}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold text-green-600">{subscriptionStatus}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="content" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Conteúdo Premium Disponível</CardTitle>
            <CardDescription>Acesse todo o catálogo XNEMA com sua assinatura ativa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button asChild className="h-auto p-4 flex flex-col items-start">
                <Link to="/between-heaven-hell">
                  <div className="flex flex-col items-start">
                    <Crown className="h-6 w-6 text-xnema-orange mb-2" />
                    <h4 className="font-semibold mb-1">Entre o Céu e o Inferno</h4>
                    <p className="text-sm text-muted-foreground">Série exclusiva XNEMA</p>
                  </div>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-start">
                <Link to="/catalog">
                  <div className="flex flex-col items-start">
                    <Download className="h-6 w-6 mb-2" />
                    <h4 className="font-semibold mb-1">Catálogo Completo</h4>
                    <p className="text-sm text-muted-foreground">Todos os filmes e séries</p>
                  </div>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-start">
                <Link to="/categories">
                  <div className="flex flex-col items-start">
                    <Settings className="h-6 w-6 mb-2" />
                    <h4 className="font-semibold mb-1">Categorias</h4>
                    <p className="text-sm text-muted-foreground">Navegue por gênero</p>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="billing" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações de Cobrança</CardTitle>
            <CardDescription>Gerencie sua assinatura e métodos de pagamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300">
                  ✅ Sua assinatura está ativa e em dia
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Plano Atual</p>
                  <p className="font-semibold">{user.subscriptionPlan || 'Premium'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold text-green-600">{subscriptionStatus}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações da Conta</CardTitle>
            <CardDescription>Gerencie suas preferências e configurações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Notificações</h4>
                  <p className="text-sm text-muted-foreground">Receber emails sobre novos conteúdos</p>
                </div>
                <Button variant="outline" size="sm">Configurar</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Qualidade de Vídeo</h4>
                  <p className="text-sm text-muted-foreground">Ajustar qualidade padrão de reprodução</p>
                </div>
                <Button variant="outline" size="sm">4K Ativo</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Downloads</h4>
                  <p className="text-sm text-muted-foreground">Gerenciar conteúdo baixado</p>
                </div>
                <Button variant="outline" size="sm">Gerenciar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Dashboard - {user.displayName}
                </h1>
                <p className="text-muted-foreground">
                  {isSubscriber ? 'Bem-vindo de volta, assinante Premium!' : 'Conta básica - Faça upgrade para acessar todo o conteúdo'}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`flex items-center space-x-2 rounded-lg px-4 py-2 ${isSubscriber ? 'bg-xnema-orange text-white' : 'bg-gray-200 text-gray-700'}`}>
                  {isSubscriber ? <Crown className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  <span className="font-semibold">{userRole}</span>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>

          {/* Conditional Dashboard Content */}
          {isSubscriber ? <SubscriberDashboard /> : <BasicUserDashboard />}
        </div>
      </div>
    </Layout>
  );
}
